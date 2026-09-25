const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/*
=====================================================
SUPPORTED LANGUAGES
=====================================================
*/

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

/*
=====================================================
PRICING RESPONSE SCHEMA
=====================================================
*/

const pricingSchema = {
  type: "object",

  properties: {
    suggestedPrice: {
      type: "number",
    },

    minimumPrice: {
      type: "number",
    },

    maximumPrice: {
      type: "number",
    },

    confidence: {
      type: "number",
    },

    reasoning: {
      type: "string",
    },

    factors: {
      type: "array",

      items: {
        type: "string",
      },
    },
  },

  required: [
    "suggestedPrice",
    "minimumPrice",
    "maximumPrice",
    "confidence",
    "reasoning",
    "factors",
  ],
};

/*
=====================================================
CONTROLLER
=====================================================
*/

const getSuggestedPrice =
  async (req, res) => {
    try {
      /*
      =================================================
      API KEY CHECK
      =================================================
      */

      /*
      =================================================
      REQUEST DATA
      =================================================
      */

      const {
        name,
        category,
        material,
        color,
        craftType,
        craftTechnique,
        region,
        productionTimeDays,
        costPrice,
        stock,
        language,
      } = req.body;

      /*
      =================================================
      LANGUAGE
      =================================================
      */

      const selectedLanguage =
        language || "en";

      const selectedLanguageName =
        LANGUAGE_NAMES[
          selectedLanguage
        ] || "English";

      /*
      =================================================
      VALIDATION
      =================================================
      */

      if (
        !name ||
        !category
      ) {
        return res.status(400).json({
          message:
            "Product name and category are required.",
        });
      }

      /*
      =================================================
      NORMALIZE NUMBERS
      =================================================
      */

      const numericCost =
        Number(costPrice) || 0;

      const productionDays =
        Number(
          productionTimeDays
        ) || 0;

      const currentStock =
        Number(stock) || 0;

      /* A useful offline estimate keeps the prototype usable before an AI key is configured. */
      if (!process.env.GEMINI_API_KEY) {
        const multiplier = productionDays >= 14 ? 2.25 : productionDays >= 7 ? 2 : 1.7;
        const suggestedPrice = Math.max(100, Math.round(numericCost * multiplier / 50) * 50);
        return res.status(200).json({
          message: "Offline pricing estimate generated. Configure GEMINI_API_KEY for AI reasoning.",
          language: selectedLanguage,
          languageName: selectedLanguageName,
          pricing: {
            suggestedPrice,
            minimumPrice: Math.max(numericCost, Math.round(suggestedPrice * 0.85 / 50) * 50),
            maximumPrice: Math.round(suggestedPrice * 1.2 / 50) * 50,
            confidence: numericCost > 0 ? 55 : 45,
            reasoning: selectedLanguage === "hi" ? "यह उत्पादन लागत और समय पर आधारित एक ऑफ़लाइन अनुमान है; यह लाइव बाज़ार भाव नहीं है।" : "This is an offline estimate based on production cost and time, not a live market quote.",
            factors: [
              `Production cost: ₹${numericCost}`,
              `Production time: ${productionDays || "not provided"} days`,
              currentStock ? `Current stock: ${currentStock}` : "Stock was not provided",
            ],
          },
        });
      }

      /*
      =================================================
      NORMALIZE ARRAYS
      =================================================
      */

      const materialText =
        Array.isArray(material)
          ? material.join(", ")
          : material || "";

      const colorText =
        Array.isArray(color)
          ? color.join(", ")
          : color || "";

      /*
      =================================================
      AI PROMPT
      =================================================
      */

      const prompt = `
You are KarigarConnect AI Pricing Assistant.

Your job is to help an Indian artisan estimate
a fair and practical selling price for a handmade product.

The UI language selected by the user is:
${selectedLanguageName}

IMPORTANT LANGUAGE RULE:
- Return the "reasoning" entirely in ${selectedLanguageName}.
- Return every item inside the "factors" array entirely in ${selectedLanguageName}.
- Keep all numeric price values as numbers.
- Product names and technical terms may remain in their original form
  when translating them naturally would reduce clarity.
- Do not mix English into the reasoning or factors unless a proper
  product/technical term genuinely needs to remain unchanged.
- The language of reasoning and factors should be natural for an
  Indian artisan using ${selectedLanguageName}.

PRODUCT:
Name: ${name}
Category: ${category}
Material: ${materialText}
Color: ${colorText}
Craft Type: ${craftType || ""}
Craft Technique: ${craftTechnique || ""}
Region: ${region || ""}
Production Time: ${productionDays} days
Production Cost: ₹${numericCost}
Current Stock: ${currentStock}

PRICING RULES:

1. Never suggest a price below the production cost.

2. Respect the artisan's labor and craftsmanship.

3. Consider:
   - material quality
   - craft complexity
   - production time
   - craftsmanship
   - uniqueness
   - regional craft value

4. Give a realistic selling-price range in Indian Rupees.

5. Do not claim to know exact live market prices unless live
   market data is actually provided.

6. Be conservative when information is missing.

7. Explain the recommendation simply so a small artisan business
   owner can understand it.

8. Return only JSON matching the requested schema.

9. The suggested price should be practical for a small artisan
   business rather than an unrealistic luxury price.

10. Do not claim that the product has high demand, steady demand,
    or a specific market price unless that information is provided.

11. Base the recommendation only on:
    - provided product details
    - craftsmanship
    - production cost
    - production time
    - materials
    - technique
    - general pricing logic

12. Clearly communicate in the reasoning that the result is an
    AI estimate and not a live market quote.

OUTPUT LANGUAGE:
Reasoning: ${selectedLanguageName}
Factors: ${selectedLanguageName}

Return ONLY valid JSON.
`;

      /*
      =================================================
      GEMINI REQUEST
      =================================================
      */

      const interaction =
        await ai.interactions.create({
          model:
            "gemini-3.6-flash",

          input: prompt,

          response_format: {
            type: "text",
            mime_type:
              "application/json",
            schema:
              pricingSchema,
          },
        });

      /*
      =================================================
      READ AI OUTPUT
      =================================================
      */

      const text =
        interaction.output_text;

      const normalizedPricingText =
        text?.trim();

      if (
        !normalizedPricingText
      ) {
        return res.status(500).json({
          message:
            "AI returned an empty pricing response.",
        });
      }

      /*
      =================================================
      PARSE JSON
      =================================================
      */

      let pricing;

      try {
        pricing =
          JSON.parse(
            normalizedPricingText
          );

        /*
        ===============================================
        PRODUCT COMPLETENESS
        ===============================================
        */

        const productCompleteness = [
          name,
          category,
          materialText,
          colorText,
          craftType,
          craftTechnique,
          region,
          productionDays > 0
            ? productionDays
            : "",
          numericCost > 0
            ? numericCost
            : "",
        ].filter(Boolean)
          .length;

        const completenessScore =
          Math.round(
            (productCompleteness /
              9) *
              100
          );

        /*
        ===============================================
        AI CONFIDENCE
        ===============================================
        */

        const aiConfidence =
          Number(
            pricing.confidence
          ) || 0;

        pricing.confidence =
          Math.max(
            45,
            Math.min(
              95,
              Math.round(
                completenessScore *
                  0.55 +
                  aiConfidence *
                    0.45
              )
            )
          );

        /*
        ===============================================
        PRICE SAFETY RULES
        ===============================================
        */

        if (
          pricing.minimumPrice <
          numericCost
        ) {
          pricing.minimumPrice =
            numericCost;
        }

        if (
          pricing.suggestedPrice <
          pricing.minimumPrice
        ) {
          pricing.suggestedPrice =
            pricing.minimumPrice;
        }

        if (
          pricing.maximumPrice <
          pricing.suggestedPrice
        ) {
          pricing.maximumPrice =
            pricing.suggestedPrice;
        }

        /*
        ===============================================
        CLEAN FACTORS
        ===============================================
        */

        if (
          !Array.isArray(
            pricing.factors
          )
        ) {
          pricing.factors = [];
        }

        pricing.factors =
          pricing.factors
            .filter(
              (factor) =>
                typeof factor ===
                "string"
            )
            .map(
              (factor) =>
                factor.trim()
            )
            .filter(Boolean);

        /*
        ===============================================
        REASONING FALLBACK
        ===============================================
        */

        if (
          typeof pricing.reasoning !==
            "string" ||
          !pricing.reasoning.trim()
        ) {
          pricing.reasoning =
            selectedLanguage ===
            "hi"
              ? "यह AI अनुमान है और लाइव बाजार भाव नहीं है।"
              : "This is an AI estimate and not a live market quote.";
        }
      } catch (parseError) {
        console.error(
          "Pricing JSON parse error:",
          parseError
        );

        console.error(
          "AI output:",
          text
        );

        return res.status(500).json({
          message:
            "AI returned invalid pricing data.",
        });
      }

      /*
      =================================================
      RESPONSE
      =================================================
      */

      return res.status(200).json({
        message:
          "AI pricing generated successfully.",

        language:
          selectedLanguage,

        languageName:
          selectedLanguageName,

        pricing,
      });
    } catch (error) {
      console.error(
        "Pricing AI error:",
        error
      );

      return res.status(500).json({
        message:
          error.message ||
          "Failed to generate AI pricing.",
      });
    }
  };

module.exports = {
  getSuggestedPrice,
};
