const express = require("express");
const Product = require("../models/product.model");

const router = express.Router();

const TRANSLATION_API =
  "https://api.mymemory.translated.net/get";

/*
=====================================================
TRANSLATE MULTIPLE TEXTS
=====================================================

MyMemory accepts one text per request, so we still
make multiple external calls here, but they run in
parallel instead of one after another.

=====================================================
*/

const translateBatch = async (
  texts,
  target
) => {
  const entries =
    Object.entries(texts);

  const results =
    await Promise.all(
      entries.map(
        async ([key, text]) => {
          if (!text) {
            return [key, ""];
          }

          try {
            const url =
              `${TRANSLATION_API}` +
              `?q=${encodeURIComponent(
                text
              )}` +
              `&langpair=en|${encodeURIComponent(
                target
              )}`;

            const response =
              await fetch(url);

            if (!response.ok) {
              throw new Error(
                `Translation API returned ${response.status}`
              );
            }

            const data =
              await response.json();

            if (
              data.responseStatus !==
              200
            ) {
              throw new Error(
                data.responseDetails ||
                  "Translation failed."
              );
            }

            return [
              key,
              data.responseData
                .translatedText ||
                text,
            ];
          } catch (error) {
            console.error(
              `Translation failed for ${key}:`,
              error.message
            );

            /*
              Keep original text if one
              field fails.
            */

            return [key, text];
          }
        }
      )
    );

  return Object.fromEntries(
    results
  );
};


/*
=====================================================
AUTO TRANSLATE PRODUCT
=====================================================

POST
/api/products/:id/translations/auto

Body:

{
  "language": "ta"
}

=====================================================
*/

router.post(
  "/:id/translations/auto",
  async (req, res) => {
    try {
      const {
        language,
      } = req.body;

      /*
      -------------------------------------------------
      VALIDATION
      -------------------------------------------------
      */

      if (!language) {
        return res.status(400).json({
          message:
            "Language is required.",
        });
      }

      if (language === "en") {
        return res.json({
          message:
            "English is the original language.",
          language: "en",
        });
      }

      /*
      -------------------------------------------------
      FIND PRODUCT
      -------------------------------------------------
      */

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found.",
        });
      }

      /*
      -------------------------------------------------
      CHECK EXISTING TRANSLATION
      -------------------------------------------------
      */

      let existingTranslation =
        null;

      if (
        product.translations &&
        typeof product.translations.get ===
          "function"
      ) {
        existingTranslation =
          product.translations.get(
            language
          );
      }

      /*
      -------------------------------------------------
      ALREADY EXISTS
      -------------------------------------------------
      */

      if (existingTranslation) {
        return res.json({
          message:
            "Translation already exists.",
          language,
          translations:
            existingTranslation,
        });
      }

      /*
      -------------------------------------------------
      GET ORIGINAL DESCRIPTION
      -------------------------------------------------
      */

      let originalDescription =
        "";

      if (
        product.description &&
        typeof product.description ===
          "object"
      ) {
        originalDescription =
          product.description.en ||
          product.description.hi ||
          "";
      } else {
        originalDescription =
          product.description || "";
      }

      /*
      -------------------------------------------------
      BUILD TRANSLATION BATCH
      -------------------------------------------------
      */

      const texts = {};

      if (product.name) {
        texts.name =
          product.name;
      }

      if (product.category) {
        texts.category =
          product.category;
      }

      if (product.region) {
        texts.region =
          product.region;
      }

      if (originalDescription) {
        texts.description =
          originalDescription;
      }

      /*
      -------------------------------------------------
      TRANSLATE IN PARALLEL
      -------------------------------------------------
      */

      const translated =
        await translateBatch(
          texts,
          language
        );

      /*
      -------------------------------------------------
      SAVE TO MONGODB
      -------------------------------------------------
      */

      product.translations.set(
        language,
        translated
      );

      await product.save();

      /*
      -------------------------------------------------
      RESPONSE
      -------------------------------------------------
      */

      res.json({
        message:
          "Product translated and saved successfully.",
        language,
        translations:
          translated,
      });
    } catch (error) {
      console.error(
        "Automatic product translation error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to translate product.",
        error: error.message,
      });
    }
  }
);


/*
=====================================================
MANUAL SAVE TRANSLATION
=====================================================
*/

router.post(
  "/:id/translations",
  async (req, res) => {
    try {
      const {
        language,
        translations,
      } = req.body;

      if (!language) {
        return res.status(400).json({
          message:
            "Language is required.",
        });
      }

      if (
        !translations ||
        typeof translations !==
          "object"
      ) {
        return res.status(400).json({
          message:
            "Translations object is required.",
        });
      }

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found.",
        });
      }

      const existing =
        product.translations.get(
          language
        ) || {};

      const merged = {
        ...existing,
        ...translations,
      };

      product.translations.set(
        language,
        merged
      );

      await product.save();

      res.json({
        message:
          "Product translation saved successfully.",
        language,
        translations:
          merged,
      });
    } catch (error) {
      console.error(
        "Save product translation error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to save product translation.",
        error: error.message,
      });
    }
  }
);

module.exports = router;