const express = require("express");

const upload = require("../middleware/upload");
const {
  generateProductImage,
} = require("../controllers/image.controller");

const {
  imageProgress,
} = require("../controllers/imageProgress.controller");

const router = express.Router();

router.get(
  "/progress",
  imageProgress
);

router.post(
  "/generate",
  upload.single("image"),
  generateProductImage
);

module.exports = router;
