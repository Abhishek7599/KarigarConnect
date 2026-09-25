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

rembg_session = new_session(REMBG_MODEL)


# =========================================================
# BACKGROUND REMOVAL
# =========================================================

def remove_background(input_path):
    with open(input_path, "rb") as input_file:
        input_data = input_file.read()

    output_data = remove(
        input_data,
        session=rembg_session,
    )

    image_array = np.frombuffer(
        output_data,
        dtype=np.uint8,
    )

    image = cv2.imdecode(
        image_array,
        cv2.IMREAD_UNCHANGED,
    )

    if image is None:
        raise Exception(
            "Could not decode background-removed image."
        )

    if len(image.shape) != 3 or image.shape[2] != 4:
        raise Exception(
            "Background removal did not return transparency."
        )

    return image


# =========================================================
# CATEGORY DETECTION
# =========================================================

def normalize_category(category):
    value = (category or "").strip().lower()

    if any(word in value for word in [
        "saree",
        "sari",
        "shawl",
        "scarf",
        "textile",
        "handloom",
        "fabric",
        "dupatta",
    ]):
        return "textile"

    if any(word in value for word in [
        "pottery",
        "pot",
        "vase",
        "ceramic",
        "clay",
        "terracotta",
    ]):
        return "pottery"

    if any(word in value for word in [
        "jewellery",
        "jewelry",
        "necklace",
        "earring",
        "bracelet",
        "ring",
    ]):
        return "jewellery"

    if any(word in value for word in [
        "bag",
        "purse",
        "handbag",
        "clutch",
        "fashion",
    ]):
        return "fashion"

    if any(word in value for word in [
        "wood",
        "wooden",
        "carving",
        "woodcraft",
    ]):
        return "woodcraft"

    if any(word in value for word in [
        "lamp",
        "decor",
        "home",
        "cushion",
        "basket",
        "rug",
        "furniture",
    ]):
        return "home"

    return "generic"


# =========================================================
# PRODUCT CROP
# =========================================================

def get_product_crop(image):
    alpha = image[:, :, 3]

    mask = np.where(
        alpha > 25,
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

    # Tighter than Studio.
    padding = int(
        max(width, height) * 0.035
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
# PROCEDURAL BACKGROUNDS
# =========================================================

def create_gradient_background(
    size,
    top_color,
    bottom_color,
):
    y = np.linspace(
        0,
        1,
        size,
        dtype=np.float32,
    ).reshape(-1, 1, 1)

    top = np.array(
        top_color,
        dtype=np.float32,
    ).reshape(1, 1, 3)

    bottom = np.array(
        bottom_color,
        dtype=np.float32,
    ).reshape(1, 1, 3)

    gradient = (
        top * (1 - y)
        + bottom * y
    )

    gradient = np.repeat(
        gradient,
        size,
        axis=1,
    )

    return np.clip(
        gradient,
        0,
        255,
    ).astype(np.uint8)


def add_radial_light(
    image,
    center_x,
    center_y,
    strength=25,
    spread=2.5,
):
    height, width = image.shape[:2]

    x = np.linspace(
        -1,
        1,
        width,
        dtype=np.float32,
    )

    y = np.linspace(
        -1,
        1,
        height,
        dtype=np.float32,
    )

    xx, yy = np.meshgrid(
        x,
        y,
    )

    cx = (
        center_x / width * 2
        - 1
    )

    cy = (
        center_y / height * 2
        - 1
    )

    distance = (
        (xx - cx) ** 2
        + (yy - cy) ** 2
    )

    light = np.exp(
        -distance * spread
    )

    result = (
        image.astype(np.float32)
        + light[:, :, None] * strength
    )

    return np.clip(
        result,
        0,
        255,
    ).astype(np.uint8)


def add_vignette(image, strength=0.08):
    height, width = image.shape[:2]

    x = np.linspace(
        -1,
        1,
        width,
        dtype=np.float32,
    )

    y = np.linspace(
        -1,
        1,
        height,
        dtype=np.float32,
    )

    xx, yy = np.meshgrid(
        x,
        y,
    )

    distance = np.sqrt(
        xx ** 2 + yy ** 2
    )

    factor = 1 - (
        np.clip(distance, 0, 1)
        * strength
    )

    result = (
        image.astype(np.float32)
        * factor[:, :, None]
    )

    return np.clip(
        result,
        0,
        255,
    ).astype(np.uint8)


def create_textile_background(size):
    background = create_gradient_background(
        size,
        (248, 241, 227),
        (218, 203, 181),
    )

    # Subtle textile texture.
    texture = np.zeros(
        (size, size),
        dtype=np.float32,
    )

    for row in range(
        0,
        size,
        8,
    ):
        texture[row:row + 1, :] = 1.0

    texture = cv2.GaussianBlur(
        texture,
        (0, 0),
        2,
    )

    background = np.clip(
        background.astype(np.float32)
        - texture[:, :, None] * 4,
        0,
        255,
    ).astype(np.uint8)

    background = add_radial_light(
        background,
        int(size * 0.38),
        int(size * 0.27),
        25,
        2.3,
    )

    return background


def create_pottery_background(size):
    background = create_gradient_background(
        size,
        (239, 232, 220),
        (171, 145, 119),
    )

    background = add_radial_light(
        background,
        int(size * 0.35),
        int(size * 0.27),
        20,
        2.3,
    )

    return background


def create_jewellery_background(size):
    background = create_gradient_background(
        size,
        (248, 247, 244),
        (207, 202, 194),
    )

    background = add_radial_light(
        background,
        int(size * 0.42),
        int(size * 0.28),
        34,
        2.8,
    )

    return background


def create_fashion_background(size):
    background = create_gradient_background(
        size,
        (238, 241, 238),
        (188, 196, 190),
    )

    background = add_radial_light(
        background,
        int(size * 0.50),
        int(size * 0.25),
        28,
        2.4,
    )

    return background


def create_woodcraft_background(size):
    background = create_gradient_background(
        size,
        (235, 219, 197),
        (147, 112, 81),
    )

    # Simple wood grain.
    grain = np.zeros(
        (size, size),
        dtype=np.float32,
    )

    for row in range(
        15,
        size,
        32,
    ):
        grain[row:row + 2, :] = 1.0

    grain = cv2.GaussianBlur(
        grain,
        (0, 0),
        4,
    )

    background = np.clip(
        background.astype(np.float32)
        - grain[:, :, None] * 10,
        0,
        255,
    ).astype(np.uint8)

    return background


def create_home_background(size):
    background = create_gradient_background(
        size,
        (246, 244, 239),
        (214, 219, 211),
    )

    background = add_radial_light(
        background,
        int(size * 0.60),
        int(size * 0.25),
        28,
        2.3,
    )

    return background


def create_generic_background(size):
    background = create_gradient_background(
        size,
        (250, 250, 248),
        (224, 228, 223),
    )

    background = add_radial_light(
        background,
        int(size * 0.40),
        int(size * 0.25),
        25,
        2.5,
    )

    return background


def create_category_background(
    category,
    size,
):
    category = normalize_category(
        category
    )

    if category == "textile":
        return create_textile_background(size)

    if category == "pottery":
        return create_pottery_background(size)

    if category == "jewellery":
        return create_jewellery_background(size)

    if category == "fashion":
        return create_fashion_background(size)

    if category == "woodcraft":
        return create_woodcraft_background(size)

    if category == "home":
        return create_home_background(size)

    return create_generic_background(size)


# =========================================================
# PRODUCT LIGHTING
# =========================================================

def apply_product_lighting(product):
    rgb = product[:, :, :3].astype(
        np.float32
    )

    alpha = (
        product[:, :, 3].astype(
            np.float32
        )
        / 255.0
    )

    height, width = alpha.shape

    x = np.linspace(
        -1,
        1,
        width,
        dtype=np.float32,
    )

    y = np.linspace(
        -1,
        1,
        height,
        dtype=np.float32,
    )

    xx, yy = np.meshgrid(
        x,
        y,
    )

    distance = (
        (xx + 0.30) ** 2
        + (yy + 0.42) ** 2
    )

    light = np.exp(
        -distance * 2.7
    )

    rgb *= (
        1.0
        + light[:, :, None] * 0.10
    )

    # Tiny warm highlight.
    rgb[:, :, 2] += (
        light * 1.4
    )

    product[:, :, :3] = np.clip(
        rgb,
        0,
        255,
    ).astype(np.uint8)

    return product


# =========================================================
# RESIZE
# =========================================================

def resize_product(
    product,
    canvas_size,
):
    height = product.shape[0]
    width = product.shape[1]

    # Larger than Studio so it feels like a close-up.
    max_dimension = int(
        canvas_size * 0.90
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
# DETAIL ENHANCEMENT
# =========================================================

def enhance_product_details(product):
    rgb = product[:, :, :3]
    alpha = product[:, :, 3]

    # Local detail enhancement.
    enhanced = cv2.detailEnhance(
        rgb,
        sigma_s=10,
        sigma_r=0.15,
    )

    # Gentle sharpening.
    blurred = cv2.GaussianBlur(
        enhanced,
        (0, 0),
        0.8,
    )

    sharpened = cv2.addWeighted(
        enhanced,
        1.13,
        blurred,
        -0.13,
        0,
    )

    product[:, :, :3] = sharpened

    return product


# =========================================================
# CONTACT SHADOW
# =========================================================

def create_contact_shadow(
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

    coords = cv2.findNonZero(
        mask
    )

    shadow = np.zeros(
        (canvas_size, canvas_size),
        dtype=np.uint8,
    )

    if coords is None:
        return shadow

    x, y, width, height = cv2.boundingRect(
        coords
    )

    absolute_x = offset_x + x
    absolute_y = offset_y + y

    center_x = (
        absolute_x
        + width // 2
    )

    center_y = (
        absolute_y
        + height
        - max(
            4,
            int(height * 0.02),
        )
    )

    ellipse_width = max(
        25,
        int(width * 0.34),
    )

    ellipse_height = max(
        8,
        int(height * 0.025),
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

    return cv2.GaussianBlur(
        shadow,
        (0, 0),
        sigmaX=14,
    )


def blend_shadow(
    background,
    shadow,
):
    shadow_float = (
        shadow.astype(np.float32)
        / 255.0
    )

    opacity = (
        shadow_float[:, :, None]
        * 0.20
    )

    result = (
        background.astype(np.float32)
        * (1 - opacity)
    )

    return np.clip(
        result,
        0,
        255,
    ).astype(np.uint8)


# =========================================================
# COMPOSITE
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

    # Close-up sits slightly lower.
    offset_y += int(
        canvas_size * 0.02
    )

    offset_y = max(
        0,
        min(
            offset_y,
            canvas_size
            - product_height,
        ),
    )

    shadow = create_contact_shadow(
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
# REAL-ESRGAN
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

    result = subprocess.run(
        command,
        capture_output=True,
        text=True,
        check=False,
    )

    if result.stdout:
        print(result.stdout)

    if result.stderr:
        print(result.stderr)

    if result.returncode != 0:
        raise Exception(
            "Real-ESRGAN upscaling failed."
        )

    if not os.path.exists(
        output_path
    ):
        raise Exception(
            "Real-ESRGAN output was not created."
        )


# =========================================================
# COMPLETE PIPELINE
# =========================================================

def create_closeup(
    input_path,
    category,
    output_path,
):
    working_dir = os.path.dirname(
        output_path
    )

    os.makedirs(
        working_dir,
        exist_ok=True,
    )

    temp_opencv = os.path.join(
        working_dir,
        "_temp_closeup.jpg",
    )

    temp_upscaled = os.path.join(
        working_dir,
        "_temp_closeup_upscaled.png",
    )

    try:
        print(
            "1/8 Removing background..."
        )

        image = remove_background(
            input_path
        )

        print(
            "2/8 Detecting product..."
        )

        product = get_product_crop(
            image
        )

        canvas_size = 1080

        print(
            f"3/8 Creating {normalize_category(category)} background..."
        )

        background = create_category_background(
            category,
            canvas_size,
        )

        print(
            "4/8 Creating close-up composition..."
        )

        product = resize_product(
            product,
            canvas_size,
        )

        print(
            "5/8 Enhancing product details..."
        )

        product = enhance_product_details(
            product
        )

        print(
            "6/8 Matching professional lighting..."
        )

        product = apply_product_lighting(
            product
        )

        print(
            "7/8 Adding shadow and finishing..."
        )

        final_image = composite_product(
            background,
            product,
        )

        final_image = cv2.convertScaleAbs(
            final_image,
            alpha=1.025,
            beta=2,
        )

        final_image = add_vignette(
            final_image,
            strength=0.06,
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
                "Could not create Close-up preview."
            )

        print(
            "8/8 Upscaling Close-up 4x..."
        )

        upscale_with_realesrgan(
            temp_opencv,
            temp_upscaled,
        )

        final_upscaled = cv2.imread(
            temp_upscaled,
            cv2.IMREAD_COLOR,
        )

        if final_upscaled is None:
            raise Exception(
                "Could not read upscaled image."
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
                "Could not save final Close-up image."
            )

        height, width = final_upscaled.shape[:2]

        print(
            f"Final resolution: {width} x {height}"
        )

    finally:
        for temp_file in [
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
# CLI
# =========================================================

def main():
    if len(sys.argv) != 4:
        print(
            "Usage:"
        )

        print(
            "python closeup_processor.py "
            "product.jpg category output.jpg"
        )

        sys.exit(1)

    input_path = sys.argv[1]
    category = sys.argv[2]
    output_path = sys.argv[3]

    if not os.path.exists(
        input_path
    ):
        print("ERROR")

        print(
            f"Product image not found: {input_path}"
        )

        sys.exit(1)

    try:
        create_closeup(
            input_path,
            category,
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
        print("ERROR")
        print(str(error))
        sys.exit(1)


if __name__ == "__main__":
    main()