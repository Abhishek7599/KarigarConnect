
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const imageRoutes = require("./routes/image.routes");
const voiceRoutes = require("./routes/voice.routes");
const pricingRoutes = require("./routes/pricing.routes");
const photoRoutes = require("./routes/photo.routes");
const aiPhotoRoutes = require("./routes/aiPhoto.routes");
const translateRoutes = require("./routes/translate.routes");
const productTranslationRoutes = require("./routes/productTranslation.routes");

const app = express();

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  "https://karigar-connect-p45ulko99-abhishek-kumar-s-projects2602.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json({ limit: "10mb" }));

// =====================================================
// ROUTES
// =====================================================

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/ai-photos", aiPhotoRoutes);

app.use("/api/products", productTranslationRoutes);

app.use("/api/translate", translateRoutes);

// =====================================================
// STATIC UPLOADS
// =====================================================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "KarigarConnect backend is running 🚀",
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "unavailable",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS blocked this request",
    });
  }

  res.status(500).json({
    message: "Internal server error",
  });
});

// =====================================================
// MONGODB + SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.warn(
    "MONGO_URI is missing. Add it to backend/.env before using product storage."
  );

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully ✅");

      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB connection failed ❌");
      console.error(error.message);
    });
}
