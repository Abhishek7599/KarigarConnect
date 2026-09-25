const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      hi: {
        type: String,
        trim: true,
      },
      en: {
        type: String,
        trim: true,
      },
    },

    material: {
      type: [String],
      default: [],
    },

    color: {
      type: [String],
      default: [],
    },

    craftType: {
      type: String,
      trim: true,
    },

    craftTechnique: {
      type: String,
      trim: true,
    },

    region: {
      type: String,
      trim: true,
    },

    dimensions: {
      type: String,
      trim: true,
    },

    productionTimeDays: {
      type: Number,
      min: 0,
      default: 0,
    },

    costPrice: {
      type: Number,
      min: 0,
      default: 0,
    },

    sellingPrice: {
      type: Number,
      min: 0,
      default: 0,
    },

    stock: {
      type: Number,
      min: 0,
      default: 0,
    },

    originalImage: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    studioImage: {
      type: String,
      trim: true,
      default: "",
    },

    lifestyleImage: {
      type: String,
      trim: true,
      default: "",
    },

    modelImage: {
      type: String,
      trim: true,
      default: "",
    },

    closeupImage: {
      type: String,
      trim: true,
      default: "",
    },

    /*
    =====================================================
    TRANSLATION CACHE
    =====================================================

    Example:

    translations: {
      hi: {
        name: "हस्तनिर्मित साड़ी",
        category: "हस्तकरघा",
        region: "वाराणसी"
      },

      ta: {
        name: "...",
        category: "...",
        region: "..."
      }
    }

    */

    translations: {
      type: Map,
      of: {
        name: {
          type: String,
          trim: true,
          default: "",
        },

        category: {
          type: String,
          trim: true,
          default: "",
        },

        region: {
          type: String,
          trim: true,
          default: "",
        },

        description: {
          type: String,
          trim: true,
          default: "",
        },
      },
      default: {},
    },

    status: {
      type: String,
      enum: [
        "draft",
        "published",
      ],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Product",
    productSchema
  );