import sys
import os
import cv2
import numpy as np
import subprocess
import tempfile
import traceback

from rembg import remove, new_session


# =========================================================
# CONFIG
# =========================================================

REMBG_MODEL = "u2netp"

REAL_ESRGAN_EXE = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "tools",
        "realesrgan",
        "realesrgan-ncnn-vulkan.exe",
    )
)

REAL_ESRGAN_MODEL = "realesrgan-x4plus"


# =========================================================
# ENVIRONMENT
# =========================================================

IS_WINDOWS = sys.platform == "win32"

# Render/Linux uses CPU.
# Local Windows machine can use Real-ESRGAN Vulkan.
IS_RENDER = not IS_WINDOWS


# =========================================================
# STUDIO SIZE
# =========================================================

# Keep 1080 on local Windows.
#
# On Render, 768 is safer for CPU/RAM.
# The final Render image is still upscaled 4x
# to 3072 x 3072.
#
# You can override this with:
#
# STUDIO_CANVAS_SIZE=1080
#
# if your Render instance has enough resources.

if IS_RENDER:
    DEFAULT_CANVAS_SIZE = 768
else:
    DEFAULT_CANVAS_SIZE = 1080


try:
    CANVAS_SIZE = int(
        os.environ.get(
            "STUDIO_CANVAS_SIZE",
            DEFAULT_CANVAS_SIZE,
        )
    )
except ValueError:
    CANVAS_SIZE = DEFAULT_CANVAS_SIZE


CANVAS_SIZE = max(
    512,
    min(CANVAS_SIZE, 1600),
)


# =========================================================
# REMBG SESSION
# =========================================================

# IMPORTANT:
#
# Do NOT load the rembg model during module import.
#
# Render can otherwise appear to hang before the first
# processing log is printed.
#
# The model is loaded only when remove_background()
# actually needs it.

rembg_session = None


def get_rembg_session():
    global rembg_session

    if rembg_session is None:

        print(
            "-----------------------------------------",
            flush=True,
        )

        print(
            f"Loading rembg model: {REMBG_MODEL}",
            flush=True,
        )

        print(
            "This may take some time on the first Render request...",
            flush=True,
        )

        try:

            rembg_session = new_session(
                REMBG_MODEL
            )

        except Exception as error:

            print(
                "ERROR: Failed to load rembg model.",
                flush=True,
            )

            print(
                str(error),
                flush=True,
            )

            raise

        print(
            "rembg model loaded successfully.",
            flush=True,
        )

        print(
            "-----------------------------------------",
            flush=True,
        )

    return rembg_session


# =========================================================
# BACKGROUND REMOVAL
# =========================================================

def remove_background(
    input_path,
    output_path,
):

    print(
        "Reading input image...",
        flush=True,
    )

    with open(
        input_path,
        "rb",
    ) as input_file:

        input_data = input_file.read()

    if not input_data:

        raise Exception(
            "Input image is empty."
        )

    print(
        f"Input image size: {len(input_data) / 1024 / 1024:.2f} MB",
        flush=True,
    )

    session = get_rembg_session()

    print(
        "Running background removal...",
        flush=True,
    )

    try:

        output_data = remove(
            input_data,
            session=session,
        )

    except Exception as error:

        print(
            "ERROR during background removal.",
            flush=True,
        )

        print(
            str(error),
            flush=True,
        )

        raise

    if not output_data:

        raise Exception(
            "Background removal returned empty output."
        )

    with open(
        output_path,
        "wb",
    ) as output_file:

        output_file.write(
            output_data
        )

    print(
        "Background removal completed.",
        flush=True,
    )


# =========================================================
# SMART CROP
# =========================================================

def smart_crop(image):

    if image is None:

        raise Exception(
            "Invalid image supplied to smart_crop()."
        )

    if len(image.shape) != 3:

        raise Exception(
            "Image does not have valid dimensions."
        )

    if image.shape[2] < 4:

        raise Exception(
            "Image does not contain an alpha channel."
        )

    alpha = image[:, :, 3]

    mask = np.where(
        alpha > 20,
        255,
        0,
    ).astype(np.uint8)

    kernel = np.ones(
        (5, 5),
        np.uint8,
    )

    mask = cv2.morphologyEx(
        mask,
        cv2.MORPH_OPEN,
        kernel,
    )

    mask = cv2.morphologyEx(
        mask,
        cv2.MORPH_CLOSE,
        kernel,
    )

    coords = cv2.findNonZero(
        mask
    )

    if coords is None:

        raise Exception(
            "Could not detect product after background removal."
        )

    x, y, width, height = cv2.boundingRect(
        coords
    )

    if width <= 0 or height <= 0:

        raise Exception(
            "Detected product has invalid dimensions."
        )

    padding = int(
        max(width, height) * 0.16
    )

    left = max(
        0,
        x - padding,
    )

    top = max(
        0,
        y - padding,
    )

    right = min(
        image.shape[1],
        x + width + padding,
    )

    bottom = min(
        image.shape[0],
        y + height + padding,
    )

    cropped = image[
        top:bottom,
        left:right,
    ]

    if cropped.size == 0:

        raise Exception(
            "Smart crop produced an empty image."
        )

    return cropped


# =========================================================
# STUDIO BACKGROUND
# =========================================================

def create_studio_background(size):

    y = np.linspace(
        0,
        1,
        size,
        dtype=np.float32,
    ).reshape(
        -1,
        1,
    )

    top = 252.0
    bottom = 241.0

    brightness = (
        top * (1 - y)
        + bottom * y
    )

    brightness = np.repeat(
        brightness,
        size,
        axis=1,
    )

    background = np.zeros(
        (
            size,
            size,
            3,
        ),
        dtype=np.uint8,
    )

    background[:, :, 0] = np.clip(
        brightness + 1,
        0,
        255,
    )

    background[:, :, 1] = np.clip(
        brightness,
        0,
        255,
    )

    background[:, :, 2] = np.clip(
        brightness - 1,
        0,
        255,
    )

    return background


# =========================================================
# LIGHTING
# =========================================================

def create_light_map(size):

    axis = np.linspace(
        -1,
        1,
        size,
        dtype=np.float32,
    )

    x, y = np.meshgrid(
        axis,
        axis,
    )

    distance = (
        ((x + 0.32) ** 2) * 1.2
        + ((y + 0.40) ** 2) * 1.7
    )

    return np.exp(
        -distance * 2.2
    )


def apply_product_lighting(
    product,
    light_map,
):

    if product.shape[2] != 4:

        raise Exception(
            "Product must contain RGBA channels."
        )

    rgb = product[
        :, :, :3
    ].astype(
        np.float32
    )

    alpha = (
        product[
            :, :, 3
        ].astype(
            np.float32
        )
        / 255.0
    )

    product_height = product.shape[0]
    product_width = product.shape[1]

    product_light = cv2.resize(
        light_map,
        (
            product_width,
            product_height,
        ),
        interpolation=cv2.INTER_LINEAR,
    )

    multiplier = (
        1.0
        + product_light * 0.10
    )

    rgb *= multiplier[:, :, None]

    # Slight warm highlight.
    rgb[:, :, 2] += (
        product_light * 1.5
    )

    rgb = np.clip(
        rgb,
        0,
        255,
    )

    product[
        :, :, :3
    ] = rgb.astype(
        np.uint8
    )

    return product


# =========================================================
# PRODUCT RESIZE
# =========================================================

def resize_product(
    product,
    canvas_size,
):

    height = product.shape[0]
    width = product.shape[1]

    if width <= 0 or height <= 0:

        raise Exception(
            "Product has invalid dimensions."
        )

    max_dimension = int(
        canvas_size * 0.78
    )

    scale = min(
        max_dimension / width,
        max_dimension / height,
    )

    # Never upscale here.
    #
    # The final high-resolution upscale is handled later.
    scale = min(
        scale,
        1.0,
    )

    new_width = max(
        1,
        int(width * scale),
    )

    new_height = max(
        1,
        int(height * scale),
    )

    resized = cv2.resize(
        product,
        (
            new_width,
            new_height,
        ),
        interpolation=(
            cv2.INTER_AREA
            if scale < 1
            else cv2.INTER_LANCZOS4
        ),
    )

    return resized


# =========================================================
# SHADOW
# =========================================================

def create_shadow(
    product,
    canvas_size,
    offset_x,
    offset_y,
):

    alpha = product[
        :, :, 3
    ]

    mask = np.where(
        alpha > 30,
        255,
        0,
    ).astype(np.uint8)

    coords = cv2.findNonZero(
        mask
    )

    shadow = np.zeros(
        (
            canvas_size,
            canvas_size,
        ),
        dtype=np.uint8,
    )

    if coords is None:

        return shadow

    x, y, width, height = cv2.boundingRect(
        coords
    )

    absolute_x = (
        offset_x + x
    )

    absolute_y = (
        offset_y + y
    )

    center_x = (
        absolute_x
        + width // 2
    )

    center_y = (
        absolute_y
        + height
        - max(
            5,
            int(height * 0.025),
        )
    )

    ellipse_width = max(
        30,
        int(width * 0.38),
    )

    ellipse_height = max(
        9,
        int(height * 0.035),
    )

    # Prevent ellipse from going outside canvas.

    center_x = max(
        0,
        min(
            center_x,
            canvas_size - 1,
        ),
    )

    center_y = max(
        0,
        min(
            center_y,
            canvas_size - 1,
        ),
    )

    cv2.ellipse(
        shadow,
        (
            center_x,
            center_y,
        ),
        (
            min(
                ellipse_width,
                canvas_size // 2,
            ),
            min(
                ellipse_height,
                canvas_size // 2,
            ),
        ),
        0,
        0,
        360,
        110,
        -1,
    )

    shadow = cv2.GaussianBlur(
        shadow,
        (0, 0),
        sigmaX=16,
    )

    return shadow


def blend_shadow(
    background,
    shadow,
):

    shadow_float = (
        shadow.astype(
            np.float32
        )
        / 255.0
    )

    opacity = (
        shadow_float[:, :, None]
        * 0.20
    )

    result = (
        background.astype(
            np.float32
        )
        * (
            1
            - opacity
        )
    )

    return np.clip(
        result,
        0,
        255,
    ).astype(
        np.uint8
    )


# =========================================================
# COMPOSITING
# =========================================================

def composite_product(
    background,
    product,
):

    canvas = background.copy()

    canvas_size = canvas.shape[0]

    product_height = product.shape[0]
    product_width = product.shape[1]

    offset_x = (
        canvas_size
        - product_width
    ) // 2

    offset_y = (
        canvas_size
        - product_height
    ) // 2

    offset_y += int(
        canvas_size * 0.035
    )

    offset_y = max(
        0,
        min(
            offset_y,
            canvas_size
            - product_height,
        ),
    )

    shadow = create_shadow(
        product,
        canvas_size,
        offset_x,
        offset_y,
    )

    canvas = blend_shadow(
        canvas,
        shadow,
    )

    region = canvas[
        offset_y:
        offset_y + product_height,
        offset_x:
        offset_x + product_width,
    ].astype(
        np.float32
    )

    product_rgb = product[
        :, :, :3
    ].astype(
        np.float32
    )

    alpha = (
        product[
            :, :, 3
        ].astype(
            np.float32
        )
        / 255.0
    )

    result = (
        product_rgb
        * alpha[:, :, None]
        + region
        * (
            1
            - alpha[:, :, None]
        )
    )

    canvas[
        offset_y:
        offset_y + product_height,
        offset_x:
        offset_x + product_width,
    ] = np.clip(
        result,
        0,
        255,
    ).astype(
        np.uint8
    )

    return canvas


# =========================================================
# FINAL OPENCV ENHANCEMENT
# =========================================================

def enhance_image(image):

    enhanced = cv2.convertScaleAbs(
        image,
        alpha=1.025,
        beta=2,
    )

    blurred = cv2.GaussianBlur(
        enhanced,
        (0, 0),
        0.8,
    )

    sharpened = cv2.addWeighted(
        enhanced,
        1.08,
        blurred,
        -0.08,
        0,
    )

    return sharpened


# =========================================================
# CPU UPSCALE
# =========================================================

def upscale_cpu(
    input_path,
    output_path,
):

    print(
        "Render/Linux detected.",
        flush=True,
    )

    print(
        "Using CPU-safe OpenCV 4x upscale.",
        flush=True,
    )

    image = cv2.imread(
        input_path,
        cv2.IMREAD_COLOR,
    )

    if image is None:

        raise Exception(
            "Could not read image for CPU upscaling."
        )

    height, width = image.shape[:2]

    print(
        f"Input for CPU upscale: {width} x {height}",
        flush=True,
    )

    target_width = width * 4
    target_height = height * 4

    print(
        f"CPU upscale target: {target_width} x {target_height}",
        flush=True,
    )

    upscaled = cv2.resize(
        image,
        (
            target_width,
            target_height,
        ),
        interpolation=cv2.INTER_CUBIC,
    )

    success = cv2.imwrite(
        output_path,
        upscaled,
        [
            cv2.IMWRITE_PNG_COMPRESSION,
            3,
        ],
    )

    if not success:

        raise Exception(
            "Could not save CPU-upscaled image."
        )

    print(
        "CPU upscale complete.",
        flush=True,
    )


# =========================================================
# WINDOWS REAL-ESRGAN UPSCALE
# =========================================================

def upscale_windows_realesrgan(
    input_path,
    output_path,
):

    if not os.path.exists(
        REAL_ESRGAN_EXE
    ):

        raise Exception(
            "Real-ESRGAN executable not found:\n"
            + REAL_ESRGAN_EXE
        )

    print(
        "Windows detected.",
        flush=True,
    )

    print(
        "Running Real-ESRGAN 4x upscaling...",
        flush=True,
    )

    command = [
        REAL_ESRGAN_EXE,
        "-i",
        input_path,
        "-o",
        output_path,
        "-s",
        "4",
        "-n",
        REAL_ESRGAN_MODEL,
    ]

    print(
        "Starting Real-ESRGAN process...",
        flush=True,
    )

    try:

        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=False,
            timeout=300,
        )

    except subprocess.TimeoutExpired:

        raise Exception(
            "Real-ESRGAN timed out after 300 seconds."
        )

    except Exception as error:

        raise Exception(
            f"Could not start Real-ESRGAN: {error}"
        )

    if result.stdout:

        print(
            result.stdout,
            flush=True,
        )

    if result.stderr:

        print(
            result.stderr,
            flush=True,
        )

    if result.returncode != 0:

        raise Exception(
            "Real-ESRGAN upscaling failed "
            f"with exit code {result.returncode}."
        )

    if not os.path.exists(
        output_path
    ):

        raise Exception(
            "Real-ESRGAN finished but "
            "the upscaled image was not created."
        )

    print(
        "Real-ESRGAN upscale complete.",
        flush=True,
    )


# =========================================================
# PLATFORM-AWARE UPSCALING
# =========================================================

def upscale_with_realesrgan(
    input_path,
    output_path,
):

    if IS_RENDER:

        upscale_cpu(
            input_path,
            output_path,
        )

    else:

        upscale_windows_realesrgan(
            input_path,
            output_path,
        )


# =========================================================
# FINAL OUTPUT
# =========================================================

def save_final_output(
    input_path,
    output_path,
):

    print(
        "Reading upscaled image...",
        flush=True,
    )

    final_image = cv2.imread(
        input_path,
        cv2.IMREAD_COLOR,
    )

    if final_image is None:

        raise Exception(
            "Could not read upscaled output."
        )

    final_image = cv2.convertScaleAbs(
        final_image,
        alpha=1.01,
        beta=0,
    )

    success = cv2.imwrite(
        output_path,
        final_image,
        [
            cv2.IMWRITE_JPEG_QUALITY,
            95,
        ],
    )

    if not success:

        raise Exception(
            "Could not save final Studio image."
        )

    height, width = final_image.shape[:2]

    print(
        f"Final resolution: {width} x {height}",
        flush=True,
    )

    print(
        f"Final file: {output_path}",
        flush=True,
    )


# =========================================================
# COMPLETE STUDIO PIPELINE
# =========================================================

def create_studio_photo(
    input_path,
    output_path,
):

    if not os.path.exists(
        input_path
    ):

        raise Exception(
            f"Input file not found: {input_path}"
        )

    working_dir = os.path.dirname(
        os.path.abspath(
            output_path
        )
    )

    os.makedirs(
        working_dir,
        exist_ok=True,
    )

    # -----------------------------------------------------
    # UNIQUE TEMP DIRECTORY
    # -----------------------------------------------------
    #
    # This is important for Render.
    #
    # Multiple requests can happen at the same time.
    # Using "_temp_nobg.png" globally could cause requests
    # to overwrite each other's files.
    #

    temp_dir = tempfile.mkdtemp(
        prefix="studio_",
        dir=working_dir,
    )

    temp_no_bg = os.path.join(
        temp_dir,
        "nobg.png",
    )

    temp_opencv = os.path.join(
        temp_dir,
        "studio.jpg",
    )

    temp_upscaled = os.path.join(
        temp_dir,
        "upscaled.png",
    )

    try:

        print(
            "",
            flush=True,
        )

        print(
            "=========================================",
            flush=True,
        )

        print(
            "STARTING STUDIO PHOTO PROCESSING",
            flush=True,
        )

        print(
            f"Platform: {sys.platform}",
            flush=True,
        )

        print(
            f"Canvas size: {CANVAS_SIZE} x {CANVAS_SIZE}",
            flush=True,
        )

        print(
            f"Input: {input_path}",
            flush=True,
        )

        print(
            f"Output: {output_path}",
            flush=True,
        )

        print(
            "=========================================",
            flush=True,
        )

        # -------------------------------------------------
        # 1. BACKGROUND REMOVAL
        # -------------------------------------------------

        print(
            "1/7 Removing background...",
            flush=True,
        )

        remove_background(
            input_path,
            temp_no_bg,
        )

        if not os.path.exists(
            temp_no_bg
        ):

            raise Exception(
                "Background removal completed "
                "but output file does not exist."
            )

        # -------------------------------------------------
        # READ RGBA
        # -------------------------------------------------

        print(
            "Reading background-removed image...",
            flush=True,
        )

        image = cv2.imread(
            temp_no_bg,
            cv2.IMREAD_UNCHANGED,
        )

        if image is None:

            raise Exception(
                "Could not read background-removed image."
            )

        print(
            f"Background-removed dimensions: "
            f"{image.shape[1]} x {image.shape[0]}",
            flush=True,
        )

        # -------------------------------------------------
        # ENSURE RGBA
        # -------------------------------------------------

        if len(image.shape) != 3:

            raise Exception(
                "Processed image does not have valid channels."
            )

        if image.shape[2] == 3:

            print(
                "No alpha channel detected. "
                "Creating opaque alpha channel.",
                flush=True,
            )

            alpha = np.full(
                (
                    image.shape[0],
                    image.shape[1],
                ),
                255,
                dtype=np.uint8,
            )

            image = cv2.cvtColor(
                image,
                cv2.COLOR_BGR2BGRA,
            )

        elif image.shape[2] != 4:

            raise Exception(
                "Processed image does not have "
                "3 or 4 channels."
            )

        # -------------------------------------------------
        # 2. SMART CROP
        # -------------------------------------------------

        print(
            "2/7 Detecting product...",
            flush=True,
        )

        product = smart_crop(
            image
        )

        print(
            f"Detected product crop: "
            f"{product.shape[1]} x {product.shape[0]}",
            flush=True,
        )

        # -------------------------------------------------
        # 3. BACKGROUND
        # -------------------------------------------------

        print(
            "3/7 Creating studio background...",
            flush=True,
        )

        background = create_studio_background(
            CANVAS_SIZE
        )

        # -------------------------------------------------
        # 4. LIGHTING
        # -------------------------------------------------

        print(
            "4/7 Applying professional lighting...",
            flush=True,
        )

        product = resize_product(
            product,
            CANVAS_SIZE,
        )

        print(
            f"Product after resize: "
            f"{product.shape[1]} x {product.shape[0]}",
            flush=True,
        )

        light_map = create_light_map(
            CANVAS_SIZE
        )

        product = apply_product_lighting(
            product,
            light_map,
        )

        # -------------------------------------------------
        # 5. COMPOSITION
        # -------------------------------------------------

        print(
            "5/7 Adding shadow and composition...",
            flush=True,
        )

        final_image = composite_product(
            background,
            product,
        )

        # -------------------------------------------------
        # 6. ENHANCEMENT
        # -------------------------------------------------

        print(
            "6/7 Applying OpenCV enhancement...",
            flush=True,
        )

        final_image = enhance_image(
            final_image
        )

        # Ensure exact canvas size.

        if (
            final_image.shape[1] != CANVAS_SIZE
            or final_image.shape[0] != CANVAS_SIZE
        ):

            final_image = cv2.resize(
                final_image,
                (
                    CANVAS_SIZE,
                    CANVAS_SIZE,
                ),
                interpolation=cv2.INTER_LANCZOS4,
            )

        success = cv2.imwrite(
            temp_opencv,
            final_image,
            [
                cv2.IMWRITE_JPEG_QUALITY,
                95,
            ],
        )

        if not success:

            raise Exception(
                "Could not save OpenCV Studio image."
            )

        print(
            f"OpenCV Studio image created: "
            f"{CANVAS_SIZE} x {CANVAS_SIZE}",
            flush=True,
        )

        # -------------------------------------------------
        # 7. UPSCALE
        # -------------------------------------------------

        print(
            "7/7 Upscaling to high resolution...",
            flush=True,
        )

        upscale_with_realesrgan(
            temp_opencv,
            temp_upscaled,
        )

        if not os.path.exists(
            temp_upscaled
        ):

            raise Exception(
                "Upscaling finished but output file "
                "does not exist."
            )

        # -------------------------------------------------
        # SAVE FINAL JPG
        # -------------------------------------------------

        print(
            "Saving final Studio JPG...",
            flush=True,
        )

        save_final_output(
            temp_upscaled,
            output_path,
        )

        if not os.path.exists(
            output_path
        ):

            raise Exception(
                "Final Studio image was not created."
            )

        print(
            "=========================================",
            flush=True,
        )

        print(
            "STUDIO PROCESSING SUCCESS",
            flush=True,
        )

        print(
            "=========================================",
            flush=True,
        )

    except Exception as error:

        print(
            "",
            flush=True,
        )

        print(
            "=========================================",
            flush=True,
        )

        print(
            "STUDIO PROCESSING FAILED",
            flush=True,
        )

        print(
            f"ERROR: {error}",
            flush=True,
        )

        print(
            "=========================================",
            flush=True,
        )

        traceback.print_exc()

        raise

    finally:

        # -------------------------------------------------
        # CLEAN TEMP FILES
        # -------------------------------------------------

        for temp_file in [
            temp_no_bg,
            temp_opencv,
            temp_upscaled,
        ]:

            if os.path.exists(
                temp_file
            ):

                try:

                    os.remove(
                        temp_file
                    )

                except OSError:

                    pass

        try:

            if os.path.exists(
                temp_dir
            ):

                os.rmdir(
                    temp_dir
                )

        except OSError:

            pass


# =========================================================
# COMMAND LINE
# =========================================================

def main():

    print(
        "=========================================",
        flush=True,
    )

    print(
        "KarigarConnect Studio Photo Processor",
        flush=True,
    )

    print(
        f"Python: {sys.version}",
        flush=True,
    )

    print(
        f"Platform: {sys.platform}",
        flush=True,
    )

    print(
        f"Render/Linux mode: {IS_RENDER}",
        flush=True,
    )

    print(
        f"Canvas: {CANVAS_SIZE} x {CANVAS_SIZE}",
        flush=True,
    )

    print(
        "=========================================",
        flush=True,
    )

    if len(sys.argv) != 3:

        print(
            "Usage:",
            flush=True,
        )

        print(
            "python photo_processor.py input.jpg output.jpg",
            flush=True,
        )

        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    if not os.path.exists(
        input_path
    ):

        print(
            "ERROR",
            flush=True,
        )

        print(
            f"Input file not found: {input_path}",
            flush=True,
        )

        sys.exit(1)

    try:

        create_studio_photo(
            input_path,
            output_path,
        )

        print(
            "",
            flush=True,
        )

        print(
            "=================================",
            flush=True,
        )

        print(
            "SUCCESS",
            flush=True,
        )

        print(
            f"Final image: {output_path}",
            flush=True,
        )

        print(
            "=================================",
            flush=True,
        )

    except Exception as error:

        print(
            "",
            flush=True,
        )

        print(
            "ERROR",
            flush=True,
        )

        print(
            str(error),
            flush=True,
        )

        sys.exit(1)


# =========================================================
# ENTRY POINT
# =========================================================

if __name__ == "__main__":

    main()
