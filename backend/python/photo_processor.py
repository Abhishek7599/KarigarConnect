import sys
import os
import cv2
import numpy as np
import subprocess
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


# Lightweight CPU-friendly segmentation model
rembg_session = new_session(REMBG_MODEL)


# =========================================================
# BACKGROUND REMOVAL
# =========================================================

def remove_background(input_path, output_path):
    with open(input_path, "rb") as input_file:
        input_data = input_file.read()

    output_data = remove(
        input_data,
        session=rembg_session,
    )

    with open(output_path, "wb") as output_file:
        output_file.write(output_data)


# =========================================================
# SMART CROP
# =========================================================

def smart_crop(image):
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

    coords = cv2.findNonZero(mask)

    if coords is None:
        raise Exception(
            "Could not detect product."
        )

    x, y, width, height = cv2.boundingRect(
        coords
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

    return image[
        top:bottom,
        left:right,
    ]


# =========================================================
# STUDIO BACKGROUND
# =========================================================

def create_studio_background(size):
    y = np.linspace(
        0,
        1,
        size,
        dtype=np.float32,
    ).reshape(-1, 1)

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
        (size, size, 3),
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
    rgb = product[:, :, :3].astype(
        np.float32
    )

    alpha = (
        product[:, :, 3].astype(
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

    # Slight warm highlight
    rgb[:, :, 2] += (
        product_light * 1.5
    )

    original = rgb.copy()

    # Protect transparent areas
    result = (
        rgb * alpha[:, :, None]
        + original
        * (
            1
            - alpha[:, :, None]
        )
    )

    product[:, :, :3] = np.clip(
        result,
        0,
        255,
    ).astype(np.uint8)

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

    max_dimension = int(
        canvas_size * 0.78
    )

    scale = min(
        max_dimension / width,
        max_dimension / height,
    )

    new_width = max(
        1,
        int(width * scale),
    )

    new_height = max(
        1,
        int(height * scale),
    )

    return cv2.resize(
        product,
        (
            new_width,
            new_height,
        ),
        interpolation=cv2.INTER_LANCZOS4,
    )


# =========================================================
# SHADOW
# =========================================================

def create_shadow(
    product,
    canvas_size,
    offset_x,
    offset_y,
):
    alpha = product[:, :, 3]

    mask = np.where(
        alpha > 30,
        255,
        0,
    ).astype(np.uint8)

    coords = cv2.findNonZero(mask)

    shadow = np.zeros(
        (canvas_size, canvas_size),
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

    cv2.ellipse(
        shadow,
        (
            center_x,
            center_y,
        ),
        (
            ellipse_width,
            ellipse_height,
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
    ).astype(np.uint8)


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
    ].astype(np.float32)

    product_rgb = product[
        :, :, :3
    ].astype(np.float32)

    alpha = (
        product[:, :, 3]
        .astype(np.float32)
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
    ).astype(np.uint8)

    return canvas


# =========================================================
# FINAL OPENCV ENHANCEMENT
# =========================================================

def enhance_image(image):
    # Mild contrast
    enhanced = cv2.convertScaleAbs(
        image,
        alpha=1.025,
        beta=2,
    )

    # Gentle sharpening before super-resolution
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
# REAL-ESRGAN UPSCALING
# =========================================================

def upscale_with_realesrgan(
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
        "Running Real-ESRGAN 4x upscaling..."
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

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=False,
        )
    except Exception as error:
        raise Exception(
            f"Could not start Real-ESRGAN: {error}"
        )

    if result.stdout:
        print(result.stdout)

    if result.returncode != 0:
        if result.stderr:
            print(result.stderr)

        raise Exception(
            "Real-ESRGAN upscaling failed."
        )

    if not os.path.exists(
        output_path
    ):
        raise Exception(
            "Real-ESRGAN finished but "
            "the upscaled image was not created."
        )


# =========================================================
# COMPLETE STUDIO PIPELINE
# =========================================================

def create_studio_photo(
    input_path,
    output_path,
):
    working_dir = os.path.dirname(
        output_path
    )

    os.makedirs(
        working_dir,
        exist_ok=True,
    )

    temp_no_bg = os.path.join(
        working_dir,
        "_temp_nobg.png",
    )

    temp_opencv = os.path.join(
        working_dir,
        "_temp_studio.jpg",
    )

    temp_upscaled = os.path.join(
        working_dir,
        "_temp_upscaled.png",
    )

    try:
        print(
            "1/7 Removing background..."
        )

        remove_background(
            input_path,
            temp_no_bg,
        )

        image = cv2.imread(
            temp_no_bg,
            cv2.IMREAD_UNCHANGED,
        )

        if image is None:
            raise Exception(
                "Could not read background-removed image."
            )

        if (
            len(image.shape) != 3
            or image.shape[2] != 4
        ):
            raise Exception(
                "Processed image has no alpha channel."
            )

        print(
            "2/7 Detecting product..."
        )

        product = smart_crop(
            image
        )

        canvas_size = 1080

        print(
            "3/7 Creating studio background..."
        )

        background = (
            create_studio_background(
                canvas_size
            )
        )

        print(
            "4/7 Applying professional lighting..."
        )

        product = resize_product(
            product,
            canvas_size,
        )

        light_map = create_light_map(
            canvas_size
        )

        product = apply_product_lighting(
            product,
            light_map,
        )

        print(
            "5/7 Adding shadow and composition..."
        )

        final_image = composite_product(
            background,
            product,
        )

        print(
            "6/7 Applying OpenCV enhancement..."
        )

        final_image = enhance_image(
            final_image
        )

        final_image = cv2.resize(
            final_image,
            (
                1080,
                1080,
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
                "Could not save OpenCV image."
            )

        print(
            "OpenCV Studio image created."
        )

        print(
            "7/7 Upscaling to high resolution..."
        )

        upscale_with_realesrgan(
            temp_opencv,
            temp_upscaled,
        )

        # Convert final output to JPG if necessary.
        final_upscaled = cv2.imread(
            temp_upscaled,
            cv2.IMREAD_COLOR,
        )

        if final_upscaled is None:
            raise Exception(
                "Could not read Real-ESRGAN output."
            )

        final_upscaled = cv2.convertScaleAbs(
            final_upscaled,
            alpha=1.01,
            beta=0,
        )

        success = cv2.imwrite(
            output_path,
            final_upscaled,
            [
                cv2.IMWRITE_JPEG_QUALITY,
                95,
            ],
        )

        if not success:
            raise Exception(
                "Could not save final Studio image."
            )

        height, width = final_upscaled.shape[:2]

        print(
            f"Final resolution: {width} x {height}"
        )

    finally:
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


# =========================================================
# COMMAND LINE
# =========================================================

def main():
    if len(sys.argv) != 3:
        print(
            "Usage:"
        )

        print(
            "python photo_processor.py "
            "input.jpg output.jpg"
        )

        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    if not os.path.exists(
        input_path
    ):
        print("ERROR")

        print(
            f"Input file not found: {input_path}"
        )

        sys.exit(1)

    try:
        create_studio_photo(
            input_path,
            output_path,
        )

        print(
            "================================="
        )

        print(
            "SUCCESS"
        )

        print(
            f"Final image: {output_path}"
        )

        print(
            "================================="
        )

    except Exception as error:
        print(
            "ERROR"
        )

        print(
            str(error)
        )

        sys.exit(1)


if __name__ == "__main__":
    main()