
import os
import sys
import subprocess
import platform

import cv2
import numpy as np


# ============================================================
# CONFIG
# ============================================================

OUTPUT_SIZE = 1080
MODEL_NAME = "u2netp"

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

BACKEND_DIR = os.path.abspath(
    os.path.join(
        BASE_DIR,
        ".."
    )
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

IS_WINDOWS = (
    platform.system().lower()
    == "windows"
)

IS_LINUX = (
    platform.system().lower()
    == "linux"
)


# ============================================================
# STARTUP
# ============================================================

print(
    "=============================================="
)

print(
    "LIFESTYLE PHOTO PROCESSOR STARTING"
)

print(
    "=============================================="
)

print(
    "Platform:",
    platform.system()
)

print(
    "Python:",
    sys.version.split()[0]
)

if IS_LINUX:
    print(
        "Linux/Render detected."
    )

    print(
        "Skipping rembg."
    )

    print(
        "Skipping Windows Real-ESRGAN."
    )

    print(
        "Using Render-safe OpenCV pipeline."
    )

else:
    print(
        "Windows detected."
    )

    print(
        "Windows AI processing enabled."
    )


# ============================================================
# REMBG - WINDOWS ONLY
# ============================================================

rembg_session = None


def load_rembg():

    global rembg_session

    if not IS_WINDOWS:
        return None

    if rembg_session is not None:
        return rembg_session

    try:

        print(
            "Loading rembg..."
        )

        from rembg import new_session

        rembg_session = new_session(
            MODEL_NAME
        )

        print(
            "rembg loaded successfully."
        )

        return rembg_session

    except Exception as error:

        print(
            "rembg could not be loaded."
        )

        print(
            "Falling back to OpenCV."
        )

        print(
            "Reason:",
            repr(error)
        )

        rembg_session = None

        return None


# ============================================================
# FAST RENDER BACKGROUND REMOVAL
# ============================================================

def remove_background_opencv(
    image
):

    print(
        "Using FAST Render foreground extraction..."
    )

    if image is None:
        raise RuntimeError(
            "Input image could not be decoded."
        )

    original_height, original_width = (
        image.shape[:2]
    )

    print(
        f"Foreground input size: "
        f"{original_width}x{original_height}"
    )

    # --------------------------------------------------------
    # Work at a smaller resolution.
    # --------------------------------------------------------

    max_dimension = 600

    scale = min(
        1.0,
        max_dimension
        / max(
            original_width,
            original_height
        )
    )

    work_width = max(
        1,
        int(
            original_width
            * scale
        )
    )

    work_height = max(
        1,
        int(
            original_height
            * scale
        )
    )

    working = cv2.resize(
        image,
        (
            work_width,
            work_height
        ),
        interpolation=cv2.INTER_AREA
    )

    print(
        f"Working resolution: "
        f"{work_width}x{work_height}"
    )

    # --------------------------------------------------------
    # Estimate border background color.
    # --------------------------------------------------------

    border = max(
        3,
        int(
            min(
                work_width,
                work_height
            )
            * 0.04
        )
    )

    top = working[
        :border,
        :,
        :3
    ]

    bottom = working[
        -border:,
        :,
        :3
    ]

    left = working[
        :,
        :border,
        :3
    ]

    right = working[
        :,
        -border:,
        :3
    ]

    samples = np.concatenate(
        [
            top.reshape(-1, 3),
            bottom.reshape(-1, 3),
            left.reshape(-1, 3),
            right.reshape(-1, 3)
        ],
        axis=0
    )

    background_color = (
        np.median(
            samples,
            axis=0
        )
        .astype(np.float32)
    )

    print(
        "Estimated background color:",
        background_color.astype(int).tolist()
    )

    # --------------------------------------------------------
    # Color distance.
    # --------------------------------------------------------

    difference = (
        working.astype(np.float32)
        - background_color.reshape(
            1,
            1,
            3
        )
    )

    distance = np.sqrt(
        np.sum(
            difference
            * difference,
            axis=2
        )
    )

    threshold = 55.0

    foreground = np.where(
        distance > threshold,
        255,
        0
    ).astype(np.uint8)

    print(
        f"Foreground threshold: "
        f"{threshold:.2f}"
    )

    # --------------------------------------------------------
    # Remove border-connected background.
    # --------------------------------------------------------

    flood_mask = np.zeros(
        (
            work_height + 2,
            work_width + 2
        ),
        dtype=np.uint8
    )

    background_binary = np.where(
        foreground == 0,
        255,
        0
    ).astype(np.uint8)

    flood_filled = (
        background_binary.copy()
    )

    seeds = [
        (0, 0),
        (
            work_width - 1,
            0
        ),
        (
            0,
            work_height - 1
        ),
        (
            work_width - 1,
            work_height - 1
        )
    ]

    for seed_x, seed_y in seeds:

        if (
            flood_filled[
                seed_y,
                seed_x
            ]
            == 255
        ):

            cv2.floodFill(
                flood_filled,
                flood_mask,
                (
                    seed_x,
                    seed_y
                ),
                128
            )

    border_background = np.where(
        flood_filled == 128,
        0,
        255
    ).astype(np.uint8)

    foreground = cv2.bitwise_and(
        foreground,
        border_background
    )

    # --------------------------------------------------------
    # Clean mask.
    # --------------------------------------------------------

    kernel = np.ones(
        (3, 3),
        np.uint8
    )

    foreground = cv2.morphologyEx(
        foreground,
        cv2.MORPH_OPEN,
        kernel
    )

    foreground = cv2.morphologyEx(
        foreground,
        cv2.MORPH_CLOSE,
        kernel
    )

    foreground = cv2.GaussianBlur(
        foreground,
        (0, 0),
        1.2
    )

    foreground = np.where(
        foreground > 80,
        255,
        0
    ).astype(np.uint8)

    # --------------------------------------------------------
    # Restore original resolution.
    # --------------------------------------------------------

    alpha = cv2.resize(
        foreground,
        (
            original_width,
            original_height
        ),
        interpolation=cv2.INTER_LINEAR
    )

    alpha = cv2.GaussianBlur(
        alpha,
        (0, 0),
        1.0
    )

    # --------------------------------------------------------
    # Create RGBA.
    # --------------------------------------------------------

    bgra = cv2.cvtColor(
        image[:, :, :3],
        cv2.COLOR_BGR2BGRA
    )

    bgra[
        :, :, 3
    ] = alpha

    print(
        "FAST Render foreground extraction complete."
    )

    return bgra


# ============================================================
# BACKGROUND REMOVAL
# ============================================================

def remove_background(
    input_path
):

    print(
        "Removing product background..."
    )

    # --------------------------------------------------------
    # Render / Linux
    # --------------------------------------------------------

    if IS_LINUX:

        image = cv2.imread(
            input_path,
            cv2.IMREAD_COLOR
        )

        if image is None:
            raise RuntimeError(
                "Could not read input image."
            )

        return remove_background_opencv(
            image
        )

    # --------------------------------------------------------
    # Windows rembg
    # --------------------------------------------------------

    session = load_rembg()

    if session is not None:

        print(
            "Using rembg..."
        )

        try:

            from rembg import remove

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

            if (
                rgba is not None
                and len(rgba.shape) == 3
                and rgba.shape[2] == 4
            ):

                print(
                    "rembg background removal complete."
                )

                return rgba

        except Exception as error:

            print(
                "rembg processing failed."
            )

            print(
                "Falling back to OpenCV."
            )

            print(
                "Reason:",
                repr(error)
            )

    # --------------------------------------------------------
    # OpenCV fallback
    # --------------------------------------------------------

    image = cv2.imread(
        input_path,
        cv2.IMREAD_COLOR
    )

    if image is None:
        raise RuntimeError(
            "Could not read input image."
        )

    return remove_background_opencv(
        image
    )


# ============================================================
# CATEGORY
# ============================================================

def normalize_category(
    category
):

    value = (
        category or "generic"
    ).lower().strip()

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
            "dupatta"
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
            "terracotta"
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
            "ring"
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
            "fashion"
        ]
    ):
        return "fashion"

    if any(
        word in value
        for word in [
            "wood",
            "wooden",
            "carving",
            "woodcraft"
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
            "furniture"
        ]
    ):
        return "home"

    return "generic"


# ============================================================
# SCENE SELECTION
# ============================================================

def get_scene_path(
    category
):

    normalized = normalize_category(
        category
    )

    category_dir = os.path.join(
        LIFESTYLE_DIR,
        normalized
    )

    if not os.path.isdir(
        category_dir
    ):

        category_dir = os.path.join(
            LIFESTYLE_DIR,
            "generic"
        )

    if not os.path.isdir(
        category_dir
    ):

        raise RuntimeError(
            f"Lifestyle folder not found: "
            f"{category_dir}"
        )

    valid_extensions = (
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    )

    files = sorted(
        file
        for file in os.listdir(
            category_dir
        )
        if file.lower().endswith(
            valid_extensions
        )
    )

    if not files:

        raise RuntimeError(
            f"No lifestyle scene found in: "
            f"{category_dir}"
        )

    return os.path.join(
        category_dir,
        files[0]
    )


# ============================================================
# SCENE FIT
# ============================================================

def resize_cover(
    image,
    width,
    height
):

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
        (
            new_w,
            new_h
        ),
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

def find_bbox(
    alpha
):

    mask = (
        alpha > 15
    ).astype(
        np.uint8
    ) * 255

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

    if cv2.contourArea(
        largest
    ) < 50:

        return None

    x, y, w, h = (
        cv2.boundingRect(
            largest
        )
    )

    return (
        x,
        y,
        x + w,
        y + h
    )


# ============================================================
# PRODUCT ROTATION
# ============================================================

def rotate_rgba(
    image,
    angle
):

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

    cos = abs(
        matrix[0, 0]
    )

    sin = abs(
        matrix[0, 1]
    )

    new_w = int(
        h * sin
        + w * cos
    )

    new_h = int(
        h * cos
        + w * sin
    )

    matrix[0, 2] += (
        new_w / 2
        - center[0]
    )

    matrix[1, 2] += (
        new_h / 2
        - center[1]
    )

    return cv2.warpAffine(
        image,
        matrix,
        (
            new_w,
            new_h
        ),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=(
            0,
            0,
            0,
            0
        )
    )


# ============================================================
# COLOR MATCH
# ============================================================

def match_color(
    product,
    scene_region
):

    product_bgr = (
        product.astype(
            np.float32
        )
    )

    scene_bgr = (
        scene_region.astype(
            np.float32
        )
    )

    product_mean = (
        product_bgr.reshape(
            -1,
            3
        ).mean(
            axis=0
        )
        + 1.0
    )

    scene_mean = (
        scene_bgr.reshape(
            -1,
            3
        ).mean(
            axis=0
        )
        + 1.0
    )

    factor = (
        scene_mean
        / product_mean
    )

    factor = np.clip(
        factor,
        0.88,
        1.12
    )

    result = (
        product_bgr
        * factor
    )

    return np.clip(
        result,
        0,
        255
    ).astype(
        np.uint8
    )


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

    product_mean = float(
        np.mean(
            product_gray
        )
    )

    scene_mean = float(
        np.mean(
            scene_gray
        )
    )

    correction = (
        scene_mean
        / max(
            product_mean,
            1.0
        )
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

def enhance_product(
    image
):

    enhanced = cv2.detailEnhance(
        image,
        sigma_s=8,
        sigma_r=0.12
    )

    kernel = np.array(
        [
            [0, -1, 0],
            [-1, 5, -1],
            [0, -1, 0]
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
    strength=105
):

    h, w = alpha.shape

    shifted = np.zeros_like(
        alpha
    )

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
        * (
            strength
            / 255.0
        )
    ).astype(
        np.uint8
    )

    return cv2.GaussianBlur(
        shadow,
        (0, 0),
        blur
    )


# ============================================================
# COMPOSITE
# ============================================================

def alpha_composite(
    background,
    foreground,
    x,
    y
):

    bg_h, bg_w = (
        background.shape[:2]
    )

    fg_h, fg_w = (
        foreground.shape[:2]
    )

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

    if (
        x1 >= x2
        or y1 >= y2
    ):

        return background

    fg_x1 = (
        x1 - x
    )

    fg_y1 = (
        y1 - y
    )

    fg_x2 = (
        fg_x1
        + (
            x2 - x1
        )
    )

    fg_y2 = (
        fg_y1
        + (
            y2 - y1
        )
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

    alpha = alpha[
        :, :, None
    ]

    fg_bgr = (
        fg[:, :, :3]
        .astype(
            np.float32
        )
    )

    bg_float = (
        bg.astype(
            np.float32
        )
    )

    result = (
        fg_bgr * alpha
        +
        bg_float
        * (
            1 - alpha
        )
    )

    background[
        y1:y2,
        x1:x2
    ] = np.clip(
        result,
        0,
        255
    ).astype(
        np.uint8
    )

    return background


# ============================================================
# SCENE CONFIG
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
            "rotation": -1.2
        },

        "pottery": {
            "max_width": 0.38,
            "max_height": 0.45,
            "center_x": 0.50,
            "center_y": 0.72,
            "rotation": 0
        },

        "jewellery": {
            "max_width": 0.30,
            "max_height": 0.30,
            "center_x": 0.50,
            "center_y": 0.73,
            "rotation": 0
        },

        "fashion": {
            "max_width": 0.45,
            "max_height": 0.52,
            "center_x": 0.50,
            "center_y": 0.68,
            "rotation": -1.0
        },

        "woodcraft": {
            "max_width": 0.42,
            "max_height": 0.50,
            "center_x": 0.50,
            "center_y": 0.70,
            "rotation": 0.8
        },

        "home": {
            "max_width": 0.45,
            "max_height": 0.48,
            "center_x": 0.50,
            "center_y": 0.70,
            "rotation": 0
        },

        "generic": {
            "max_width": 0.45,
            "max_height": 0.48,
            "center_x": 0.50,
            "center_y": 0.70,
            "rotation": 0
        }
    }

    return configs.get(
        category,
        configs["generic"]
    )


# ============================================================
# UPSCALING
# ============================================================

def upscale_with_realesrgan(
    input_path,
    output_path
):

    # --------------------------------------------------------
    # Render / Linux
    # --------------------------------------------------------

    if IS_LINUX:

        print(
            "Render/Linux detected."
        )

        print(
            "Skipping Windows Real-ESRGAN."
        )

        print(
            "Using OpenCV 2x Lanczos upscaling..."
        )

        image = cv2.imread(
            input_path,
            cv2.IMREAD_COLOR
        )

        if image is None:
            raise RuntimeError(
                "Could not read image for upscaling."
            )

        height, width = (
            image.shape[:2]
        )

        target_width = width * 2
        target_height = height * 2

        upscaled = cv2.resize(
            image,
            (
                target_width,
                target_height
            ),
            interpolation=cv2.INTER_LANCZOS4
        )

        success = cv2.imwrite(
            output_path,
            upscaled,
            [
                cv2.IMWRITE_JPEG_QUALITY,
                96
            ]
        )

        if not success:
            raise RuntimeError(
                "OpenCV upscaling failed."
            )

        print(
            f"Upscaled image: "
            f"{target_width}x{target_height}"
        )

        return

    # --------------------------------------------------------
    # Windows Real-ESRGAN
    # --------------------------------------------------------

    if not os.path.exists(
        UPSCALE_EXE
    ):

        print(
            "Real-ESRGAN executable not found."
        )

        print(
            "Using OpenCV 2x fallback."
        )

        image = cv2.imread(
            input_path,
            cv2.IMREAD_COLOR
        )

        if image is None:
            raise RuntimeError(
                "Could not read image for upscaling."
            )

        height, width = (
            image.shape[:2]
        )

        upscaled = cv2.resize(
            image,
            (
                width * 2,
                height * 2
            ),
            interpolation=cv2.INTER_LANCZOS4
        )

        cv2.imwrite(
            output_path,
            upscaled,
            [
                cv2.IMWRITE_JPEG_QUALITY,
                96
            ]
        )

        return

    print(
        "Running Real-ESRGAN 4x..."
    )

    command = [
        UPSCALE_EXE,
        "-i",
        input_path,
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

    if result.stdout:
        print(
            result.stdout
        )

    if result.stderr:
        print(
            result.stderr
        )

    if (
        result.returncode != 0
    ):

        print(
            "Real-ESRGAN failed."
        )

        print(
            "Using OpenCV fallback."
        )

        image = cv2.imread(
            input_path,
            cv2.IMREAD_COLOR
        )

        if image is None:
            raise RuntimeError(
                "Could not read image for fallback."
            )

        height, width = (
            image.shape[:2]
        )

        upscaled = cv2.resize(
            image,
            (
                width * 2,
                height * 2
            ),
            interpolation=cv2.INTER_LANCZOS4
        )

        cv2.imwrite(
            output_path,
            upscaled,
            [
                cv2.IMWRITE_JPEG_QUALITY,
                96
            ]
        )

        return

    if not os.path.exists(
        output_path
    ):

        raise RuntimeError(
            "Real-ESRGAN output was not created."
        )


# ============================================================
# MAIN PROCESS
# ============================================================

def process_lifestyle(
    input_path,
    category,
    output_path
):

    print(
        "=============================================="
    )

    print(
        "LIFESTYLE PROCESSING"
    )

    print(
        "=============================================="
    )

    print(
        "Category:",
        category
    )

    print(
        "Input:",
        input_path
    )

    print(
        "Output:",
        output_path
    )

    # --------------------------------------------------------
    # 1
    # --------------------------------------------------------

    print(
        "1/9 Removing product background..."
    )

    rgba = remove_background(
        input_path
    )

    # --------------------------------------------------------
    # 2
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # 3
    # --------------------------------------------------------

    print(
        "3/9 Detecting product..."
    )

    alpha = rgba[
        :, :, 3
    ]

    bbox = find_bbox(
        alpha
    )

    if bbox is None:

        raise RuntimeError(
            "Could not detect product."
        )

    x1, y1, x2, y2 = bbox

    pad_x = int(
        (x2 - x1)
        * 0.025
    )

    pad_y = int(
        (y2 - y1)
        * 0.025
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

    # --------------------------------------------------------
    # 4
    # --------------------------------------------------------

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
        )
    )

    new_w = max(
        1,
        int(
            product_w
            * scale
        )
    )

    new_h = max(
        1,
        int(
            product_h
            * scale
        )
    )

    product = cv2.resize(
        product,
        (
            new_w,
            new_h
        ),
        interpolation=cv2.INTER_CUBIC
    )

    # --------------------------------------------------------
    # 5
    # --------------------------------------------------------

    print(
        "5/9 Applying rotation..."
    )

    product = rotate_rgba(
        product,
        config["rotation"]
    )

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

    if normalize_category(
        category
    ) in [
        "handloom",
        "pottery",
        "fashion",
        "woodcraft",
        "home"
    ]:

        pos_y = int(
            center_y
            - product_h * 0.42
        )

    pos_y = max(
        0,
        min(
            pos_y,
            OUTPUT_SIZE
            - product_h
        )
    )

    pos_x = max(
        0,
        min(
            pos_x,
            OUTPUT_SIZE
            - product_w
        )
    )

    # --------------------------------------------------------
    # 6
    # --------------------------------------------------------

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

        product_bgr = (
            product[
                :, :, :3
            ]
        )

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

    # --------------------------------------------------------
    # 7
    # --------------------------------------------------------

    print(
        "7/9 Creating realistic contact shadow..."
    )

    product_alpha = (
        product[
            :, :, 3
        ]
    )

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

    scene = alpha_composite(
        scene,
        shadow_rgba,
        pos_x + 5,
        pos_y + 7
    )

    # --------------------------------------------------------
    # 8
    # --------------------------------------------------------

    print(
        "8/9 Compositing and enhancing..."
    )

    scene = alpha_composite(
        scene,
        product,
        pos_x,
        pos_y
    )

    # --------------------------------------------------------
    # Gentle final enhancement.
    # --------------------------------------------------------

    lab = cv2.cvtColor(
        scene,
        cv2.COLOR_BGR2LAB
    )

    l, a, b = cv2.split(
        lab
    )

    clahe = cv2.createCLAHE(
        clipLimit=1.2,
        tileGridSize=(
            8,
            8
        )
    )

    l = clahe.apply(
        l
    )

    scene = cv2.cvtColor(
        cv2.merge(
            (
                l,
                a,
                b
            )
        ),
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

    success = cv2.imwrite(
        base_output,
        scene,
        [
            cv2.IMWRITE_JPEG_QUALITY,
            96
        ]
    )

    if not success:

        raise RuntimeError(
            "Could not create lifestyle base image."
        )

    # --------------------------------------------------------
    # 9
    # --------------------------------------------------------

    print(
        "9/9 Upscaling final image..."
    )

    upscale_with_realesrgan(
        base_output,
        output_path
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

        try:
            os.remove(
                base_output
            )

        except OSError:
            pass

    final = cv2.imread(
        output_path,
        cv2.IMREAD_COLOR
    )

    if final is None:

        raise RuntimeError(
            "Could not read final lifestyle image."
        )

    height, width = (
        final.shape[:2]
    )

    file_size = os.path.getsize(
        output_path
    )

    print(
        "=============================================="
    )

    print(
        "LIFESTYLE PROCESSING COMPLETE"
    )

    print(
        f"Final resolution: "
        f"{width} x {height}"
    )

    print(
        f"Output size: "
        f"{file_size} bytes"
    )

    print(
        "=============================================="
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
            "python lifestyle_processor.py "
            "input.jpg category output.jpg"
        )

        sys.exit(1)

    input_path = sys.argv[1]

    category = sys.argv[2]

    output_path = sys.argv[3]

    if not os.path.exists(
        input_path
    ):

        print(
            f"Input file not found: "
            f"{input_path}"
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
            f"Final image: "
            f"{output_path}"
        )

        print(
            "================================="
        )

    except Exception as error:

        print(
            "ERROR:"
        )

        print(
            repr(error)
        )

        sys.exit(1)