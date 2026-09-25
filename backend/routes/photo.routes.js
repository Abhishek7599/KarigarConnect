const express = require("express");
const multer = require("multer");

const {
  processProductPhoto,
  processCloseupPhoto,
  processLifestylePhoto,
  processModelPhoto,
} = require("../controllers/photo.controller");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

// Studio
router.post(
  "/studio",
  upload.single("image"),
  processProductPhoto
);

// Close-up
router.post(
  "/closeup",
  upload.single("image"),
  processCloseupPhoto
);

// Model
router.post(
  "/model",
  upload.single("image"),
  processModelPhoto
);

// Lifestyle
router.post(
  "/lifestyle",
  upload.single("image"),
  processLifestylePhoto
);

module.exports = router;


