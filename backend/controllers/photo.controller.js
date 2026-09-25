const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const {
  processStudioPhoto,
} = require("../services/photoProcessor.service");

const {
  processAiScenePhoto,
} = require("../services/aiScene.service");

const processProductPhoto = async (req, res) => {
  let inputPath = null;
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Product photo is required.",
      });
    }

    const uploadDir = path.join(
      __dirname,
      "..",
      "uploads"
    );

    const processedDir = path.join(
      uploadDir,
      "processed"
    );

    fs.mkdirSync(uploadDir, {
      recursive: true,
    });

    fs.mkdirSync(processedDir, {
      recursive: true,
    });

    const timestamp = Date.now();

    const extension =
      path.extname(req.file.originalname) || ".jpg";

    const inputFileName =
      `product-${timestamp}${extension}`;

    const outputFileName =
      `studio-${timestamp}.jpg`;

    inputPath = path.join(
      uploadDir,
      inputFileName
    );

    outputPath = path.join(
      processedDir,
      outputFileName
    );

    fs.writeFileSync(
      inputPath,
      req.file.buffer
    );

    console.log(
      "Starting high-resolution Studio processing..."
    );

    await processStudioPhoto(
      inputPath,
      outputPath
    );

    if (!fs.existsSync(outputPath)) {
      throw new Error(
        "Studio processor finished but output image was not created."
      );
    }

    const outputStats = fs.statSync(
      outputPath
    );

    console.log(
      `Studio output created: ${outputStats.size} bytes`
    );

    return res.status(200).json({
      message:
        "High-resolution Studio photo created successfully.",

      imageUrl:
        `/uploads/processed/${outputFileName}`,

      resolution: "4320x4320",
    });
  } catch (error) {
    console.error(
      "Studio photo processing error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to process product photo.",
    });
  } finally {
    if (
      inputPath &&
      fs.existsSync(inputPath)
    ) {
      try {
        fs.unlinkSync(inputPath);
      } catch (error) {
        console.error(
          "Could not remove temporary input:",
          error.message
        );
      }
    }
  }
};


/*
=========================================================
CLOSE-UP PHOTO
=========================================================
*/

const processCloseupPhoto = async (req, res) => {
  let inputPath = null;
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Product photo is required.",
      });
    }

    const category =
      req.body.category || "generic";

    const uploadDir = path.join(
      __dirname,
      "..",
      "uploads"
    );

    const processedDir = path.join(
      uploadDir,
      "processed"
    );

    fs.mkdirSync(uploadDir, {
      recursive: true,
    });

    fs.mkdirSync(processedDir, {
      recursive: true,
    });

    const timestamp = Date.now();

    const extension =
      path.extname(req.file.originalname) || ".jpg";

    const inputFileName =
      `product-closeup-${timestamp}${extension}`;

    const outputFileName =
      `closeup-${timestamp}.jpg`;

    inputPath = path.join(
      uploadDir,
      inputFileName
    );

    outputPath = path.join(
      processedDir,
      outputFileName
    );

    fs.writeFileSync(
      inputPath,
      req.file.buffer
    );

    const pythonScript = path.join(
      __dirname,
      "..",
      "python",
      "closeup_processor.py"
    );

    console.log(
      `Starting Close-up processing for category: ${category}`
    );

    await new Promise(
      (resolve, reject) => {
        const python = spawn(
          "python",
          [
            pythonScript,
            inputPath,
            category,
            outputPath,
          ]
        );

        let stdout = "";
        let stderr = "";

        python.stdout.on(
          "data",
          (data) => {
            stdout += data.toString();
          }
        );

        python.stderr.on(
          "data",
          (data) => {
            stderr += data.toString();
          }
        );

        python.on(
          "error",
          (error) => {
            reject(
              new Error(
                `Could not start Python processor: ${error.message}`
              )
            );
          }
        );

        python.on(
          "close",
          (code) => {
            console.log(stdout);

            if (code !== 0) {
              reject(
                new Error(
                  stderr.trim() ||
                    stdout.trim() ||
                    "Close-up processing failed."
                )
              );

              return;
            }

            resolve();
          }
        );
      }
    );

    if (!fs.existsSync(outputPath)) {
      throw new Error(
        "Close-up processor finished but output image was not created."
      );
    }

    return res.status(200).json({
      message:
        "Close-up photo created successfully.",

      imageUrl:
        `/uploads/processed/${outputFileName}`,
    });
  } catch (error) {
    console.error(
      "Close-up processing error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to process Close-up photo.",
    });
  } finally {
    if (
      inputPath &&
      fs.existsSync(inputPath)
    ) {
      try {
        fs.unlinkSync(inputPath);
      } catch (error) {
        console.error(
          "Could not remove temporary input:",
          error.message
        );
      }
    }
  }
};


/*
=========================================================
AI LIFESTYLE PHOTO
=========================================================
*/

const processLifestylePhoto = async (req, res) => {
  let inputPath = null;
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Product photo is required.",
      });
    }

    const category =
      req.body.category || "generic";

    const uploadDir = path.join(
      __dirname,
      "..",
      "uploads"
    );

    const processedDir = path.join(
      uploadDir,
      "processed"
    );

    fs.mkdirSync(uploadDir, {
      recursive: true,
    });

    fs.mkdirSync(processedDir, {
      recursive: true,
    });

    const timestamp = Date.now();

    const extension =
      path.extname(req.file.originalname) || ".jpg";

    const inputFileName =
      `product-lifestyle-${timestamp}${extension}`;

    const outputFileName =
      `lifestyle-${timestamp}.jpg`;

    inputPath = path.join(
      uploadDir,
      inputFileName
    );

    outputPath = path.join(
      processedDir,
      outputFileName
    );

    fs.writeFileSync(
      inputPath,
      req.file.buffer
    );

    console.log(
      `Starting AI Lifestyle generation for category: ${category}`
    );

    await processAiScenePhoto({
      inputPath,
      outputPath,
      mode: "lifestyle",
      category,
    });

    if (!fs.existsSync(outputPath)) {
      throw new Error(
        "AI Lifestyle processor finished but output image was not created."
      );
    }

    const outputStats =
      fs.statSync(outputPath);

    console.log(
      `Lifestyle output created: ${outputStats.size} bytes`
    );

    return res.status(200).json({
      message:
        "AI Lifestyle photo created successfully.",

      imageUrl:
        `/uploads/processed/${outputFileName}`,

      resolution:
        "512x512",

      style:
        "lifestyle",
    });
  } catch (error) {
    console.error(
      "Lifestyle photo processing error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to create AI Lifestyle photo.",
    });
  } finally {
    if (
      inputPath &&
      fs.existsSync(inputPath)
    ) {
      try {
        fs.unlinkSync(inputPath);
      } catch (error) {
        console.error(
          "Could not remove temporary Lifestyle input:",
          error.message
        );
      }
    }
  }
};


/*
=========================================================
AI MODEL PHOTO
=========================================================
*/

const processModelPhoto = async (req, res) => {
  let inputPath = null;
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Product photo is required.",
      });
    }

    const category =
      req.body.category || "generic";

    const uploadDir = path.join(
      __dirname,
      "..",
      "uploads"
    );

    const processedDir = path.join(
      uploadDir,
      "processed"
    );

    fs.mkdirSync(uploadDir, {
      recursive: true,
    });

    fs.mkdirSync(processedDir, {
      recursive: true,
    });

    const timestamp = Date.now();

    const extension =
      path.extname(req.file.originalname) || ".jpg";

    const inputFileName =
      `product-model-${timestamp}${extension}`;

    const outputFileName =
      `model-${timestamp}.jpg`;

    inputPath = path.join(
      uploadDir,
      inputFileName
    );

    outputPath = path.join(
      processedDir,
      outputFileName
    );

    fs.writeFileSync(
      inputPath,
      req.file.buffer
    );

    console.log(
      `Starting AI Model generation for category: ${category}`
    );

    await processAiScenePhoto({
      inputPath,
      outputPath,
      mode: "model",
      category,
    });

    if (!fs.existsSync(outputPath)) {
      throw new Error(
        "AI Model processor finished but output image was not created."
      );
    }

    const outputStats =
      fs.statSync(outputPath);

    console.log(
      `Model output created: ${outputStats.size} bytes`
    );

    return res.status(200).json({
      message:
        "AI Model photo created successfully.",

      imageUrl:
        `/uploads/processed/${outputFileName}`,

      resolution:
        "512x512",

      style:
        "model",
    });
  } catch (error) {
    console.error(
      "Model photo processing error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to create AI Model photo.",
    });
  } finally {
    if (
      inputPath &&
      fs.existsSync(inputPath)
    ) {
      try {
        fs.unlinkSync(inputPath);
      } catch (error) {
        console.error(
          "Could not remove temporary Model input:",
          error.message
        );
      }
    }
  }
};


module.exports = {
  processProductPhoto,
  processCloseupPhoto,
  processLifestylePhoto,
};


module.exports.processModelPhoto = processModelPhoto;
