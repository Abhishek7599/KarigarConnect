const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Please sign in to continue." });
    const { userId } = jwt.verify(token, process.env.JWT_SECRET || "change-this-development-secret");
    req.user = await User.findById(userId).select("-password");
    if (!req.user) return res.status(401).json({ message: "Account not found." });
    next();
  } catch { return res.status(401).json({ message: "Your session has expired." }); }
};
