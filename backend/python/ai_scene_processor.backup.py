import os
import sys
import random
import gc

import torch
from PIL import Image, ImageOps

from diffusers import StableDiffusionImg2ImgPipeline


MODEL_ID = "stable-diffusion-v1-5/stable-diffusion-v1-5"

WIDTH = 512
HEIGHT = 512

STEPS = int(os.getenv("SCENE_STEPS", "20"))
GUIDANCE = float(os.getenv("SCENE_GUIDANCE", "7.0"))
STRENGTH = float(os.getenv("SCENE_STRENGTH", "0.38"))


def clean_category(category):
    return (category or "generic").strip().lower()


def build_prompt(mode, category):
    category = clean_category(category)

    lifestyle_prompts = {
        "handloom": (
            "premium Indian artisan handloom product displayed naturally "
            "in a beautiful luxury Indian home interior, warm daylight, "
            "wooden furniture, tasteful decor, realistic commercial "
            "ecommerce photography, natural shadows, photorealistic, "
            "professional product advertising"
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


def prepare_image(input_path):
    image = Image.open(input_path).convert("RGB")

    image.thumbnail(
        (420, 420),
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


def load_pipeline(use_cuda):
    if use_cuda:
        dtype = torch.float16
    else:
        dtype = torch.float32

    pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
        MODEL_ID,
        torch_dtype=dtype,
        use_safetensors=True,
    )


    if use_cuda:
        pipe.enable_model_cpu_offload()
    else:
        pipe = pipe.to("cpu")

    return pipe


def generate(
    input_path,
    category,
    mode,
    output_path,
):
    print("--------------------------------------------------")
    print("AI SCENE PROCESSOR")
    print("Mode:", mode)
    print("Category:", category)
    print("Input:", input_path)
    print("Output:", output_path)
    print("--------------------------------------------------")

    use_cuda = torch.cuda.is_available()

    print(
        "Device:",
        torch.cuda.get_device_name(0)
        if use_cuda
        else "CPU",
    )

    init_image = prepare_image(input_path)

    prompt = build_prompt(
        mode,
        category,
    )

    negative_prompt = build_negative_prompt()

    print("Prompt:")
    print(prompt)

    print("Loading Stable Diffusion model...")

    pipe = None

    try:
        pipe = load_pipeline(use_cuda)

        seed = random.randint(
            1,
            2_147_483_647,
        )

        if use_cuda:
            generator = torch.Generator(
                device="cuda"
            ).manual_seed(seed)
        else:
            generator = torch.Generator(
                device="cpu"
            ).manual_seed(seed)

        print("Seed:", seed)
        print("Generating image...")

        result = pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            image=init_image,
            strength=STRENGTH,
            guidance_scale=GUIDANCE,
            num_inference_steps=STEPS,
            width=WIDTH,
            height=HEIGHT,
            generator=generator,
        )

        generated = result.images[0]

        generated = generated.convert("RGB")

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

        print("SUCCESS")
        print("Saved:", output_path)

    finally:
        del pipe

        gc.collect()

        if torch.cuda.is_available():
            torch.cuda.empty_cache()


def main():
    if len(sys.argv) < 5:
        print(
            "Usage: python ai_scene_processor.py "
            "<input> <category> <mode> <output>"
        )

        sys.exit(1)

    input_path = sys.argv[1]
    category = sys.argv[2]
    mode = sys.argv[3]
    output_path = sys.argv[4]

    if mode not in [
        "lifestyle",
        "model",
    ]:
        print(
            "Invalid mode. Use lifestyle or model."
        )

        sys.exit(1)

    if not os.path.exists(input_path):
        print(
            f"Input image does not exist: {input_path}"
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
        )

        sys.exit(1)


if __name__ == "__main__":
    main()
