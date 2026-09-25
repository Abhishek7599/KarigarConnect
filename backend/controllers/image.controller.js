const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const replicate = require("../services/replicate.service");

const {
  sendProgress,
} = require("./imageProgress.controller");

const styles = [
  {
    name: "studio",
    prompt: `
Transform the provided product photograph into a premium e-commerce studio photograph.

Remove the original background.

Place the exact product on a clean warm-white studio background with soft diffused professional lighting and a subtle realistic shadow.

IMPORTANT:
Preserve the product EXACTLY.
Keep the same shape, colors, patterns, embroidery, texture, proportions, materials and craftsmanship.

Do not redesign the product.
Do not add new patterns.
Do not change its colors.
Do not remove any important product details.
The product must remain faithful to the reference image.
`,
  },

  {
    name: "lifestyle",
    prompt: `
Transform the provided product photograph into a premium lifestyle product photograph.

Keep the exact original product unchanged.

Place the product naturally in an elegant Indian artisan-inspired interior setting with warm natural daylight.

The environment can change, but the product itself must remain faithful to the reference image.

IMPORTANT:
Preserve the exact colors, patterns, embroidery, texture, shape, proportions and craftsmanship.

Do not redesign or invent product details.
`,
  },

  {
    name: "model",
    prompt: `
Create a professional marketplace photograph using the provided product as the exact reference.

Show the product naturally being worn or used by a realistic model when appropriate for the product.

IMPORTANT:
Preserve the exact product design, colors, patterns, embroidery, material, shape and proportions.

The model and environment can be generated, but the product must remain faithful to the reference image.

Do not redesign the product.
Do not invent new patterns or details.
`,
  },

  {
    name: "closeup",
    prompt: `
Create a premium close-up product photograph from the provided reference.

Focus on the product's craftsmanship, embroidery, texture, stitching, material and fine details.

IMPORTANT:
Preserve the exact original colors, patterns and design.

Do not invent details that are not present in the reference.
Do not redesign the product.
`,
  },
];

const generateProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    const selectedStyles = req.body.styles ? JSON.parse(req.body.styles) : styles.map((item) => item.name);
    if (!Array.isArray(selectedStyles) || !selectedStyles.every((name) => styles.some((item) => item.name === name))) {
      return res.status(400).json({ message: "Choose one or more valid photo styles." });
    }
    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(503).json({ message: "AI photo generation is not configured. Add REPLICATE_API_TOKEN to backend/.env." });
    }

    // Make a low-light or slightly soft seller image a cleaner reference for the AI model.
    const enhancedSource = await sharp(req.file.buffer)
      .rotate()
      .resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true })
      .modulate({ brightness: 1.06, saturation: 1.04 })
      .sharpen()
      .jpeg({ quality: 92 })
      .toBuffer();

    const uploadDirectory = path.join(__dirname, "../uploads");

    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, {
        recursive: true,
      });
    }

    const generatedImages = [];

    for (const style of styles.filter((item) => selectedStyles.includes(item.name))) {
  console.log(`Generating ${style.name} image...`);

  sendProgress({
    type: "generating",
    style: style.name,
    message: `Creating ${style.name} photo...`,
  });

  const output = await replicate.run(
    "black-forest-labs/flux-kontext-pro",
    {
      input: {
        prompt: style.prompt,
        input_image: `data:image/jpeg;base64,${enhancedSource.toString(
          "base64"
        )}`,
      },
    }
  );

  console.log(`${style.name} generation completed`);

  let imageUrl;

  if (Array.isArray(output)) {
    imageUrl = output[0];
  } else {
    imageUrl = output;
  }

  if (!imageUrl) {
    console.log(`No image returned for ${style.name}`);

    sendProgress({
      type: "error",
      style: style.name,
      message: `${style.name} photo could not be created`,
    });

    continue;
  }

  const response = await fetch(imageUrl);
  const imageBuffer = Buffer.from(
    await response.arrayBuffer()
  );

  const fileName = `product-${style.name}-${Date.now()}.png`;

  const outputPath = path.join(
    uploadDirectory,
    fileName
  );

  await sharp(imageBuffer)
    .png()
    .toFile(outputPath);

  generatedImages.push({
    style: style.name,
    imageUrl: `http://localhost:${
      process.env.PORT || 5000
    }/uploads/${fileName}`,
  });

  sendProgress({
    type: "completed",
    style: style.name,
    message: `${style.name} photo created successfully`,
  });
}

    if (generatedImages.length === 0) {
      return res.status(500).json({
        message: "No AI images were generated",
      });
    }

    sendProgress({
        type: "all-completed",
        message: "All AI product photos are ready!",
    });

    res.status(201).json({
      message: "AI product photos generated successfully",
      generatedImages,
    });
  } catch (error) {
    // Do not log the full SDK error: it can include Authorization request headers.
    const status = error?.response?.status || error?.status;
    const safeMessage = error?.message || "Failed to generate AI product photos.";
    console.error(`Replicate image generation failed${status ? ` (HTTP ${status})` : ""}: ${safeMessage}`);

    if (status === 402 || /insufficient credit|payment required/i.test(safeMessage)) {
      return res.status(402).json({
        message: "AI photo generation needs available Replicate credit. Add credit to the connected Replicate account, wait a few minutes, then try again.",
        code: "REPLICATE_INSUFFICIENT_CREDIT",
      });
    }

    return res.status(500).json({
      message: "Failed to generate AI product photos",
      code: "AI_PHOTO_GENERATION_FAILED",
    });
  }
};

module.exports = {
  generateProductImage,
};
