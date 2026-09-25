const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const productSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },

    category: {
      type: "string",
    },

    descriptionEn: {
      type: "string",
    },

    descriptionHi: {
      type: "string",
    },

    descriptionSelected: {
      type: "string",
    },

    material: {
      type: "array",
      items: {
        type: "string",
      },
    },

    color: {
      type: "array",
      items: {
        type: "string",
      },
    },

    craftType: {
      type: "string",
    },

    craftTechnique: {
      type: "string",
    },

    region: {
      type: "string",
    },

    dimensions: {
      type: "string",
    },

    productionTimeDays: {
      type: "integer",
    },

    costPrice: {
      type: "number",
    },

    sellingPrice: {
      type: "number",
    },

    stock: {
      type: "integer",
    },
  },

  required: [
    "name",
    "category",
    "descriptionEn",
    "descriptionHi",
    "descriptionSelected",
    "material",
    "color",
    "craftType",
    "craftTechnique",
    "region",
    "dimensions",
    "productionTimeDays",
    "costPrice",
    "sellingPrice",
    "stock",
  ],
};

const LANGUAGE_NAMES = {
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
};

const generateProductFromVoice = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message:
          "Audio file is required.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message:
          "GEMINI_API_KEY is missing in backend .env",
      });
    }

    const audioBase64 =
      req.file.buffer.toString("base64");

    /*
    =====================================================
    SELECTED LANGUAGE
    =====================================================
    */

    const selectedLanguage =
      req.body.language || "en";

    const selectedLanguageName =
      LANGUAGE_NAMES[
        selectedLanguage
      ] || "English";

    /*
    =====================================================
    AI PROMPT
    =====================================================
    */

    const prompt = `
You are KarigarConnect AI.

You help Indian artisans create product listings from natural speech.

The artisan's selected language is:

${selectedLanguageName}

Language code:

${selectedLanguage}

The artisan may speak:
- ${selectedLanguageName}
- Hindi
- English
- Hinglish
- Another Indian language
- Or a mixture of languages.

IMPORTANT:

Understand the artisan's speech accurately.

Do not reject the speech because it is not English.

Understand Indian craft terminology, local names,
regional words, spoken numbers and Indian currency.

Extract ONLY information that is actually present
in the artisan's speech.

Never invent:
- materials
- colors
- locations
- certifications
- prices
- production times
- craft techniques
- product claims

If something is not mentioned:
- return an empty string for string fields
- return an empty array for array fields
- return 0 for numeric fields

PRICING:

Understand Indian rupee amounts correctly.

Convert spoken numbers into numeric values.

DESCRIPTION RULES:

Create three short professional marketplace descriptions.

1. descriptionEn

Write a natural English description.

2. descriptionHi

Write a natural Hindi description.

3. descriptionSelected

Write a natural marketplace description in the
artisan's selected language:

${selectedLanguageName}

The selected-language description must use ONLY
facts found in the artisan's speech.

Do not add information that was not spoken.

If the selected language is English,
descriptionSelected may be the same as descriptionEn.

If the selected language is Hindi,
descriptionSelected may be the same as descriptionHi.

Return ONLY valid JSON matching the requested schema.

Do not return markdown.

Do not return explanations.
`;

    /*
    =====================================================
    GEMINI REQUEST
    =====================================================
    */

    const interaction =
      await ai.interactions.create({
        model: "gemini-3.6-flash",

        input: [
          {
            type: "text",
            text: prompt,
          },

          {
            type: "audio",
            data: audioBase64,
            mime_type:
              req.file.mimetype,
          },
        ],

        response_format: {
          type: "text",
          mime_type:
            "application/json",
          schema: productSchema,
        },
      });

    /*
    =====================================================
    AI RESPONSE
    =====================================================
    */

    const text =
      interaction.output_text;

    if (!text) {
      return res.status(500).json({
        message:
          "AI returned an empty response.",
      });
    }

    let product;

    try {
      product =
        JSON.parse(text);
    } catch (parseError) {
      console.error(
        "JSON parse error:",
        parseError
      );

      console.error(
        "AI output:",
        text
      );

      return res.status(500).json({
        message:
          "AI returned invalid product data.",
      });
    }

    /*
    =====================================================
    RESPONSE
    =====================================================
    */

    return res.status(200).json({
      message:
        "Product information extracted successfully.",

      language:
        selectedLanguage,

      languageName:
        selectedLanguageName,

      product,
    });
  } catch (error) {
    console.error(
      "Voice AI error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to understand the product from voice.",
    });
  }
};

module.exports = {
  generateProductFromVoice,
};