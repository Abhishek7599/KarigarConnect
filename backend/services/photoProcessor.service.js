const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const pythonScript = path.join(
  __dirname,
  "..",
  "python",
  "photo_processor.py"
);

const processStudioPhoto = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const python = spawn("python", [
      pythonScript,
      inputPath,
      outputPath,
    ]);

    let stdout = "";
    let stderr = "";

    python.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    python.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    python.on("error", (error) => {
      reject(
        new Error(
          `Could not start Python photo processor: ${error.message}`
        )
      );
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            stderr.trim() ||
              stdout.trim() ||
              "Photo processing failed."
          )
        );

        return;
      }

      if (!fs.existsSync(outputPath)) {
        reject(
          new Error(
            "Photo processor finished but output image was not created."
          )
        );

        return;
      }

      resolve({
        outputPath,
        output: stdout.trim(),
      });
    });
  });
};

module.exports = {
  processStudioPhoto,
};