import {
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";

import { useLanguage } from "../i18n/LanguageContext";
import "./Photoshoot.css";

const BACKEND_URL =
  "http://localhost:5000";

const styles = [
  {
    id: "studio",
    title: "Studio",
    subtitle: "Professional product photo",
    icon: "🏢",
    available: true,
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    subtitle: "In-context product photo",
    icon: "🏡",
    available: true,
  },
  {
    id: "model",
    title: "Model",
    subtitle: "Product in use / worn",
    icon: "🧍",
    available: true,
  },
  {
    id: "closeup",
    title: "Close-up",
    subtitle: "Craft details",
    icon: "🔍",
    available: true,
  },
];

const categories = [
  {
    value: "Handloom",
    label: "Handloom / Textile",
  },
  {
    value: "Pottery",
    label: "Pottery / Ceramic",
  },
  {
    value: "Jewellery",
    label: "Jewellery",
  },
  {
    value: "Fashion",
    label: "Fashion / Bags",
  },
  {
    value: "Woodcraft",
    label: "Woodcraft",
  },
  {
    value: "Home Decor",
    label: "Home Decor",
  },
  {
    value: "generic",
    label: "Other",
  },
];

const PROGRESS_STEP_IDS = [
  "background",
  "crop",
  "lighting",
  "enhancement",
  "upscale",
];

/*
=====================================================
PHOTOSHOOT PAGE TRANSLATIONS
10 INDIAN LANGUAGES
=====================================================
*/

const PHOTOSHOOT_TRANSLATIONS = {
  en: {
    eyebrow: "PROFESSIONAL PRODUCT PHOTOS",
    heroTitleBefore: "Turn one raw photo into",
    heroTitleHighlight: "marketplace-ready photography.",
    heroDescription:
      "Upload your handmade product photo and let KarigarConnect prepare it for professional online selling.",

    step1Label: "STEP 1",
    uploadHeadingProduct: "Product photo",
    uploadHeadingGeneric: "Upload your product",
    loadingProductTitle: "Loading product photo...",
    loadingProductDescription: "Getting your saved image from the catalog.",
    previewLabelSaved: "Saved product photo",
    previewLabelOriginal: "Original photo",
    uploadTitle: "Upload your product photo",
    uploadHint: "JPG, PNG or WEBP · Maximum 5MB",
    choosePhoto: "Choose Photo",
    removePhoto: "Remove photo",

    step2Label: "STEP 2",
    styleHeading: "Choose photo style",
    styleHelp: "Select how your product should be professionally presented.",
    comingSoon: "Coming soon",

    categoryFieldLabel: "Product Category",
    categoryFieldHelp: "Used to choose an automatic category-appropriate visual background.",
    categoryAiTag: "✨ AI",
    categoryAutoLabel: "Product category",
    categoryAutoHelp: "Automatically taken from your saved product.",

    featureBgRemoval: "✓ Automatic background removal",
    featureComposition: "✓ Dynamic composition",
    featureLighting: "✓ Professional lighting",
    featureEnhancement: "✓ 4× enhancement",

    generateButton: "✨ Create all 4 product photos",
    generateButtonBusy: "Processing photo...",
    privacyNote: "Your photo is processed through the KarigarConnect local image engine.",

    errorHeading: "Photo processing failed",
    tryAgain: "Try Again",
    genericGenerateError: "Unable to create all product photos.",
    selectImageAlert: "Please select an image file.",
    imageTooLargeAlert: "Image must be smaller than 5MB.",
    uploadFirstAlert: "Please upload a product photo first.",
    loadSavedImageError: "Could not load the saved product image. Please upload it manually.",

    step3Label: "STEP 3",
    resultsHeading: "Your professional photo",
    resultsHelp: "Enhanced, professionally composed and upscaled for online selling.",
    readyBadge: "✓ Ready",
    downloadTitle: "Download image",
    continueManual: "Continue with manual details",
    continueVoice: "Continue with voice input",

    modalEngineLabel: "KARIGARCONNECT PHOTO ENGINE",
    modalHeadingBefore: "Creating your",
    modalHeadingAfter: "photo",
    modalDescription:
      "Your product is being cleaned, enhanced, professionally composed and upscaled for online selling.",
    modalFirstRunNote: "The first run may take longer while the image-processing models initialize.",
    productUpdateFailedHeading: "Product update failed",
    processingFailedHeading: "Processing failed",

    initialProgressMessage: "Preparing your professional photo...",
    waitingMessage: "Waiting...",
    stepTitles: {
      background: "Background removal",
      crop: "Dynamic crop",
      lighting: "Professional lighting",
      enhancement: "Image enhancement",
      upscale: "4× super-resolution",
    },

    stepEnhancingUploaded: "Enhancing the uploaded image…",
    creatingAllFormats: "Enhancing your photo and creating all four marketplace formats…",
    sourceEnhanced: "Source image enhanced.",
    compositionsCreated: "Four product compositions created.",
    lightingAppliedAll: "Professional lighting applied.",
    detailEnhancedAll: "Product detail enhanced.",
    allImagesReady: "All high-quality images are ready.",
    allPhotosReadyCelebration: "🎉 Studio, Lifestyle, Model and Close-up photos are ready!",

    noProductSelected: "No product selected.",
    unsupportedStyle: "Unsupported photo style.",
    updateFailedGeneric: "Failed to update product.",
    photoCreatedNotSaved: "Photo created, but product was not updated.",

    styles: {
      studio: { title: "Studio", subtitle: "Professional product photo" },
      lifestyle: { title: "Lifestyle", subtitle: "In-context product photo" },
      model: { title: "Model", subtitle: "Product in use / worn" },
      closeup: { title: "Close-up", subtitle: "Craft details" },
    },

    categories: {
      Handloom: "Handloom / Textile",
      Pottery: "Pottery / Ceramic",
      Jewellery: "Jewellery",
      Fashion: "Fashion / Bags",
      Woodcraft: "Woodcraft",
      "Home Decor": "Home Decor",
      generic: "Other",
    },

    creatingStyleImage: (styleLabel, n) => `Creating ${styleLabel} image (${n} of 4)…`,
    savingStylePhoto: (styleLabel) => `Saving ${styleLabel} photo to your product...`,
    savedStylePhoto: (styleLabel) => `✓ ${styleLabel} photo saved to your product`,
    resultTitle: (styleLabel) => `${styleLabel} Product Photo`,
    resultCaption: (resolution) =>
      `Background removed · Dynamic crop · Lighting · 4× enhanced · ${resolution}`,
  },

  hi: {
    eyebrow: "पेशेवर उत्पाद तस्वीरें",
    heroTitleBefore: "एक साधारण फोटो को बदलें",
    heroTitleHighlight: "मार्केटप्लेस-तैयार फोटोग्राफी में।",
    heroDescription:
      "अपने हस्तनिर्मित उत्पाद की फोटो अपलोड करें और KarigarConnect को इसे पेशेवर ऑनलाइन बिक्री के लिए तैयार करने दें।",

    step1Label: "चरण 1",
    uploadHeadingProduct: "उत्पाद फोटो",
    uploadHeadingGeneric: "अपना उत्पाद अपलोड करें",
    loadingProductTitle: "उत्पाद फोटो लोड हो रही है...",
    loadingProductDescription: "आपकी सहेजी गई छवि कैटलॉग से लाई जा रही है।",
    previewLabelSaved: "सहेजी गई उत्पाद फोटो",
    previewLabelOriginal: "मूल फोटो",
    uploadTitle: "अपने उत्पाद की फोटो अपलोड करें",
    uploadHint: "JPG, PNG या WEBP · अधिकतम 5MB",
    choosePhoto: "फोटो चुनें",
    removePhoto: "फोटो हटाएं",

    step2Label: "चरण 2",
    styleHeading: "फोटो शैली चुनें",
    styleHelp: "चुनें कि आपका उत्पाद पेशेवर रूप से कैसे प्रस्तुत किया जाए।",
    comingSoon: "जल्द आ रहा है",

    categoryFieldLabel: "उत्पाद श्रेणी",
    categoryFieldHelp: "स्वचालित रूप से श्रेणी-उपयुक्त दृश्य पृष्ठभूमि चुनने के लिए उपयोग किया जाता है।",
    categoryAiTag: "✨ AI",
    categoryAutoLabel: "उत्पाद श्रेणी",
    categoryAutoHelp: "आपके सहेजे गए उत्पाद से स्वचालित रूप से ली गई।",

    featureBgRemoval: "✓ स्वचालित पृष्ठभूमि हटाना",
    featureComposition: "✓ डायनामिक कंपोज़िशन",
    featureLighting: "✓ पेशेवर लाइटिंग",
    featureEnhancement: "✓ 4× एन्हांसमेंट",

    generateButton: "✨ सभी 4 उत्पाद फोटो बनाएं",
    generateButtonBusy: "फोटो प्रोसेस हो रही है...",
    privacyNote: "आपकी फोटो KarigarConnect के लोकल इमेज इंजन से प्रोसेस होती है।",

    errorHeading: "फोटो प्रोसेसिंग विफल",
    tryAgain: "पुनः प्रयास करें",
    genericGenerateError: "सभी उत्पाद फोटो नहीं बनाई जा सकीं।",
    selectImageAlert: "कृपया एक इमेज फ़ाइल चुनें।",
    imageTooLargeAlert: "इमेज 5MB से छोटी होनी चाहिए।",
    uploadFirstAlert: "कृपया पहले उत्पाद की फोटो अपलोड करें।",
    loadSavedImageError: "सहेजी गई उत्पाद फोटो लोड नहीं हो सकी। कृपया इसे मैन्युअल रूप से अपलोड करें।",

    step3Label: "चरण 3",
    resultsHeading: "आपकी पेशेवर फोटो",
    resultsHelp: "ऑनलाइन बिक्री के लिए एन्हांस्ड, पेशेवर रूप से कंपोज़्ड और अपस्केल्ड।",
    readyBadge: "✓ तैयार",
    downloadTitle: "इमेज डाउनलोड करें",
    continueManual: "मैन्युअल विवरण के साथ जारी रखें",
    continueVoice: "वॉइस इनपुट के साथ जारी रखें",

    modalEngineLabel: "KARIGARCONNECT फोटो इंजन",
    modalHeadingBefore: "आपकी",
    modalHeadingAfter: "फोटो बनाई जा रही है",
    modalDescription:
      "आपके उत्पाद को साफ, एन्हांस, पेशेवर रूप से कंपोज़ और ऑनलाइन बिक्री के लिए अपस्केल किया जा रहा है।",
    modalFirstRunNote: "पहली बार इमेज-प्रोसेसिंग मॉडल शुरू होने में थोड़ा अधिक समय लग सकता है।",
    productUpdateFailedHeading: "उत्पाद अपडेट विफल",
    processingFailedHeading: "प्रोसेसिंग विफल",

    initialProgressMessage: "आपकी पेशेवर फोटो तैयार की जा रही है...",
    waitingMessage: "प्रतीक्षा हो रही है...",
    stepTitles: {
      background: "पृष्ठभूमि हटाना",
      crop: "डायनामिक क्रॉप",
      lighting: "पेशेवर लाइटिंग",
      enhancement: "इमेज एन्हांसमेंट",
      upscale: "4× सुपर-रिज़ॉल्यूशन",
    },

    stepEnhancingUploaded: "अपलोड की गई इमेज को एन्हांस किया जा रहा है…",
    creatingAllFormats: "आपकी फोटो को एन्हांस करके सभी चार मार्केटप्लेस फॉर्मेट बनाए जा रहे हैं…",
    sourceEnhanced: "मूल इमेज एन्हांस हो गई।",
    compositionsCreated: "चार उत्पाद कंपोज़िशन बनाई गईं।",
    lightingAppliedAll: "पेशेवर लाइटिंग लगाई गई।",
    detailEnhancedAll: "उत्पाद विवरण एन्हांस किया गया।",
    allImagesReady: "सभी उच्च-गुणवत्ता वाली इमेज तैयार हैं।",
    allPhotosReadyCelebration: "🎉 Studio, Lifestyle, Model और Close-up फोटो तैयार हैं!",

    noProductSelected: "कोई उत्पाद चयनित नहीं है।",
    unsupportedStyle: "असमर्थित फोटो शैली।",
    updateFailedGeneric: "उत्पाद अपडेट करने में विफल।",
    photoCreatedNotSaved: "फोटो बन गई, लेकिन उत्पाद अपडेट नहीं हुआ।",

    styles: {
      studio: { title: "स्टूडियो", subtitle: "पेशेवर उत्पाद फोटो" },
      lifestyle: { title: "लाइफस्टाइल", subtitle: "संदर्भ में उत्पाद फोटो" },
      model: { title: "मॉडल", subtitle: "उपयोग / पहने हुए उत्पाद" },
      closeup: { title: "क्लोज़-अप", subtitle: "शिल्प विवरण" },
    },

    categories: {
      Handloom: "हथकरघा / वस्त्र",
      Pottery: "मिट्टी के बर्तन / सिरेमिक",
      Jewellery: "आभूषण",
      Fashion: "फैशन / बैग",
      Woodcraft: "लकड़ी शिल्प",
      "Home Decor": "होम डेकोर",
      generic: "अन्य",
    },

    creatingStyleImage: (styleLabel, n) => `${styleLabel} इमेज बनाई जा रही है (${n} में से 4)…`,
    savingStylePhoto: (styleLabel) => `${styleLabel} फोटो आपके उत्पाद में सहेजी जा रही है...`,
    savedStylePhoto: (styleLabel) => `✓ ${styleLabel} फोटो आपके उत्पाद में सहेजी गई`,
    resultTitle: (styleLabel) => `${styleLabel} उत्पाद फोटो`,
    resultCaption: (resolution) =>
      `पृष्ठभूमि हटाई गई · डायनामिक क्रॉप · लाइटिंग · 4× एन्हांस्ड · ${resolution}`,
  },

  bn: {
    eyebrow: "পেশাদার পণ্যের ছবি",
    heroTitleBefore: "একটি সাধারণ ছবিকে রূপান্তর করুন",
    heroTitleHighlight: "মার্কেটপ্লেস-রেডি ফটোগ্রাফিতে।",
    heroDescription:
      "আপনার হস্তনির্মিত পণ্যের ছবি আপলোড করুন এবং KarigarConnect-কে পেশাদার অনলাইন বিক্রয়ের জন্য প্রস্তুত করতে দিন।",

    step1Label: "ধাপ ১",
    uploadHeadingProduct: "পণ্যের ছবি",
    uploadHeadingGeneric: "আপনার পণ্য আপলোড করুন",
    loadingProductTitle: "পণ্যের ছবি লোড হচ্ছে...",
    loadingProductDescription: "আপনার সংরক্ষিত ছবি ক্যাটালগ থেকে আনা হচ্ছে।",
    previewLabelSaved: "সংরক্ষিত পণ্যের ছবি",
    previewLabelOriginal: "মূল ছবি",
    uploadTitle: "আপনার পণ্যের ছবি আপলোড করুন",
    uploadHint: "JPG, PNG বা WEBP · সর্বোচ্চ 5MB",
    choosePhoto: "ছবি নির্বাচন করুন",
    removePhoto: "ছবি সরান",

    step2Label: "ধাপ ২",
    styleHeading: "ছবির স্টাইল বেছে নিন",
    styleHelp: "আপনার পণ্য কীভাবে পেশাদারভাবে উপস্থাপন করা হবে তা নির্বাচন করুন।",
    comingSoon: "শীঘ্রই আসছে",

    categoryFieldLabel: "পণ্যের বিভাগ",
    categoryFieldHelp: "স্বয়ংক্রিয়ভাবে বিভাগ-উপযুক্ত ভিজ্যুয়াল ব্যাকগ্রাউন্ড বেছে নিতে ব্যবহৃত হয়।",
    categoryAiTag: "✨ AI",
    categoryAutoLabel: "পণ্যের বিভাগ",
    categoryAutoHelp: "আপনার সংরক্ষিত পণ্য থেকে স্বয়ংক্রিয়ভাবে নেওয়া।",

    featureBgRemoval: "✓ স্বয়ংক্রিয় ব্যাকগ্রাউন্ড অপসারণ",
    featureComposition: "✓ ডাইনামিক কম্পোজিশন",
    featureLighting: "✓ পেশাদার লাইটিং",
    featureEnhancement: "✓ 4× এনহান্সমেন্ট",

    generateButton: "✨ সবগুলো 4টি পণ্যের ছবি তৈরি করুন",
    generateButtonBusy: "ছবি প্রসেস হচ্ছে...",
    privacyNote: "আপনার ছবি KarigarConnect-এর লোকাল ইমেজ ইঞ্জিনের মাধ্যমে প্রসেস করা হয়।",

    errorHeading: "ছবি প্রসেসিং ব্যর্থ হয়েছে",
    tryAgain: "আবার চেষ্টা করুন",
    genericGenerateError: "সবগুলো পণ্যের ছবি তৈরি করা যায়নি।",
    selectImageAlert: "অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন।",
    imageTooLargeAlert: "ছবি অবশ্যই 5MB এর চেয়ে ছোট হতে হবে।",
    uploadFirstAlert: "অনুগ্রহ করে প্রথমে পণ্যের ছবি আপলোড করুন।",
    loadSavedImageError: "সংরক্ষিত পণ্যের ছবি লোড করা যায়নি। অনুগ্রহ করে ম্যানুয়ালি আপলোড করুন।",

    step3Label: "ধাপ ৩",
    resultsHeading: "আপনার পেশাদার ছবি",
    resultsHelp: "অনলাইন বিক্রয়ের জন্য এনহান্সড, পেশাদারভাবে কম্পোজড এবং আপস্কেলড।",
    readyBadge: "✓ প্রস্তুত",
    downloadTitle: "ছবি ডাউনলোড করুন",
    continueManual: "ম্যানুয়াল বিবরণ দিয়ে এগিয়ে যান",
    continueVoice: "ভয়েস ইনপুট দিয়ে এগিয়ে যান",

    modalEngineLabel: "KARIGARCONNECT ফটো ইঞ্জিন",
    modalHeadingBefore: "আপনার",
    modalHeadingAfter: "ছবি তৈরি হচ্ছে",
    modalDescription:
      "আপনার পণ্যকে পরিষ্কার, এনহান্স, পেশাদারভাবে কম্পোজ এবং অনলাইন বিক্রয়ের জন্য আপস্কেল করা হচ্ছে।",
    modalFirstRunNote: "ইমেজ-প্রসেসিং মডেলগুলো চালু হতে প্রথমবার একটু বেশি সময় লাগতে পারে।",
    productUpdateFailedHeading: "পণ্য আপডেট ব্যর্থ হয়েছে",
    processingFailedHeading: "প্রসেসিং ব্যর্থ হয়েছে",

    initialProgressMessage: "আপনার পেশাদার ছবি প্রস্তুত করা হচ্ছে...",
    waitingMessage: "অপেক্ষা করা হচ্ছে...",
    stepTitles: {
      background: "ব্যাকগ্রাউন্ড অপসারণ",
      crop: "ডাইনামিক ক্রপ",
      lighting: "পেশাদার লাইটিং",
      enhancement: "ছবি এনহান্সমেন্ট",
      upscale: "4× সুপার-রেজোলিউশন",
    },

    stepEnhancingUploaded: "আপলোড করা ছবি এনহান্স করা হচ্ছে…",
    creatingAllFormats: "আপনার ছবি এনহান্স করে সবগুলো চারটি মার্কেটপ্লেস ফরম্যাট তৈরি করা হচ্ছে…",
    sourceEnhanced: "মূল ছবি এনহান্স হয়েছে।",
    compositionsCreated: "চারটি পণ্যের কম্পোজিশন তৈরি হয়েছে।",
    lightingAppliedAll: "পেশাদার লাইটিং প্রয়োগ করা হয়েছে।",
    detailEnhancedAll: "পণ্যের বিবরণ এনহান্স করা হয়েছে।",
    allImagesReady: "সবগুলো উচ্চ-মানের ছবি প্রস্তুত।",
    allPhotosReadyCelebration: "🎉 Studio, Lifestyle, Model ও Close-up ছবি প্রস্তুত!",

    noProductSelected: "কোনো পণ্য নির্বাচিত হয়নি।",
    unsupportedStyle: "অসমর্থিত ছবির স্টাইল।",
    updateFailedGeneric: "পণ্য আপডেট করতে ব্যর্থ হয়েছে।",
    photoCreatedNotSaved: "ছবি তৈরি হয়েছে, কিন্তু পণ্য আপডেট হয়নি।",

    styles: {
      studio: { title: "স্টুডিও", subtitle: "পেশাদার পণ্যের ছবি" },
      lifestyle: { title: "লাইফস্টাইল", subtitle: "প্রাসঙ্গিক পণ্যের ছবি" },
      model: { title: "মডেল", subtitle: "ব্যবহৃত / পরিহিত পণ্য" },
      closeup: { title: "ক্লোজ-আপ", subtitle: "কারুকাজের বিবরণ" },
    },

    categories: {
      Handloom: "হ্যান্ডলুম / টেক্সটাইল",
      Pottery: "মৃৎশিল্প / সিরামিক",
      Jewellery: "গয়না",
      Fashion: "ফ্যাশন / ব্যাগ",
      Woodcraft: "কাঠের কারুকাজ",
      "Home Decor": "হোম ডেকোর",
      generic: "অন্যান্য",
    },

    creatingStyleImage: (styleLabel, n) => `${styleLabel} ছবি তৈরি হচ্ছে (৪টির মধ্যে ${n})…`,
    savingStylePhoto: (styleLabel) => `${styleLabel} ছবি আপনার পণ্যে সংরক্ষণ করা হচ্ছে...`,
    savedStylePhoto: (styleLabel) => `✓ ${styleLabel} ছবি আপনার পণ্যে সংরক্ষিত হয়েছে`,
    resultTitle: (styleLabel) => `${styleLabel} পণ্যের ছবি`,
    resultCaption: (resolution) =>
      `ব্যাকগ্রাউন্ড অপসারিত · ডাইনামিক ক্রপ · লাইটিং · 4× এনহান্সড · ${resolution}`,
  },

  ta: {
    eyebrow: "தொழில்முறை தயாரிப்பு புகைப்படங்கள்",
    heroTitleBefore: "ஒரு எளிய புகைப்படத்தை மாற்றுங்கள்",
    heroTitleHighlight: "மார்க்கெட்பிளேஸுக்குத் தயாரான புகைப்படமாக.",
    heroDescription:
      "உங்கள் கைவினைப் பொருளின் புகைப்படத்தை பதிவேற்றி, தொழில்முறை ஆன்லைன் விற்பனைக்கு KarigarConnect தயார் செய்ய அனுமதிக்கவும்.",

    step1Label: "படி 1",
    uploadHeadingProduct: "தயாரிப்பு புகைப்படம்",
    uploadHeadingGeneric: "உங்கள் தயாரிப்பை பதிவேற்றவும்",
    loadingProductTitle: "தயாரிப்பு புகைப்படம் ஏற்றப்படுகிறது...",
    loadingProductDescription: "உங்கள் சேமிக்கப்பட்ட படம் பட்டியலிலிருந்து பெறப்படுகிறது.",
    previewLabelSaved: "சேமிக்கப்பட்ட தயாரிப்பு புகைப்படம்",
    previewLabelOriginal: "மூல புகைப்படம்",
    uploadTitle: "உங்கள் தயாரிப்பு புகைப்படத்தை பதிவேற்றவும்",
    uploadHint: "JPG, PNG அல்லது WEBP · அதிகபட்சம் 5MB",
    choosePhoto: "புகைப்படத்தை தேர்ந்தெடு",
    removePhoto: "புகைப்படத்தை நீக்கு",

    step2Label: "படி 2",
    styleHeading: "புகைப்பட பாணியை தேர்ந்தெடுக்கவும்",
    styleHelp: "உங்கள் தயாரிப்பு எவ்வாறு தொழில்முறையாக வழங்கப்பட வேண்டும் எனத் தேர்ந்தெடுக்கவும்.",
    comingSoon: "விரைவில் வருகிறது",

    categoryFieldLabel: "தயாரிப்பு வகை",
    categoryFieldHelp: "தானியங்கி வகைக்கு ஏற்ற காட்சி பின்னணியைத் தேர்ந்தெடுக்க பயன்படுகிறது.",
    categoryAiTag: "✨ AI",
    categoryAutoLabel: "தயாரிப்பு வகை",
    categoryAutoHelp: "உங்கள் சேமிக்கப்பட்ட தயாரிப்பிலிருந்து தானாகவே எடுக்கப்பட்டது.",

    featureBgRemoval: "✓ தானியங்கி பின்னணி நீக்கம்",
    featureComposition: "✓ டைனமிக் கம்போசிஷன்",
    featureLighting: "✓ தொழில்முறை லைட்டிங்",
    featureEnhancement: "✓ 4× மேம்பாடு",

    generateButton: "✨ அனைத்து 4 தயாரிப்பு புகைப்படங்களையும் உருவாக்கு",
    generateButtonBusy: "புகைப்படம் செயலாக்கப்படுகிறது...",
    privacyNote: "உங்கள் புகைப்படம் KarigarConnect-இன் லோக்கல் இமேஜ் இன்ஜின் மூலம் செயலாக்கப்படுகிறது.",

    errorHeading: "புகைப்பட செயலாக்கம் தோல்வியடைந்தது",
    tryAgain: "மீண்டும் முயற்சிக்கவும்",
    genericGenerateError: "அனைத்து தயாரிப்பு புகைப்படங்களையும் உருவாக்க முடியவில்லை.",
    selectImageAlert: "தயவுசெய்து ஒரு படக் கோப்பைத் தேர்ந்தெடுக்கவும்.",
    imageTooLargeAlert: "படம் 5MB-க்கும் சிறியதாக இருக்க வேண்டும்.",
    uploadFirstAlert: "தயவுசெய்து முதலில் தயாரிப்பு புகைப்படத்தை பதிவேற்றவும்.",
    loadSavedImageError: "சேமிக்கப்பட்ட தயாரிப்பு படத்தை ஏற்ற முடியவில்லை. தயவுசெய்து கைமுறையாக பதிவேற்றவும்.",

    step3Label: "படி 3",
    resultsHeading: "உங்கள் தொழில்முறை புகைப்படம்",
    resultsHelp: "ஆன்லைன் விற்பனைக்காக மேம்படுத்தப்பட்டு, தொழில்முறையாக கம்போஸ் செய்யப்பட்டு அப்ஸ்கேல் செய்யப்பட்டது.",
    readyBadge: "✓ தயார்",
    downloadTitle: "படத்தை பதிவிறக்கு",
    continueManual: "கைமுறை விவரங்களுடன் தொடரவும்",
    continueVoice: "குரல் உள்ளீட்டுடன் தொடரவும்",

    modalEngineLabel: "KARIGARCONNECT போட்டோ இன்ஜின்",
    modalHeadingBefore: "உங்கள்",
    modalHeadingAfter: "புகைப்படம் உருவாக்கப்படுகிறது",
    modalDescription:
      "உங்கள் தயாரிப்பு சுத்தப்படுத்தப்பட்டு, மேம்படுத்தப்பட்டு, தொழில்முறையாக கம்போஸ் செய்யப்பட்டு ஆன்லைன் விற்பனைக்காக அப்ஸ்கேல் செய்யப்படுகிறது.",
    modalFirstRunNote: "இமேஜ்-செயலாக்க மாடல்கள் தொடங்க முதல் முறை சற்று அதிக நேரம் எடுக்கலாம்.",
    productUpdateFailedHeading: "தயாரிப்பு புதுப்பிப்பு தோல்வியடைந்தது",
    processingFailedHeading: "செயலாக்கம் தோல்வியடைந்தது",

    initialProgressMessage: "உங்கள் தொழில்முறை புகைப்படம் தயார் செய்யப்படுகிறது...",
    waitingMessage: "காத்திருக்கிறது...",
    stepTitles: {
      background: "பின்னணி நீக்கம்",
      crop: "டைனமிக் க்ராப்",
      lighting: "தொழில்முறை லைட்டிங்",
      enhancement: "பட மேம்பாடு",
      upscale: "4× சூப்பர்-ரெசல்யூஷன்",
    },

    stepEnhancingUploaded: "பதிவேற்றப்பட்ட படம் மேம்படுத்தப்படுகிறது…",
    creatingAllFormats: "உங்கள் புகைப்படத்தை மேம்படுத்தி நான்கு மார்க்கெட்பிளேஸ் வடிவங்களும் உருவாக்கப்படுகின்றன…",
    sourceEnhanced: "மூலப் படம் மேம்படுத்தப்பட்டது.",
    compositionsCreated: "நான்கு தயாரிப்பு கம்போசிஷன்கள் உருவாக்கப்பட்டன.",
    lightingAppliedAll: "தொழில்முறை லைட்டிங் பயன்படுத்தப்பட்டது.",
    detailEnhancedAll: "தயாரிப்பு விவரம் மேம்படுத்தப்பட்டது.",
    allImagesReady: "அனைத்து உயர்தர படங்களும் தயார்.",
    allPhotosReadyCelebration: "🎉 Studio, Lifestyle, Model மற்றும் Close-up புகைப்படங்கள் தயார்!",

    noProductSelected: "எந்த தயாரிப்பும் தேர்ந்தெடுக்கப்படவில்லை.",
    unsupportedStyle: "ஆதரிக்கப்படாத புகைப்பட பாணி.",
    updateFailedGeneric: "தயாரிப்பை புதுப்பிக்க முடியவில்லை.",
    photoCreatedNotSaved: "புகைப்படம் உருவாக்கப்பட்டது, ஆனால் தயாரிப்பு புதுப்பிக்கப்படவில்லை.",

    styles: {
      studio: { title: "ஸ்டூடியோ", subtitle: "தொழில்முறை தயாரிப்பு புகைப்படம்" },
      lifestyle: { title: "லைஃப்ஸ்டைல்", subtitle: "சூழல் சார்ந்த தயாரிப்பு புகைப்படம்" },
      model: { title: "மாடல்", subtitle: "பயன்பாட்டில் / அணிந்திருக்கும் தயாரிப்பு" },
      closeup: { title: "க்ளோஸ்-அப்", subtitle: "கைவினை விவரங்கள்" },
    },

    categories: {
      Handloom: "கைத்தறி / துணி",
      Pottery: "மட்பாண்டம் / செராமிக்",
      Jewellery: "நகைகள்",
      Fashion: "ஃபேஷன் / பைகள்",
      Woodcraft: "மரவேலை",
      "Home Decor": "வீட்டு அலங்காரம்",
      generic: "மற்றவை",
    },

    creatingStyleImage: (styleLabel, n) => `${styleLabel} படம் உருவாக்கப்படுகிறது (4-இல் ${n})…`,
    savingStylePhoto: (styleLabel) => `${styleLabel} புகைப்படம் உங்கள் தயாரிப்பில் சேமிக்கப்படுகிறது...`,
    savedStylePhoto: (styleLabel) => `✓ ${styleLabel} புகைப்படம் உங்கள் தயாரிப்பில் சேமிக்கப்பட்டது`,
    resultTitle: (styleLabel) => `${styleLabel} தயாரிப்பு புகைப்படம்`,
    resultCaption: (resolution) =>
      `பின்னணி நீக்கப்பட்டது · டைனமிக் க்ராப் · லைட்டிங் · 4× மேம்படுத்தப்பட்டது · ${resolution}`,
  },

  te: {
    eyebrow: "ప్రొఫెషనల్ ప్రొడక్ట్ ఫోటోలు",
    heroTitleBefore: "ఒక సాధారణ ఫోటోను మార్చండి",
    heroTitleHighlight: "మార్కెట్‌ప్లేస్‌కు సిద్ధమైన ఫోటోగ్రఫీగా.",
    heroDescription:
      "మీ చేతితో తయారుచేసిన ఉత్పత్తి ఫోటోను అప్‌లోడ్ చేయండి, KarigarConnect దీన్ని ప్రొఫెషనల్ ఆన్‌లైన్ అమ్మకానికి సిద్ధం చేయనివ్వండి.",

    step1Label: "దశ 1",
    uploadHeadingProduct: "ఉత్పత్తి ఫోటో",
    uploadHeadingGeneric: "మీ ఉత్పత్తిని అప్‌లోడ్ చేయండి",
    loadingProductTitle: "ఉత్పత్తి ఫోటో లోడ్ అవుతోంది...",
    loadingProductDescription: "మీ సేవ్ చేసిన చిత్రం కేటలాగ్ నుండి తీసుకురాబడుతోంది.",
    previewLabelSaved: "సేవ్ చేసిన ఉత్పత్తి ఫోటో",
    previewLabelOriginal: "అసలు ఫోటో",
    uploadTitle: "మీ ఉత్పత్తి ఫోటోను అప్‌లోడ్ చేయండి",
    uploadHint: "JPG, PNG లేదా WEBP · గరిష్టంగా 5MB",
    choosePhoto: "ఫోటో ఎంచుకోండి",
    removePhoto: "ఫోటో తీసివేయండి",

    step2Label: "దశ 2",
    styleHeading: "ఫోటో శైలిని ఎంచుకోండి",
    styleHelp: "మీ ఉత్పత్తి ఎలా ప్రొఫెషనల్‌గా ప్రదర్శించాలో ఎంచుకోండి.",
    comingSoon: "త్వరలో వస్తుంది",

    categoryFieldLabel: "ఉత్పత్తి వర్గం",
    categoryFieldHelp: "వర్గానికి తగిన దృశ్య నేపథ్యాన్ని స్వయంచాలకంగా ఎంచుకోవడానికి ఉపయోగించబడుతుంది.",
    categoryAiTag: "✨ AI",
    categoryAutoLabel: "ఉత్పత్తి వర్గం",
    categoryAutoHelp: "మీ సేవ్ చేసిన ఉత్పత్తి నుండి స్వయంచాలకంగా తీసుకోబడింది.",

    featureBgRemoval: "✓ స్వయంచాలక నేపథ్య తొలగింపు",
    featureComposition: "✓ డైనమిక్ కంపోజిషన్",
    featureLighting: "✓ ప్రొఫెషనల్ లైటింగ్",
    featureEnhancement: "✓ 4× మెరుగుదల",

    generateButton: "✨ అన్ని 4 ఉత్పత్తి ఫోటోలను సృష్టించండి",
    generateButtonBusy: "ఫోటో ప్రాసెస్ అవుతోంది...",
    privacyNote: "మీ ఫోటో KarigarConnect లోకల్ ఇమేజ్ ఇంజిన్ ద్వారా ప్రాసెస్ చేయబడుతుంది.",

    errorHeading: "ఫోటో ప్రాసెసింగ్ విఫలమైంది",
    tryAgain: "మళ్లీ ప్రయత్నించండి",
    genericGenerateError: "అన్ని ఉత్పత్తి ఫోటోలను సృష్టించలేకపోయాము.",
    selectImageAlert: "దయచేసి ఒక ఇమేజ్ ఫైల్‌ను ఎంచుకోండి.",
    imageTooLargeAlert: "ఇమేజ్ 5MB కంటే చిన్నదిగా ఉండాలి.",
    uploadFirstAlert: "దయచేసి ముందుగా ఉత్పత్తి ఫోటోను అప్‌లోడ్ చేయండి.",
    loadSavedImageError: "సేవ్ చేసిన ఉత్పత్తి చిత్రాన్ని లోడ్ చేయలేకపోయాము. దయచేసి మాన్యువల్‌గా అప్‌లోడ్ చేయండి.",

    step3Label: "దశ 3",
    resultsHeading: "మీ ప్రొఫెషనల్ ఫోటో",
    resultsHelp: "ఆన్‌లైన్ అమ్మకానికి మెరుగుపరచబడి, ప్రొఫెషనల్‌గా కంపోజ్ చేయబడి, అప్‌స్కేల్ చేయబడింది.",
    readyBadge: "✓ సిద్ధం",
    downloadTitle: "ఇమేజ్ డౌన్‌లోడ్ చేయండి",
    continueManual: "మాన్యువల్ వివరాలతో కొనసాగించండి",
    continueVoice: "వాయిస్ ఇన్‌పుట్‌తో కొనసాగించండి",

    modalEngineLabel: "KARIGARCONNECT ఫోటో ఇంజిన్",
    modalHeadingBefore: "మీ",
    modalHeadingAfter: "ఫోటో సృష్టించబడుతోంది",
    modalDescription:
      "మీ ఉత్పత్తిని శుభ్రం చేసి, మెరుగుపరిచి, ప్రొఫెషనల్‌గా కంపోజ్ చేసి, ఆన్‌లైన్ అమ్మకానికి అప్‌స్కేల్ చేస్తున్నాము.",
    modalFirstRunNote: "ఇమేజ్-ప్రాసెసింగ్ మోడల్స్ ప్రారంభం కావడానికి మొదటిసారి కొంచెం ఎక్కువ సమయం పట్టవచ్చు.",
    productUpdateFailedHeading: "ఉత్పత్తి అప్‌డేట్ విఫలమైంది",
    processingFailedHeading: "ప్రాసెసింగ్ విఫలమైంది",

    initialProgressMessage: "మీ ప్రొఫెషనల్ ఫోటో సిద్ధం చేయబడుతోంది...",
    waitingMessage: "వేచి ఉంది...",
    stepTitles: {
      background: "నేపథ్య తొలగింపు",
      crop: "డైనమిక్ క్రాప్",
      lighting: "ప్రొఫెషనల్ లైటింగ్",
      enhancement: "ఇమేజ్ మెరుగుదల",
      upscale: "4× సూపర్-రిజల్యూషన్",
    },

    stepEnhancingUploaded: "అప్‌లోడ్ చేసిన ఇమేజ్ మెరుగుపరచబడుతోంది…",
    creatingAllFormats: "మీ ఫోటోను మెరుగుపరిచి నాలుగు మార్కెట్‌ప్లేస్ ఫార్మాట్‌లను సృష్టిస్తున్నాము…",
    sourceEnhanced: "మూల ఇమేజ్ మెరుగుపరచబడింది.",
    compositionsCreated: "నాలుగు ఉత్పత్తి కంపోజిషన్‌లు సృష్టించబడ్డాయి.",
    lightingAppliedAll: "ప్రొఫెషనల్ లైటింగ్ వర్తింపజేయబడింది.",
    detailEnhancedAll: "ఉత్పత్తి వివరాలు మెరుగుపరచబడ్డాయి.",
    allImagesReady: "అన్ని అధిక-నాణ్యత ఇమేజ్‌లు సిద్ధంగా ఉన్నాయి.",
    allPhotosReadyCelebration: "🎉 Studio, Lifestyle, Model మరియు Close-up ఫోటోలు సిద్ధంగా ఉన్నాయి!",

    noProductSelected: "ఏ ఉత్పత్తి ఎంచుకోబడలేదు.",
    unsupportedStyle: "మద్దతు లేని ఫోటో శైలి.",
    updateFailedGeneric: "ఉత్పత్తిని అప్‌డేట్ చేయడంలో విఫలమైంది.",
    photoCreatedNotSaved: "ఫోటో సృష్టించబడింది, కానీ ఉత్పత్తి అప్‌డేట్ కాలేదు.",

    styles: {
      studio: { title: "స్టూడియో", subtitle: "ప్రొఫెషనల్ ఉత్పత్తి ఫోటో" },
      lifestyle: { title: "లైఫ్‌స్టైల్", subtitle: "సందర్భోచిత ఉత్పత్తి ఫోటో" },
      model: { title: "మోడల్", subtitle: "వాడుకలో / ధరించిన ఉత్పత్తి" },
      closeup: { title: "క్లోజ్-అప్", subtitle: "క్రాఫ్ట్ వివరాలు" },
    },

    categories: {
      Handloom: "చేనేత / వస్త్రం",
      Pottery: "కుండలు / సెరామిక్",
      Jewellery: "నగలు",
      Fashion: "ఫ్యాషన్ / బ్యాగులు",
      Woodcraft: "చెక్క పనితనం",
      "Home Decor": "హోమ్ డెకర్",
      generic: "ఇతరులు",
    },

    creatingStyleImage: (styleLabel, n) => `${styleLabel} ఇమేజ్ సృష్టించబడుతోంది (4లో ${n})…`,
    savingStylePhoto: (styleLabel) => `${styleLabel} ఫోటో మీ ఉత్పత్తిలో సేవ్ చేయబడుతోంది...`,
    savedStylePhoto: (styleLabel) => `✓ ${styleLabel} ఫోటో మీ ఉత్పత్తిలో సేవ్ చేయబడింది`,
    resultTitle: (styleLabel) => `${styleLabel} ఉత్పత్తి ఫోటో`,
    resultCaption: (resolution) =>
      `నేపథ్యం తీసివేయబడింది · డైనమిక్ క్రాప్ · లైటింగ్ · 4× మెరుగుపరచబడింది · ${resolution}`,
  },

  mr: {
    eyebrow: "व्यावसायिक उत्पादन फोटो",
    heroTitleBefore: "एक साधा फोटो बदला",
    heroTitleHighlight: "मार्केटप्लेस-रेडी फोटोग्राफीमध्ये.",
    heroDescription:
      "तुमच्या हस्तनिर्मित उत्पादनाचा फोटो अपलोड करा आणि KarigarConnect ला तो व्यावसायिक ऑनलाइन विक्रीसाठी तयार करू द्या.",

    step1Label: "पायरी 1",
    uploadHeadingProduct: "उत्पादन फोटो",
    uploadHeadingGeneric: "तुमचे उत्पादन अपलोड करा",
    loadingProductTitle: "उत्पादन फोटो लोड होत आहे...",
    loadingProductDescription: "तुमची जतन केलेली प्रतिमा कॅटलॉगमधून आणली जात आहे.",
    previewLabelSaved: "जतन केलेला उत्पादन फोटो",
    previewLabelOriginal: "मूळ फोटो",
    uploadTitle: "तुमच्या उत्पादनाचा फोटो अपलोड करा",
    uploadHint: "JPG, PNG किंवा WEBP · कमाल 5MB",
    choosePhoto: "फोटो निवडा",
    removePhoto: "फोटो काढा",

    step2Label: "पायरी 2",
    styleHeading: "फोटो शैली निवडा",
    styleHelp: "तुमचे उत्पादन व्यावसायिकरित्या कसे सादर करावे ते निवडा.",
    comingSoon: "लवकरच येत आहे",

    categoryFieldLabel: "उत्पादन श्रेणी",
    categoryFieldHelp: "स्वयंचलितपणे श्रेणी-योग्य दृश्य पार्श्वभूमी निवडण्यासाठी वापरले जाते.",
    categoryAiTag: "✨ AI",
    categoryAutoLabel: "उत्पादन श्रेणी",
    categoryAutoHelp: "तुमच्या जतन केलेल्या उत्पादनावरून आपोआप घेतली.",

    featureBgRemoval: "✓ स्वयंचलित पार्श्वभूमी काढणे",
    featureComposition: "✓ डायनॅमिक कंपोझिशन",
    featureLighting: "✓ व्यावसायिक लाइटिंग",
    featureEnhancement: "✓ 4× एन्हांसमेंट",

    generateButton: "✨ सर्व 4 उत्पादन फोटो तयार करा",
    generateButtonBusy: "फोटो प्रक्रिया होत आहे...",
    privacyNote: "तुमचा फोटो KarigarConnect च्या लोकल इमेज इंजिनद्वारे प्रक्रिया केला जातो.",

    errorHeading: "फोटो प्रक्रिया अयशस्वी",
    tryAgain: "पुन्हा प्रयत्न करा",
    genericGenerateError: "सर्व उत्पादन फोटो तयार करता आले नाहीत.",
    selectImageAlert: "कृपया एक इमेज फाइल निवडा.",
    imageTooLargeAlert: "इमेज 5MB पेक्षा लहान असावी.",
    uploadFirstAlert: "कृपया प्रथम उत्पादनाचा फोटो अपलोड करा.",
    loadSavedImageError: "जतन केलेली उत्पादन प्रतिमा लोड करता आली नाही. कृपया ती मॅन्युअली अपलोड करा.",

    step3Label: "पायरी 3",
    resultsHeading: "तुमचा व्यावसायिक फोटो",
    resultsHelp: "ऑनलाइन विक्रीसाठी सुधारित, व्यावसायिकरित्या कंपोझ केलेला आणि अपस्केल केलेला.",
    readyBadge: "✓ तयार",
    downloadTitle: "इमेज डाउनलोड करा",
    continueManual: "मॅन्युअल तपशीलांसह पुढे जा",
    continueVoice: "व्हॉइस इनपुटसह पुढे जा",

    modalEngineLabel: "KARIGARCONNECT फोटो इंजिन",
    modalHeadingBefore: "तुमचा",
    modalHeadingAfter: "फोटो तयार होत आहे",
    modalDescription:
      "तुमचे उत्पादन स्वच्छ, सुधारित, व्यावसायिकरित्या कंपोझ आणि ऑनलाइन विक्रीसाठी अपस्केल केले जात आहे.",
    modalFirstRunNote: "इमेज-प्रक्रिया मॉडेल सुरू होण्यासाठी पहिल्यांदा थोडा जास्त वेळ लागू शकतो.",
    productUpdateFailedHeading: "उत्पादन अपडेट अयशस्वी",
    processingFailedHeading: "प्रक्रिया अयशस्वी",

    initialProgressMessage: "तुमचा व्यावसायिक फोटो तयार केला जात आहे...",
    waitingMessage: "प्रतीक्षा करत आहे...",
    stepTitles: {
      background: "पार्श्वभूमी काढणे",
      crop: "डायनॅमिक क्रॉप",
      lighting: "व्यावसायिक लाइटिंग",
      enhancement: "इमेज एन्हांसमेंट",
      upscale: "4× सुपर-रिझोल्यूशन",
    },

    stepEnhancingUploaded: "अपलोड केलेली इमेज सुधारली जात आहे…",
    creatingAllFormats: "तुमचा फोटो सुधारून सर्व चार मार्केटप्लेस फॉरमॅट तयार केले जात आहेत…",
    sourceEnhanced: "मूळ इमेज सुधारली गेली.",
    compositionsCreated: "चार उत्पादन कंपोझिशन तयार केल्या.",
    lightingAppliedAll: "व्यावसायिक लाइटिंग लागू केली.",
    detailEnhancedAll: "उत्पादन तपशील सुधारला.",
    allImagesReady: "सर्व उच्च-गुणवत्तेच्या इमेज तयार आहेत.",
    allPhotosReadyCelebration: "🎉 Studio, Lifestyle, Model आणि Close-up फोटो तयार आहेत!",

    noProductSelected: "कोणतेही उत्पादन निवडलेले नाही.",
    unsupportedStyle: "असमर्थित फोटो शैली.",
    updateFailedGeneric: "उत्पादन अपडेट करण्यात अयशस्वी.",
    photoCreatedNotSaved: "फोटो तयार झाला, पण उत्पादन अपडेट झाले नाही.",

    styles: {
      studio: { title: "स्टुडिओ", subtitle: "व्यावसायिक उत्पादन फोटो" },
      lifestyle: { title: "लाइफस्टाइल", subtitle: "संदर्भासहित उत्पादन फोटो" },
      model: { title: "मॉडेल", subtitle: "वापरातील / परिधान केलेले उत्पादन" },
      closeup: { title: "क्लोज-अप", subtitle: "कारागिरीचे तपशील" },
    },

    categories: {
      Handloom: "हातमाग / कापड",
      Pottery: "मातीची भांडी / सिरॅमिक",
      Jewellery: "दागिने",
      Fashion: "फॅशन / बॅग्स",
      Woodcraft: "लाकूडकाम",
      "Home Decor": "होम डेकोर",
      generic: "इतर",
    },

    creatingStyleImage: (styleLabel, n) => `${styleLabel} इमेज तयार होत आहे (4 पैकी ${n})…`,
    savingStylePhoto: (styleLabel) => `${styleLabel} फोटो तुमच्या उत्पादनात जतन होत आहे...`,
    savedStylePhoto: (styleLabel) => `✓ ${styleLabel} फोटो तुमच्या उत्पादनात जतन झाला`,
    resultTitle: (styleLabel) => `${styleLabel} उत्पादन फोटो`,
    resultCaption: (resolution) =>
      `पार्श्वभूमी काढली · डायनॅमिक क्रॉप · लाइटिंग · 4× सुधारित · ${resolution}`,
  },

  gu: {
    eyebrow: "વ્યાવસાયિક ઉત્પાદન ફોટા",
    heroTitleBefore: "એક સાદા ફોટાને બદલો",
    heroTitleHighlight: "માર્કેટપ્લેસ-તૈયાર ફોટોગ્રાફીમાં.",
    heroDescription:
      "તમારા હાથબનાવટના ઉત્પાદનનો ફોટો અપલોડ કરો અને KarigarConnect ને તેને વ્યાવસાયિક ઓનલાઇન વેચાણ માટે તૈયાર કરવા દો.",

    step1Label: "પગલું 1",
    uploadHeadingProduct: "ઉત્પાદન ફોટો",
    uploadHeadingGeneric: "તમારું ઉત્પાદન અપલોડ કરો",
    loadingProductTitle: "ઉત્પાદન ફોટો લોડ થઈ રહ્યો છે...",
    loadingProductDescription: "તમારી સાચવેલી છબી કેટલોગમાંથી લાવવામાં આવી રહી છે.",
    previewLabelSaved: "સાચવેલો ઉત્પાદન ફોટો",
    previewLabelOriginal: "મૂળ ફોટો",
    uploadTitle: "તમારા ઉત્પાદનનો ફોટો અપલોડ કરો",
    uploadHint: "JPG, PNG અથવા WEBP · મહત્તમ 5MB",
    choosePhoto: "ફોટો પસંદ કરો",
    removePhoto: "ફોટો દૂર કરો",

    step2Label: "પગલું 2",
    styleHeading: "ફોટો શૈલી પસંદ કરો",
    styleHelp: "તમારું ઉત્પાદન કેવી રીતે વ્યાવસાયિક રીતે રજૂ કરવું તે પસંદ કરો.",
    comingSoon: "ટૂંક સમયમાં આવે છે",

    categoryFieldLabel: "ઉત્પાદન શ્રેણી",
    categoryFieldHelp: "આપમેળે શ્રેણી-યોગ્ય દ્રશ્ય પૃષ્ઠભૂમિ પસંદ કરવા માટે વપરાય છે.",
    categoryAiTag: "✨ AI",
    categoryAutoLabel: "ઉત્પાદન શ્રેણી",
    categoryAutoHelp: "તમારા સાચવેલા ઉત્પાદનમાંથી આપમેળે લેવામાં આવ્યું.",

    featureBgRemoval: "✓ સ્વયંસંચાલિત પૃષ્ઠભૂમિ દૂર કરવી",
    featureComposition: "✓ ડાયનેમિક કમ્પોઝિશન",
    featureLighting: "✓ વ્યાવસાયિક લાઇટિંગ",
    featureEnhancement: "✓ 4× એન્હાન્સમેન્ટ",

    generateButton: "✨ બધા 4 ઉત્પાદન ફોટા બનાવો",
    generateButtonBusy: "ફોટો પ્રોસેસ થઈ રહ્યો છે...",
    privacyNote: "તમારો ફોટો KarigarConnect ના લોકલ ઇમેજ એન્જિન દ્વારા પ્રોસેસ થાય છે.",

    errorHeading: "ફોટો પ્રોસેસિંગ નિષ્ફળ",
    tryAgain: "ફરી પ્રયાસ કરો",
    genericGenerateError: "બધા ઉત્પાદન ફોટા બનાવી શકાયા નથી.",
    selectImageAlert: "કૃપા કરી એક ઇમેજ ફાઇલ પસંદ કરો.",
    imageTooLargeAlert: "ઇમેજ 5MB કરતાં નાની હોવી જોઈએ.",
    uploadFirstAlert: "કૃપા કરી પહેલા ઉત્પાદનનો ફોટો અપલોડ કરો.",
    loadSavedImageError: "સાચવેલી ઉત્પાદન છબી લોડ કરી શકાઈ નથી. કૃપા કરી તેને મેન્યુઅલી અપલોડ કરો.",

    step3Label: "પગલું 3",
    resultsHeading: "તમારો વ્યાવસાયિક ફોટો",
    resultsHelp: "ઓનલાઇન વેચાણ માટે ઉન્નત, વ્યાવસાયિક રીતે કમ્પોઝ કરેલો અને અપસ્કેલ કરેલો.",
    readyBadge: "✓ તૈયાર",
    downloadTitle: "ઇમેજ ડાઉનલોડ કરો",
    continueManual: "મેન્યુઅલ વિગતો સાથે આગળ વધો",
    continueVoice: "વૉઇસ ઇનપુટ સાથે આગળ વધો",

    modalEngineLabel: "KARIGARCONNECT ફોટો એન્જિન",
    modalHeadingBefore: "તમારો",
    modalHeadingAfter: "ફોટો બનાવવામાં આવી રહ્યો છે",
    modalDescription:
      "તમારું ઉત્પાદન સાફ, ઉન્નત, વ્યાવસાયિક રીતે કમ્પોઝ અને ઓનલાઇન વેચાણ માટે અપસ્કેલ કરવામાં આવી રહ્યું છે.",
    modalFirstRunNote: "ઇમેજ-પ્રોસેસિંગ મોડેલ શરૂ થવામાં પ્રથમ વખત થોડો વધુ સમય લાગી શકે છે.",
    productUpdateFailedHeading: "ઉત્પાદન અપડેટ નિષ્ફળ",
    processingFailedHeading: "પ્રોસેસિંગ નિષ્ફળ",

    initialProgressMessage: "તમારો વ્યાવસાયિક ફોટો તૈયાર કરવામાં આવી રહ્યો છે...",
    waitingMessage: "રાહ જોવાઈ રહી છે...",
    stepTitles: {
      background: "પૃષ્ઠભૂમિ દૂર કરવી",
      crop: "ડાયનેમિક ક્રોપ",
      lighting: "વ્યાવસાયિક લાઇટિંગ",
      enhancement: "ઇમેજ એન્હાન્સમેન્ટ",
      upscale: "4× સુપર-રિઝોલ્યુશન",
    },

    stepEnhancingUploaded: "અપલોડ કરેલી ઇમેજ ઉન્નત કરવામાં આવી રહી છે…",
    creatingAllFormats: "તમારો ફોટો ઉન્નત કરીને બધા ચાર માર્કેટપ્લેસ ફોર્મેટ બનાવવામાં આવી રહ્યા છે…",
    sourceEnhanced: "મૂળ ઇમેજ ઉન્નત થઈ.",
    compositionsCreated: "ચાર ઉત્પાદન કમ્પોઝિશન બનાવવામાં આવ્યા.",
    lightingAppliedAll: "વ્યાવસાયિક લાઇટિંગ લાગુ કરવામાં આવી.",
    detailEnhancedAll: "ઉત્પાદન વિગત ઉન્નત કરવામાં આવી.",
    allImagesReady: "બધી ઉચ્ચ-ગુણવત્તાવાળી ઇમેજ તૈયાર છે.",
    allPhotosReadyCelebration: "🎉 Studio, Lifestyle, Model અને Close-up ફોટા તૈયાર છે!",

    noProductSelected: "કોઈ ઉત્પાદન પસંદ કરેલ નથી.",
    unsupportedStyle: "અસમર્થિત ફોટો શૈલી.",
    updateFailedGeneric: "ઉત્પાદન અપડેટ કરવામાં નિષ્ફળ.",
    photoCreatedNotSaved: "ફોટો બન્યો, પણ ઉત્પાદન અપડેટ થયું નથી.",

    styles: {
      studio: { title: "સ્ટુડિયો", subtitle: "વ્યાવસાયિક ઉત્પાદન ફોટો" },
      lifestyle: { title: "લાઇફસ્ટાઇલ", subtitle: "સંદર્ભ સાથે ઉત્પાદન ફોટો" },
      model: { title: "મોડેલ", subtitle: "ઉપયોગમાં / પહેરેલું ઉત્પાદન" },
      closeup: { title: "ક્લોઝ-અપ", subtitle: "કારીગરીની વિગતો" },
    },

    categories: {
      Handloom: "હાથશાળ / કાપડ",
      Pottery: "માટીકામ / સિરામિક",
      Jewellery: "ઘરેણાં",
      Fashion: "ફેશન / બેગ્સ",
      Woodcraft: "લાકડાકામ",
      "Home Decor": "હોમ ડેકોર",
      generic: "અન્ય",
    },

    creatingStyleImage: (styleLabel, n) => `${styleLabel} ઇમેજ બનાવવામાં આવી રહી છે (4માંથી ${n})…`,
    savingStylePhoto: (styleLabel) => `${styleLabel} ફોટો તમારા ઉત્પાદનમાં સાચવવામાં આવી રહ્યો છે...`,
    savedStylePhoto: (styleLabel) => `✓ ${styleLabel} ફોટો તમારા ઉત્પાદનમાં સાચવવામાં આવ્યો`,
    resultTitle: (styleLabel) => `${styleLabel} ઉત્પાદન ફોટો`,
    resultCaption: (resolution) =>
      `પૃષ્ઠભૂમિ દૂર કરી · ડાયનેમિક ક્રોપ · લાઇટિંગ · 4× ઉન્નત · ${resolution}`,
  },

  kn: {
    eyebrow: "ವೃತ್ತಿಪರ ಉತ್ಪನ್ನ ಫೋಟೋಗಳು",
    heroTitleBefore: "ಒಂದು ಸರಳ ಫೋಟೋವನ್ನು ಬದಲಾಯಿಸಿ",
    heroTitleHighlight: "ಮಾರುಕಟ್ಟೆ-ಸಿದ್ಧ ಛಾಯಾಗ್ರಹಣವಾಗಿ.",
    heroDescription:
      "ನಿಮ್ಮ ಕೈಯಿಂದ ತಯಾರಿಸಿದ ಉತ್ಪನ್ನದ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು KarigarConnect ಅದನ್ನು ವೃತ್ತಿಪರ ಆನ್‌ಲೈನ್ ಮಾರಾಟಕ್ಕೆ ಸಿದ್ಧಪಡಿಸಲಿ.",

    step1Label: "ಹಂತ 1",
    uploadHeadingProduct: "ಉತ್ಪನ್ನ ಫೋಟೋ",
    uploadHeadingGeneric: "ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    loadingProductTitle: "ಉತ್ಪನ್ನ ಫೋಟೋ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    loadingProductDescription: "ನಿಮ್ಮ ಉಳಿಸಿದ ಚಿತ್ರವನ್ನು ಕ್ಯಾಟಲಾಗ್‌ನಿಂದ ತರಲಾಗುತ್ತಿದೆ.",
    previewLabelSaved: "ಉಳಿಸಿದ ಉತ್ಪನ್ನ ಫೋಟೋ",
    previewLabelOriginal: "ಮೂಲ ಫೋಟೋ",
    uploadTitle: "ನಿಮ್ಮ ಉತ್ಪನ್ನದ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    uploadHint: "JPG, PNG ಅಥವಾ WEBP · ಗರಿಷ್ಠ 5MB",
    choosePhoto: "ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ",
    removePhoto: "ಫೋಟೋ ತೆಗೆದುಹಾಕಿ",

    step2Label: "ಹಂತ 2",
    styleHeading: "ಫೋಟೋ ಶೈಲಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    styleHelp: "ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ವೃತ್ತಿಪರವಾಗಿ ಹೇಗೆ ಪ್ರಸ್ತುತಪಡಿಸಬೇಕು ಎಂದು ಆಯ್ಕೆಮಾಡಿ.",
    comingSoon: "ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತಿದೆ",

    categoryFieldLabel: "ಉತ್ಪನ್ನ ವರ್ಗ",
    categoryFieldHelp: "ವರ್ಗಕ್ಕೆ ಸೂಕ್ತವಾದ ದೃಶ್ಯ ಹಿನ್ನೆಲೆಯನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಆಯ್ಕೆ ಮಾಡಲು ಬಳಸಲಾಗುತ್ತದೆ.",
    categoryAiTag: "✨ AI",
    categoryAutoLabel: "ಉತ್ಪನ್ನ ವರ್ಗ",
    categoryAutoHelp: "ನಿಮ್ಮ ಉಳಿಸಿದ ಉತ್ಪನ್ನದಿಂದ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ.",

    featureBgRemoval: "✓ ಸ್ವಯಂಚಾಲಿತ ಹಿನ್ನೆಲೆ ತೆಗೆದುಹಾಕುವಿಕೆ",
    featureComposition: "✓ ಡೈನಾಮಿಕ್ ಕಂಪೋಸಿಷನ್",
    featureLighting: "✓ ವೃತ್ತಿಪರ ಲೈಟಿಂಗ್",
    featureEnhancement: "✓ 4× ವರ್ಧನೆ",

    generateButton: "✨ ಎಲ್ಲಾ 4 ಉತ್ಪನ್ನ ಫೋಟೋಗಳನ್ನು ರಚಿಸಿ",
    generateButtonBusy: "ಫೋಟೋ ಪ್ರಕ್ರಿಯೆಗೊಳ್ಳುತ್ತಿದೆ...",
    privacyNote: "ನಿಮ್ಮ ಫೋಟೋ KarigarConnect ನ ಲೋಕಲ್ ಇಮೇಜ್ ಎಂಜಿನ್ ಮೂಲಕ ಪ್ರಕ್ರಿಯೆಗೊಳ್ಳುತ್ತದೆ.",

    errorHeading: "ಫೋಟೋ ಪ್ರಕ್ರಿಯೆ ವಿಫಲವಾಗಿದೆ",
    tryAgain: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    genericGenerateError: "ಎಲ್ಲಾ ಉತ್ಪನ್ನ ಫೋಟೋಗಳನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    selectImageAlert: "ದಯವಿಟ್ಟು ಒಂದು ಇಮೇಜ್ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ.",
    imageTooLargeAlert: "ಇಮೇಜ್ 5MB ಗಿಂತ ಚಿಕ್ಕದಾಗಿರಬೇಕು.",
    uploadFirstAlert: "ದಯವಿಟ್ಟು ಮೊದಲು ಉತ್ಪನ್ನದ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    loadSavedImageError: "ಉಳಿಸಿದ ಉತ್ಪನ್ನ ಚಿತ್ರವನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಅದನ್ನು ಹಸ್ತಚಾಲಿತವಾಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",

    step3Label: "ಹಂತ 3",
    resultsHeading: "ನಿಮ್ಮ ವೃತ್ತಿಪರ ಫೋಟೋ",
    resultsHelp: "ಆನ್‌ಲೈನ್ ಮಾರಾಟಕ್ಕಾಗಿ ವರ್ಧಿತ, ವೃತ್ತಿಪರವಾಗಿ ಸಂಯೋಜಿಸಲ್ಪಟ್ಟ ಮತ್ತು ಅಪ್‌ಸ್ಕೇಲ್ ಮಾಡಲಾಗಿದೆ.",
    readyBadge: "✓ ಸಿದ್ಧ",
    downloadTitle: "ಇಮೇಜ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    continueManual: "ಹಸ್ತಚಾಲಿತ ವಿವರಗಳೊಂದಿಗೆ ಮುಂದುವರಿಸಿ",
    continueVoice: "ಧ್ವನಿ ಇನ್‌ಪುಟ್‌ನೊಂದಿಗೆ ಮುಂದುವರಿಸಿ",

    modalEngineLabel: "KARIGARCONNECT ಫೋಟೋ ಎಂಜಿನ್",
    modalHeadingBefore: "ನಿಮ್ಮ",
    modalHeadingAfter: "ಫೋಟೋ ರಚಿಸಲಾಗುತ್ತಿದೆ",
    modalDescription:
      "ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ, ವರ್ಧಿಸಿ, ವೃತ್ತಿಪರವಾಗಿ ಸಂಯೋಜಿಸಿ ಮತ್ತು ಆನ್‌ಲೈನ್ ಮಾರಾಟಕ್ಕಾಗಿ ಅಪ್‌ಸ್ಕೇಲ್ ಮಾಡಲಾಗುತ್ತಿದೆ.",
    modalFirstRunNote: "ಇಮೇಜ್-ಪ್ರಕ್ರಿಯೆ ಮಾದರಿಗಳು ಪ್ರಾರಂಭವಾಗಲು ಮೊದಲ ಬಾರಿಗೆ ಸ್ವಲ್ಪ ಹೆಚ್ಚು ಸಮಯ ತೆಗೆದುಕೊಳ್ಳಬಹುದು.",
    productUpdateFailedHeading: "ಉತ್ಪನ್ನ ನವೀಕರಣ ವಿಫಲವಾಗಿದೆ",
    processingFailedHeading: "ಪ್ರಕ್ರಿಯೆ ವಿಫಲವಾಗಿದೆ",

    initialProgressMessage: "ನಿಮ್ಮ ವೃತ್ತಿಪರ ಫೋಟೋವನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...",
    waitingMessage: "ಕಾಯಲಾಗುತ್ತಿದೆ...",
    stepTitles: {
      background: "ಹಿನ್ನೆಲೆ ತೆಗೆದುಹಾಕುವಿಕೆ",
      crop: "ಡೈನಾಮಿಕ್ ಕ್ರಾಪ್",
      lighting: "ವೃತ್ತಿಪರ ಲೈಟಿಂಗ್",
      enhancement: "ಇಮೇಜ್ ವರ್ಧನೆ",
      upscale: "4× ಸೂಪರ್-ರೆಸಲ್ಯೂಶನ್",
    },

    stepEnhancingUploaded: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಇಮೇಜ್ ಅನ್ನು ವರ್ಧಿಸಲಾಗುತ್ತಿದೆ…",
    creatingAllFormats: "ನಿಮ್ಮ ಫೋಟೋವನ್ನು ವರ್ಧಿಸಿ ಎಲ್ಲಾ ನಾಲ್ಕು ಮಾರುಕಟ್ಟೆ ಸ್ವರೂಪಗಳನ್ನು ರಚಿಸಲಾಗುತ್ತಿದೆ…",
    sourceEnhanced: "ಮೂಲ ಇಮೇಜ್ ವರ್ಧಿಸಲಾಗಿದೆ.",
    compositionsCreated: "ನಾಲ್ಕು ಉತ್ಪನ್ನ ಸಂಯೋಜನೆಗಳನ್ನು ರಚಿಸಲಾಗಿದೆ.",
    lightingAppliedAll: "ವೃತ್ತಿಪರ ಲೈಟಿಂಗ್ ಅನ್ವಯಿಸಲಾಗಿದೆ.",
    detailEnhancedAll: "ಉತ್ಪನ್ನ ವಿವರ ವರ್ಧಿಸಲಾಗಿದೆ.",
    allImagesReady: "ಎಲ್ಲಾ ಉತ್ತಮ-ಗುಣಮಟ್ಟದ ಇಮೇಜ್‌ಗಳು ಸಿದ್ಧವಾಗಿವೆ.",
    allPhotosReadyCelebration: "🎉 Studio, Lifestyle, Model ಮತ್ತು Close-up ಫೋಟೋಗಳು ಸಿದ್ಧವಾಗಿವೆ!",

    noProductSelected: "ಯಾವುದೇ ಉತ್ಪನ್ನ ಆಯ್ಕೆ ಮಾಡಿಲ್ಲ.",
    unsupportedStyle: "ಬೆಂಬಲಿಸದ ಫೋಟೋ ಶೈಲಿ.",
    updateFailedGeneric: "ಉತ್ಪನ್ನವನ್ನು ನವೀಕರಿಸಲು ವಿಫಲವಾಗಿದೆ.",
    photoCreatedNotSaved: "ಫೋಟೋ ರಚಿಸಲಾಗಿದೆ, ಆದರೆ ಉತ್ಪನ್ನ ನವೀಕರಿಸಲಾಗಿಲ್ಲ.",

    styles: {
      studio: { title: "ಸ್ಟುಡಿಯೋ", subtitle: "ವೃತ್ತಿಪರ ಉತ್ಪನ್ನ ಫೋಟೋ" },
      lifestyle: { title: "ಲೈಫ್‌ಸ್ಟೈಲ್", subtitle: "ಸಂದರ್ಭೋಚಿತ ಉತ್ಪನ್ನ ಫೋಟೋ" },
      model: { title: "ಮಾದರಿ", subtitle: "ಬಳಕೆಯಲ್ಲಿ / ಧರಿಸಿದ ಉತ್ಪನ್ನ" },
      closeup: { title: "ಕ್ಲೋಸ್-ಅಪ್", subtitle: "ಕರಕುಶಲ ವಿವರಗಳು" },
    },

    categories: {
      Handloom: "ಕೈಮಗ್ಗ / ಜವಳಿ",
      Pottery: "ಕುಂಬಾರಿಕೆ / ಸೆರಾಮಿಕ್",
      Jewellery: "ಆಭರಣಗಳು",
      Fashion: "ಫ್ಯಾಷನ್ / ಬ್ಯಾಗ್‌ಗಳು",
      Woodcraft: "ಮರಗೆಲಸ",
      "Home Decor": "ಹೋಮ್ ಡೆಕರ್",
      generic: "ಇತರೆ",
    },

    creatingStyleImage: (styleLabel, n) => `${styleLabel} ಇಮೇಜ್ ರಚಿಸಲಾಗುತ್ತಿದೆ (4ರಲ್ಲಿ ${n})…`,
    savingStylePhoto: (styleLabel) => `${styleLabel} ಫೋಟೋ ನಿಮ್ಮ ಉತ್ಪನ್ನದಲ್ಲಿ ಉಳಿಸಲಾಗುತ್ತಿದೆ...`,
    savedStylePhoto: (styleLabel) => `✓ ${styleLabel} ಫೋಟೋ ನಿಮ್ಮ ಉತ್ಪನ್ನದಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ`,
    resultTitle: (styleLabel) => `${styleLabel} ಉತ್ಪನ್ನ ಫೋಟೋ`,
    resultCaption: (resolution) =>
      `ಹಿನ್ನೆಲೆ ತೆಗೆದುಹಾಕಲಾಗಿದೆ · ಡೈನಾಮಿಕ್ ಕ್ರಾಪ್ · ಲೈಟಿಂಗ್ · 4× ವರ್ಧಿತ · ${resolution}`,
  },

  ml: {
    eyebrow: "പ്രൊഫഷണൽ ഉൽപ്പന്ന ഫോട്ടോകൾ",
    heroTitleBefore: "ഒരു സാധാരണ ഫോട്ടോ മാറ്റുക",
    heroTitleHighlight: "മാർക്കറ്റ്‌പ്ലേസിന് തയ്യാറായ ഫോട്ടോഗ്രഫിയായി.",
    heroDescription:
      "നിങ്ങളുടെ കൈകൊണ്ട് നിർമ്മിച്ച ഉൽപ്പന്നത്തിന്റെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക, KarigarConnect അത് പ്രൊഫഷണൽ ഓൺലൈൻ വിൽപ്പനയ്ക്ക് തയ്യാറാക്കട്ടെ.",

    step1Label: "ഘട്ടം 1",
    uploadHeadingProduct: "ഉൽപ്പന്ന ഫോട്ടോ",
    uploadHeadingGeneric: "നിങ്ങളുടെ ഉൽപ്പന്നം അപ്‌ലോഡ് ചെയ്യുക",
    loadingProductTitle: "ഉൽപ്പന്ന ഫോട്ടോ ലോഡ് ചെയ്യുന്നു...",
    loadingProductDescription: "നിങ്ങളുടെ സേവ് ചെയ്ത ചിത്രം കാറ്റലോഗിൽ നിന്ന് കൊണ്ടുവരുന്നു.",
    previewLabelSaved: "സേവ് ചെയ്ത ഉൽപ്പന്ന ഫോട്ടോ",
    previewLabelOriginal: "യഥാർത്ഥ ഫോട്ടോ",
    uploadTitle: "നിങ്ങളുടെ ഉൽപ്പന്ന ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
    uploadHint: "JPG, PNG അല്ലെങ്കിൽ WEBP · പരമാവധി 5MB",
    choosePhoto: "ഫോട്ടോ തിരഞ്ഞെടുക്കുക",
    removePhoto: "ഫോട്ടോ നീക്കം ചെയ്യുക",

    step2Label: "ഘട്ടം 2",
    styleHeading: "ഫോട്ടോ ശൈലി തിരഞ്ഞെടുക്കുക",
    styleHelp: "നിങ്ങളുടെ ഉൽപ്പന്നം എങ്ങനെ പ്രൊഫഷണലായി അവതരിപ്പിക്കണമെന്ന് തിരഞ്ഞെടുക്കുക.",
    comingSoon: "ഉടൻ വരുന്നു",

    categoryFieldLabel: "ഉൽപ്പന്ന വിഭാഗം",
    categoryFieldHelp: "വിഭാഗത്തിന് അനുയോജ്യമായ ദൃശ്യ പശ്ചാത്തലം സ്വയമേവ തിരഞ്ഞെടുക്കാൻ ഉപയോഗിക്കുന്നു.",
    categoryAiTag: "✨ AI",
    categoryAutoLabel: "ഉൽപ്പന്ന വിഭാഗം",
    categoryAutoHelp: "നിങ്ങളുടെ സേവ് ചെയ്ത ഉൽപ്പന്നത്തിൽ നിന്ന് സ്വയമേവ എടുത്തത്.",

    featureBgRemoval: "✓ സ്വയമേവയുള്ള പശ്ചാത്തല നീക്കം",
    featureComposition: "✓ ഡൈനാമിക് കോമ്പോസിഷൻ",
    featureLighting: "✓ പ്രൊഫഷണൽ ലൈറ്റിംഗ്",
    featureEnhancement: "✓ 4× മെച്ചപ്പെടുത്തൽ",

    generateButton: "✨ എല്ലാ 4 ഉൽപ്പന്ന ഫോട്ടോകളും സൃഷ്ടിക്കുക",
    generateButtonBusy: "ഫോട്ടോ പ്രോസസ്സ് ചെയ്യുന്നു...",
    privacyNote: "നിങ്ങളുടെ ഫോട്ടോ KarigarConnect ന്റെ ലോക്കൽ ഇമേജ് എഞ്ചിൻ വഴി പ്രോസസ്സ് ചെയ്യുന്നു.",

    errorHeading: "ഫോട്ടോ പ്രോസസ്സിംഗ് പരാജയപ്പെട്ടു",
    tryAgain: "വീണ്ടും ശ്രമിക്കുക",
    genericGenerateError: "എല്ലാ ഉൽപ്പന്ന ഫോട്ടോകളും സൃഷ്ടിക്കാൻ കഴിഞ്ഞില്ല.",
    selectImageAlert: "ദയവായി ഒരു ഇമേജ് ഫയൽ തിരഞ്ഞെടുക്കുക.",
    imageTooLargeAlert: "ഇമേജ് 5MB-ൽ താഴെ ആയിരിക്കണം.",
    uploadFirstAlert: "ദയവായി ആദ്യം ഉൽപ്പന്ന ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.",
    loadSavedImageError: "സേവ് ചെയ്ത ഉൽപ്പന്ന ചിത്രം ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല. ദയവായി ഇത് സ്വമേധയാ അപ്‌ലോഡ് ചെയ്യുക.",

    step3Label: "ഘട്ടം 3",
    resultsHeading: "നിങ്ങളുടെ പ്രൊഫഷണൽ ഫോട്ടോ",
    resultsHelp: "ഓൺലൈൻ വിൽപ്പനയ്ക്കായി മെച്ചപ്പെടുത്തി, പ്രൊഫഷണലായി കോമ്പോസ് ചെയ്ത്, അപ്‌സ്കെയിൽ ചെയ്തത്.",
    readyBadge: "✓ തയ്യാർ",
    downloadTitle: "ഇമേജ് ഡൗൺലോഡ് ചെയ്യുക",
    continueManual: "സ്വമേധയാ വിശദാംശങ്ങളുമായി തുടരുക",
    continueVoice: "വോയ്സ് ഇൻപുട്ടുമായി തുടരുക",

    modalEngineLabel: "KARIGARCONNECT ഫോട്ടോ എഞ്ചിൻ",
    modalHeadingBefore: "നിങ്ങളുടെ",
    modalHeadingAfter: "ഫോട്ടോ സൃഷ്ടിക്കുന്നു",
    modalDescription:
      "നിങ്ങളുടെ ഉൽപ്പന്നം വൃത്തിയാക്കി, മെച്ചപ്പെടുത്തി, പ്രൊഫഷണലായി കോമ്പോസ് ചെയ്ത് ഓൺലൈൻ വിൽപ്പനയ്ക്കായി അപ്‌സ്കെയിൽ ചെയ്യുന്നു.",
    modalFirstRunNote: "ഇമേജ്-പ്രോസസ്സിംഗ് മോഡലുകൾ ആരംഭിക്കാൻ ആദ്യതവണ അല്പം കൂടുതൽ സമയമെടുത്തേക്കാം.",
    productUpdateFailedHeading: "ഉൽപ്പന്ന അപ്‌ഡേറ്റ് പരാജയപ്പെട്ടു",
    processingFailedHeading: "പ്രോസസ്സിംഗ് പരാജയപ്പെട്ടു",

    initialProgressMessage: "നിങ്ങളുടെ പ്രൊഫഷണൽ ഫോട്ടോ തയ്യാറാക്കുന്നു...",
    waitingMessage: "കാത്തിരിക്കുന്നു...",
    stepTitles: {
      background: "പശ്ചാത്തല നീക്കം",
      crop: "ഡൈനാമിക് ക്രോപ്പ്",
      lighting: "പ്രൊഫഷണൽ ലൈറ്റിംഗ്",
      enhancement: "ഇമേജ് മെച്ചപ്പെടുത്തൽ",
      upscale: "4× സൂപ്പർ-റെസലൂഷൻ",
    },

    stepEnhancingUploaded: "അപ്‌ലോഡ് ചെയ്ത ഇമേജ് മെച്ചപ്പെടുത്തുന്നു…",
    creatingAllFormats: "നിങ്ങളുടെ ഫോട്ടോ മെച്ചപ്പെടുത്തി എല്ലാ നാല് മാർക്കറ്റ്‌പ്ലേസ് ഫോർമാറ്റുകളും സൃഷ്ടിക്കുന്നു…",
    sourceEnhanced: "മൂല ഇമേജ് മെച്ചപ്പെടുത്തി.",
    compositionsCreated: "നാല് ഉൽപ്പന്ന കോമ്പോസിഷനുകൾ സൃഷ്ടിച്ചു.",
    lightingAppliedAll: "പ്രൊഫഷണൽ ലൈറ്റിംഗ് പ്രയോഗിച്ചു.",
    detailEnhancedAll: "ഉൽപ്പന്ന വിശദാംശം മെച്ചപ്പെടുത്തി.",
    allImagesReady: "എല്ലാ ഉയർന്ന നിലവാരമുള്ള ഇമേജുകളും തയ്യാർ.",
    allPhotosReadyCelebration: "🎉 Studio, Lifestyle, Model, Close-up ഫോട്ടോകൾ തയ്യാർ!",

    noProductSelected: "ഒരു ഉൽപ്പന്നവും തിരഞ്ഞെടുത്തിട്ടില്ല.",
    unsupportedStyle: "പിന്തുണയില്ലാത്ത ഫോട്ടോ ശൈലി.",
    updateFailedGeneric: "ഉൽപ്പന്നം അപ്‌ഡേറ്റ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു.",
    photoCreatedNotSaved: "ഫോട്ടോ സൃഷ്ടിച്ചു, പക്ഷേ ഉൽപ്പന്നം അപ്‌ഡേറ്റ് ചെയ്തില്ല.",

    styles: {
      studio: { title: "സ്റ്റുഡിയോ", subtitle: "പ്രൊഫഷണൽ ഉൽപ്പന്ന ഫോട്ടോ" },
      lifestyle: { title: "ലൈഫ്‌സ്റ്റൈൽ", subtitle: "സന്ദർഭോചിത ഉൽപ്പന്ന ഫോട്ടോ" },
      model: { title: "മോഡൽ", subtitle: "ഉപയോഗത്തിൽ / ധരിച്ച ഉൽപ്പന്നം" },
      closeup: { title: "ക്ലോസ്-അപ്പ്", subtitle: "കരകൗശല വിശദാംശങ്ങൾ" },
    },

    categories: {
      Handloom: "കൈത്തറി / തുണിത്തരം",
      Pottery: "മൺപാത്രം / സെറാമിക്",
      Jewellery: "ആഭരണങ്ങൾ",
      Fashion: "ഫാഷൻ / ബാഗുകൾ",
      Woodcraft: "മരപ്പണി",
      "Home Decor": "ഹോം ഡെക്കോർ",
      generic: "മറ്റുള്ളവ",
    },

    creatingStyleImage: (styleLabel, n) => `${styleLabel} ഇമേജ് സൃഷ്ടിക്കുന്നു (4-ൽ ${n})…`,
    savingStylePhoto: (styleLabel) => `${styleLabel} ഫോട്ടോ നിങ്ങളുടെ ഉൽപ്പന്നത്തിൽ സേവ് ചെയ്യുന്നു...`,
    savedStylePhoto: (styleLabel) => `✓ ${styleLabel} ഫോട്ടോ നിങ്ങളുടെ ഉൽപ്പന്നത്തിൽ സേവ് ചെയ്തു`,
    resultTitle: (styleLabel) => `${styleLabel} ഉൽപ്പന്ന ഫോട്ടോ`,
    resultCaption: (resolution) =>
      `പശ്ചാത്തലം നീക്കി · ഡൈനാമിക് ക്രോപ്പ് · ലൈറ്റിംഗ് · 4× മെച്ചപ്പെടുത്തി · ${resolution}`,
  },

  pa: {
    eyebrow: "ਪੇਸ਼ੇਵਰ ਉਤਪਾਦ ਫੋਟੋਆਂ",
    heroTitleBefore: "ਇੱਕ ਸਧਾਰਨ ਫੋਟੋ ਨੂੰ ਬਦਲੋ",
    heroTitleHighlight: "ਮਾਰਕੀਟਪਲੇਸ-ਤਿਆਰ ਫੋਟੋਗ੍ਰਾਫੀ ਵਿੱਚ।",
    heroDescription:
      "ਆਪਣੇ ਹੱਥ ਨਾਲ ਬਣੇ ਉਤਪਾਦ ਦੀ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ ਅਤੇ KarigarConnect ਨੂੰ ਇਸਨੂੰ ਪੇਸ਼ੇਵਰ ਔਨਲਾਈਨ ਵਿਕਰੀ ਲਈ ਤਿਆਰ ਕਰਨ ਦਿਓ।",

    step1Label: "ਪੜਾਅ 1",
    uploadHeadingProduct: "ਉਤਪਾਦ ਫੋਟੋ",
    uploadHeadingGeneric: "ਆਪਣਾ ਉਤਪਾਦ ਅੱਪਲੋਡ ਕਰੋ",
    loadingProductTitle: "ਉਤਪਾਦ ਫੋਟੋ ਲੋਡ ਹੋ ਰਹੀ ਹੈ...",
    loadingProductDescription: "ਤੁਹਾਡੀ ਸੰਭਾਲੀ ਗਈ ਤਸਵੀਰ ਕੈਟਲਾਗ ਤੋਂ ਲਿਆਂਦੀ ਜਾ ਰਹੀ ਹੈ।",
    previewLabelSaved: "ਸੰਭਾਲੀ ਗਈ ਉਤਪਾਦ ਫੋਟੋ",
    previewLabelOriginal: "ਅਸਲੀ ਫੋਟੋ",
    uploadTitle: "ਆਪਣੇ ਉਤਪਾਦ ਦੀ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ",
    uploadHint: "JPG, PNG ਜਾਂ WEBP · ਵੱਧ ਤੋਂ ਵੱਧ 5MB",
    choosePhoto: "ਫੋਟੋ ਚੁਣੋ",
    removePhoto: "ਫੋਟੋ ਹਟਾਓ",

    step2Label: "ਪੜਾਅ 2",
    styleHeading: "ਫੋਟੋ ਸ਼ੈਲੀ ਚੁਣੋ",
    styleHelp: "ਚੁਣੋ ਕਿ ਤੁਹਾਡਾ ਉਤਪਾਦ ਪੇਸ਼ੇਵਰ ਢੰਗ ਨਾਲ ਕਿਵੇਂ ਪੇਸ਼ ਕੀਤਾ ਜਾਵੇ।",
    comingSoon: "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ",

    categoryFieldLabel: "ਉਤਪਾਦ ਸ਼੍ਰੇਣੀ",
    categoryFieldHelp: "ਸ੍ਵੈਚਾਲਿਤ ਤੌਰ 'ਤੇ ਸ਼੍ਰੇਣੀ-ਅਨੁਕੂਲ ਵਿਜ਼ੂਅਲ ਬੈਕਗ੍ਰਾਊਂਡ ਚੁਣਨ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
    categoryAiTag: "✨ AI",
    categoryAutoLabel: "ਉਤਪਾਦ ਸ਼੍ਰੇਣੀ",
    categoryAutoHelp: "ਤੁਹਾਡੇ ਸੰਭਾਲੇ ਗਏ ਉਤਪਾਦ ਤੋਂ ਸ੍ਵੈਚਾਲਿਤ ਤੌਰ 'ਤੇ ਲਈ ਗਈ।",

    featureBgRemoval: "✓ ਸ੍ਵੈਚਾਲਿਤ ਬੈਕਗ੍ਰਾਊਂਡ ਹਟਾਉਣਾ",
    featureComposition: "✓ ਡਾਇਨਾਮਿਕ ਕੰਪੋਜ਼ੀਸ਼ਨ",
    featureLighting: "✓ ਪੇਸ਼ੇਵਰ ਲਾਈਟਿੰਗ",
    featureEnhancement: "✓ 4× ਸੁਧਾਰ",

    generateButton: "✨ ਸਾਰੀਆਂ 4 ਉਤਪਾਦ ਫੋਟੋਆਂ ਬਣਾਓ",
    generateButtonBusy: "ਫੋਟੋ ਪ੍ਰੋਸੈਸ ਹੋ ਰਹੀ ਹੈ...",
    privacyNote: "ਤੁਹਾਡੀ ਫੋਟੋ KarigarConnect ਦੇ ਲੋਕਲ ਇਮੇਜ ਇੰਜਣ ਰਾਹੀਂ ਪ੍ਰੋਸੈਸ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।",

    errorHeading: "ਫੋਟੋ ਪ੍ਰੋਸੈਸਿੰਗ ਅਸਫਲ",
    tryAgain: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
    genericGenerateError: "ਸਾਰੀਆਂ ਉਤਪਾਦ ਫੋਟੋਆਂ ਨਹੀਂ ਬਣਾਈਆਂ ਜਾ ਸਕੀਆਂ।",
    selectImageAlert: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਇਮੇਜ ਫਾਈਲ ਚੁਣੋ।",
    imageTooLargeAlert: "ਇਮੇਜ 5MB ਤੋਂ ਛੋਟੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
    uploadFirstAlert: "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਉਤਪਾਦ ਦੀ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ।",
    loadSavedImageError: "ਸੰਭਾਲੀ ਗਈ ਉਤਪਾਦ ਤਸਵੀਰ ਲੋਡ ਨਹੀਂ ਹੋ ਸਕੀ। ਕਿਰਪਾ ਕਰਕੇ ਇਸਨੂੰ ਖੁਦ ਅੱਪਲੋਡ ਕਰੋ।",

    step3Label: "ਪੜਾਅ 3",
    resultsHeading: "ਤੁਹਾਡੀ ਪੇਸ਼ੇਵਰ ਫੋਟੋ",
    resultsHelp: "ਔਨਲਾਈਨ ਵਿਕਰੀ ਲਈ ਸੁਧਰੀ, ਪੇਸ਼ੇਵਰ ਢੰਗ ਨਾਲ ਕੰਪੋਜ਼ ਕੀਤੀ ਅਤੇ ਅੱਪਸਕੇਲ ਕੀਤੀ।",
    readyBadge: "✓ ਤਿਆਰ",
    downloadTitle: "ਇਮੇਜ ਡਾਊਨਲੋਡ ਕਰੋ",
    continueManual: "ਖੁਦ ਵੇਰਵਿਆਂ ਨਾਲ ਜਾਰੀ ਰੱਖੋ",
    continueVoice: "ਵੌਇਸ ਇਨਪੁੱਟ ਨਾਲ ਜਾਰੀ ਰੱਖੋ",

    modalEngineLabel: "KARIGARCONNECT ਫੋਟੋ ਇੰਜਣ",
    modalHeadingBefore: "ਤੁਹਾਡੀ",
    modalHeadingAfter: "ਫੋਟੋ ਬਣਾਈ ਜਾ ਰਹੀ ਹੈ",
    modalDescription:
      "ਤੁਹਾਡੇ ਉਤਪਾਦ ਨੂੰ ਸਾਫ਼, ਸੁਧਾਰਿਆ, ਪੇਸ਼ੇਵਰ ਢੰਗ ਨਾਲ ਕੰਪੋਜ਼ ਅਤੇ ਔਨਲਾਈਨ ਵਿਕਰੀ ਲਈ ਅੱਪਸਕੇਲ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ।",
    modalFirstRunNote: "ਇਮੇਜ-ਪ੍ਰੋਸੈਸਿੰਗ ਮਾਡਲਾਂ ਨੂੰ ਸ਼ੁਰੂ ਹੋਣ ਵਿੱਚ ਪਹਿਲੀ ਵਾਰ ਥੋੜ੍ਹਾ ਵੱਧ ਸਮਾਂ ਲੱਗ ਸਕਦਾ ਹੈ।",
    productUpdateFailedHeading: "ਉਤਪਾਦ ਅੱਪਡੇਟ ਅਸਫਲ",
    processingFailedHeading: "ਪ੍ਰੋਸੈਸਿੰਗ ਅਸਫਲ",

    initialProgressMessage: "ਤੁਹਾਡੀ ਪੇਸ਼ੇਵਰ ਫੋਟੋ ਤਿਆਰ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",
    waitingMessage: "ਉਡੀਕ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",
    stepTitles: {
      background: "ਬੈਕਗ੍ਰਾਊਂਡ ਹਟਾਉਣਾ",
      crop: "ਡਾਇਨਾਮਿਕ ਕ੍ਰੌਪ",
      lighting: "ਪੇਸ਼ੇਵਰ ਲਾਈਟਿੰਗ",
      enhancement: "ਇਮੇਜ ਸੁਧਾਰ",
      upscale: "4× ਸੁਪਰ-ਰੈਜ਼ੋਲਿਊਸ਼ਨ",
    },

    stepEnhancingUploaded: "ਅੱਪਲੋਡ ਕੀਤੀ ਇਮੇਜ ਨੂੰ ਸੁਧਾਰਿਆ ਜਾ ਰਿਹਾ ਹੈ…",
    creatingAllFormats: "ਤੁਹਾਡੀ ਫੋਟੋ ਨੂੰ ਸੁਧਾਰ ਕੇ ਸਾਰੇ ਚਾਰ ਮਾਰਕੀਟਪਲੇਸ ਫਾਰਮੈਟ ਬਣਾਏ ਜਾ ਰਹੇ ਹਨ…",
    sourceEnhanced: "ਮੂਲ ਇਮੇਜ ਸੁਧਾਰੀ ਗਈ।",
    compositionsCreated: "ਚਾਰ ਉਤਪਾਦ ਕੰਪੋਜ਼ੀਸ਼ਨ ਬਣਾਈਆਂ ਗਈਆਂ।",
    lightingAppliedAll: "ਪੇਸ਼ੇਵਰ ਲਾਈਟਿੰਗ ਲਾਗੂ ਕੀਤੀ ਗਈ।",
    detailEnhancedAll: "ਉਤਪਾਦ ਵੇਰਵਾ ਸੁਧਾਰਿਆ ਗਿਆ।",
    allImagesReady: "ਸਾਰੀਆਂ ਉੱਚ-ਗੁਣਵੱਤਾ ਵਾਲੀਆਂ ਇਮੇਜਾਂ ਤਿਆਰ ਹਨ।",
    allPhotosReadyCelebration: "🎉 Studio, Lifestyle, Model ਅਤੇ Close-up ਫੋਟੋਆਂ ਤਿਆਰ ਹਨ!",

    noProductSelected: "ਕੋਈ ਉਤਪਾਦ ਨਹੀਂ ਚੁਣਿਆ ਗਿਆ।",
    unsupportedStyle: "ਅਸਮਰਥਿਤ ਫੋਟੋ ਸ਼ੈਲੀ।",
    updateFailedGeneric: "ਉਤਪਾਦ ਅੱਪਡੇਟ ਕਰਨ ਵਿੱਚ ਅਸਫਲ।",
    photoCreatedNotSaved: "ਫੋਟੋ ਬਣ ਗਈ, ਪਰ ਉਤਪਾਦ ਅੱਪਡੇਟ ਨਹੀਂ ਹੋਇਆ।",

    styles: {
      studio: { title: "ਸਟੂਡੀਓ", subtitle: "ਪੇਸ਼ੇਵਰ ਉਤਪਾਦ ਫੋਟੋ" },
      lifestyle: { title: "ਲਾਈਫਸਟਾਈਲ", subtitle: "ਸੰਦਰਭ ਵਿੱਚ ਉਤਪਾਦ ਫੋਟੋ" },
      model: { title: "ਮਾਡਲ", subtitle: "ਵਰਤੋਂ ਵਿੱਚ / ਪਹਿਨਿਆ ਉਤਪਾਦ" },
      closeup: { title: "ਕਲੋਜ਼-ਅੱਪ", subtitle: "ਕਾਰੀਗਰੀ ਵੇਰਵੇ" },
    },

    categories: {
      Handloom: "ਹੈਂਡਲੂਮ / ਕੱਪੜਾ",
      Pottery: "ਮਿੱਟੀ ਦੇ ਭਾਂਡੇ / ਸਿਰੇਮਿਕ",
      Jewellery: "ਗਹਿਣੇ",
      Fashion: "ਫੈਸ਼ਨ / ਬੈਗ",
      Woodcraft: "ਲੱਕੜ ਦਾ ਕੰਮ",
      "Home Decor": "ਹੋਮ ਡੇਕੋਰ",
      generic: "ਹੋਰ",
    },

    creatingStyleImage: (styleLabel, n) => `${styleLabel} ਇਮੇਜ ਬਣਾਈ ਜਾ ਰਹੀ ਹੈ (4 ਵਿੱਚੋਂ ${n})…`,
    savingStylePhoto: (styleLabel) => `${styleLabel} ਫੋਟੋ ਤੁਹਾਡੇ ਉਤਪਾਦ ਵਿੱਚ ਸੰਭਾਲੀ ਜਾ ਰਹੀ ਹੈ...`,
    savedStylePhoto: (styleLabel) => `✓ ${styleLabel} ਫੋਟੋ ਤੁਹਾਡੇ ਉਤਪਾਦ ਵਿੱਚ ਸੰਭਾਲੀ ਗਈ`,
    resultTitle: (styleLabel) => `${styleLabel} ਉਤਪਾਦ ਫੋਟੋ`,
    resultCaption: (resolution) =>
      `ਬੈਕਗ੍ਰਾਊਂਡ ਹਟਾਈ ਗਈ · ਡਾਇਨਾਮਿਕ ਕ੍ਰੌਪ · ਲਾਈਟਿੰਗ · 4× ਸੁਧਰੀ · ${resolution}`,
  },
};


function Photoshoot({
  selectedProduct = null,
  onNavigate,
}) {
  const { language } = useLanguage();
  const languageKey = String(language || "en").toLowerCase().split("-")[0];
  const ui =
    PHOTOSHOOT_TRANSLATIONS[languageKey] ||
    PHOTOSHOOT_TRANSLATIONS.en;

  const localizedStyles = styles.map((item) => ({
    ...item,
    title: ui.styles[item.id]?.title || item.title,
    subtitle: ui.styles[item.id]?.subtitle || item.subtitle,
  }));

  const localizedCategories = categories.map((item) => ({
    ...item,
    label: ui.categories[item.value] || item.label,
  }));

  const buildProgressSteps = () =>
    PROGRESS_STEP_IDS.map((id) => ({
      id,
      title: ui.stepTitles[id],
      status: "waiting",
      message: ui.waitingMessage,
    }));

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [selectedStyle, setSelectedStyle] =
    useState("studio");

  const [selectedCategory, setSelectedCategory] =
    useState(
      selectedProduct?.category ||
        "Handloom"
    );

  const [generatedImages, setGeneratedImages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingProductImage, setLoadingProductImage] =
    useState(false);

  const [progressSteps, setProgressSteps] =
    useState(buildProgressSteps);

  const [progressMessage, setProgressMessage] =
    useState(
      ui.initialProgressMessage
    );

  const [progressPercent, setProgressPercent] =
    useState(0);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [productSaveStatus, setProductSaveStatus] =
    useState("");

  const [productSaveError, setProductSaveError] =
    useState("");

  /*
  =====================================================
  RESET
  =====================================================
  */

  const resetProgress = () => {
    setProgressSteps(
      buildProgressSteps()
    );

    setProgressMessage(
      ui.initialProgressMessage
    );

    setProgressPercent(0);

    setErrorMessage("");

    setProductSaveStatus("");

    setProductSaveError("");
  };

  /*
  =====================================================
  WAIT
  =====================================================
  */

  const wait = (ms) =>
    new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          ms
        )
    );

  /*
  =====================================================
  PRODUCT → CATEGORY
  =====================================================
  */

  useEffect(() => {
    if (
      selectedProduct?.category
    ) {
      setSelectedCategory(
        selectedProduct.category
      );
    }
  }, [selectedProduct]);

  /*
  =====================================================
  LOAD PRODUCT IMAGE
  =====================================================
  */

  const loadProductImage =
    async (imageUrl) => {
      try {
        setLoadingProductImage(
          true
        );

        setErrorMessage("");

        const response =
          await fetch(
            imageUrl
          );

        if (!response.ok) {
          throw new Error(
            `Unable to load product image (${response.status}).`
          );
        }

        const blob =
          await response.blob();

        if (
          !blob.type.startsWith(
            "image/"
          )
        ) {
          throw new Error(
            "The saved product file is not a valid image."
          );
        }

        let extension =
          blob.type.split(
            "/"
          )[1] ||
          "jpg";

        if (
          extension ===
          "jpeg"
        ) {
          extension =
            "jpg";
        }

        const file =
          new File(
            [blob],
            `product.${extension}`,
            {
              type:
                blob.type ||
                "image/jpeg",
              lastModified:
                Date.now(),
            }
          );

        setSelectedImage(
          file
        );

        setPreview(
          imageUrl
        );

        setGeneratedImages(
          []
        );

        resetProgress();
      } catch (
        error
      ) {
        console.error(
          "Product image loading error:",
          error
        );

        setSelectedImage(
          null
        );

        setPreview("");

        setErrorMessage(
          ui.loadSavedImageError
        );
      } finally {
        setLoadingProductImage(
          false
        );
      }
    };

  /*
  =====================================================
  PRODUCT → IMAGE
  =====================================================
  */

  useEffect(() => {
    if (
      !selectedProduct?.image
    ) {
      return;
    }

    const productImage =
      selectedProduct.image.startsWith(
        "http://"
      ) ||
      selectedProduct.image.startsWith(
        "https://"
      )
        ? selectedProduct.image
        : `${BACKEND_URL}${selectedProduct.image}`;

    loadProductImage(
      productImage
    );
  }, [selectedProduct]);

  /*
  =====================================================
  CLEANUP
  =====================================================
  */

  useEffect(() => {
    return () => {
      if (
        preview &&
        preview.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          preview
        );
      }
    };
  }, [preview]);

  /*
  =====================================================
  MANUAL UPLOAD
  =====================================================
  */

  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        ui.selectImageAlert
      );

      event.target.value =
        "";

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        ui.imageTooLargeAlert
      );

      event.target.value =
        "";

      return;
    }

    if (
      preview &&
      preview.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        preview
      );
    }

    const imageUrl =
      URL.createObjectURL(
        file
      );

    setSelectedImage(
      file
    );

    setPreview(
      imageUrl
    );

    setGeneratedImages(
      []
    );

    setProductSaveStatus(
      ""
    );

    setProductSaveError(
      ""
    );

    resetProgress();

    event.target.value =
      "";
  };

  /*
  =====================================================
  STYLE
  =====================================================
  */

  const handleStyleSelect = (
    style
  ) => {
    if (loading) {
      return;
    }

    if (!style.available) {
      return;
    }

    setSelectedStyle(
      style.id
    );

    setGeneratedImages(
      []
    );

    setProductSaveStatus(
      ""
    );

    setProductSaveError(
      ""
    );

    resetProgress();
  };

  /*
  =====================================================
  CATEGORY
  =====================================================
  */

  const handleCategoryChange = (
    event
  ) => {
    if (loading) {
      return;
    }

    setSelectedCategory(
      event.target.value
    );

    setGeneratedImages(
      []
    );

    resetProgress();
  };

  /*
  =====================================================
  PROGRESS
  =====================================================
  */

  const updateProgressStep = (
    stepId,
    status,
    message
  ) => {
    setProgressSteps(
      (previousSteps) =>
        previousSteps.map(
          (step) =>
            step.id ===
            stepId
              ? {
                  ...step,
                  status,
                  message,
                }
              : step
        )
    );
  };

  /*
  =====================================================
  SAVE GENERATED IMAGE TO PRODUCT
  =====================================================
  */

  const saveGeneratedImageToProduct =
    async (
      imagePath,
      style
    ) => {
      const productId =
        selectedProduct?._id ||
        selectedProduct?.id;

      if (!productId) {
        return {
          saved: false,
          reason:
            ui.noProductSelected,
        };
      }

      try {
        const photoName =
          ui.styles[style]?.title ||
          style;

        setProductSaveStatus(
          ui.savingStylePhoto(photoName)
        );

        setProductSaveError(
          ""
        );

        let updatePayload =
          null;

        /*
        =================================================
        STUDIO
        =================================================
        */

        if (
          style ===
          "studio"
        ) {
          updatePayload = {
            studioImage:
              imagePath,

            /*
            Studio becomes the
            main marketplace image.
            */

            image:
              imagePath,
          };
        }

        /*
        =================================================
        CLOSE-UP
        =================================================
        */

        if (
          style ===
          "closeup"
        ) {
          updatePayload = {
            closeupImage:
              imagePath,
          };
        }

        if (style === "lifestyle") {
          updatePayload = { lifestyleImage: imagePath };
        }

        if (style === "model") {
          updatePayload = { modelImage: imagePath };
        }

        if (!updatePayload) {
          throw new Error(
            ui.unsupportedStyle
          );
        }

        const response =
          await fetch(
            `${BACKEND_URL}/api/products/${productId}`,
            {
              method:
                "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  updatePayload
                ),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              ui.photoCreatedNotSaved
          );
        }

        setProductSaveStatus(
          ui.savedStylePhoto(photoName)
        );

        return {
          saved: true,

          product:
            data.product ||
            data,
        };
      } catch (
        error
      ) {
        console.error(
          "Save generated image error:",
          error
        );

        const reason =
          error.message ||
          ui.updateFailedGeneric;

        setProductSaveError(
          reason
        );

        setProductSaveStatus(
          ui.photoCreatedNotSaved
        );

        return {
          saved: false,
          reason,
        };
      }
    };

  /*
  =====================================================
  GENERATE PHOTO
  =====================================================
  */

  const handleGenerateAll = async () => {
    if (!selectedImage) return alert(ui.uploadFirstAlert);
    try {
      setLoading(true); setGeneratedImages([]); resetProgress();
      updateProgressStep("background", "generating", ui.stepEnhancingUploaded);
      setProgressMessage(ui.creatingAllFormats);
      setProgressPercent(12);
      // All four routes run on this computer's Python/OpenCV pipeline; no Replicate request or credits.
      const stylesToCreate = ["studio", "lifestyle", "model", "closeup"];
      const images = [];
      for (let index = 0; index < stylesToCreate.length; index += 1) {
        const style = stylesToCreate[index];
        const styleLabel = ui.styles[style]?.title || style;
        setProgressMessage(ui.creatingStyleImage(styleLabel, index + 1));
        setProgressPercent(12 + index * 18);
        const formData = new FormData();
        formData.append("image", selectedImage, selectedImage.name || "product.jpg");
        formData.append("category", selectedCategory || "generic");
        const response = await fetch(`${BACKEND_URL}/api/photos/${style}`, { method: "POST", body: formData });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || `Unable to create the ${style} photo.`);
        if (!data.imageUrl) throw new Error(`The ${style} processor did not return an image.`);
        images.push({
          style,
          imageUrl: data.imageUrl.startsWith("http") ? data.imageUrl : `${BACKEND_URL}${data.imageUrl}`,
          title: ui.resultTitle(styleLabel),
          description: ui.resultsHelp,
          resolution: data.resolution || "High resolution",
          savedToProduct: false,
        });
      }
      updateProgressStep("background", "completed", ui.sourceEnhanced);
      updateProgressStep("crop", "completed", ui.compositionsCreated);
      updateProgressStep("lighting", "completed", ui.lightingAppliedAll);
      updateProgressStep("enhancement", "completed", ui.detailEnhancedAll);
      updateProgressStep("upscale", "completed", ui.allImagesReady);
      setProgressPercent(90);
      if (selectedProduct?._id || selectedProduct?.id) {
        for (const image of images) await saveGeneratedImageToProduct(image.imageUrl.replace(BACKEND_URL, ""), image.style);
        images.forEach((image) => { image.savedToProduct = true; });
      }
      setGeneratedImages(images); setProgressPercent(100);
      localStorage.setItem("karigarconnect-photoshoot-draft", JSON.stringify(images.map(({ style, imageUrl }) => ({ style, imageUrl }))));
      setProgressMessage(ui.allPhotosReadyCelebration);
    } catch (error) {
      console.error("All-photo generation error:", error);
      setErrorMessage(error.message || ui.genericGenerateError);
    } finally { setLoading(false); }
  };

  const handleGenerate =
    async () => {
      if (!selectedImage) {
        alert(
          "Please upload a product photo first."
        );

        return;
      }

      if (
        selectedStyle !==
          "studio" &&
        selectedStyle !==
          "closeup"
      ) {
        alert(
          "This photo style is coming soon."
        );

        return;
      }

      try {
        setLoading(true);

        setGeneratedImages(
          []
        );

        resetProgress();

        const formData =
          new FormData();

        formData.append(
          "image",
          selectedImage,
          selectedImage.name ||
            "product.jpg"
        );

        /*
        =================================================
        STUDIO
        =================================================
        */

        if (
          selectedStyle ===
          "studio"
        ) {
          updateProgressStep(
            "background",
            "generating",
            ui.stepTitles.background
          );

          setProgressMessage(
            ui.stepTitles.background
          );

          setProgressPercent(
            15
          );

          const response =
            await fetch(
              `${BACKEND_URL}/api/photos/studio`,
              {
                method:
                  "POST",
                body:
                  formData,
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to create Studio photo."
            );
          }

          updateProgressStep(
            "background",
            "completed",
            "Background removed successfully."
          );

          setProgressPercent(
            32
          );

          updateProgressStep(
            "crop",
            "generating",
            "Creating professional product framing..."
          );

          setProgressMessage(
            "Creating professional product framing..."
          );

          setProgressPercent(
            42
          );

          await wait(
            350
          );

          updateProgressStep(
            "crop",
            "completed",
            "Product automatically framed."
          );

          updateProgressStep(
            "lighting",
            "generating",
            "Applying studio lighting..."
          );

          setProgressMessage(
            "Applying professional studio lighting..."
          );

          setProgressPercent(
            55
          );

          await wait(
            350
          );

          updateProgressStep(
            "lighting",
            "completed",
            "Studio lighting applied."
          );

          updateProgressStep(
            "enhancement",
            "generating",
            "Enhancing product image quality..."
          );

          setProgressMessage(
            "Enhancing product image quality..."
          );

          setProgressPercent(
            68
          );

          await wait(
            350
          );

          updateProgressStep(
            "enhancement",
            "completed",
            "Image enhancement completed."
          );

          updateProgressStep(
            "upscale",
            "generating",
            ui.stepTitles.upscale
          );

          setProgressMessage(
            "Upscaling image to high resolution..."
          );

          setProgressPercent(
            80
          );

          await wait(
            700
          );

          if (
            !data.imageUrl
          ) {
            throw new Error(
              "Backend did not return an image URL."
            );
          }

          const imageUrl =
            data.imageUrl.startsWith(
              "http"
            )
              ? data.imageUrl
              : `${BACKEND_URL}${data.imageUrl}`;

          /*
          -----------------------------------------------
          SAVE STUDIO IMAGE TO PRODUCT
          -----------------------------------------------
          */

          let saveResult = {
            saved: false,
          };

          if (
            selectedProduct?._id ||
            selectedProduct?.id
          ) {
            setProgressMessage(
              ui.savingStylePhoto(ui.styles.studio.title)
            );

            setProgressPercent(
              94
            );

            saveResult =
              await saveGeneratedImageToProduct(
                data.imageUrl,
                "studio"
              );
          }

          updateProgressStep(
            "upscale",
            "completed",
            data.resolution
              ? `Final resolution: ${data.resolution}`
              : ui.allImagesReady
          );

          setProgressPercent(
            100
          );

          setGeneratedImages([
            {
              style:
                "studio",

              imageUrl,

              resolution:
                data.resolution ||
                "4320x4320",

              title:
                "Studio Product Photo",

              description:
                "Professional studio product photography.",

              savedToProduct:
                saveResult.saved,
            },
          ]);

          if (
            selectedProduct?._id ||
            selectedProduct?.id
          ) {
            setProgressMessage(
              saveResult.saved
                ? ui.savedStylePhoto(ui.styles.studio.title)
                : ui.photoCreatedNotSaved
            );
          } else {
            setProgressMessage(
              ui.allPhotosReadyCelebration
            );
          }

          await wait(
            650
          );

          setLoading(
            false
          );

          return;
        }

        /*
        =================================================
        CLOSE-UP
        =================================================
        */

        if (
          selectedStyle ===
          "closeup"
        ) {
          formData.append(
            "category",
            selectedCategory ||
              "generic"
          );

          updateProgressStep(
            "background",
            "generating",
            ui.stepTitles.background
          );

          setProgressMessage(
            ui.stepTitles.background
          );

          setProgressPercent(
            15
          );

          const response =
            await fetch(
              `${BACKEND_URL}/api/photos/closeup`,
              {
                method:
                  "POST",
                body:
                  formData,
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to create Close-up photo."
            );
          }

          updateProgressStep(
            "background",
            "completed",
            "Background removed successfully."
          );

          setProgressPercent(
            32
          );

          updateProgressStep(
            "crop",
            "generating",
            ui.creatingAllFormats
          );

          setProgressMessage(
            ui.compositionsCreated
          );

          setProgressPercent(
            44
          );

          await wait(
            350
          );

          updateProgressStep(
            "crop",
            "completed",
            ui.compositionsCreated
          );

          updateProgressStep(
            "lighting",
            "generating",
            ui.stepTitles.lighting
          );

          setProgressMessage(
            ui.lightingAppliedAll
          );

          setProgressPercent(
            56
          );

          await wait(
            350
          );

          updateProgressStep(
            "lighting",
            "completed",
            ui.lightingAppliedAll
          );

          updateProgressStep(
            "enhancement",
            "generating",
            ui.stepTitles.enhancement
          );

          setProgressMessage(
            ui.detailEnhancedAll
          );

          setProgressPercent(
            68
          );

          await wait(
            350
          );

          updateProgressStep(
            "enhancement",
            "completed",
            ui.detailEnhancedAll
          );

          updateProgressStep(
            "upscale",
            "generating",
            ui.stepTitles.upscale
          );

          setProgressMessage(
            ui.allImagesReady
          );

          setProgressPercent(
            80
          );

          await wait(
            700
          );

          if (
            !data.imageUrl
          ) {
            throw new Error(
              "Backend did not return an image URL."
            );
          }

          const imageUrl =
            data.imageUrl.startsWith(
              "http"
            )
              ? data.imageUrl
              : `${BACKEND_URL}${data.imageUrl}`;

          /*
          -----------------------------------------------
          SAVE CLOSE-UP IMAGE TO PRODUCT
          -----------------------------------------------
          */

          let saveResult = {
            saved: false,
          };

          if (
            selectedProduct?._id ||
            selectedProduct?.id
          ) {
            setProgressMessage(
              ui.savingStylePhoto(ui.styles.closeup.title)
            );

            setProgressPercent(
              94
            );

            saveResult =
              await saveGeneratedImageToProduct(
                data.imageUrl,
                "closeup"
              );
          }

          updateProgressStep(
            "upscale",
            "completed",
            data.resolution
              ? `Final resolution: ${data.resolution}`
              : ui.allImagesReady
          );

          setProgressPercent(
            100
          );

          setGeneratedImages([
            {
              style:
                "closeup",

              imageUrl,

              resolution:
                data.resolution ||
                "4320x4320",

              title:
                "Close-up Product Photo",

              description:
                "Detailed product photo focused on craftsmanship.",

              savedToProduct:
                saveResult.saved,
            },
          ]);

          if (
            selectedProduct?._id ||
            selectedProduct?.id
          ) {
            setProgressMessage(
              saveResult.saved
                ? ui.savedStylePhoto(ui.styles.closeup.title)
                : ui.photoCreatedNotSaved
            );
          } else {
            setProgressMessage(
              ui.allPhotosReadyCelebration
            );
          }

          await wait(
            650
          );

          setLoading(
            false
          );

          return;
        }
      } catch (
        error
      ) {
        console.error(
          "Photo processing error:",
          error
        );

        const message =
          error.message ||
          ui.genericGenerateError;

        setErrorMessage(
          message
        );

        setProgressMessage(
          ui.processingFailedHeading
        );

        setProgressSteps(
          (previousSteps) =>
            previousSteps.map(
              (step) => {
                if (
                  step.status ===
                  "generating"
                ) {
                  return {
                    ...step,
                    status:
                      "error",
                    message,
                  };
                }

                return step;
              }
            )
        );

        setProgressPercent(
          0
        );

        setLoading(
          false
        );
      }
    };

  /*
  =====================================================
  REMOVE PHOTO
  =====================================================
  */

  const handleRemovePhoto =
    () => {
      if (loading) {
        return;
      }

      if (
        preview &&
        preview.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          preview
        );
      }

      setSelectedImage(
        null
      );

      setPreview("");

      setGeneratedImages(
        []
      );

      setProductSaveStatus(
        ""
      );

      setProductSaveError(
        ""
      );

      resetProgress();
    };

  /*
  =====================================================
  DOWNLOAD
  =====================================================
  */

  const downloadImage =
    async (
      image,
      style
    ) => {
      try {
        const response =
          await fetch(
            image
          );

        if (
          !response.ok
        ) {
          throw new Error(
            "Unable to download the image."
          );
        }

        const blob =
          await response.blob();

        const blobUrl =
          URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href =
          blobUrl;

        link.download =
          `karigarconnect-${style}.jpg`;

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
          blobUrl
        );
      } catch (
        error
      ) {
        console.error(
          "Download error:",
          error
        );

        window.open(
          image,
          "_blank"
        );
      }
    };

  /*
  =====================================================
  PROCESSING MODAL
  =====================================================
  */

  const ProcessingModal =
    loading &&
    typeof document !==
      "undefined"
      ? createPortal(
          <div
            className="ai-processing-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={ui.processingFailedHeading}
          >
            <div className="ai-processing-card">

              <div className="ai-processing-icon">
                ✨
              </div>

              <p className="ai-processing-label">
                {ui.modalEngineLabel}
              </p>

              <h2>
                {ui.modalHeadingBefore}
                <span>
                  {" "}
                  {ui.styles[selectedStyle]?.title || ui.styles.studio.title}{" "}
                  {ui.modalHeadingAfter}
                </span>
              </h2>

              <p className="ai-processing-description">
                {ui.modalDescription}
              </p>

              <div className="ai-progress-top">

                <span>
                  {progressMessage}
                </span>

                <strong>
                  {progressPercent}%
                </strong>

              </div>

              <div className="ai-progress-bar-container">

                <div
                  className="ai-progress-bar"
                  style={{
                    width:
                      `${progressPercent}%`,
                  }}
                />

              </div>

              <div className="ai-progress-steps">

                {progressSteps.map(
                  (step) => {
                    let icon =
                      "○";

                    if (
                      step.status ===
                      "generating"
                    ) {
                      icon =
                        "⏳";
                    }

                    if (
                      step.status ===
                      "completed"
                    ) {
                      icon =
                        "✓";
                    }

                    if (
                      step.status ===
                      "error"
                    ) {
                      icon =
                        "⚠";
                    }

                    return (
                      <div
                        key={
                          step.id
                        }
                        className={`ai-progress-step ${step.status}`}
                      >

                        <div className="ai-step-icon">
                          {icon}
                        </div>

                        <div className="ai-step-content">

                          <strong>
                            {
                              step.title
                            }
                          </strong>

                          <p>
                            {
                              step.message
                            }
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

              {productSaveStatus && (
                <div className="product-save-status">
                  {
                    productSaveStatus
                  }
                </div>
              )}

              {productSaveError && (
                <div className="ai-error-box">

                  <strong>
                    {ui.productUpdateFailedHeading}
                  </strong>

                  <p>
                    {
                      productSaveError
                    }
                  </p>

                </div>
              )}

              {errorMessage && (
                <div className="ai-error-box">

                  <strong>
                    {ui.processingFailedHeading}
                  </strong>

                  <p>
                    {
                      errorMessage
                    }
                  </p>

                </div>
              )}

              {!errorMessage &&
                !productSaveError && (
                  <p className="ai-processing-note">
                    {ui.modalFirstRunNote}
                  </p>
                )}

            </div>
          </div>,
          document.body
        )
      : null;

  /*
  =====================================================
  PAGE
  =====================================================
  */

  return (
    <div className="photoshoot-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero-section">

        <p className="eyebrow">
          {ui.eyebrow}
        </p>

        <h1>
          {ui.heroTitleBefore}
          <span>
            {" "}
            {ui.heroTitleHighlight}
          </span>
        </h1>

        <p className="hero-description">
          {ui.heroDescription}
        </p>

      </section>

      {/* =================================================
          WORKSPACE
      ================================================= */}

      <section className="workspace">

        {/* ================= UPLOAD ================= */}

        <div className="upload-card">

          <div className="section-heading">

            <div>

              <p className="step-label">
                {ui.step1Label}
              </p>

              <h2>
                {selectedProduct
                  ? ui.uploadHeadingProduct
                  : ui.uploadHeadingGeneric}
              </h2>

            </div>

            <span className="heading-icon">
              📷
            </span>

          </div>

          <label
            className={`upload-area ${
              loadingProductImage
                ? "loading-product-image"
                : ""
            }`}
          >

            {loadingProductImage ? (
              <>
                <div className="upload-icon">
                  ⏳
                </div>

                <h3>
                  {ui.loadingProductTitle}
                </h3>

                <p>
                  {ui.loadingProductDescription}
                </p>
              </>
            ) : preview ? (
              <div className="uploaded-preview-container">

                <img
                  src={preview}
                  alt="Selected product"
                  className="uploaded-image"
                />

                <span className="preview-label">
                  {selectedProduct
                    ? ui.previewLabelSaved
                    : ui.previewLabelOriginal}
                </span>

              </div>
            ) : (
              <>
                <div className="upload-icon">
                  ↑
                </div>

                <h3>
                  {ui.uploadTitle}
                </h3>

                <p>
                  {ui.uploadHint}
                </p>

                <span className="upload-button">
                  {ui.choosePhoto}
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
              hidden
              disabled={
                loading ||
                loadingProductImage
              }
            />

          </label>

          {preview && (
            <button
              type="button"
              className="change-photo-button"
              onClick={
                handleRemovePhoto
              }
              disabled={
                loading
              }
            >
              {ui.removePhoto}
            </button>
          )}

        </div>

        {/* ================= SETTINGS ================= */}

        <div className="settings-card">

          <div className="section-heading">

            <div>

              <p className="step-label">
                {ui.step2Label}
              </p>

              <h2>
                {ui.styleHeading}
              </h2>

              <p className="section-help">
                {ui.styleHelp}
              </p>

            </div>

            <span className="heading-icon">
              ✨
            </span>

          </div>

          {/* STYLE GRID */}

          <div className="style-grid">

            {localizedStyles.map(
              (item) => {
                const isSelected =
                  selectedStyle ===
                  item.id;

                return (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    className={`style-option ${
                      isSelected
                        ? "active"
                        : ""
                    } ${
                      !item.available
                        ? "coming-soon"
                        : ""
                    }`}
                    onClick={() =>
                      handleStyleSelect(
                        item
                      )
                    }
                    disabled={
                      loading ||
                      !item.available
                    }
                  >

                    <span>
                      {item.icon}
                    </span>

                    <strong>
                      {
                        item.title
                      }
                    </strong>

                    <small>
                      {
                        item.subtitle
                      }
                    </small>

                    {!item.available && (
                      <em>
                        {ui.comingSoon}
                      </em>
                    )}

                  </button>
                );
              }
            )}

          </div>

          {/* ================= MANUAL CATEGORY ================= */}

          {selectedStyle ===
            "closeup" &&
            !selectedProduct && (
              <div className="category-field">

                <div className="category-field-header">

                  <div>

                    <label
                      htmlFor="product-category"
                    >
                      {ui.categoryFieldLabel}
                    </label>

                    <p>
                      {ui.categoryFieldHelp}
                    </p>

                  </div>

                  <span>
                    ✨ AI
                  </span>

                </div>

                <select
                  id="product-category"
                  value={
                    selectedCategory
                  }
                  onChange={
                    handleCategoryChange
                  }
                  disabled={
                    loading
                  }
                >

                  {localizedCategories.map(
                    (
                      category
                    ) => (
                      <option
                        key={
                          category.value
                        }
                        value={
                          category.value
                        }
                      >
                        {
                          category.label
                        }
                      </option>
                    )
                  )}

                </select>

              </div>
            )}

          {/* ================= AUTOMATIC CATEGORY ================= */}

          {selectedStyle ===
            "closeup" &&
            selectedProduct && (
              <div className="category-auto">

                <div>

                  <strong>
                    {ui.categoryAutoLabel}
                  </strong>

                  <span>
                    {
                      selectedProduct.category ||
                      selectedCategory
                    }
                  </span>

                </div>

                <small>
                  {ui.categoryAutoHelp}
                </small>

              </div>
            )}

          {/* ================= FEATURES ================= */}

          <div className="processing-features">

            <span>
              {ui.featureBgRemoval}
            </span>

            <span>
              {ui.featureComposition}
            </span>

            <span>
              {ui.featureLighting}
            </span>

            <span>
              {ui.featureEnhancement}
            </span>

          </div>

          {/* ================= GENERATE ================= */}

          <button
            type="button"
            className="generate-button"
            onClick={
              handleGenerateAll
            }
            disabled={
              loading ||
              loadingProductImage ||
              !selectedImage
            }
          >
            {loading
              ? ui.generateButtonBusy
              : ui.generateButton}
          </button>

          <p className="privacy-note">
            {ui.privacyNote}
          </p>

        </div>

      </section>

      {/* =================================================
          ERROR
      ================================================= */}

      {errorMessage &&
        !loading && (
          <div className="photo-error-state">

            <strong>
              {ui.errorHeading}
            </strong>

            <p>
              {
                errorMessage
              }
            </p>

            <button
              type="button"
              onClick={
                handleGenerateAll
              }
              disabled={
                loading ||
                !selectedImage
              }
            >
              {ui.tryAgain}
            </button>

          </div>
        )}

      {/* =================================================
          RESULTS
      ================================================= */}

      {generatedImages.length >
        0 && (
        <section className="results-section">

          <div className="results-heading">

            <div>

              <p className="step-label">
                {ui.step3Label}
              </p>

              <h2>
                {ui.resultsHeading}
              </h2>

              <p className="section-help">
                {ui.resultsHelp}
              </p>

              {selectedProduct &&
                productSaveStatus && (
                  <p className="product-save-result">
                    {
                      productSaveStatus
                    }
                  </p>
                )}

              {selectedProduct &&
                productSaveError && (
                  <p className="product-save-error">
                    {
                      productSaveError
                    }
                  </p>
                )}

            </div>

            <span className="success-label">
              {ui.readyBadge}
            </span>

          </div>

          <div className="image-grid">

            {generatedImages.map(
              (
                item,
                index
              ) => {

                const image =
                  typeof item ===
                  "string"
                    ? item
                    : item.imageUrl;

                const style =
                  typeof item ===
                  "string"
                    ? "studio"
                    : item.style ||
                      "studio";

                const resolution =
                  typeof item ===
                  "string"
                    ? "High resolution"
                    : item.resolution ||
                      "4320x4320";

                const label =
                  ui.styles[style]?.title ||
                  style.charAt(0).toUpperCase() + style.slice(1);

                return (
                  <div
                    className="result-card"
                    key={`${image}-${index}`}
                  >

                    <div className="result-image-container">

                      <img
                        src={image}
                        alt={
                          `Professional ${label} product photo`
                        }
                      />

                      <span className="result-style-badge">
                        {label}
                      </span>

                    </div>

                    <div className="result-footer">

                      <div>

                        <strong>
                          {ui.resultTitle(label)}
                        </strong>

                        <small>
                          {ui.resultCaption(resolution)}
                        </small>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          downloadImage(
                            image,
                            style
                          )
                        }
                        className="download-button"
                        title={ui.downloadTitle}
                      >
                        ↓
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>

          {!selectedProduct && onNavigate && (
            <div className="photo-next-actions">
              <button type="button" className="generate-button" onClick={() => onNavigate("add-product")}>{ui.continueManual}</button>
              <button type="button" className="change-photo-button" onClick={() => onNavigate("voice")}>{ui.continueVoice}</button>
            </div>
          )}

        </section>
      )}

      {ProcessingModal}

    </div>
  );
}

export default Photoshoot;