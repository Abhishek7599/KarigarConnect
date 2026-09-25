const express = require("express");
const multer = require("multer");

const {
  generateProductFromVoice,
} = require("../controllers/voice.controller");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post(
  "/product",
  upload.single("audio"),
  generateProductFromVoice
);

module.exports = router;
