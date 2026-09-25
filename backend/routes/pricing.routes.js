const express = require("express");

const {
  getSuggestedPrice,
} = require("../controllers/pricing.controller");

const router = express.Router();

router.post("/suggest", getSuggestedPrice);

module.exports = router;