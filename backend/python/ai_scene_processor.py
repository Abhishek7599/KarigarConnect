
import os
import sys
import random
import gc
import platform

from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw


# ============================================================
# CONFIG
# ============================================================

MODEL_ID = "stable-diffusion-v1-5/stable-diffusion-v1-5"

WIDTH = 768
HEIGHT = 768

STEPS = int(os.getenv("SCENE_STEPS", "20"))
GUIDANCE = float(os.getenv("SCENE_GUIDANCE", "7.0"))
STRENGTH = float(os.getenv("SCENE_STRENGTH", "0.38"))


# ============================================================
# PLATFORM
# ============================================================

IS_WINDOWS = platform.system().lower() == "windows"
IS_LINUX = platform.system().lower() == "linux"


# ============================================================
# CATEGORY
# ============================================================

def clean_category(category):
    return (category or "generic").strip().lower()


# ============================================================
# PROMPTS
# ============================================================

def build_prompt(mode, category):
    category = clean_category(category)

    lifestyle_prompts = {
        "handloom": (
            "premium Indian artisan handloom product displayed naturally "
            "in a beautiful luxury Indian home interior, warm daylight, "
            "wooden furniture, tasteful decor, realistic commercial "
            "ecommerce photography, natural shadows, photorealistic"
        ),

        "pottery": (
            "beautiful handmade pottery product displayed on a premium "
            "modern Indian home shelf, warm natural sunlight, realistic "
            "living room environment, tasteful decor, commercial product "
            "photography, photorealistic"
        ),

        "jewellery": (
            "luxury Indian jewellery product presented elegantly in a "
            "premium dressing table environment, soft warm lighting, "
            "marble and gold accents, realistic commercial jewellery "
            "photography, photorealistic"
        ),

        "fashion": (
            "premium Indian fashion product naturally presented in a "
            "modern stylish apartment, soft daylight, elegant interior, "
            "fashion ecommerce campaign, realistic commercial photography, "
            "photorealistic"
        ),

        "woodcraft": (
            "beautiful handmade wooden craft product displayed naturally "
            "inside a premium modern Indian living room, warm daylight, "
            "wood textures, realistic commercial product photography, "
            "photorealistic"
        ),

        "home decor": (
            "handmade home decor product styled naturally inside a premium "
            "modern Indian home, warm sunlight, elegant interior design, "
            "professional ecommerce lifestyle photography, photorealistic"
        ),
    }

    model_prompts = {
        "handloom": (
            "professional adult Indian fashion model presenting an artisan "
            "handloom product naturally, elegant Indian styling, premium "
            "commercial fashion campaign, realistic body proportions, "
            "studio-quality lighting, photorealistic"
        ),

        "jewellery": (
            "professional adult Indian female fashion model wearing and "
            "presenting an artisan jewellery product, elegant Indian styling, "
            "luxury jewellery campaign, realistic skin, natural pose, "
            "professional commercial photography, photorealistic"
        ),

        "fashion": (
            "professional adult Indian fashion model wearing and presenting "
            "the uploaded fashion product, modern elegant styling, realistic "
            "body proportions, premium fashion campaign, commercial "
            "photography, photorealistic"
        ),

        "pottery": (
            "professional adult Indian artisan model naturally holding and "
            "presenting the handmade pottery product, elegant home setting, "
            "commercial lifestyle campaign, realistic photography, "
            "photorealistic"
        ),

        "woodcraft": (
            "professional adult Indian model naturally presenting a handmade "
            "woodcraft product inside a premium home, elegant pose, "
            "commercial lifestyle photography, photorealistic"
        ),

        "home decor": (
            "professional adult Indian lifestyle model presenting a handmade "
            "home decor product inside a beautiful modern home, natural pose, "
            "commercial lifestyle campaign, photorealistic"
        ),
    }

    if mode == "lifestyle":
        return lifestyle_prompts.get(
            category,
            (
                "premium handmade artisan product naturally styled inside "
                "a beautiful modern Indian home, warm daylight, elegant "
                "interior, professional ecommerce lifestyle photography, "
                "photorealistic"
            ),
        )

    return model_prompts.get(
        category,
        (
            "professional adult Indian model naturally presenting the "
            "uploaded handmade artisan product, elegant modern styling, "
            "premium commercial campaign, realistic photography, "
            "photorealistic"
        ),
    )


def build_negative_prompt():
    return (
        "blurry, low quality, low resolution, cartoon, illustration, "
        "painting, distorted product, deformed object, duplicate product, "
        "extra objects, floating object, warped object, malformed hands, "
        "extra fingers, missing fingers, bad anatomy, text, watermark, "
        "logo, cropped product, oversaturated, unrealistic shadows"
    )


# ============================================================
# IMAGE PREPARATION
# ============================================================

def prepare_image(input_path):
    print("Preparing input image...", flush=True)

    image = Image.open(input_path).convert("RGB")

    image.thumbnail(
        (640, 640),
        Image.Resampling.LANCZOS,
    )

    canvas = Image.new(
        "RGB",
        (WIDTH, HEIGHT),
        (235, 235, 235),
    )

    x = (WIDTH - image.width) // 2
    y = (HEIGHT - image.height) // 2

    canvas.paste(image, (x, y))

    return canvas


# ============================================================
# LIGHTWEIGHT RENDER BACKGROUND
# ============================================================

def create_lifestyle_background(category):
    """
    Creates a lightweight premium lifestyle background.

    This is intentionally used on Render/Linux instead of
    running Stable Diffusion on CPU.
    """

    category = clean_category(category)

    print(
        "Creating lightweight Render lifestyle background...",
        flush=True,
    )

    background = Image.new(
        "RGB",
        (WIDTH, HEIGHT),
        (238, 234, 226),
    )

    draw = ImageDraw.Draw(background)

    # Soft vertical gradient
    for y in range(HEIGHT):
        ratio = y / HEIGHT

        r = int(246 - (ratio * 20))
        g = int(242 - (ratio * 18))
        b = int(235 - (ratio * 12))

        draw.line(
            [(0, y), (WIDTH, y)],
            fill=(r, g, b),
        )

    # Floor area
    floor_y = int(HEIGHT * 0.72)

    draw.rectangle(
        [
            (0, floor_y),
            (WIDTH, HEIGHT),
        ],
        fill=(218, 207, 191),
    )

    # Back wall panel
    draw.rounded_rectangle(
        [
            (55, 65),
            (WIDTH - 55, floor_y - 35),
        ],
        radius=30,
        fill=(244, 240, 231),
        outline=(225, 216, 202),
        width=3,
    )

    # Shelf / tabletop
    table_y = int(HEIGHT * 0.67)

    draw.rounded_rectangle(
        [
            (90, table_y),
            (WIDTH - 90, table_y + 35),
        ],
        radius=10,
        fill=(157, 126, 91),
    )

    # Table legs
    draw.rectangle(
        [
            (120, table_y + 30),
            (145, HEIGHT - 40),
        ],
        fill=(128, 101, 73),
    )

    draw.rectangle(
        [
            (WIDTH - 145, table_y + 30),
            (WIDTH - 120, HEIGHT - 40),
        ],
        fill=(128, 101, 73),
    )

    # Decorative plant
    plant_x = 115
    plant_y = 180

    draw.rectangle(
        [
            (plant_x - 15, plant_y + 80),
            (plant_x + 15, plant_y + 145),
        ],
        fill=(164, 125, 82),
    )

    leaves = [
        (plant_x - 45, plant_y + 55, plant_x - 5, plant_y + 105),
        (plant_x + 5, plant_y + 35, plant_x + 45, plant_y + 90),
        (plant_x - 35, plant_y + 5, plant_x + 5, plant_y + 65),
        (plant_x + 10, plant_y - 5, plant_x + 50, plant_y + 55),
    ]

    for box in leaves:
        draw.ellipse(
            box,
            fill=(96, 128, 88),
        )

    # Decorative wall frame
    frame_x1 = WIDTH - 245
    frame_y1 = 110
    frame_x2 = WIDTH - 100
    frame_y2 = 270

    draw.rectangle(
        [
            (frame_x1, frame_y1),
            (frame_x2, frame_y2),
        ],
        fill=(183, 151, 112),
    )

    draw.rectangle(
        [
            (frame_x1 + 12, frame_y1 + 12),
            (frame_x2 - 12, frame_y2 - 12),
        ],
        fill=(238, 225, 205),
    )

    # Soft blur for more photographic appearance
    background = background.filter(
        ImageFilter.GaussianBlur(radius=1.2)
    )

    return background


# ============================================================
# PRODUCT EXTRACTION / SIMPLE MASK
# ============================================================

def estimate_background_color(image):
    """
    Estimates the average border color.
    """

    small = image.resize((64, 64))

    pixels = []

    for x in range(64):
        pixels.append(small.getpixel((x, 0)))
        pixels.append(small.getpixel((x, 63)))

    for y in range(64):
        pixels.append(small.getpixel((0, y)))
        pixels.append(small.getpixel((63, y)))

    count = len(pixels)

    r = sum(p[0] for p in pixels) // count
    g = sum(p[1] for p in pixels) // count
    b = sum(p[2] for p in pixels) // count

    return (r, g, b)


def create_product_mask(image):
    """
    Lightweight foreground estimation.

    This does NOT use GrabCut and does NOT use rembg on Render.
    """

    print(
        "Creating lightweight product mask...",
        flush=True,
    )

    rgb = image.convert("RGB")

    bg_r, bg_g, bg_b = estimate_background_color(rgb)

    print(
        f"Estimated background: ({bg_r}, {bg_g}, {bg_b})",
        flush=True,
    )

    # Work at reduced resolution for speed
    max_side = 450

    work = rgb.copy()

    scale = min(
        1.0,
        max_side / max(work.width, work.height),
    )

    if scale < 1.0:
        work = work.resize(
            (
                max(1, int(work.width * scale)),
                max(1, int(work.height * scale)),
            ),
            Image.Resampling.BILINEAR,
        )

    pixels = work.load()

    mask = Image.new(
        "L",
        work.size,
        0,
    )

    mask_pixels = mask.load()

    threshold = 48

    for y in range(work.height):
        for x in range(work.width):
            r, g, b = pixels[x, y]

            distance = (
                abs(r - bg_r)
                + abs(g - bg_g)
                + abs(b - bg_b)
            )

            if distance > threshold:
                mask_pixels[x, y] = 255
            else:
                mask_pixels[x, y] = 0

    # Remove tiny isolated areas
    mask = mask.filter(
        ImageFilter.MedianFilter(size=5)
    )

    mask = mask.filter(
        ImageFilter.GaussianBlur(radius=1.5)
    )

    # Resize mask back to original size
    mask = mask.resize(
        rgb.size,
        Image.Resampling.BILINEAR,
    )

    print(
        "Product mask created.",
        flush=True,
    )

    return mask


# ============================================================
# PRODUCT COMPOSITION
# ============================================================

def create_lifestyle_composite(input_path, category):
    print(
        "Creating Render lifestyle composition...",
        flush=True,
    )

    product = Image.open(input_path).convert("RGB")

    print(
        f"Original product size: {product.size}",
        flush=True,
    )

    # Product mask
    mask = create_product_mask(product)

    # Crop around product
    bbox = mask.getbbox()

    if bbox:
        left, top, right, bottom = bbox

        padding = 25

        left = max(0, left - padding)
        top = max(0, top - padding)
        right = min(product.width, right + padding)
        bottom = min(product.height, bottom + padding)

        product = product.crop(
            (left, top, right, bottom)
        )

        mask = mask.crop(
            (left, top, right, bottom)
        )

        print(
            f"Product crop: {product.size}",
            flush=True,
        )

    # Resize product
    max_product_size = 560

    scale = min(
        max_product_size / product.width,
        max_product_size / product.height,
        1.0,
    )

    new_size = (
        max(1, int(product.width * scale)),
        max(1, int(product.height * scale)),
    )

    product = product.resize(
        new_size,
        Image.Resampling.LANCZOS,
    )

    mask = mask.resize(
        new_size,
        Image.Resampling.LANCZOS,
    )

    # Background
    background = create_lifestyle_background(
        category
    )

    # Product position
    x = (WIDTH - product.width) // 2

    table_y = int(HEIGHT * 0.67)

    y = table_y - product.height + 20

    # Keep product inside canvas
    y = max(
        40,
        min(
            y,
            HEIGHT - product.height - 20,
        ),
    )

    # Shadow
    shadow = Image.new(
        "RGBA",
        (product.width + 100, 100),
        (0, 0, 0, 0),
    )

    shadow_draw = ImageDraw.Draw(shadow)

    shadow_draw.ellipse(
        [
            (10, 35),
            (shadow.width - 10, 85),
        ],
        fill=(0, 0, 0, 90),
    )

    shadow = shadow.filter(
        ImageFilter.GaussianBlur(radius=18)
    )

    shadow_x = (
        x
        + product.width // 2
        - shadow.width // 2
    )

    shadow_y = min(
        HEIGHT - 90,
        y + product.height - 15,
    )

    background_rgba = background.convert("RGBA")

    background_rgba.alpha_composite(
        shadow,
        (
            shadow_x,
            shadow_y,
        ),
    )

    # Product
    product_rgba = product.convert("RGBA")

    product_rgba.putalpha(mask)

    background_rgba.alpha_composite(
        product_rgba,
        (x, y),
    )

    result = background_rgba.convert("RGB")

    return result


# ============================================================
# IMAGE ENHANCEMENT
# ============================================================

def enhance_image(image):
    print(
        "Applying final image enhancement...",
        flush=True,
    )

    image = ImageEnhance.Color(
        image
    ).enhance(1.04)

    image = ImageEnhance.Contrast(
        image
    ).enhance(1.03)

    image = ImageEnhance.Brightness(
        image
    ).enhance(1.02)

    image = image.filter(
        ImageFilter.UnsharpMask(
            radius=1.1,
            percent=110,
            threshold=3,
        )
    )

    return image


# ============================================================
# STABLE DIFFUSION — LOCAL GPU ONLY
# ============================================================

def load_pipeline(use_cuda):

    if not use_cuda:
        raise RuntimeError(
            "Stable Diffusion is disabled on Render CPU."
        )

    import torch
    from diffusers import StableDiffusionPipeline

    print(
        "Loading Stable Diffusion for local GPU...",
        flush=True,
    )

    pipe = StableDiffusionPipeline.from_pretrained(
        MODEL_ID,
        torch_dtype=torch.float16,
        use_safetensors=True,
    )

    pipe.load_ip_adapter(
        "h94/IP-Adapter",
        subfolder="models",
        weight_name="ip-adapter_sd15.bin",
    )

    pipe.set_ip_adapter_scale(0.75)

    pipe.enable_model_cpu_offload()

    return pipe


def generate_stable_diffusion(
    input_path,
    category,
    mode,
    output_path,
):

    import torch

    init_image = prepare_image(
        input_path
    )

    prompt = build_prompt(
        mode,
        category,
    )

    negative_prompt = build_negative_prompt()

    print(
        "Prompt:",
        flush=True,
    )

    print(
        prompt,
        flush=True,
    )

    pipe = None

    try:
        pipe = load_pipeline(
            torch.cuda.is_available()
        )

        seed = random.randint(
            1,
            2_147_483_647,
        )

        generator = torch.Generator(
            device="cuda"
        ).manual_seed(seed)

        print(
            "Seed:",
            seed,
            flush=True,
        )

        print(
            "Generating Stable Diffusion image...",
            flush=True,
        )

        result = pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            ip_adapter_image=init_image,
            guidance_scale=GUIDANCE,
            num_inference_steps=STEPS,
            width=512,
            height=512,
            generator=generator,
        )

        generated = result.images[0].convert(
            "RGB"
        )

        os.makedirs(
            os.path.dirname(output_path),
            exist_ok=True,
        )

        generated.save(
            output_path,
            "JPEG",
            quality=95,
            optimize=True,
        )

        print(
            "Stable Diffusion SUCCESS",
            flush=True,
        )

    finally:

        if pipe is not None:
            del pipe

        gc.collect()

        if torch.cuda.is_available():
            torch.cuda.empty_cache()


# ============================================================
# MAIN GENERATOR
# ============================================================

def generate(
    input_path,
    category,
    mode,
    output_path,
):

    print(
        "--------------------------------------------------",
        flush=True,
    )

    print(
        "AI SCENE PROCESSOR",
        flush=True,
    )

    print(
        "Mode:",
        mode,
        flush=True,
    )

    print(
        "Category:",
        category,
        flush=True,
    )

    print(
        "Input:",
        input_path,
        flush=True,
    )

    print(
        "Output:",
        output_path,
        flush=True,
    )

    print(
        "Platform:",
        platform.system(),
        flush=True,
    )

    print(
        "--------------------------------------------------",
        flush=True,
    )

    # ========================================================
    # RENDER / LINUX
    # ========================================================

    if IS_LINUX:

        print(
            "Render/Linux detected.",
            flush=True,
        )

        print(
            "Stable Diffusion CPU generation disabled.",
            flush=True,
        )

        print(
            "Using fast lifestyle composition instead.",
            flush=True,
        )

        result = create_lifestyle_composite(
            input_path,
            category,
        )

        result = enhance_image(
            result
        )

        os.makedirs(
            os.path.dirname(output_path),
            exist_ok=True,
        )

        result.save(
            output_path,
            "JPEG",
            quality=94,
            optimize=True,
        )

        print(
            "Render lifestyle image created:",
            output_path,
            flush=True,
        )

        print(
            "SUCCESS",
            flush=True,
        )

        return

    # ========================================================
    # LOCAL WINDOWS
    # ========================================================

    print(
        "Windows environment detected.",
        flush=True,
    )

    try:

        import torch

        use_cuda = torch.cuda.is_available()

        if use_cuda:

            print(
                "CUDA GPU detected:",
                torch.cuda.get_device_name(0),
                flush=True,
            )

            generate_stable_diffusion(
                input_path,
                category,
                mode,
                output_path,
            )

            return

        print(
            "No CUDA GPU detected.",
            flush=True,
        )

        print(
            "Using lightweight fallback.",
            flush=True,
        )

    except Exception as error:

        print(
            "Stable Diffusion unavailable:",
            repr(error),
            flush=True,
        )

        print(
            "Using lightweight fallback.",
            flush=True,
        )

    result = create_lifestyle_composite(
        input_path,
        category,
    )

    result = enhance_image(
        result
    )

    os.makedirs(
        os.path.dirname(output_path),
        exist_ok=True,
    )

    result.save(
        output_path,
        "JPEG",
        quality=94,
        optimize=True,
    )

    print(
        "Fallback lifestyle image created:",
        output_path,
        flush=True,
    )

    print(
        "SUCCESS",
        flush=True,
    )


# ============================================================
# CLI
# ============================================================

def main():

    print(
        "KarigarConnect AI Scene Processor",
        flush=True,
    )

    print(
        "CLI started",
        flush=True,
    )

    print(
        "Python version:",
        sys.version,
        flush=True,
    )

    if len(sys.argv) < 5:

        print(
            "Usage: python ai_scene_processor.py "
            "<input> <category> <mode> <output>",
            flush=True,
        )

        sys.exit(1)

    input_path = sys.argv[1]
    category = sys.argv[2]
    mode = sys.argv[3]
    output_path = sys.argv[4]

    print(
        "CLI input:",
        input_path,
        flush=True,
    )

    print(
        "CLI output:",
        output_path,
        flush=True,
    )

    if mode not in [
        "lifestyle",
        "model",
    ]:

        print(
            "Invalid mode. Use lifestyle or model.",
            flush=True,
        )

        sys.exit(1)

    if not os.path.exists(input_path):

        print(
            f"Input image does not exist: {input_path}",
            flush=True,
        )

        sys.exit(1)

    try:

        generate(
            input_path,
            category,
            mode,
            output_path,
        )

    except Exception as error:

        print(
            "AI generation failed:",
            repr(error),
            flush=True,
        )

        sys.exit(1)


if __name__ == "__main__":
    main()












