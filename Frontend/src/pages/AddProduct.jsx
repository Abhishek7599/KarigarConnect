
import {
  useEffect,
  useRef,
  useState,
} from "react";

import "./AddProduct.css";

import {
  useLanguage,
} from "../i18n/LanguageContext";

const BACKEND_URL =
  "http://localhost:5000";

const ARTISAN_ID =
  "6aa7d975f3c555e19062b4cd";

/*
=====================================================
INDIAN VOICE LANGUAGES
=====================================================
*/

const VOICE_LANGUAGES = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    speechCode: "en-IN",
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिंदी",
    speechCode: "hi-IN",
  },
  {
    code: "bn",
    label: "Bengali",
    nativeLabel: "বাংলা",
    speechCode: "bn-IN",
  },
  {
    code: "ta",
    label: "Tamil",
    nativeLabel: "தமிழ்",
    speechCode: "ta-IN",
  },
  {
    code: "te",
    label: "Telugu",
    nativeLabel: "తెలుగు",
    speechCode: "te-IN",
  },
  {
    code: "mr",
    label: "Marathi",
    nativeLabel: "मराठी",
    speechCode: "mr-IN",
  },
  {
    code: "gu",
    label: "Gujarati",
    nativeLabel: "ગુજરાતી",
    speechCode: "gu-IN",
  },
  {
    code: "kn",
    label: "Kannada",
    nativeLabel: "ಕನ್ನಡ",
    speechCode: "kn-IN",
  },
  {
    code: "ml",
    label: "Malayalam",
    nativeLabel: "മലയാളം",
    speechCode: "ml-IN",
  },
  {
    code: "pa",
    label: "Punjabi",
    nativeLabel: "ਪੰਜਾਬੀ",
    speechCode: "pa-IN",
  },
];

function AddProduct({
  onNavigate,
}) {
  const {
    t,
    language,
    setLanguage,
  } = useLanguage();

  /*
  =====================================================
  FORM STATE
  =====================================================
  */

  const [formData, setFormData] =
    useState({
      name: "",
      category: "",

      descriptionEn: "",
      descriptionHi: "",
      descriptionSelected: "",

      material: "",
      color: "",
      craftType: "",
      craftTechnique: "",
      region: "",
      dimensions: "",
      productionTimeDays: "",
      costPrice: "",
      sellingPrice: "",
      stock: "",
      status: "draft",
    });

  const [photoDraft, setPhotoDraft] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("karigarconnect-photoshoot-draft") || "[]");
      if (Array.isArray(saved)) setPhotoDraft(saved);
    } catch { localStorage.removeItem("karigarconnect-photoshoot-draft"); }
  }, []);

  const [loading, setLoading] =
    useState(false);

  const [voiceLoading, setVoiceLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [isRecording, setIsRecording] =
    useState(false);

  const [recordingSeconds, setRecordingSeconds] =
    useState(0);

  const mediaRecorderRef =
    useRef(null);

  const audioChunksRef =
    useRef([]);

  const timerRef =
    useRef(null);

  /*
  =====================================================
  LANGUAGE HELPERS
  =====================================================
  */

  const isHindi =
    language === "hi";

  const selectedVoiceLanguage =
    VOICE_LANGUAGES.find(
      (item) =>
        item.code === language
    ) || VOICE_LANGUAGES[0];

  const voiceLang =
    selectedVoiceLanguage.speechCode;

  /*
  =====================================================
  UI TRANSLATIONS
  =====================================================
  */

  const ui = {
    productCreator:
      t.addProductCreator ||
      (isHindi
        ? "AI उत्पाद निर्माता"
        : "AI PRODUCT CREATOR"),

    aiReady:
      t.aiReady ||
      (isHindi
        ? "AI तैयार"
        : "AI Ready"),

    turnCraftInto:
      t.turnCraftInto ||
      (isHindi
        ? "अपनी कला को बदलें"
        : "Turn your craft into"),

    digitalProduct:
      t.digitalProduct ||
      (isHindi
        ? "एक डिजिटल उत्पाद में।"
        : "a digital product."),

    heroDescription:
      t.addProductHeroDescription ||
      (isHindi
        ? "स्वाभाविक रूप से बोलें। KarigarConnect आपकी भाषा समझता है, लिस्टिंग तैयार करता है और उसे ऑनलाइन बेचने के लिए तैयार करने में मदद करता है।"
        : "Just speak naturally. KarigarConnect understands your language, prepares the listing and helps you get it ready to sell online."),

    backProducts:
      t.backProducts ||
      (isHindi
        ? "उत्पाद"
        : "Products"),

    yourAiAssistant:
      t.yourAiAssistant ||
      (isHindi
        ? "आपका AI सहायक"
        : "YOUR AI ASSISTANT"),

    tellProduct:
      t.tellProduct ||
      (isHindi
        ? "अपने उत्पाद के बारे में बताएं।"
        : "Tell us about your product."),

    noForms:
      t.noForms ||
      (isHindi
        ? "कोई फॉर्म नहीं। जटिल टाइपिंग नहीं। बस KarigarConnect से बात करें।"
        : "No forms. No complicated typing. Just talk to KarigarConnect."),

    voiceExample:
      t.voiceExample ||
      "Yeh Banarasi saree hai, pure silk ki hai, red aur golden color hai. Varanasi mein bani hai...",

    startSpeaking:
      t.startSpeaking ||
      (isHindi
        ? "बोलना शुरू करें"
        : "Start speaking"),

    startSpeakingHelp:
      t.startSpeakingHelp ||
      (isHindi
        ? "टैप करें और अपने उत्पाद के बारे में बताएं"
        : "Tap and tell us about your product"),

    listening:
      t.listening ||
      (isHindi
        ? "सुन रहा है..."
        : "Listening..."),

    tapToFinish:
      t.tapToFinish ||
      (isHindi
        ? "समाप्त करने के लिए टैप करें"
        : "Tap to finish"),

    stop:
      t.stop ||
      (isHindi
        ? "रोकें"
        : "Stop"),

    understandingYou:
      t.understandingYou ||
      (isHindi
        ? "KarigarConnect आपको समझ रहा है"
        : "KarigarConnect is understanding you"),

    extractingInfo:
      t.extractingInfo ||
      (isHindi
        ? "आपके उत्पाद की जानकारी निकाली जा रही है..."
        : "Extracting your product information..."),

    howItWorks:
      t.howItWorks ||
      (isHindi
        ? "यह कैसे काम करता है"
        : "HOW IT WORKS"),

    fromVoice:
      t.fromVoice ||
      (isHindi
        ? "आवाज़ से तैयार उत्पाद तक"
        : "From voice to ready-to-sell"),

    youSpeak:
      t.youSpeak ||
      (isHindi
        ? "आप बोलते हैं"
        : "You speak"),

    youSpeakDescription:
      t.youSpeakDescription ||
      (isHindi
        ? "अपनी भाषा में स्वाभाविक रूप से अपनी कला के बारे में बताएं।"
        : "Describe your craft naturally in your own language."),

    aiUnderstands:
      t.aiUnderstands ||
      (isHindi
        ? "AI समझता है"
        : "AI understands"),

    aiUnderstandsDescription:
      t.aiUnderstandsDescription ||
      (isHindi
        ? "महत्वपूर्ण उत्पाद जानकारी अपने आप निकाली जाती है।"
        : "Important product information is extracted automatically."),

    yourListing:
      t.yourListing ||
      (isHindi
        ? "आपकी लिस्टिंग"
        : "Your listing"),

    yourListingDescription:
      t.yourListingDescription ||
      (isHindi
        ? "जानकारी की समीक्षा करें और अपना डिजिटल उत्पाद बनाएं।"
        : "Review the details and create your digital product."),

    somethingWentWrong:
      t.somethingWentWrong ||
      (isHindi
        ? "कुछ गलत हो गया"
        : "Something went wrong"),

    productDetailsReady:
      t.productDetailsReady ||
      (isHindi
        ? "आपके उत्पाद की जानकारी समीक्षा के लिए तैयार है।"
        : "Your product details are ready to review."),

    reviewEdit:
      t.reviewEdit ||
      (isHindi
        ? "समीक्षा और संपादन"
        : "REVIEW & EDIT"),

    yourProductDetails:
      t.yourProductDetails ||
      (isHindi
        ? "आपके उत्पाद की जानकारी"
        : "Your product details"),

    aiFilled:
      t.aiFilled ||
      (isHindi
        ? "AI द्वारा भरी गई जानकारी को सहेजने से पहले संपादित किया जा सकता है।"
        : "AI-filled information can be edited before saving."),

    editable:
      t.editable ||
      (isHindi
        ? "संपादन योग्य"
        : "Editable"),

    basicInformation:
      t.basicInformation ||
      (isHindi
        ? "मूल जानकारी"
        : "Basic Information"),

    coreDetails:
      t.coreDetails ||
      (isHindi
        ? "आपके उत्पाद की मुख्य जानकारी।"
        : "Core details of your product."),

    storyDescription:
      t.storyDescription ||
      (isHindi
        ? "कहानी और विवरण"
        : "Story & Description"),

    storyDescriptionHelp:
      t.storyDescriptionHelp ||
      (isHindi
        ? "अपने उत्पाद को आसानी से खोजने और समझने योग्य बनाएं।"
        : "Make your product easy to discover and understand."),

    englishDescription:
      t.englishDescription ||
      (isHindi
        ? "अंग्रेज़ी विवरण"
        : "English Description"),

    hindiDescription:
      t.hindiDescription ||
      (isHindi
        ? "हिंदी विवरण"
        : "Hindi Description"),

    selectedLanguageDescription:
      t.selectedLanguageDescription ||
      (isHindi
        ? "चयनित भाषा का विवरण"
        : "Selected Language Description"),

    selectedLanguageDescriptionHelp:
      t.selectedLanguageDescriptionHelp ||
      (isHindi
        ? "AI द्वारा आपकी चुनी गई भाषा में तैयार किया गया विवरण।"
        : "AI-generated description in your selected language."),

    pricingInventory:
      t.pricingInventory ||
      (isHindi
        ? "कीमत और स्टॉक"
        : "Pricing & Inventory"),

    pricingInventoryHelp:
      t.pricingInventoryHelp ||
      (isHindi
        ? "अपनी लिस्टिंग के लिए आवश्यक संख्याएं तय करें।"
        : "Set the numbers that control your listing."),

    productionTime:
      t.productionTime ||
      (isHindi
        ? "उत्पादन समय"
        : "Production Time"),

    days:
      t.days ||
      (isHindi
        ? "दिन"
        : "days"),

    status:
      t.status ||
      (isHindi
        ? "स्थिति"
        : "Status"),

    draft:
      t.draft ||
      (isHindi
        ? "ड्राफ्ट"
        : "Draft"),

    published:
      t.publishedStatus ||
      (isHindi
        ? "प्रकाशित"
        : "Published"),

    comingNext:
      t.comingNext ||
      (isHindi
        ? "आगे आने वाला फीचर"
        : "COMING NEXT"),

    createProfessionalPhotos:
      t.createProfessionalPhotos ||
      (isHindi
        ? "AI से प्रोफेशनल उत्पाद फोटो बनाएं"
        : "Create professional product photos with AI"),

    photoFeatureDescription:
      t.photoFeatureDescription ||
      (isHindi
        ? "आपके उत्पाद की जानकारी तैयार होने के बाद, KarigarConnect एक वास्तविक उत्पाद फोटो को मार्केटप्लेस-तैयार तस्वीरों में बदलने में मदद करेगा।"
        : "After your product details are ready, KarigarConnect will help transform one real product photo into marketplace-ready images."),

    aiPhotos:
      t.aiPhotos ||
      (isHindi
        ? "AI फोटो"
        : "AI Photos"),

    createProduct:
      t.createProduct ||
      (isHindi
        ? "उत्पाद बनाएं"
        : "Create Product"),

    creatingProduct:
      t.creatingProduct ||
      (isHindi
        ? "उत्पाद बनाया जा रहा है..."
        : "Creating Product..."),

    cancel:
      t.cancelProduct ||
      t.cancel ||
      (isHindi
        ? "रद्द करें"
        : "Cancel"),
  };

  /*
  =====================================================
  CLEANUP
  =====================================================
  */

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(
          timerRef.current
        );
      }

      if (
        mediaRecorderRef.current?.state ===
        "recording"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  /*
  =====================================================
  RESTORE AI PRICING DATA
  =====================================================
  */

  useEffect(() => {
    const suggestedPrice =
      localStorage.getItem(
        "karigar-suggested-price"
      );

    const savedPricingProduct =
      localStorage.getItem(
        "karigar-pricing-product"
      );

    if (
      !suggestedPrice &&
      !savedPricingProduct
    ) {
      return;
    }

    setFormData(
      (previous) => {
        let updatedForm = {
          ...previous,
        };

        if (suggestedPrice) {
          updatedForm.sellingPrice =
            suggestedPrice;
        }

        if (savedPricingProduct) {
          try {
            const pricingProduct =
              JSON.parse(
                savedPricingProduct
              );

            updatedForm = {
              ...updatedForm,

              name:
                pricingProduct.name ||
                updatedForm.name,

              category:
                pricingProduct.category ||
                updatedForm.category,

              material:
                pricingProduct.material ||
                updatedForm.material,

              color:
                pricingProduct.color ||
                updatedForm.color,

              craftType:
                pricingProduct.craftType ||
                updatedForm.craftType,

              craftTechnique:
                pricingProduct.craftTechnique ||
                updatedForm.craftTechnique,

              region:
                pricingProduct.region ||
                updatedForm.region,

              productionTimeDays:
                pricingProduct.productionTimeDays ||
                updatedForm.productionTimeDays,

              costPrice:
                pricingProduct.costPrice ||
                updatedForm.costPrice,

              stock:
                pricingProduct.stock ||
                updatedForm.stock,
            };
          } catch (
            storageError
          ) {
            console.error(
              "Could not restore pricing product:",
              storageError
            );
          }
        }

        return updatedForm;
      }
    );

    localStorage.removeItem(
      "karigar-suggested-price"
    );

    localStorage.removeItem(
      "karigar-pricing-product"
    );
  }, []);

  /*
  =====================================================
  RESTORE VOICE INPUT DATA
  =====================================================
  */

  useEffect(() => {
    const savedVoiceProduct =
      sessionStorage.getItem(
        "karigar-voice-product"
      );

    if (!savedVoiceProduct) {
      return;
    }

    try {
      const voiceProduct =
        JSON.parse(
          savedVoiceProduct
        );

      setFormData(
        (previous) => {
          const materialValue =
            Array.isArray(
              voiceProduct.material
            )
              ? voiceProduct.material.join(
                  ", "
                )
              : voiceProduct.material ||
                previous.material;

          const colorValue =
            Array.isArray(
              voiceProduct.color
            )
              ? voiceProduct.color.join(
                  ", "
                )
              : voiceProduct.color ||
                previous.color;

          return {
            ...previous,

            name:
              voiceProduct.name ||
              previous.name,

            category:
              voiceProduct.category ||
              previous.category,

            descriptionEn:
              voiceProduct.descriptionEn ||
              previous.descriptionEn,

            descriptionHi:
              voiceProduct.descriptionHi ||
              previous.descriptionHi,

            descriptionSelected:
              voiceProduct.descriptionSelected ||
              previous.descriptionSelected,

            material:
              materialValue,

            color:
              colorValue,

            craftType:
              voiceProduct.craftType ||
              previous.craftType,

            craftTechnique:
              voiceProduct.craftTechnique ||
              previous.craftTechnique,

            region:
              voiceProduct.region ||
              previous.region,

            dimensions:
              voiceProduct.dimensions ||
              previous.dimensions,

            productionTimeDays:
              voiceProduct.productionTimeDays ||
              previous.productionTimeDays,

            costPrice:
              voiceProduct.costPrice ||
              previous.costPrice,

            sellingPrice:
              voiceProduct.sellingPrice ||
              previous.sellingPrice,

            stock:
              voiceProduct.stock ||
              previous.stock,
          };
        }
      );

      setMessage(
        isHindi
          ? "वॉइस से मिली जानकारी आपके उत्पाद फॉर्म में भर दी गई है।"
          : "Voice-generated product information has been added to the form."
      );

      sessionStorage.removeItem(
        "karigar-voice-product"
      );
    } catch (
      voiceStorageError
    ) {
      console.error(
        "Voice product restore error:",
        voiceStorageError
      );

      sessionStorage.removeItem(
        "karigar-voice-product"
      );
    }
  }, []);

  /*
  =====================================================
  FORM CHANGE
  =====================================================
  */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /*
  =====================================================
  START RECORDING
  =====================================================
  */

  const startRecording =
    async () => {
      try {
        setError("");
        setMessage("");

        if (
          !navigator.mediaDevices?.getUserMedia
        ) {
          throw new Error(
            isHindi
              ? "आपका ब्राउज़र माइक्रोफ़ोन रिकॉर्डिंग को सपोर्ट नहीं करता।"
              : "Your browser does not support microphone recording."
          );
        }

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
            }
          );

        let recorder;

        try {
          recorder =
            new MediaRecorder(
              stream,
              {
                mimeType:
                  "audio/webm",
              }
            );
        } catch {
          recorder =
            new MediaRecorder(
              stream
            );
        }

        audioChunksRef.current =
          [];

        recorder.ondataavailable =
          (event) => {
            if (
              event.data.size > 0
            ) {
              audioChunksRef.current.push(
                event.data
              );
            }
          };

        recorder.onstop =
          async () => {
            try {
              stream
                .getTracks()
                .forEach(
                  (track) =>
                    track.stop()
                );

              const audioBlob =
                new Blob(
                  audioChunksRef.current,
                  {
                    type:
                      recorder.mimeType ||
                      "audio/webm",
                  }
                );

              await sendAudioToAI(
                audioBlob
              );
            } catch (
              err
            ) {
              console.error(
                "Audio processing error:",
                err
              );

              setError(
                err.message ||
                  (isHindi
                    ? "ऑडियो प्रोसेस करने में समस्या हुई।"
                    : "There was a problem processing the audio.")
              );

              setVoiceLoading(
                false
              );
            }
          };

        mediaRecorderRef.current =
          recorder;

        recorder.start();

        setIsRecording(true);
        setRecordingSeconds(0);

        timerRef.current =
          setInterval(() => {
            setRecordingSeconds(
              (seconds) =>
                seconds + 1
            );
          }, 1000);
      } catch (
        err
      ) {
        console.error(
          "Microphone error:",
          err
        );

        setError(
          err.message ||
            (isHindi
              ? "माइक्रोफ़ोन एक्सेस नहीं किया जा सका।"
              : "Could not access your microphone.")
        );
      }
    };

  /*
  =====================================================
  STOP RECORDING
  =====================================================
  */

  const stopRecording =
    () => {
      if (
        !mediaRecorderRef.current
      ) {
        return;
      }

      if (
        mediaRecorderRef.current
          .state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }

      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(
          timerRef.current
        );

        timerRef.current = null;
      }
    };

  /*
  =====================================================
  SEND AUDIO TO AI
  =====================================================
  */

  const sendAudioToAI =
    async (audioBlob) => {
      try {
        setVoiceLoading(true);
        setError("");
        setMessage("");

        const formDataToSend =
          new FormData();

        formDataToSend.append(
          "audio",
          audioBlob,
          "product-voice.webm"
        );

        formDataToSend.append(
          "language",
          language
        );

        const response =
          await fetch(
            `${BACKEND_URL}/api/voice/product`,
            {
              method: "POST",
              body: formDataToSend,
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              (isHindi
                ? "AI ऑडियो को समझ नहीं सका।"
                : "AI could not understand the audio.")
          );
        }

        const product =
          data.product;

        if (!product) {
          throw new Error(
            isHindi
              ? "AI से कोई उत्पाद जानकारी नहीं मिली।"
              : "No product information was returned by AI."
          );
        }

        setFormData(
          (previous) => ({
            ...previous,

            name:
              product.name ||
              previous.name,

            category:
              product.category ||
              previous.category,

            descriptionEn:
              product.descriptionEn ||
              previous.descriptionEn,

            descriptionHi:
              product.descriptionHi ||
              previous.descriptionHi,

            descriptionSelected:
              product.descriptionSelected ||
              previous.descriptionSelected,

            material:
              Array.isArray(
                product.material
              )
                ? product.material.join(
                    ", "
                  )
                : product.material ||
                  previous.material,

            color:
              Array.isArray(
                product.color
              )
                ? product.color.join(
                    ", "
                  )
                : product.color ||
                  previous.color,

            craftType:
              product.craftType ||
              previous.craftType,

            craftTechnique:
              product.craftTechnique ||
              previous.craftTechnique,

            region:
              product.region ||
              previous.region,

            dimensions:
              product.dimensions ||
              previous.dimensions,

            productionTimeDays:
              product.productionTimeDays ??
              previous.productionTimeDays,

            costPrice:
              product.costPrice ??
              previous.costPrice,

            sellingPrice:
              product.sellingPrice ??
              previous.sellingPrice,

            stock:
              product.stock ??
              previous.stock,
          })
        );

        setMessage(
          isHindi
            ? "AI ने आपके उत्पाद को समझकर जानकारी भर दी है।"
            : "AI understood your product and filled the details."
        );
      } catch (
        err
      ) {
        console.error(
          "Voice AI error:",
          err
        );

        setError(
          err.message ||
            (isHindi
              ? "आपकी आवाज़ को समझने में समस्या हुई।"
              : "Something went wrong while understanding your voice.")
        );
      } finally {
        setVoiceLoading(false);
      }
    };

  /*
  =====================================================
  SAVE PRODUCT TRANSLATION
  =====================================================
  */

  const saveSelectedLanguageTranslation =
    async (
      createdProductId
    ) => {
      if (
        !createdProductId ||
        language === "en" ||
        language === "hi"
      ) {
        return;
      }

      const selectedDescription =
        formData.descriptionSelected.trim();

      if (!selectedDescription) {
        return;
      }

      try {
        const translationResponse =
          await fetch(
            `${BACKEND_URL}/api/products/${createdProductId}/translations`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                language,

                translations: {
                  name:
                    formData.name.trim(),

                  category:
                    formData.category.trim(),

                  region:
                    formData.region.trim(),

                  description:
                    selectedDescription,
                },
              }),
            }
          );

        const translationData =
          await translationResponse.json();

        if (
          !translationResponse.ok
        ) {
          throw new Error(
            translationData.message ||
              "Failed to save product translation."
          );
        }

        console.log(
          `Product translation saved for ${language}.`
        );
      } catch (
        translationError
      ) {
        console.error(
          "Translation save error:",
          translationError
        );
      }
    };

  /*
  =====================================================
  SUBMIT
  =====================================================
  */

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      setLoading(true);
      setMessage("");
      setError("");

      try {
        const payload = {
          artisan:
            ARTISAN_ID,

          name:
            formData.name.trim(),

          category:
            formData.category.trim(),

          description: {
            en:
              formData.descriptionEn.trim(),

            hi:
              formData.descriptionHi.trim(),
          },

          material:
            formData.material
              .split(",")
              .map(
                (item) =>
                  item.trim()
              )
              .filter(Boolean),

          color:
            formData.color
              .split(",")
              .map(
                (item) =>
                  item.trim()
              )
              .filter(Boolean),

          craftType:
            formData.craftType.trim(),

          craftTechnique:
            formData.craftTechnique.trim(),

          region:
            formData.region.trim(),

          dimensions:
            formData.dimensions.trim(),

          productionTimeDays:
            Number(
              formData.productionTimeDays
            ) || 0,

          costPrice:
            Number(
              formData.costPrice
            ) || 0,

          sellingPrice:
            Number(
              formData.sellingPrice
            ) || 0,

          stock:
            Number(
              formData.stock
            ) || 0,

          status:
            formData.status,
        };

        const generatedPhotos = Object.fromEntries(
          photoDraft.map((photo) => [
            `${photo.style}Image`,
            photo.imageUrl.replace(BACKEND_URL, ""),
          ])
        );

        /*
        Basic validation
        */

        if (
          !payload.name ||
          !payload.category
        ) {
          throw new Error(
            isHindi
              ? "उत्पाद का नाम और श्रेणी आवश्यक है।"
              : "Product name and category are required."
          );
        }

        /*
        Create product
        */

        const response =
          await fetch(
            `${BACKEND_URL}/api/products/create`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({ ...payload, ...generatedPhotos, image: generatedPhotos.studioImage || payload.image }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              (isHindi
                ? "उत्पाद बनाने में समस्या हुई।"
                : "Failed to create product.")
          );
        }

        /*
        Extract created product ID
        */

        const createdProductId =
          data.product?._id ||
          data.product?.id ||
          data._id ||
          data.id;

        /*
        Save selected-language
        description to MongoDB.
        */

        await saveSelectedLanguageTranslation(
          createdProductId
        );

        setMessage(
          isHindi
            ? "उत्पाद सफलतापूर्वक जोड़ दिया गया!"
            : "Product added successfully!"
        );

        setTimeout(() => {
          onNavigate(
            "products"
          );
        }, 1000);
      } catch (
        err
      ) {
        console.error(
          "Create product error:",
          err
        );

        setError(
          err.message ||
            (isHindi
              ? "कुछ गलत हो गया।"
              : "Something went wrong.")
        );
      } finally {
        setLoading(false);
      }
    };

  /*
  =====================================================
  RECORDING TIME
  =====================================================
  */

  const formatRecordingTime =
    () => {
      const minutes =
        Math.floor(
          recordingSeconds / 60
        );

      const seconds =
        recordingSeconds % 60;

      return `${String(
        minutes
      ).padStart(
        2,
        "0"
      )}:${String(
        seconds
      ).padStart(
        2,
        "0"
      )}`;
    };

  /*
  =====================================================
  RENDER
  =====================================================
  */

  return (
    <div className="add-product-page">

      {/* ================= HERO ================= */}

      <section className="add-product-hero">

        <div className="add-product-hero-main">

          <div className="add-product-label-row">

            <span className="add-product-label">
              {
                ui.productCreator
              }
            </span>

            <span className="ai-live-badge">

              <span></span>

              {ui.aiReady}

            </span>

          </div>

          <h1>
            {ui.turnCraftInto}

            <span>
              {" "}
              {ui.digitalProduct}
            </span>
          </h1>

          <p>
            {
              ui.heroDescription
            }
          </p>

        </div>

        <button
          type="button"
          className="back-button"
          onClick={() =>
            onNavigate(
              "products"
            )
          }
        >
          ← {ui.backProducts}
        </button>

      </section>

      {/* ================= AI VOICE ================= */}

      <section className="voice-ai-card">

        <div className="voice-glow voice-glow-one"></div>
        <div className="voice-glow voice-glow-two"></div>

        <div className="voice-ai-header">

          <div>

            <div className="voice-ai-label">
              {
                ui.yourAiAssistant
              }
            </div>

            <h2>
              {
                ui.tellProduct
              }
            </h2>

            <p>
              {ui.noForms}
            </p>

          </div>

          <div className="voice-ai-orb">
            <span>✦</span>
          </div>

        </div>

        {/* ================= VOICE EXAMPLE ================= */}

        <div className="voice-example-box">

          <span className="quote-mark">
            “
          </span>

          <p>
            {
              ui.voiceExample
            }
          </p>

          <span className="quote-mark quote-end">
            ”
          </span>

        </div>

        {/* ================= VOICE ACTION ================= */}

        <div className="voice-main-action">

          {!isRecording &&
            !voiceLoading && (
              <button
                type="button"
                className="voice-record-button"
                onClick={
                  startRecording
                }
              >

                <span className="voice-mic-large">
                  🎙️
                </span>

                <span className="voice-record-text">

                  <strong>
                    {
                      ui.startSpeaking
                    }
                  </strong>

                  <small>
                    {
                      ui.startSpeakingHelp
                    }
                  </small>

                </span>

                <span className="voice-action-arrow">
                  →
                </span>

              </button>
            )}

          {isRecording && (
            <button
              type="button"
              className="voice-recording-button"
              onClick={
                stopRecording
              }
            >

              <span className="recording-icon-wrap">

                <span className="recording-bars">

                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>

                </span>

              </span>

              <span className="voice-record-text">

                <strong>
                  {ui.listening}
                </strong>

                <small>
                  {
                    formatRecordingTime()
                  }

                  {" · "}

                  {
                    ui.tapToFinish
                  }
                </small>

              </span>

              <span className="stop-label">
                {ui.stop}
              </span>

            </button>
          )}

          {voiceLoading && (
            <div className="voice-ai-processing">

              <div className="voice-spinner"></div>

              <div>

                <strong>
                  {
                    ui.understandingYou
                  }
                </strong>

                <small>
                  {
                    ui.extractingInfo
                  }
                </small>

              </div>

            </div>
          )}

        </div>

        {/* ================= MULTILINGUAL VOICE ================= */}

        <div className="voice-bottom">

          <div className="voice-language-selector">

            <div className="voice-language-title">

              <span>
                🌐
              </span>

              <span>
                {isHindi
                  ? "आवाज़ की भाषा"
                  : "Voice language"}
              </span>

            </div>

            <select
              value={language}
              onChange={(
                event
              ) =>
                setLanguage(
                  event.target.value
                )
              }
              disabled={
                isRecording ||
                voiceLoading
              }
              className="voice-language-select"
            >

              {VOICE_LANGUAGES.map(
                (
                  voiceLanguage
                ) => (
                  <option
                    key={
                      voiceLanguage.code
                    }
                    value={
                      voiceLanguage.code
                    }
                  >
                    {
                      voiceLanguage.nativeLabel
                    }{" "}
                    —{" "}
                    {
                      voiceLanguage.label
                    }
                  </option>
                )
              )}

            </select>

            <div
              className="voice-language-info"
              style={{
                color:
                  "#A79A85",
                fontSize:
                  "11px",
                marginTop:
                  "4px",
              }}
            >
              {
                selectedVoiceLanguage.nativeLabel
              }

              {" · "}

              {voiceLang}

            </div>

          </div>

          <div className="voice-trust">

            🔒{" "}

            {t.voicePrivacy ||
              (isHindi
                ? "आपकी आवाज़ का उपयोग केवल इस उत्पाद के लिए किया जाता है"
                : "Your voice is used only for this product")}

          </div>

        </div>

      </section>

      {/* ================= AI FLOW ================= */}

      <section className="ai-flow-section">

        <div className="ai-flow-heading">

          <span>
            {ui.howItWorks}
          </span>

          <h2>
            {ui.fromVoice}
          </h2>

        </div>

        <div className="ai-flow-grid">

          <div className="ai-flow-step">

            <div className="ai-flow-number">
              01
            </div>

            <div className="ai-flow-icon">
              🎙️
            </div>

            <h3>
              {ui.youSpeak}
            </h3>

            <p>
              {
                ui.youSpeakDescription
              }
            </p>

          </div>

          <div className="ai-flow-line"></div>

          <div className="ai-flow-step">

            <div className="ai-flow-number">
              02
            </div>

            <div className="ai-flow-icon">
              🧠
            </div>

            <h3>
              {
                ui.aiUnderstands
              }
            </h3>

            <p>
              {
                ui.aiUnderstandsDescription
              }
            </p>

          </div>

          <div className="ai-flow-line"></div>

          <div className="ai-flow-step">

            <div className="ai-flow-number">
              03
            </div>

            <div className="ai-flow-icon">
              ✨
            </div>

            <h3>
              {ui.yourListing}
            </h3>

            <p>
              {
                ui.yourListingDescription
              }
            </p>

          </div>

        </div>

      </section>

      {/* ================= MESSAGES ================= */}

      {error && (
        <div className="form-message error">

          <strong>
            {
              ui.somethingWentWrong
            }
          </strong>

          <p>
            {error}
          </p>

        </div>
      )}

      {message && (
        <div className="form-message success">

          <strong>
            ✨ {message}
          </strong>

          <p>
            {
              ui.productDetailsReady
            }
          </p>

        </div>
      )}

      {/* ================= PRODUCT FORM ================= */}

      <section className="manual-section">

        <div className="manual-section-heading">

          <div>

            <span>
              {ui.reviewEdit}
            </span>

            <h2>
              {
                ui.yourProductDetails
              }
            </h2>

            <p>
              {ui.aiFilled}
            </p>

          </div>

          <div className="edit-badge">
            ✏️ {ui.editable}
          </div>

        </div>

        <form
          className="add-product-form"
          onSubmit={
            handleSubmit
          }
        >

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <section className="form-card">

            <div className="form-card-heading">

              <div>

                <span>
                  01
                </span>

                <h2>
                  {
                    ui.basicInformation
                  }
                </h2>

                <p>
                  {
                    ui.coreDetails
                  }
                </p>

              </div>

              <div className="form-icon">
                🧵
              </div>

            </div>

            <div className="form-grid">

              <div className="form-field full-width">

                <label htmlFor="name">
                  {t.productName ||
                    "Product Name"}{" "}
                  *
                </label>

                <input
                  id="name"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    t.productNamePlaceholder ||
                    (isHindi
                      ? "जैसे: हस्तनिर्मित बनारसी साड़ी"
                      : "e.g. Handmade Banarasi Saree")
                  }
                  required
                />

              </div>

              <div className="form-field">

                <label htmlFor="category">
                  {t.category ||
                    "Category"}{" "}
                  *
                </label>

                <input
                  id="category"
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    t.categoryPlaceholder ||
                    (isHindi
                      ? "जैसे: हस्तकरघा"
                      : "e.g. Handloom")
                  }
                  required
                />

              </div>

              <div className="form-field">

                <label htmlFor="craftType">
                  {t.craftType ||
                    "Craft Type"}
                </label>

                <input
                  id="craftType"
                  name="craftType"
                  value={
                    formData.craftType
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    t.craftTypePlaceholder ||
                    (isHindi
                      ? "जैसे: हाथ से बुनाई"
                      : "e.g. Hand weaving")
                  }
                />

              </div>

              <div className="form-field">

                <label htmlFor="material">
                  {t.material ||
                    "Material"}
                </label>

                <input
                  id="material"
                  name="material"
                  value={
                    formData.material
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    t.materialPlaceholder ||
                    (isHindi
                      ? "कपास, रेशम"
                      : "Cotton, Silk")
                  }
                />

              </div>

              <div className="form-field">

                <label htmlFor="color">
                  {t.color ||
                    "Color"}
                </label>

                <input
                  id="color"
                  name="color"
                  value={
                    formData.color
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    t.colorPlaceholder ||
                    (isHindi
                      ? "लाल, सुनहरा"
                      : "Red, Golden")
                  }
                />

              </div>

              <div className="form-field">

                <label htmlFor="craftTechnique">
                  {t.craftTechnique ||
                    "Craft Technique"}
                </label>

                <input
                  id="craftTechnique"
                  name="craftTechnique"
                  value={
                    formData.craftTechnique
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    t.craftTechniquePlaceholder ||
                    (isHindi
                      ? "जैसे: हाथ की कढ़ाई"
                      : "e.g. Hand embroidery")
                  }
                />

              </div>

              <div className="form-field">

                <label htmlFor="region">
                  {t.region ||
                    (isHindi
                      ? "क्षेत्र"
                      : "Region")}
                </label>

                <input
                  id="region"
                  name="region"
                  value={
                    formData.region
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    t.regionPlaceholder ||
                    (isHindi
                      ? "जैसे: वाराणसी"
                      : "e.g. Varanasi")
                  }
                />

              </div>

              <div className="form-field">

                <label htmlFor="dimensions">
                  {t.dimensions ||
                    "Dimensions"}
                </label>

                <input
                  id="dimensions"
                  name="dimensions"
                  value={
                    formData.dimensions
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    t.dimensionsPlaceholder ||
                    (isHindi
                      ? "जैसे: 6.2 मीटर × 1.2 मीटर"
                      : "e.g. 6.2m × 1.2m")
                  }
                />

              </div>

            </div>

          </section>

          {/* =================================================
              STORY & DESCRIPTION
          ================================================= */}

          <section className="form-card">

            <div className="form-card-heading">

              <div>

                <span>
                  02
                </span>

                <h2>
                  {
                    ui.storyDescription
                  }
                </h2>

                <p>
                  {
                    ui.storyDescriptionHelp
                  }
                </p>

              </div>

              <div className="form-icon">
                ✍️
              </div>

            </div>

            <div className="form-grid">

              <div className="form-field full-width">

                <label htmlFor="descriptionEn">
                  {
                    ui.englishDescription
                  }
                </label>

                <textarea
                  id="descriptionEn"
                  name="descriptionEn"
                  value={
                    formData.descriptionEn
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    t.englishDescriptionPlaceholder ||
                    "AI-generated English description..."
                  }
                  rows="5"
                />

              </div>

              <div className="form-field full-width">

                <label htmlFor="descriptionHi">
                  {
                    ui.hindiDescription
                  }
                </label>

                <textarea
                  id="descriptionHi"
                  name="descriptionHi"
                  value={
                    formData.descriptionHi
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    t.hindiDescriptionPlaceholder ||
                    "AI-generated Hindi description..."
                  }
                  rows="5"
                />

              </div>

              <div className="form-field full-width">

                <label htmlFor="descriptionSelected">

                  {
                    ui.selectedLanguageDescription
                  }

                  {" — "}

                  {
                    selectedVoiceLanguage.nativeLabel
                  }

                </label>

                <textarea
                  id="descriptionSelected"
                  name="descriptionSelected"
                  value={
                    formData.descriptionSelected
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    isHindi
                      ? "AI द्वारा आपकी चुनी गई भाषा में विवरण..."
                      : `AI-generated ${selectedVoiceLanguage.label} description...`
                  }
                  rows="6"
                />

                <small
                  style={{
                    display:
                      "block",
                    marginTop:
                      "7px",
                    color:
                      "#A79A85",
                    fontSize:
                      "11px",
                    lineHeight:
                      "1.5",
                  }}
                >
                  {
                    ui.selectedLanguageDescriptionHelp
                  }
                </small>

              </div>

            </div>

          </section>

          {/* =================================================
              PRICING & INVENTORY
          ================================================= */}

          <section className="form-card">

            <div className="form-card-heading">

              <div>

                <span>
                  03
                </span>

                <h2>
                  {
                    ui.pricingInventory
                  }
                </h2>

                <p>
                  {
                    ui.pricingInventoryHelp
                  }
                </p>

              </div>

              <div className="form-icon">
                💰
              </div>

            </div>

            <div className="form-grid">

              <div className="form-field">

                <label htmlFor="costPrice">
                  {t.costPrice ||
                    "Cost Price"}
                </label>

                <div className="price-input">

                  <span>
                    ₹
                  </span>

                  <input
                    id="costPrice"
                    name="costPrice"
                    type="number"
                    min="0"
                    value={
                      formData.costPrice
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={
                      t.costPricePlaceholder ||
                      "2500"
                    }
                  />

                </div>

              </div>

              <div className="form-field">

                <label htmlFor="sellingPrice">
                  {t.sellingPrice ||
                    "Selling Price"}
                </label>

                <div className="price-input recommended-price">

                  <span>
                    ₹
                  </span>

                  <input
                    id="sellingPrice"
                    name="sellingPrice"
                    type="number"
                    min="0"
                    value={
                      formData.sellingPrice
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={
                      t.sellingPricePlaceholder ||
                      "4200"
                    }
                  />

                </div>

              </div>

              <div className="form-field">

                <label htmlFor="stock">
                  {t.stock ||
                    "Stock"}
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={
                    formData.stock
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    t.stockPlaceholder ||
                    "5"
                  }
                />

              </div>

              <div className="form-field">

                <label htmlFor="productionTimeDays">
                  {
                    ui.productionTime
                  }
                </label>

                <div className="input-with-suffix">

                  <input
                    id="productionTimeDays"
                    name="productionTimeDays"
                    type="number"
                    min="0"
                    value={
                      formData.productionTimeDays
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={
                      t.productionDaysPlaceholder ||
                      "10"
                    }
                  />

                  <span>
                    {ui.days}
                  </span>

                </div>

              </div>

              <div className="form-field">

                <label htmlFor="status">
                  {ui.status}
                </label>

                <select
                  id="status"
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="draft">
                    {ui.draft}
                  </option>

                  <option value="published">
                    {ui.published}
                  </option>

                </select>

              </div>

            </div>

          </section>

          {/* =================================================
              FUTURE AI PHOTO
          ================================================= */}

          <section className="photo-ai-preview">

            <div className="photo-ai-icon">
              📸
            </div>

            <div>

              <span>
                {ui.comingNext}
              </span>

              <h3>
                {
                  ui.createProfessionalPhotos
                }
              </h3>

              <p>
                {
                  ui.photoFeatureDescription
                }
              </p>

            </div>

            <span className="coming-soon-pill">
              {ui.aiPhotos}
            </span>

          </section>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                onNavigate(
                  "products"
                )
              }
              disabled={loading}
            >
              {
                ui.cancel
              }
            </button>

            <button
              type="submit"
              className="save-product-button"
              disabled={loading}
            >
              {loading
                ? ui.creatingProduct
                : `✓ ${ui.createProduct}`}
            </button>

          </div>

        </form>

      </section>

    </div>
  );
}

export default AddProduct;
