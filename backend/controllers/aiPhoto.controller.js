const fs = require("fs");
const path = require("path");

const {
  generateStyledProductImage,
} = require("../services/aiBackground.service");

const generateAIProductPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "GEMINI_API_KEY is missing in backend .env",
      });
    }

    let product = {};

    if (req.body.product) {
      try {
        product = JSON.parse(req.body.product);
      } catch (error) {
        return res.status(400).json({
          message: "Invalid product data.",
        });
      }
    }

    const style = req.body.style || "studio";

    const allowedStyles = [
      "studio",
      "lifestyle",
      "model",
      "closeup",
    ];

    if (!allowedStyles.includes(style)) {
      return res.status(400).json({
        message: "Invalid photo style.",
      });
    }

    const imageBase64 = req.file.buffer.toString("base64");

    console.log(
      `Generating ${style} AI product photo...`
    );

    const result = await generateStyledProductImage({
      imageBase64,
      mimeType: req.file.mimetype,
      product,
      style,
    });

    if (!result?.imageBase64) {
      return res.status(500).json({
        message: "AI did not return image data.",
      });
    }

    const processedDir = path.join(
      __dirname,
      "..",
      "uploads",
      "ai"
    );

    fs.mkdirSync(processedDir, {
      recursive: true,
    });

    const fileName =
      `ai-${style}-${Date.now()}.png`;

    const outputPath = path.join(
      processedDir,
      fileName
    );

    const imageBuffer = Buffer.from(
      result.imageBase64,
      "base64"
    );

    fs.writeFileSync(
      outputPath,
      imageBuffer
    );

    console.log(
      `${style} AI photo created successfully.`
    );

    return res.status(200).json({
      message:
        "AI product photo generated successfully.",

      style,

      imageUrl:
        `/uploads/ai/${fileName}`,
    });
  } catch (error) {
    console.error(
      "AI product photo error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to generate AI product photo.",
    });
  }
};

module.exports = {
  generateAIProductPhoto,
};