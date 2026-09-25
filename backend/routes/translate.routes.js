const express = require("express");

const router = express.Router();

/*
=====================================================
TRANSLATE MULTIPLE TEXTS
=====================================================
*/

router.post("/", async (req, res) => {
  try {
    const {
      texts,
      target,
    } = req.body;

    /*
    -------------------------------------------------
    VALIDATION
    -------------------------------------------------
    */

    if (!texts || typeof texts !== "object") {
      return res.status(400).json({
        message:
          "texts object is required.",
      });
    }

    if (!target) {
      return res.status(400).json({
        message:
          "Target language is required.",
      });
    }

    /*
    -------------------------------------------------
    TRANSLATE ALL TEXTS
    -------------------------------------------------
    */

    const translated = {};

    for (const [key, text] of Object.entries(
      texts
    )) {
      if (!text) {
        translated[key] = "";
        continue;
      }

      try {
        const url =
          `https://api.mymemory.translated.net/get` +
          `?q=${encodeURIComponent(text)}` +
          `&langpair=en|${encodeURIComponent(
            target
          )}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Translation API returned ${response.status}`
          );
        }

        const data =
          await response.json();

        if (
          data.responseStatus !== 200
        ) {
          throw new Error(
            data.responseDetails ||
              "Translation failed."
          );
        }

        translated[key] =
          data.responseData.translatedText;
      } catch (error) {
        console.error(
          `Translation failed for "${key}":`,
          error.message
        );

        /*
          Keep original text if one
          translation fails.
        */

        translated[key] = text;
      }
    }

    /*
    -------------------------------------------------
    RESPONSE
    -------------------------------------------------
    */

    res.json({
      targetLanguage: target,
      translations: translated,
    });
  } catch (error) {
    console.error(
      "Translation error:",
      error.message
    );

    res.status(500).json({
      message:
        "Translation failed.",
      error: error.message,
    });
  }
});

module.exports = router;