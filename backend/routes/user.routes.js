const express = require("express");
const { registerUser, loginUser, getProfile, updateProfile } = require("../controllers/user.controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", auth, getProfile);
router.put("/me", auth, updateProfile);

module.exports = router;
