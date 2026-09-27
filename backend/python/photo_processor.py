
# ============================================================
# KARIGARCONNECT STUDIO PHOTO PROCESSOR
# Render/Linux + Windows compatible
# Diagnostic version
# ============================================================

print("PYTHON PROCESS STARTED", flush=True)

import sys
print("IMPORT: sys OK", flush=True)

import os
print("IMPORT: os OK", flush=True)

import traceback
import tempfile
import shutil
import subprocess
from pathlib import Path

print("IMPORT: standard libraries OK", flush=True)


# ============================================================
# THIRD-PARTY IMPORTS
# ============================================================

try:
    print("IMPORT: cv2 starting...", flush=True)
    import cv2
    print("IMPORT: cv2 OK", flush=True)
except Exception as e:
    print(f"IMPORT ERROR: cv2 -> {e}", flush=True)
    traceback.print_exc()
    sys.exit(1)


try:
    print("IMPORT: numpy starting...", flush=True)
    import numpy as np
    print("IMPORT: numpy OK", flush=True)
except Exception as e:
    print(f"IMPORT ERROR: numpy -> {e}", flush=True)
    traceback.print_exc()
    sys.exit(1)


try:
    print("IMPORT: PIL starting...", flush=True)
    from PIL import Image, ImageEnhance, ImageFilter
    print("IMPORT: PIL OK", flush=True)
except Exception as e:
    print(f"IMPORT ERROR: PIL -> {e}", flush=True)
    traceback.print_exc()
    sys.exit(1)


try:
    print("IMPORT: rembg starting...", flush=True)
    from rembg import remove, new_session
    print("IMPORT: rembg OK", flush=True)
except Exception as e:
    print(f"IMPORT ERROR: rembg -> {e}", flush=True)
    traceback.print_exc()
    sys.exit(1)


# ============================================================
# CONFIGURATION
# ============================================================

REMBG_MODEL = os.getenv(
    "REMBG_MODEL",
    "u2netp"
)

WINDOWS_UPSCALER = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "tools",
    "realesrgan",
    "realesrgan-ncnn-vulkan.exe"
)

WINDOWS_UPSCALER_MODEL = os.getenv(
    "REALESRGAN_MODEL",
    "realesrgan-x4plus"
)

DEFAULT_RENDER_CANVAS = 768
DEFAULT_WINDOWS_CANVAS = 1080

try:
    CANVAS_SIZE = int(
        os.getenv(
            "STUDIO_CANVAS_SIZE",
            DEFAULT_RENDER_CANVAS
            if sys.platform != "win32"
            else DEFAULT_WINDOWS_CANVAS
        )
    )
except Exception:
    CANVAS_SIZE = DEFAULT_RENDER_CANVAS


# ============================================================
# LAZY REMBG SESSION
# ============================================================

rembg_session = None


def get_rembg_session():
    global rembg_session

    if rembg_session is None:
        print(
            f"Loading rembg model: {REMBG_MODEL}",
            flush=True
        )

        rembg_session = new_session(
            REMBG_MODEL
        )

        print(
            "rembg model loaded successfully",
            flush=True
        )

    return rembg_session


# ============================================================
# LOGGING
# ============================================================

def log(message):
    print(message, flush=True)


# ============================================================
# IMAGE LOAD
# ============================================================

def load_image(input_path):
    log(f"Loading image: {input_path}")

    if not os.path.exists(input_path):
        raise FileNotFoundError(
            f"Input image does not exist: {input_path}"
        )

    image = Image.open(input_path)

    log(
        f"Original image: {image.size}, mode={image.mode}"
    )

    return image.convert("RGBA")


# ============================================================
# BACKGROUND REMOVAL
# ============================================================

def remove_background(image):
    log("Removing background with rembg...")

    session = get_rembg_session()

    result = remove(
        image,
        session=session
    )

    if result.mode != "RGBA":
        result = result.convert("RGBA")

    log("Background removed successfully")

    return result


# ============================================================
# SMART CROP
# ============================================================

def smart_crop(image):
    log("Creating smart crop...")

    alpha = image.getchannel("A")

    bbox = alpha.getbbox()

    if not bbox:
        log(
            "No alpha bounding box found. Using full image."
        )

        return image

    left, top, right, bottom = bbox

    width = right - left
    height = bottom - top

    padding_x = int(width * 0.15)
    padding_y = int(height * 0.15)

    left = max(0, left - padding_x)
    top = max(0, top - padding_y)

    right = min(
        image.width,
        right + padding_x
    )

    bottom = min(
        image.height,
        bottom + padding_y
    )

    cropped = image.crop(
        (left, top, right, bottom)
    )

    log(
        f"Smart crop: {cropped.size}"
    )

    return cropped


# ============================================================
# RESIZE PRODUCT
# ============================================================

def resize_product(image, canvas_size):
    log(
        f"Resizing product for {canvas_size}x{canvas_size} canvas..."
    )

    max_product_size = int(
        canvas_size * 0.72
    )

    width, height = image.size

    scale = min(
        max_product_size / width,
        max_product_size / height
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
        (new_width, new_height),
        Image.Resampling.LANCZOS
    )

    log(
        f"Product resized: {resized.size}"
    )

    return resized


# ============================================================
# STUDIO BACKGROUND
# ============================================================

def create_studio_background(size):
    log(
        f"Creating studio background: {size}x{size}"
    )

    background = np.zeros(
        (size, size, 4),
        dtype=np.uint8
    )

    # Warm neutral studio background.
    top_color = np.array(
        [248, 245, 238, 255],
        dtype=np.float32
    )

    bottom_color = np.array(
        [225, 220, 210, 255],
        dtype=np.float32
    )

    for y in range(size):
        ratio = y / max(1, size - 1)

        color = (
            top_color * (1 - ratio)
            + bottom_color * ratio
        ).astype(np.uint8)

        background[y, :, :] = color

    return Image.fromarray(
        background,
        "RGBA"
    )


# ============================================================
# LIGHTING
# ============================================================

def apply_lighting(image):
    log("Applying product lighting...")

    rgb = image.convert("RGB")

    brightness = ImageEnhance.Brightness(
        rgb
    )

    rgb = brightness.enhance(1.05)

    contrast = ImageEnhance.Contrast(
        rgb
    )

    rgb = contrast.enhance(1.04)

    return rgb.convert("RGBA")


# ============================================================
# SHADOW
# ============================================================

def create_shadow(product, canvas_size):
    log("Creating product shadow...")

    alpha = product.getchannel("A")

    shadow_alpha = alpha.filter(
        ImageFilter.GaussianBlur(
            radius=max(
                4,
                int(canvas_size * 0.012)
            )
        )
    )

    shadow = Image.new(
        "RGBA",
        product.size,
        (0, 0, 0, 0)
    )

    shadow.putalpha(
        shadow_alpha.point(
            lambda p: int(p * 0.22)
        )
    )

    return shadow


# ============================================================
# COMPOSITING
# ============================================================

def composite_product(
    background,
    product,
    canvas_size
):
    log("Compositing product...")

    x = (
        canvas_size - product.width
    ) // 2

    y = (
        canvas_size - product.height
    ) // 2

    # Slightly lower than absolute center
    # for a product photography look.
    y += int(
        canvas_size * 0.035
    )

    shadow = create_shadow(
        product,
        canvas_size
    )

    shadow_x = x
    shadow_y = min(
        canvas_size - shadow.height,
        y + int(
            canvas_size * 0.025
        )
    )

    background.alpha_composite(
        shadow,
        (
            shadow_x,
            shadow_y
        )
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
# OPENCV ENHANCEMENT
# ============================================================

def enhance_image(image):
    log("Applying OpenCV enhancement...")

    rgb = image.convert("RGB")

    array = np.array(rgb)

    # Mild sharpening.
    blurred = cv2.GaussianBlur(
        array,
        (0, 0),
        1.0
    )

    sharpened = cv2.addWeighted(
        array,
        1.12,
        blurred,
        -0.12,
        0
    )

    # Small contrast improvement.
    lab = cv2.cvtColor(
        sharpened,
        cv2.COLOR_RGB2LAB
    )

    l_channel, a_channel, b_channel = cv2.split(
        lab
    )

    clahe = cv2.createCLAHE(
        clipLimit=1.5,
        tileGridSize=(8, 8)
    )

    l_channel = clahe.apply(
        l_channel
    )

    enhanced_lab = cv2.merge(
        [
            l_channel,
            a_channel,
            b_channel
        ]
    )

    enhanced = cv2.cvtColor(
        enhanced_lab,
        cv2.COLOR_LAB2RGB
    )

    return Image.fromarray(
        enhanced
    )


# ============================================================
# CPU UPSCALE FOR RENDER
# ============================================================

def upscale_cpu(image, target_size):
    log(
        f"Render/Linux CPU upscale to {target_size}x{target_size}..."
    )

    image = image.convert("RGB")

    array = np.array(image)

    upscaled = cv2.resize(
        array,
        (
            target_size,
            target_size
        ),
        interpolation=cv2.INTER_CUBIC
    )

    return Image.fromarray(
        upscaled
    )


# ============================================================
# WINDOWS REAL-ESRGAN
# ============================================================

def upscale_windows(
    image,
    output_path
):
    log("Attempting Windows Real-ESRGAN upscale...")

    if not os.path.exists(
        WINDOWS_UPSCALER
    ):
        log(
            "Real-ESRGAN executable not found."
        )

        return None

    temp_dir = tempfile.mkdtemp(
        prefix="karigar_studio_"
    )

    try:
        input_file = os.path.join(
            temp_dir,
            "input.png"
        )

        output_dir = os.path.join(
            temp_dir,
            "output"
        )

        os.makedirs(
            output_dir,
            exist_ok=True
        )

        image.convert(
            "RGB"
        ).save(
            input_file,
            "PNG"
        )

        command = [
            WINDOWS_UPSCALER,
            "-i",
            input_file,
            "-o",
            output_dir,
            "-n",
            WINDOWS_UPSCALER_MODEL,
            "-s",
            "4"
        ]

        log(
            "Running Real-ESRGAN..."
        )

        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=300
        )

        if result.stdout:
            log(
                result.stdout.strip()
            )

        if result.stderr:
            log(
                result.stderr.strip()
            )

        if result.returncode != 0:
            log(
                f"Real-ESRGAN failed with code {result.returncode}"
            )

            return None

        generated_files = list(
            Path(output_dir).glob("*")
        )

        if not generated_files:
            log(
                "Real-ESRGAN produced no output."
            )

            return None

        generated = generated_files[0]

        result_image = Image.open(
            generated
        ).convert("RGB")

        log(
            f"Real-ESRGAN output: {result_image.size}"
        )

        return result_image

    except subprocess.TimeoutExpired:
        log(
            "Real-ESRGAN timed out."
        )

        return None

    except Exception as e:
        log(
            f"Real-ESRGAN error: {e}"
        )

        traceback.print_exc()

        return None

    finally:
        shutil.rmtree(
            temp_dir,
            ignore_errors=True
        )


# ============================================================
# FINAL OUTPUT
# ============================================================

def save_final(
    image,
    output_path
):
    log(
        f"Saving final image: {output_path}"
    )

    output_parent = os.path.dirname(
        output_path
    )

    if output_parent:
        os.makedirs(
            output_parent,
            exist_ok=True
        )

    image = image.convert(
        "RGB"
    )

    image.save(
        output_path,
        "JPEG",
        quality=95,
        optimize=True
    )

    if not os.path.exists(
        output_path
    ):
        raise RuntimeError(
            "Output image was not created."
        )

    size = os.path.getsize(
        output_path
    )

    if size <= 0:
        raise RuntimeError(
            "Output image is empty."
        )

    log(
        f"Final output saved: {size} bytes"
    )


# ============================================================
# MAIN STUDIO PIPELINE
# ============================================================

def create_studio_photo(
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

    log(
        f"Canvas size: {CANVAS_SIZE}x{CANVAS_SIZE}"
    )

    # --------------------------------------------------------
    # 1/7 LOAD
    # --------------------------------------------------------

    log("1/7 Loading product image...")

    image = load_image(
        input_path
    )

    # --------------------------------------------------------
    # 2/7 BACKGROUND
    # --------------------------------------------------------

    log("2/7 Removing background...")

    product = remove_background(
        image
    )

    # --------------------------------------------------------
    # 3/7 CROP
    # --------------------------------------------------------

    log("3/7 Smart cropping product...")

    product = smart_crop(
        product
    )

    # --------------------------------------------------------
    # 4/7 RESIZE
    # --------------------------------------------------------

    log("4/7 Preparing product...")

    product = resize_product(
        product,
        CANVAS_SIZE
    )

    product = apply_lighting(
        product
    )

    # --------------------------------------------------------
    # 5/7 BACKGROUND + SHADOW
    # --------------------------------------------------------

    log("5/7 Creating studio scene...")

    background = create_studio_background(
        CANVAS_SIZE
    )

    composed = composite_product(
        background,
        product,
        CANVAS_SIZE
    )

    # --------------------------------------------------------
    # 6/7 ENHANCEMENT
    # --------------------------------------------------------

    log("6/7 Enhancing final image...")

    enhanced = enhance_image(
        composed
    )

    # --------------------------------------------------------
    # 7/7 UPSCALE + SAVE
    # --------------------------------------------------------

    log("7/7 Upscaling and saving...")

    final_image = None

    if sys.platform == "win32":
        final_image = upscale_windows(
            enhanced,
            output_path
        )

    if final_image is None:
        final_image = upscale_cpu(
            enhanced,
            CANVAS_SIZE
        )

    save_final(
        final_image,
        output_path
    )

    log("")
    log("========================================")
    log("STUDIO PROCESSING COMPLETE")
    log("========================================")
    log(
        f"Final resolution: {final_image.size}"
    )
    log(
        f"Output: {output_path}"
    )
    log("========================================")

    return output_path


# ============================================================
# CLI
# ============================================================

def main():
    log("")
    log("KarigarConnect Studio Photo Processor")
    log("CLI started")
    log(
        f"Python version: {sys.version}"
    )

    if len(sys.argv) < 3:
        print(
            "Usage: python photo_processor.py <input> <output>",
            flush=True
        )

        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    log(
        f"CLI input: {input_path}"
    )

    log(
        f"CLI output: {output_path}"
    )

    try:
        create_studio_photo(
            input_path,
            output_path
        )

    except Exception as e:
        log("")
        log("========================================")
        log("STUDIO PROCESSING FAILED")
        log("========================================")
        log(
            f"ERROR: {e}"
        )

        traceback.print_exc()

        sys.exit(1)


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()

