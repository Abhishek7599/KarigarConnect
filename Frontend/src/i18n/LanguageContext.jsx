import {
  createContext,
  useContext,
  useState,
} from "react";

import translations from "./translations";

const BACKEND_URL = "http://localhost:5000";

const LanguageContext =
  createContext(null);

export function LanguageProvider({
  children,
}) {
  /*
  =====================================================
  CURRENT LANGUAGE
  =====================================================
  */

  const [language, setLanguageState] =
    useState(() => {
      return (
        localStorage.getItem(
          "karigar-language"
        ) || "en"
      );
    });

  /*
  =====================================================
  CURRENT TRANSLATIONS
  =====================================================
  */

  const [dynamicTranslations, setDynamicTranslations] =
    useState(() => {
      const savedLanguage =
        localStorage.getItem(
          "karigar-language"
        );

      if (
        savedLanguage &&
        translations[savedLanguage]
      ) {
        return translations[savedLanguage];
      }

      return translations.en;
    });

  /*
  =====================================================
  CHANGE UI LANGUAGE
  =====================================================
  */

  const setLanguage = (
    newLanguage
  ) => {
    if (
      !translations[newLanguage]
    ) {
      console.warn(
        `Language "${newLanguage}" is not available.`
      );

      return;
    }

    setLanguageState(
      newLanguage
    );

    localStorage.setItem(
      "karigar-language",
      newLanguage
    );

    /*
      UI language changes instantly
      from the local dictionary.
    */

    setDynamicTranslations(
      translations[newLanguage]
    );
  };

  /*
  =====================================================
  TRANSLATE DYNAMIC TEXT
  =====================================================

  Used for:
  - Product names
  - Product descriptions
  - AI generated text
  - Business insights
  - Marketplace descriptions
  */

  /*
=====================================================
TRANSLATE ONE DYNAMIC TEXT
=====================================================
*/

const translateDynamic = async (text) => {
  if (!text || !text.trim()) {
    return text;
  }

  if (language === "en") {
    return text;
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/translate`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          target: language,

          texts: {
            text: text,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Dynamic translation failed."
      );
    }

    return (
      data.translations?.text ||
      text
    );
  } catch (error) {
    console.error(
      "Dynamic translation error:",
      error
    );

    return text;
  }
};


/*
=====================================================
TRANSLATE MULTIPLE DYNAMIC TEXTS
=====================================================
*/

const translateDynamicBatch = async (
  texts
) => {
  /*
  -------------------------------------------------
  ENGLISH
  -------------------------------------------------
  */

  if (language === "en") {
    return texts;
  }

  /*
  -------------------------------------------------
  EMPTY OBJECT
  -------------------------------------------------
  */

  if (
    !texts ||
    Object.keys(texts).length === 0
  ) {
    return {};
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/translate`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          target: language,
          texts,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Dynamic batch translation failed."
      );
    }

    return (
      data.translations || texts
    );
  } catch (error) {
    console.error(
      "Dynamic batch translation error:",
      error
    );

    return texts;
  }
};

  /*
  =====================================================
  FINAL TRANSLATION OBJECT
  =====================================================
  */

  const t = {
    ...translations.en,
    ...dynamicTranslations,
  };

  /*
  =====================================================
  PROVIDER
  =====================================================
  */

  return (
    <LanguageContext.Provider
  value={{
    language,
    setLanguage,
    t,
    translateDynamic,
    translateDynamicBatch,
    translationLoading: false,
  }}
>
      {children}
    </LanguageContext.Provider>
  );
}

/*
=====================================================
HOOK
=====================================================
*/

export function useLanguage() {
  const context =
    useContext(
      LanguageContext
    );

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}