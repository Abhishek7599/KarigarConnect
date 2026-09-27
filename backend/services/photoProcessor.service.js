const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const pythonScript = path.join(
  __dirname,
  "..",
  "python",
  "photo_processor.py"
);

// Render uses Linux.
// Your local Windows machine uses python/python.exe.
const pythonCommand =
  process.platform === "win32"
    ? "python"
    : "python3";

const processStudioPhoto = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    console.log("========================================");
    console.log("STUDIO PHOTO PROCESSOR STARTING");
    console.log("========================================");

    console.log("Platform:", process.platform);
    console.log("Python command:", pythonCommand);
    console.log("Python script:", pythonScript);
    console.log("Input:", inputPath);
    console.log("Output:", outputPath);

    // Make sure the Python script exists.
    if (!fs.existsSync(pythonScript)) {
      reject(
        new Error(
          `Python Studio processor not found: ${pythonScript}`
        )
      );

      return;
    }

    // Make sure input exists.
    if (!fs.existsSync(inputPath)) {
      reject(
        new Error(
          `Studio input image not found: ${inputPath}`
        )
      );

      return;
    }

    const python = spawn(
      pythonCommand,
      [
        "-u",
        pythonScript,
        inputPath,
        outputPath,
      ],
      {
        cwd: path.join(__dirname, ".."),
        env: {
          ...process.env,
          PYTHONUNBUFFERED: "1",
        },
      }
    );

    let stdout = "";
    let stderr = "";

    let finished = false;

    // -------------------------------------------------
    // TIMEOUT
    // -------------------------------------------------

    const timeout = setTimeout(() => {
      if (finished) {
        return;
      }

      console.error(
        "Studio Python processor timed out after 10 minutes."
      );

      finished = true;

      try {
        python.kill("SIGTERM");
      } catch (error) {
        console.error(
          "Could not terminate Python process:",
          error.message
        );
      }

      reject(
        new Error(
          "Studio photo processing timed out after 10 minutes."
        )
      );
    }, 10 * 60 * 1000);

    // -------------------------------------------------
    // PYTHON STDOUT
    // -------------------------------------------------

    python.stdout.on("data", (data) => {
      const message = data.toString();

      stdout += message;

      console.log(
        `[Studio Python stdout] ${message.trim()}`
      );
    });

    // -------------------------------------------------
    // PYTHON STDERR
    // -------------------------------------------------

    python.stderr.on("data", (data) => {
      const message = data.toString();

      stderr += message;

      console.error(
        `[Studio Python stderr] ${message.trim()}`
      );
    });

    // -------------------------------------------------
    // PROCESS ERROR
    // -------------------------------------------------

    python.on("error", (error) => {
      if (finished) {
        return;
      }

      finished = true;

      clearTimeout(timeout);

      console.error(
        "Failed to start Python Studio processor:",
        error
      );

      reject(
        new Error(
          `Could not start Python photo processor using "${pythonCommand}": ${error.message}`
        )
      );
    });

    // -------------------------------------------------
    // PROCESS CLOSE
    // -------------------------------------------------

    python.on("close", (code, signal) => {
      if (finished) {
        return;
      }

      finished = true;

      clearTimeout(timeout);

      console.log("========================================");
      console.log("STUDIO PYTHON PROCESS FINISHED");
      console.log("Exit code:", code);
      console.log("Signal:", signal);
      console.log("========================================");

      // Python failed.
      if (code !== 0) {
        const errorMessage =
          stderr.trim() ||
          stdout.trim() ||
          `Python Studio processor failed with exit code ${code}.`;

        reject(
          new Error(errorMessage)
        );

        return;
      }

      // Python exited successfully but didn't create output.
      if (!fs.existsSync(outputPath)) {
        reject(
          new Error(
            "Python Studio processor finished successfully, but output image was not created."
          )
        );

        return;
      }

      const stats = fs.statSync(outputPath);

      if (stats.size === 0) {
        reject(
          new Error(
            "Studio processor created an empty output image."
          )
        );

        return;
      }

      console.log(
        `Studio output verified: ${stats.size} bytes`
      );

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
