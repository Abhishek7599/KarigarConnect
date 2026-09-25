const path = require("path");
const { spawn } = require("child_process");

const processAiScenePhoto = ({
  inputPath,
  outputPath,
  mode,
  category,
}) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(
      __dirname,
      "..",
      "python",
      "ai_scene_processor.py"
    );

    const pythonCommand =
      process.env.PYTHON_BIN || "python";

    const python = spawn(
      pythonCommand,
      [
        pythonScript,
        inputPath,
        category || "generic",
        mode,
        outputPath,
      ],
      {
        windowsHide: true,
      }
    );

    let stdout = "";
    let stderr = "";

    python.stdout.on("data", (data) => {
      const message = data.toString();

      stdout += message;

      console.log(
        `[AI ${mode.toUpperCase()}] ${message.trim()}`
      );
    });

    python.stderr.on("data", (data) => {
      const message = data.toString();

      stderr += message;

      console.error(
        `[AI ${mode.toUpperCase()} ERROR] ${message.trim()}`
      );
    });

    python.on("error", (error) => {
      reject(
        new Error(
          `Could not start AI scene processor: ${error.message}`
        )
      );
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            stderr.trim() ||
              stdout.trim() ||
              `AI ${mode} processing failed.`
          )
        );

        return;
      }

      resolve({
        stdout,
        stderr,
      });
    });
  });
};

module.exports = {
  processAiScenePhoto,
};