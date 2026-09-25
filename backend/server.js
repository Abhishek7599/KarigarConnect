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
const productTranslationRoutes =
  require("./routes/productTranslation.routes");

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || true }));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/ai-photos", aiPhotoRoutes);

app.use(
  "/api/products",
  productTranslationRoutes
);

app.use(
  "/api/translate",
  translateRoutes
);


app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "KarigarConnect backend is running 🚀",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "unavailable",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// MongoDB connection
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.warn("MONGO_URI is missing. Add it to backend/.env before using product storage.");
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
} else mongoose
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
