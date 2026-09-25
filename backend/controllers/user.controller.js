const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const publicUser = (user) => ({ id: user._id, _id: user._id, name: user.name, phone: user.phone, language: user.language, craftType: user.craftType, location: user.location, experienceYears: user.experienceYears, businessName: user.businessName, bio: user.bio, certificates: user.certificates || [], credentials: user.credentials || [] });
const tokenFor = (user) => jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "change-this-development-secret", { expiresIn: "7d" });

const registerUser = async (req, res) => {
  try {
    const { name, phone, password, language, craftType, location, experienceYears, businessName, bio, certificates, credentials } = req.body;
    if (!phone || !password || password.length < 6) return res.status(400).json({ message: "Phone and a password of at least 6 characters are required." });
    if (await User.findOne({ phone })) return res.status(409).json({ message: "An account with this phone already exists." });
    const user = await User.create({ name, phone, password: await bcrypt.hash(password, 12), language: language || "en", craftType, location, experienceYears, businessName, bio, certificates, credentials });
    return res.status(201).json({ message: "Account created", user: publicUser(user), token: tokenFor(user) });
  } catch (error) { return res.status(500).json({ message: error.message || "Could not create account." }); }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.body.phone }).select("+password");
    if (!user || !(await bcrypt.compare(req.body.password || "", user.password))) return res.status(401).json({ message: "Incorrect phone number or password." });
    return res.json({ message: "Signed in", user: publicUser(user), token: tokenFor(user) });
  } catch { return res.status(500).json({ message: "Could not sign in." }); }
};

const getProfile = (req, res) => res.json({ user: publicUser(req.user) });
const updateProfile = async (req, res) => {
  ["name", "language", "craftType", "location", "experienceYears", "businessName", "bio", "certificates", "credentials"].forEach((key) => { if (req.body[key] !== undefined) req.user[key] = req.body[key]; });
  await req.user.save();
  res.json({ message: "Profile updated", user: publicUser(req.user) });
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };
