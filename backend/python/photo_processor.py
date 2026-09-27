
# ============================================================
# KARIGARCONNECT STUDIO PHOTO PROCESSOR
# ============================================================
#
# Windows:
#   Uses rembg when available.
#
# Render/Linux:
#   NEVER uses GrabCut.
#   Uses a lightweight center/edge foreground mask.
#
# The goal is to keep Studio generation reliable on Render CPU.
# ============================================================

print("PYTHON PROCESS STARTED", flush=True)

import sys
import os
import traceback

print("IMPORT: standard libraries OK", flush=True)

# ------------------------------------------------------------
# OpenCV
# ------------------------------------------------------------

print("IMPORT: cv2 starting...", flush=True)

try:
    import cv2
    print("IMPORT: cv2 OK", flush=True)
except Exception as e:
    print(f"IMPORT ERROR cv2: {e}", flush=True)
    raise

# ------------------------------------------------------------
# NumPy
# ------------------------------------------------------------

print("IMPORT: numpy starting...", flush=True)

try:
    import numpy as np
    print("IMPORT: numpy OK", flush=True)
except Exception as e:
    print(f"IMPORT ERROR numpy: {e}", flush=True)
    raise

# ------------------------------------------------------------
# PIL
# ------------------------------------------------------------

print("IMPORT: PIL starting...", flush=True)

try:
    from PIL import Image, ImageEnhance, ImageFilter
    print("IMPORT: PIL OK", flush=True)
except Exception as e:
    print(f"IMPORT ERROR PIL: {e}", flush=True)
    raise

# ------------------------------------------------------------
# rembg
# ------------------------------------------------------------
#
# IMPORTANT:
# Do NOT import rembg on Render.
# Its model initialization can block startup.
# ------------------------------------------------------------

rembg_available = False
rembg_remove = None

if sys.platform == "win32":
    try:
        print("Windows detected. Loading rembg...", flush=True)

        from rembg import remove as rembg_remove

        rembg_available = True

        print("rembg available", flush=True)

    except Exception as e:
        print(
            f"rembg unavailable on Windows: {e}",
            flush=True
        )
        rembg_available = False
else:
    print(
        "Linux/Render detected. Skipping rembg.",
        flush=True
    )


# ============================================================
# LOGGING
# ============================================================

def log(message):
    print(message, flush=True)


# ============================================================
# IMAGE LOADING
# ============================================================

def load_image(input_path):
    log(f"Loading image: {input_path}")

    image = Image.open(input_path)

    image = image.convert("RGB")

    log(
        f"Original image: {image.size}, "
        f"mode={image.mode}"
    )

    return image


# ============================================================
# FAST RENDER FOREGROUND EXTRACTION
# ============================================================
#
# NO GrabCut.
#
# Strategy:
#   1. Resize to a small working image.
#   2. Estimate background from the border.
#   3. Calculate color distance from that background.
#   4. Keep pixels sufficiently different from the border.
#   5. Clean mask using small morphology operations.
#
# This is intentionally lightweight.
# ============================================================

def remove_background_fast(image):

    log("Using FAST Render foreground extraction...")

    rgba = np.array(
        image.convert("RGBA"),
        dtype=np.uint8
    )

    rgb = rgba[:, :, :3]

    height, width = rgb.shape[:2]

    log(
        f"Foreground input size: "
        f"{width}x{height}"
    )

    # --------------------------------------------------------
    # Work at small resolution.
    # --------------------------------------------------------

    max_dimension = 600

    scale = min(
        1.0,
        max_dimension / float(
            max(width, height)
        )
    )

    work_width = max(
        32,
        int(width * scale)
    )

    work_height = max(
        32,
        int(height * scale)
    )

    if scale != 1.0:

        work_rgb = cv2.resize(
            rgb,
            (
                work_width,
                work_height
            ),
            interpolation=cv2.INTER_AREA
        )

    else:

        work_rgb = rgb.copy()

    log(
        f"Working resolution: "
        f"{work_width}x{work_height}"
    )

    # --------------------------------------------------------
    # Convert to LAB.
    #
    # LAB gives a better color-distance estimate than raw RGB.
    # --------------------------------------------------------

    lab = cv2.cvtColor(
        work_rgb,
        cv2.COLOR_RGB2LAB
    )

    # --------------------------------------------------------
    # Sample the image borders.
    # --------------------------------------------------------

    border = max(
        3,
        int(
            min(work_width, work_height) * 0.04
        )
    )

    top = lab[:border, :, :]
    bottom = lab[-border:, :, :]
    left = lab[:, :border, :]
    right = lab[:, -border:, :]

    border_pixels = np.concatenate(
        [
            top.reshape(-1, 3),
            bottom.reshape(-1, 3),
            left.reshape(-1, 3),
            right.reshape(-1, 3)
        ],
        axis=0
    )

    background_color = np.median(
        border_pixels,
        axis=0
    )

    log(
        "Estimated border background color."
    )

    # --------------------------------------------------------
    # Color distance from estimated background.
    # --------------------------------------------------------

    diff = (
        lab.astype(np.float32)
        - background_color.astype(np.float32)
    )

    distance = np.sqrt(
        np.sum(
            diff * diff,
            axis=2
        )
    )

    # --------------------------------------------------------
    # Dynamic threshold.
    #
    # The threshold is based on border variation so textured
    # backgrounds don't immediately swallow the product.
    # --------------------------------------------------------

    border_distance = np.sqrt(
        np.sum(
            (
                border_pixels.astype(np.float32)
                - background_color.astype(np.float32)
            )
            ** 2,
            axis=1
        )
    )

    noise_level = float(
        np.percentile(
            border_distance,
            90
        )
    )

    threshold = max(
        18.0,
        min(
            55.0,
            noise_level * 2.2 + 12.0
        )
    )

    log(
        f"Foreground threshold: "
        f"{threshold:.2f}"
    )

    foreground = (
        distance > threshold
    ).astype(np.uint8) * 255

    # --------------------------------------------------------
    # Strongly prefer the central region.
    #
    # This prevents random border texture from becoming
    # foreground.
    # --------------------------------------------------------

    center_mask = np.zeros(
        (
            work_height,
            work_width
        ),
        dtype=np.uint8
    )

    margin_x = int(
        work_width * 0.08
    )

    margin_y = int(
        work_height * 0.05
    )

    cv2.rectangle(
        center_mask,
        (
            margin_x,
            margin_y
        ),
        (
            work_width - margin_x - 1,
            work_height - margin_y - 1
        ),
        255,
        -1
    )

    foreground = cv2.bitwise_and(
        foreground,
        center_mask
    )

    # --------------------------------------------------------
    # Morphological cleanup.
    #
    # Small kernels only.
    # --------------------------------------------------------

    kernel_size = 3

    kernel = cv2.getStructuringElement(
        cv2.MORPH_ELLIPSE,
        (
            kernel_size,
            kernel_size
        )
    )

    foreground = cv2.morphologyEx(
        foreground,
        cv2.MORPH_OPEN,
        kernel,
        iterations=1
    )

    foreground = cv2.morphologyEx(
        foreground,
        cv2.MORPH_CLOSE,
        kernel,
        iterations=2
    )

    # --------------------------------------------------------
    # Keep the largest connected component.
    # --------------------------------------------------------

    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(
        foreground,
        connectivity=8
    )

    if num_labels > 1:

        component_areas = stats[
            1:,
            cv2.CC_STAT_AREA
        ]

        largest_index = (
            1
            + int(
                np.argmax(
                    component_areas
                )
            )
        )

        largest_area = int(
            stats[
                largest_index,
                cv2.CC_STAT_AREA
            ]
        )

        image_area = (
            work_width * work_height
        )

        # Only use the component if it isn't absurdly small.
        if largest_area > image_area * 0.01:

            foreground = np.where(
                labels == largest_index,
                255,
                0
            ).astype(
                np.uint8
            )

    # --------------------------------------------------------
    # Soft edge.
    # --------------------------------------------------------

    foreground = cv2.GaussianBlur(
        foreground,
        (0, 0),
        1.0
    )

    # --------------------------------------------------------
    # Restore original size.
    # --------------------------------------------------------

    foreground = cv2.resize(
        foreground,
        (
            width,
            height
        ),
        interpolation=cv2.INTER_LINEAR
    )

    result = rgba.copy()

    result[:, :, 3] = foreground

    output = Image.fromarray(
        result,
        "RGBA"
    )

    log(
        "FAST Render foreground extraction complete"
    )

    return output


# ============================================================
# BACKGROUND REMOVAL
# ============================================================

def remove_background(image):

    # --------------------------------------------------------
    # Windows
    # --------------------------------------------------------

    if (
        sys.platform == "win32"
        and rembg_available
        and rembg_remove is not None
    ):

        try:

            log(
                "Removing background with rembg..."
            )

            output = rembg_remove(
                image
            )

            if isinstance(
                output,
                Image.Image
            ):
                result = output.convert(
                    "RGBA"
                )
            else:
                result = Image.open(
                    output
                ).convert(
                    "RGBA"
                )

            log(
                "rembg background removal complete"
            )

            return result

        except Exception as e:

            log(
                f"rembg failed: {e}"
            )

            log(
                "Falling back to fast OpenCV extraction..."
            )

    # --------------------------------------------------------
    # Render/Linux
    # --------------------------------------------------------

    return remove_background_fast(
        image
    )


# ============================================================
# SMART CROP
# ============================================================

def smart_crop(image):

    log("Creating smart crop...")

    rgba = image.convert("RGBA")

    alpha = rgba.getchannel("A")

    bbox = alpha.getbbox()

    if bbox is None:

        log(
            "No foreground detected. "
            "Keeping original image."
        )

        return rgba

    left, top, right, bottom = bbox

    width, height = rgba.size

    padding_x = int(
        width * 0.08
    )

    padding_y = int(
        height * 0.08
    )

    left = max(
        0,
        left - padding_x
    )

    top = max(
        0,
        top - padding_y
    )

    right = min(
        width,
        right + padding_x
    )

    bottom = min(
        height,
        bottom + padding_y
    )

    cropped = rgba.crop(
        (
            left,
            top,
            right,
            bottom
        )
    )

    log(
        f"Smart crop: "
        f"{cropped.size}"
    )

    return cropped


# ============================================================
# RESIZE PRODUCT
# ============================================================

def resize_product(image, max_product_size):

    log(
        f"Resizing product to fit "
        f"{max_product_size}px..."
    )

    image = image.convert(
        "RGBA"
    )

    width, height = image.size

    scale = min(
        max_product_size / width,
        max_product_size / height,
        1.0
    )

    new_width = max(
        1,
        int(width * scale)
    )

    new_height = max(
        1,
        int(height * scale)
    )

    resized = image.resize(
        (
            new_width,
            new_height
        ),
        Image.Resampling.LANCZOS
    )

    log(
        f"Product size: "
        f"{resized.size}"
    )

    return resized


# ============================================================
# CREATE STUDIO BACKGROUND
# ============================================================

def create_studio_background(
    width,
    height
):

    log(
        "Creating studio background..."
    )

    background = np.zeros(
        (
            height,
            width,
            3
        ),
        dtype=np.uint8
    )

    # Neutral warm-gray studio background.
    top_value = 242
    bottom_value = 222

    for y in range(height):

        ratio = (
            y / max(
                1,
                height - 1
            )
        )

        value = int(
            top_value
            * (1.0 - ratio)
            + bottom_value
            * ratio
        )

        background[y, :, :] = (
            value,
            value,
            value
        )

    return Image.fromarray(
        background,
        "RGB"
    ).convert(
        "RGBA"
    )


# ============================================================
# STUDIO SHADOW
# ============================================================

def create_shadow(
    width,
    height
):

    shadow = np.zeros(
        (
            height,
            width
        ),
        dtype=np.uint8
    )

    center_x = width // 2

    center_y = int(
        height * 0.78
    )

    ellipse_width = int(
        width * 0.34
    )

    ellipse_height = int(
        height * 0.045
    )

    cv2.ellipse(
        shadow,
        (
            center_x,
            center_y
        ),
        (
            ellipse_width,
            ellipse_height
        ),
        0,
        0,
        360,
        120,
        -1
    )

    shadow = cv2.GaussianBlur(
        shadow,
        (0, 0),
        max(
            3,
            int(width * 0.025)
        )
    )

    shadow_rgba = np.zeros(
        (
            height,
            width,
            4
        ),
        dtype=np.uint8
    )

    shadow_rgba[:, :, 0:3] = 0
    shadow_rgba[:, :, 3] = shadow

    return Image.fromarray(
        shadow_rgba,
        "RGBA"
    )


# ============================================================
# COMPOSITE PRODUCT
# ============================================================

def composite_product(
    product,
    canvas_size
):

    canvas_width, canvas_height = (
        canvas_size,
        canvas_size
    )

    background = create_studio_background(
        canvas_width,
        canvas_height
    )

    # --------------------------------------------------------
    # Shadow
    # --------------------------------------------------------

    shadow = create_shadow(
        canvas_width,
        canvas_height
    )

    background.alpha_composite(
        shadow
    )

    # --------------------------------------------------------
    # Product
    # --------------------------------------------------------

    product_width, product_height = (
        product.size
    )

    x = (
        canvas_width
        - product_width
    ) // 2

    # Slightly below center.
    y = (
        canvas_height
        - product_height
    ) // 2 + int(
        canvas_height * 0.035
    )

    background.alpha_composite(
        product,
        (
            x,
            y
        )
    )

    return background


# ============================================================
# LIGHTING / IMAGE ENHANCEMENT
# ============================================================

def enhance_product(image):

    log(
        "Applying studio lighting..."
    )

    rgba = image.convert(
        "RGBA"
    )

    rgb = rgba.convert(
        "RGB"
    )

    # Slight contrast enhancement.
    rgb = ImageEnhance.Contrast(
        rgb
    ).enhance(
        1.06
    )

    # Slight brightness enhancement.
    rgb = ImageEnhance.Brightness(
        rgb
    ).enhance(
        1.025
    )

    # Very mild color enhancement.
    rgb = ImageEnhance.Color(
        rgb
    ).enhance(
        1.04
    )

    return rgb.convert(
        "RGBA"
    )


# ============================================================
# FINAL SHARPENING
# ============================================================

def final_enhancement(image):

    log(
        "Final image enhancement..."
    )

    rgb = image.convert(
        "RGB"
    )

    # Mild unsharp mask.
    rgb = rgb.filter(
        ImageFilter.UnsharpMask(
            radius=1.2,
            percent=70,
            threshold=3
        )
    )

    return rgb


# ============================================================
# UPSCALE
# ============================================================

def upscale_image(
    image,
    target_size
):

    log(
        f"Upscaling final image to "
        f"{target_size}x{target_size}..."
    )

    rgb = np.array(
        image.convert("RGB")
    )

    upscaled = cv2.resize(
        rgb,
        (
            target_size,
            target_size
        ),
        interpolation=cv2.INTER_CUBIC
    )

    return Image.fromarray(
        upscaled,
        "RGB"
    )


# ============================================================
# MAIN STUDIO PROCESS
# ============================================================

def process_studio(
    input_path,
    output_path
):

    log("")
    log("========================================")
    log("KARIGARCONNECT STUDIO PROCESSOR")
    log("========================================")

    log(
        f"Input: {input_path}"
    )

    log(
        f"Output: {output_path}"
    )

    log(
        f"Platform: {sys.platform}"
    )

    # --------------------------------------------------------
    # Canvas
    # --------------------------------------------------------
    #
    # Render uses 768 by default.
    # You can change with:
    #
    # STUDIO_CANVAS_SIZE=1024
    #
    # --------------------------------------------------------

    canvas_size = int(
        os.getenv(
            "STUDIO_CANVAS_SIZE",
            "768"
        )
    )

    canvas_size = max(
        256,
        min(
            canvas_size,
            2048
        )
    )

    log(
        f"Canvas size: "
        f"{canvas_size}x{canvas_size}"
    )

    # --------------------------------------------------------
    # 1/7 Load
    # --------------------------------------------------------

    log(
        "1/7 Loading product image..."
    )

    image = load_image(
        input_path
    )

    # --------------------------------------------------------
    # 2/7 Background
    # --------------------------------------------------------

    log(
        "2/7 Removing background..."
    )

    product = remove_background(
        image
    )

    # --------------------------------------------------------
    # 3/7 Crop
    # --------------------------------------------------------

    log(
        "3/7 Smart cropping product..."
    )

    product = smart_crop(
        product
    )

    # --------------------------------------------------------
    # 4/7 Resize
    # --------------------------------------------------------

    log(
        "4/7 Resizing product..."
    )

    product_limit = int(
        canvas_size * 0.78
    )

    product = resize_product(
        product,
        product_limit
    )

    # --------------------------------------------------------
    # 5/7 Lighting
    # --------------------------------------------------------

    log(
        "5/7 Applying lighting..."
    )

    product = enhance_product(
        product
    )

    # --------------------------------------------------------
    # 6/7 Studio composition
    # --------------------------------------------------------

    log(
        "6/7 Creating studio composition..."
    )

    result = composite_product(
        product,
        canvas_size
    )

    # --------------------------------------------------------
    # 7/7 Finalize
    # --------------------------------------------------------

    log(
        "7/7 Finalizing output..."
    )

    result = final_enhancement(
        result
    )

    # --------------------------------------------------------
    # Ensure output directory exists.
    # --------------------------------------------------------

    output_dir = os.path.dirname(
        output_path
    )

    if output_dir:
        os.makedirs(
            output_dir,
            exist_ok=True
        )

    # --------------------------------------------------------
    # Render output.
    # --------------------------------------------------------

    result.save(
        output_path,
        "JPEG",
        quality=94,
        optimize=True
    )

    # --------------------------------------------------------
    # Verify.
    # --------------------------------------------------------

    if not os.path.exists(
        output_path
    ):

        raise RuntimeError(
            "Output image was not created."
        )

    output_size = os.path.getsize(
        output_path
    )

    if output_size <= 0:

        raise RuntimeError(
            "Output image is empty."
        )

    log(
        f"Output created: "
        f"{output_path}"
    )

    log(
        f"Output file size: "
        f"{output_size} bytes"
    )

    log("")
    log("========================================")
    log("STUDIO PROCESSING COMPLETE")
    log("========================================")

    return output_path


# ============================================================
# CLI
# ============================================================

def main():

    log(
        "KarigarConnect Studio Photo Processor"
    )

    log(
        "CLI started"
    )

    log(
        f"Python version: "
        f"{sys.version}"
    )

    if len(sys.argv) < 3:

        print(
            "Usage: python photo_processor.py "
            "<input> <output>",
            flush=True
        )

        return 1

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    log(
        f"CLI input: {input_path}"
    )

    log(
        f"CLI output: {output_path}"
    )

    try:

        process_studio(
            input_path,
            output_path
        )

        return 0

    except Exception as e:

        log("")
        log("========================================")
        log("STUDIO PROCESSING FAILED")
        log("========================================")

        log(
            f"Error: {e}"
        )

        traceback.print_exc()

        return 1


if __name__ == "__main__":

    sys.exit(
        main()
    )