import os
import sys
import subprocess

import cv2
import numpy as np
from rembg import remove, new_session


# ============================================================
# CONFIG
# ============================================================

OUTPUT_SIZE = 1080
MODEL_NAME = "u2netp"

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

BACKEND_DIR = os.path.abspath(
    os.path.join(BASE_DIR, "..")
)

LIFESTYLE_DIR = os.path.join(
    BACKEND_DIR,
    "assets",
    "lifestyle"
)

UPSCALE_EXE = os.path.join(
    BACKEND_DIR,
    "tools",
    "realesrgan",
    "realesrgan-ncnn-vulkan.exe"
)


# ============================================================
# CATEGORY
# ============================================================

def normalize_category(category):
    value = (category or "generic").lower().strip()

    if any(
        word in value
        for word in [
            "saree",
            "sari",
            "shawl",
            "scarf",
            "textile",
            "handloom",
            "fabric",
            "dupatta",
        ]
    ):
        return "handloom"

    if any(
        word in value
        for word in [
            "pottery",
            "pot",
            "vase",
            "ceramic",
            "clay",
            "terracotta",
        ]
    ):
        return "pottery"

    if any(
        word in value
        for word in [
            "jewellery",
            "jewelry",
            "necklace",
            "earring",
            "bracelet",
            "ring",
        ]
    ):
        return "jewellery"

    if any(
        word in value
        for word in [
            "bag",
            "purse",
            "handbag",
            "clutch",
            "fashion",
        ]
    ):
        return "fashion"

    if any(
        word in value
        for word in [
            "wood",
            "wooden",
            "carving",
            "woodcraft",
        ]
    ):
        return "woodcraft"

    if any(
        word in value
        for word in [
            "lamp",
            "decor",
            "home",
            "cushion",
            "basket",
            "rug",
            "furniture",
        ]
    ):
        return "home"

    return "generic"


# ============================================================
# SCENE SELECTION
# ============================================================

def get_scene_path(category):
    normalized = normalize_category(category)

    category_dir = os.path.join(
        LIFESTYLE_DIR,
        normalized
    )

    if not os.path.isdir(category_dir):
        category_dir = os.path.join(
            LIFESTYLE_DIR,
            "generic"
        )

    if not os.path.isdir(category_dir):
        raise RuntimeError(
            f"Lifestyle folder not found: {category_dir}"
        )

    valid_extensions = (
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    )

    files = sorted(
        file
        for file in os.listdir(category_dir)
        if file.lower().endswith(valid_extensions)
    )

    if not files:
        raise RuntimeError(
            f"No lifestyle scene found in: {category_dir}"
        )

    return os.path.join(
        category_dir,
        files[0]
    )


# ============================================================
# SCENE FIT
# ============================================================

def resize_cover(image, width, height):
    h, w = image.shape[:2]

    scale = max(
        width / w,
        height / h
    )

    new_w = max(
        1,
        int(w * scale)
    )

    new_h = max(
        1,
        int(h * scale)
    )

    resized = cv2.resize(
        image,
        (new_w, new_h),
        interpolation=cv2.INTER_LANCZOS4
    )

    x = max(
        0,
        (new_w - width) // 2
    )

    y = max(
        0,
        (new_h - height) // 2
    )

    return resized[
        y:y + height,
        x:x + width
    ]


# ============================================================
# PRODUCT DETECTION
# ============================================================

def find_bbox(alpha):
    mask = (alpha > 15).astype(np.uint8) * 255

    contours, _ = cv2.findContours(
        mask,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    if not contours:
        return None

    largest = max(
        contours,
        key=cv2.contourArea
    )

    if cv2.contourArea(largest) < 50:
        return None

    x, y, w, h = cv2.boundingRect(
        largest
    )

    return x, y, x + w, y + h


# ============================================================
# PRODUCT ROTATION
# ============================================================

def rotate_rgba(image, angle):
    h, w = image.shape[:2]

    center = (
        w // 2,
        h // 2
    )

    matrix = cv2.getRotationMatrix2D(
        center,
        angle,
        1.0
    )

    cos = abs(matrix[0, 0])
    sin = abs(matrix[0, 1])

    new_w = int(
        h * sin + w * cos
    )

    new_h = int(
        h * cos + w * sin
    )

    matrix[0, 2] += (
        new_w / 2
        - center[0]
    )

    matrix[1, 2] += (
        new_h / 2
        - center[1]
    )

    rotated = cv2.warpAffine(
        image,
        matrix,
        (new_w, new_h),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=(0, 0, 0, 0),
    )

    return rotated


# ============================================================
# PERSPECTIVE
# ============================================================

def apply_perspective(
    image,
    top_left,
    top_right,
    bottom_right,
    bottom_left,
):
    h, w = image.shape[:2]

    source = np.float32(
        [
            [0, 0],
            [w - 1, 0],
            [w - 1, h - 1],
            [0, h - 1],
        ]
    )

    destination = np.float32(
        [
            top_left,
            top_right,
            bottom_right,
            bottom_left,
        ]
    )

    matrix = cv2.getPerspectiveTransform(
        source,
        destination
    )

    result = cv2.warpPerspective(
        image,
        matrix,
        (OUTPUT_SIZE, OUTPUT_SIZE),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=(0, 0, 0, 0),
    )

    return result


# ============================================================
# COLOR MATCH
# ============================================================

def match_color(
    product,
    scene_region
):
    product_bgr = product.astype(
        np.float32
    )

    scene_bgr = scene_region.astype(
        np.float32
    )

    product_mean = (
        product_bgr.reshape(-1, 3).mean(axis=0)
        + 1.0
    )

    scene_mean = (
        scene_bgr.reshape(-1, 3).mean(axis=0)
        + 1.0
    )

    factor = (
        scene_mean / product_mean
    )

    factor = np.clip(
        factor,
        0.88,
        1.12
    )

    result = (
        product_bgr * factor
    )

    return np.clip(
        result,
        0,
        255
    ).astype(np.uint8)


# ============================================================
# BRIGHTNESS MATCH
# ============================================================

def match_brightness(
    product,
    scene_region
):
    product_gray = cv2.cvtColor(
        product,
        cv2.COLOR_BGR2GRAY
    )

    scene_gray = cv2.cvtColor(
        scene_region,
        cv2.COLOR_BGR2GRAY
    )

    p_mean = float(
        np.mean(product_gray)
    )

    s_mean = float(
        np.mean(scene_gray)
    )

    correction = (
        s_mean / max(p_mean, 1.0)
    )

    correction = np.clip(
        correction,
        0.82,
        1.18
    )

    return cv2.convertScaleAbs(
        product,
        alpha=correction,
        beta=0
    )


# ============================================================
# PRODUCT ENHANCEMENT
# ============================================================

def enhance_product(image):
    enhanced = cv2.detailEnhance(
        image,
        sigma_s=8,
        sigma_r=0.12
    )

    kernel = np.array(
        [
            [0, -1, 0],
            [-1, 5, -1],
            [0, -1, 0],
        ],
        dtype=np.float32
    )

    enhanced = cv2.filter2D(
        enhanced,
        -1,
        kernel
    )

    return enhanced


# ============================================================
# CONTACT SHADOW
# ============================================================

def make_shadow(
    alpha,
    offset_x=12,
    offset_y=16,
    blur=14,
    strength=105,
):
    h, w = alpha.shape

    shadow = np.zeros(
        (h, w),
        dtype=np.uint8
    )

    shifted = np.zeros_like(alpha)

    src_x1 = max(
        0,
        -offset_x
    )

    src_x2 = min(
        w,
        w - offset_x
    )

    dst_x1 = max(
        0,
        offset_x
    )

    dst_x2 = min(
        w,
        w + offset_x
    )

    src_y1 = max(
        0,
        -offset_y
    )

    src_y2 = min(
        h,
        h - offset_y
    )

    dst_y1 = max(
        0,
        offset_y
    )

    dst_y2 = min(
        h,
        h + offset_y
    )

    if (
        src_x2 > src_x1
        and src_y2 > src_y1
        and dst_x2 > dst_x1
        and dst_y2 > dst_y1
    ):
        shifted[
            dst_y1:dst_y2,
            dst_x1:dst_x2
        ] = alpha[
            src_y1:src_y2,
            src_x1:src_x2
        ]

    shadow = (
        shifted.astype(
            np.float32
        )
        * (strength / 255.0)
    ).astype(np.uint8)

    shadow = cv2.GaussianBlur(
        shadow,
        (0, 0),
        blur
    )

    return shadow


# ============================================================
# COMPOSITE
# ============================================================

def alpha_composite(
    background,
    foreground,
    x,
    y,
):
    bg_h, bg_w = background.shape[:2]
    fg_h, fg_w = foreground.shape[:2]

    x1 = max(
        0,
        x
    )

    y1 = max(
        0,
        y
    )

    x2 = min(
        bg_w,
        x + fg_w
    )

    y2 = min(
        bg_h,
        y + fg_h
    )

    if x1 >= x2 or y1 >= y2:
        return background

    fg_x1 = x1 - x
    fg_y1 = y1 - y
    fg_x2 = fg_x1 + (
        x2 - x1
    )
    fg_y2 = fg_y1 + (
        y2 - y1
    )

    fg = foreground[
        fg_y1:fg_y2,
        fg_x1:fg_x2
    ]

    bg = background[
        y1:y2,
        x1:x2
    ]

    alpha = (
        fg[:, :, 3]
        .astype(
            np.float32
        )
        / 255.0
    )

    alpha = alpha[:, :, None]

    fg_bgr = fg[:, :, :3].astype(
        np.float32
    )

    bg_float = bg.astype(
        np.float32
    )

    result = (
        fg_bgr * alpha
        +
        bg_float * (1 - alpha)
    )

    background[
        y1:y2,
        x1:x2
    ] = np.clip(
        result,
        0,
        255
    ).astype(np.uint8)

    return background


# ============================================================
# SCENE-SPECIFIC PLACEMENT
# ============================================================

def get_scene_config(
    category
):
    category = normalize_category(
        category
    )

    configs = {
        "handloom": {
            "max_width": 0.62,
            "max_height": 0.55,
            "center_x": 0.50,
            "center_y": 0.67,
            "rotation": -1.2,
            "perspective": True,
        },

        "pottery": {
            "max_width": 0.38,
            "max_height": 0.45,
            "center_x": 0.50,
            "center_y": 0.72,
            "rotation": 0,
            "perspective": True,
        },

        "jewellery": {
            "max_width": 0.30,
            "max_height": 0.30,
            "center_x": 0.50,
            "center_y": 0.73,
            "rotation": 0,
            "perspective": True,
        },

        "fashion": {
            "max_width": 0.45,
            "max_height": 0.52,
            "center_x": 0.50,
            "center_y": 0.68,
            "rotation": -1.0,
            "perspective": True,
        },

        "woodcraft": {
            "max_width": 0.42,
            "max_height": 0.50,
            "center_x": 0.50,
            "center_y": 0.70,
            "rotation": 0.8,
            "perspective": True,
        },

        "home": {
            "max_width": 0.45,
            "max_height": 0.48,
            "center_x": 0.50,
            "center_y": 0.70,
            "rotation": 0,
            "perspective": True,
        },

        "generic": {
            "max_width": 0.45,
            "max_height": 0.48,
            "center_x": 0.50,
            "center_y": 0.70,
            "rotation": 0,
            "perspective": True,
        },
    }

    return configs.get(
        category,
        configs["generic"]
    )


# ============================================================
# MAIN PROCESS
# ============================================================

def process_lifestyle(
    input_path,
    category,
    output_path,
):
    print(
        "1/9 Removing product background..."
    )

    session = new_session(
        MODEL_NAME
    )

    with open(
        input_path,
        "rb"
    ) as file:
        source = file.read()

    removed = remove(
        source,
        session=session
    )

    encoded = np.frombuffer(
        removed,
        np.uint8
    )

    rgba = cv2.imdecode(
        encoded,
        cv2.IMREAD_UNCHANGED
    )

    if rgba is None:
        raise RuntimeError(
            "Could not decode product image."
        )

    if (
        len(rgba.shape) != 3
        or rgba.shape[2] != 4
    ):
        raise RuntimeError(
            "Background removal did not return RGBA."
        )

    print(
        "2/9 Loading lifestyle scene..."
    )

    scene_path = get_scene_path(
        category
    )

    print(
        f"Using scene: {scene_path}"
    )

    scene = cv2.imread(
        scene_path,
        cv2.IMREAD_COLOR
    )

    if scene is None:
        raise RuntimeError(
            "Could not load lifestyle scene."
        )

    scene = resize_cover(
        scene,
        OUTPUT_SIZE,
        OUTPUT_SIZE
    )

    print(
        "3/9 Detecting product..."
    )

    alpha = rgba[:, :, 3]

    bbox = find_bbox(
        alpha
    )

    if bbox is None:
        raise RuntimeError(
            "Could not detect product."
        )

    x1, y1, x2, y2 = bbox

    pad_x = int(
        (x2 - x1) * 0.025
    )

    pad_y = int(
        (y2 - y1) * 0.025
    )

    x1 = max(
        0,
        x1 - pad_x
    )

    y1 = max(
        0,
        y1 - pad_y
    )

    x2 = min(
        rgba.shape[1],
        x2 + pad_x
    )

    y2 = min(
        rgba.shape[0],
        y2 + pad_y
    )

    product = rgba[
        y1:y2,
        x1:x2
    ].copy()

    config = get_scene_config(
        category
    )

    print(
        "4/9 Fitting product to scene..."
    )

    product_h, product_w = (
        product.shape[:2]
    )

    max_w = int(
        OUTPUT_SIZE
        * config["max_width"]
    )

    max_h = int(
        OUTPUT_SIZE
        * config["max_height"]
    )

    scale = min(
        max_w / max(
            product_w,
            1
        ),
        max_h / max(
            product_h,
            1
        ),
    )

    new_w = max(
        1,
        int(product_w * scale)
    )

    new_h = max(
        1,
        int(product_h * scale)
    )

    product = cv2.resize(
        product,
        (
            new_w,
            new_h
        ),
        interpolation=cv2.INTER_CUBIC
    )

    print(
        "5/9 Applying perspective and rotation..."
    )

    product = rotate_rgba(
        product,
        config["rotation"]
    )

    # Recalculate dimensions after rotation.
    product_h, product_w = (
        product.shape[:2]
    )

    center_x = int(
        OUTPUT_SIZE
        * config["center_x"]
    )

    center_y = int(
        OUTPUT_SIZE
        * config["center_y"]
    )

    pos_x = (
        center_x
        - product_w // 2
    )

    pos_y = (
        center_y
        - product_h // 2
    )

    # Product should sit on the lower portion
    # of the image instead of floating.
    if normalize_category(category) in [
        "handloom",
        "pottery",
        "fashion",
        "woodcraft",
        "home",
    ]:
        pos_y = int(
            center_y
            - product_h * 0.42
        )

    pos_y = max(
        0,
        min(
            pos_y,
            OUTPUT_SIZE - product_h
        )
    )

    pos_x = max(
        0,
        min(
            pos_x,
            OUTPUT_SIZE - product_w
        )
    )

    print(
        "6/9 Matching product lighting and color..."
    )

    scene_region = scene[
        pos_y:min(
            OUTPUT_SIZE,
            pos_y + product_h
        ),
        pos_x:min(
            OUTPUT_SIZE,
            pos_x + product_w
        )
    ]

    if (
        scene_region.shape[0]
        == product_h
        and
        scene_region.shape[1]
        == product_w
    ):
        product_bgr = product[
            :, :, :3
        ]

        matched = match_color(
            product_bgr,
            scene_region
        )

        matched = match_brightness(
            matched,
            scene_region
        )

        product[
            :, :, :3
        ] = matched

    print(
        "7/9 Creating realistic contact shadow..."
    )

    product_alpha = product[
        :, :, 3
    ]

    shadow = make_shadow(
        product_alpha,
        offset_x=14,
        offset_y=18,
        blur=13,
        strength=92
    )

    shadow_rgba = np.zeros_like(
        product
    )

    shadow_rgba[
        :, :, 3
    ] = shadow

    shadow_rgba[
        :, :, 0
    ] = 30

    shadow_rgba[
        :, :, 1
    ] = 27

    shadow_rgba[
        :, :, 2
    ] = 24

    # Put a slightly flattened version under the product.
    shadow_rgba = cv2.resize(
        shadow_rgba,
        (
            product_w,
            product_h
        ),
        interpolation=cv2.INTER_LINEAR
    )

    scene = alpha_composite(
        scene,
        shadow_rgba,
        pos_x + 5,
        pos_y + 7
    )

    print(
        "8/9 Compositing and enhancing..."
    )

    scene = alpha_composite(
        scene,
        product,
        pos_x,
        pos_y
    )

    # Enhance only the final scene gently.
    lab = cv2.cvtColor(
        scene,
        cv2.COLOR_BGR2LAB
    )

    l, a, b = cv2.split(
        lab
    )

    clahe = cv2.createCLAHE(
        clipLimit=1.2,
        tileGridSize=(8, 8)
    )

    l = clahe.apply(l)

    scene = cv2.cvtColor(
        cv2.merge((l, a, b)),
        cv2.COLOR_LAB2BGR
    )

    scene = cv2.convertScaleAbs(
        scene,
        alpha=1.02,
        beta=1
    )

    os.makedirs(
        os.path.dirname(
            output_path
        ),
        exist_ok=True
    )

    base_output = (
        output_path
        + ".base.jpg"
    )

    cv2.imwrite(
        base_output,
        scene,
        [
            cv2.IMWRITE_JPEG_QUALITY,
            96
        ]
    )

    print(
        "9/9 Running Real-ESRGAN 4×..."
    )

    if not os.path.exists(
        UPSCALE_EXE
    ):
        raise RuntimeError(
            "Real-ESRGAN executable not found: "
            + UPSCALE_EXE
        )

    command = [
        UPSCALE_EXE,
        "-i",
        base_output,
        "-o",
        output_path,
        "-s",
        "4",
        "-n",
        "realesrgan-x4plus"
    ]

    result = subprocess.run(
        command,
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        raise RuntimeError(
            result.stderr.strip()
            or result.stdout.strip()
            or "Real-ESRGAN failed."
        )

    if not os.path.exists(
        output_path
    ):
        raise RuntimeError(
            "Lifestyle image was not created."
        )

    if os.path.exists(
        base_output
    ):
        os.remove(
            base_output
        )

    final = cv2.imread(
        output_path
    )

    if final is None:
        raise RuntimeError(
            "Could not read final image."
        )

    h, w = final.shape[:2]

    print(
        f"Final resolution: {w} x {h}"
    )


# ============================================================
# CLI
# ============================================================

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(
            "Usage:"
        )
        print(
            "python lifestyle_processor.py input.jpg category output.jpg"
        )
        sys.exit(1)

    input_path = sys.argv[1]
    category = sys.argv[2]
    output_path = sys.argv[3]

    if not os.path.exists(
        input_path
    ):
        print(
            f"Input file not found: {input_path}"
        )
        sys.exit(1)

    try:
        process_lifestyle(
            input_path,
            category,
            output_path
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
            "ERROR:"
        )
        print(
            str(error)
        )
        sys.exit(1)