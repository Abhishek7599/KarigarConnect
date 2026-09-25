

import React, {
  useEffect,
  useState,
} from "react";

import { useLanguage } from "../i18n/LanguageContext";
import "./Marketplace.css";

const BACKEND_URL =
  import.meta.env.VITE_API_URL;

const ARTISAN_ID =
  "6aa7d975f3c555e19062b4cd";

const MARKETPLACE_TRANSLATIONS = {
  en: {
    eyebrow: "SELL ONLINE",
    title: "Take your craft online",
    description:
      "Prepare your handmade products for digital selling with better listings, complete product information and marketplace-ready details.",

    readyTitle: "Marketplace readiness",
    readyDescription:
      "Your products can be prepared here before connecting them to an online marketplace.",

    productCatalog: "Product Catalog",
    productCatalogDesc:
      "Keep names, descriptions, prices, stock and product details organized.",

    productImages: "Professional Images",
    productImagesDesc:
      "Use AI Photoshoot to create clean images suitable for online product listings.",

    smartPricing: "Smart Pricing",
    smartPricingDesc:
      "Use AI Pricing to estimate a practical selling price before publishing.",

    multilingual: "Multilingual Listings",
    multilingualDesc:
      "Create product information in multiple Indian languages for wider reach.",

    ondcReady: "ONDC Ready",
    ondcReadyDesc:
      "Prepare your catalog and product information for future marketplace connectivity.",

    comingSoon: "CONNECTIVITY COMING SOON",

    checklist: "Marketplace checklist",
    checklistDescription:
      "Complete these steps before taking your products online.",

    step1: "Add your product",
    step1Desc:
      "Create a complete product listing with accurate information.",

    step2: "Create product photos",
    step2Desc:
      "Generate professional marketplace-ready images.",

    step3: "Set your price",
    step3Desc:
      "Use AI Pricing to get a useful price suggestion.",

    step4: "Publish your product",
    step4Desc:
      "Move your finished product from draft to published.",

    start: "Start",
    products: "View Products",
    photoshoot: "AI Photoshoot",
    pricing: "AI Pricing",

    note:
      "Marketplace connectivity is not active yet. This page currently prepares your catalog for future integration.",
  },

  hi: {
    eyebrow: "ऑनलाइन बेचें",
    title: "अपनी कला को ऑनलाइन ले जाएं",
    description:
      "बेहतर लिस्टिंग, पूरी उत्पाद जानकारी और मार्केटप्लेस के लिए तैयार विवरण के साथ अपने हस्तनिर्मित उत्पादों को डिजिटल बिक्री के लिए तैयार करें।",

    readyTitle: "मार्केटप्लेस तैयारी",
    readyDescription:
      "ऑनलाइन मार्केटप्लेस से जोड़ने से पहले यहां अपने उत्पाद तैयार करें।",

    productCatalog: "प्रोडक्ट कैटलॉग",
    productCatalogDesc:
      "नाम, विवरण, कीमत, स्टॉक और प्रोडक्ट जानकारी को व्यवस्थित रखें।",

    productImages: "प्रोफेशनल फोटो",
    productImagesDesc:
      "AI फोटोशूट से ऑनलाइन लिस्टिंग के लिए साफ और बेहतर फोटो बनाएं।",

    smartPricing: "स्मार्ट प्राइसिंग",
    smartPricingDesc:
      "पब्लिश करने से पहले AI प्राइसिंग से व्यावहारिक बिक्री कीमत का सुझाव लें।",

    multilingual: "बहुभाषी लिस्टिंग",
    multilingualDesc:
      "अधिक लोगों तक पहुंचने के लिए कई भारतीय भाषाओं में प्रोडक्ट जानकारी तैयार करें।",

    ondcReady: "ONDC तैयारी",
    ondcReadyDesc:
      "भविष्य के मार्केटप्लेस कनेक्शन के लिए अपना कैटलॉग और प्रोडक्ट डेटा तैयार करें।",

    comingSoon: "कनेक्टिविटी जल्द आएगी",

    checklist: "मार्केटप्लेस चेकलिस्ट",
    checklistDescription:
      "अपने प्रोडक्ट को ऑनलाइन ले जाने से पहले ये चरण पूरे करें।",

    step1: "प्रोडक्ट जोड़ें",
    step1Desc:
      "सही जानकारी के साथ पूरी प्रोडक्ट लिस्टिंग बनाएं।",

    step2: "प्रोडक्ट फोटो बनाएं",
    step2Desc:
      "प्रोफेशनल मार्केटप्लेस-तैयार फोटो बनाएं।",

    step3: "कीमत तय करें",
    step3Desc:
      "AI प्राइसिंग से उपयोगी कीमत का सुझाव लें।",

    step4: "प्रोडक्ट पब्लिश करें",
    step4Desc:
      "तैयार प्रोडक्ट को ड्राफ्ट से पब्लिश्ड करें।",

    start: "शुरू करें",
    products: "प्रोडक्ट देखें",
    photoshoot: "AI फोटोशूट",
    pricing: "AI प्राइसिंग",

    note:
      "मार्केटप्लेस कनेक्टिविटी अभी सक्रिय नहीं है। यह पेज फिलहाल आपके कैटलॉग को भविष्य के इंटीग्रेशन के लिए तैयार करता है।",
  },

  bn: {
    eyebrow: "অনলাইনে বিক্রি করুন",
    title: "আপনার শিল্পকে অনলাইনে নিন",
    description:
      "ভালো লিস্টিং, সম্পূর্ণ পণ্যের তথ্য এবং মার্কেটপ্লেস-প্রস্তুত বিবরণ দিয়ে আপনার হাতে তৈরি পণ্যকে অনলাইন বিক্রির জন্য প্রস্তুত করুন।",

    readyTitle: "মার্কেটপ্লেস প্রস্তুতি",
    readyDescription:
      "অনলাইন মার্কেটপ্লেসে সংযোগের আগে এখানে আপনার পণ্য প্রস্তুত করুন।",

    productCatalog: "পণ্য ক্যাটালগ",
    productCatalogDesc:
      "নাম, বিবরণ, মূল্য, স্টক এবং পণ্যের তথ্য সংগঠিত রাখুন।",

    productImages: "প্রফেশনাল ছবি",
    productImagesDesc:
      "AI ফটোশুট দিয়ে অনলাইন লিস্টিংয়ের জন্য পরিষ্কার ছবি তৈরি করুন।",

    smartPricing: "স্মার্ট প্রাইসিং",
    smartPricingDesc:
      "প্রকাশের আগে AI Pricing দিয়ে ব্যবহারিক বিক্রয় মূল্য পান।",

    multilingual: "বহুভাষিক লিস্টিং",
    multilingualDesc:
      "আরও মানুষের কাছে পৌঁছাতে বিভিন্ন ভারতীয় ভাষায় পণ্যের তথ্য তৈরি করুন।",

    ondcReady: "ONDC প্রস্তুতি",
    ondcReadyDesc:
      "ভবিষ্যৎ মার্কেটপ্লেস সংযোগের জন্য আপনার ক্যাটালগ ও পণ্যের তথ্য প্রস্তুত করুন।",

    comingSoon: "কানেক্টিভিটি শীঘ্রই আসছে",

    checklist: "মার্কেটপ্লেস চেকলিস্ট",
    checklistDescription:
      "পণ্য অনলাইনে নেওয়ার আগে এই ধাপগুলি সম্পূর্ণ করুন।",

    step1: "পণ্য যোগ করুন",
    step1Desc:
      "সঠিক তথ্য দিয়ে সম্পূর্ণ পণ্য লিস্টিং তৈরি করুন।",

    step2: "পণ্যের ছবি তৈরি করুন",
    step2Desc:
      "প্রফেশনাল মার্কেটপ্লেস-প্রস্তুত ছবি তৈরি করুন।",

    step3: "দাম নির্ধারণ করুন",
    step3Desc:
      "AI Pricing দিয়ে একটি ব্যবহারিক দামের পরামর্শ নিন।",

    step4: "পণ্য প্রকাশ করুন",
    step4Desc:
      "প্রস্তুত পণ্যকে ড্রাফট থেকে প্রকাশ করুন।",

    start: "শুরু করুন",
    products: "পণ্য দেখুন",
    photoshoot: "AI ফটোশুট",
    pricing: "AI প্রাইসিং",

    note:
      "মার্কেটপ্লেস সংযোগ এখনও সক্রিয় নয়। এই পেজটি আপাতত ভবিষ্যৎ ইন্টিগ্রেশনের জন্য আপনার ক্যাটালগ প্রস্তুত করে।",
  },

  ta: {
    eyebrow: "ஆன்லைனில் விற்கவும்",
    title: "உங்கள் கைவினையை ஆன்லைனில் கொண்டு செல்லுங்கள்",
    description:
      "சிறந்த பட்டியல், முழுமையான தயாரிப்பு தகவல் மற்றும் மார்க்கெட்ப்ளேஸ் தயாரான விவரங்களுடன் உங்கள் கைவினைப் பொருட்களை ஆன்லைன் விற்பனைக்கு தயாராக்குங்கள்.",

    readyTitle: "மார்க்கெட்ப்ளேஸ் தயார்நிலை",
    readyDescription:
      "ஆன்லைன் மார்க்கெட்ப்ளேஸ் இணைப்பிற்கு முன் உங்கள் தயாரிப்புகளை இங்கே தயாராக்குங்கள்.",

    productCatalog: "தயாரிப்பு பட்டியல்",
    productCatalogDesc:
      "பெயர், விவரம், விலை, ஸ்டாக் மற்றும் தயாரிப்பு தகவல்களை ஒழுங்காக வைத்திருங்கள்.",

    productImages: "தொழில்முறை படங்கள்",
    productImagesDesc:
      "AI போட்டோஷூட் மூலம் ஆன்லைன் பட்டியலுக்கான தெளிவான படங்களை உருவாக்குங்கள்.",

    smartPricing: "ஸ்மார்ட் விலை",
    smartPricingDesc:
      "வெளியிடுவதற்கு முன் AI Pricing மூலம் நடைமுறை விற்பனை விலையைப் பெறுங்கள்.",

    multilingual: "பலமொழி பட்டியல்கள்",
    multilingualDesc:
      "அதிகமான மக்களை அடைய இந்திய மொழிகளில் தயாரிப்பு தகவலை உருவாக்குங்கள்.",

    ondcReady: "ONDC தயார்நிலை",
    ondcReadyDesc:
      "எதிர்கால மார்க்கெட்ப்ளேஸ் இணைப்பிற்காக உங்கள் பட்டியல் மற்றும் தயாரிப்பு தகவலை தயார் செய்யுங்கள்.",

    comingSoon: "இணைப்பு விரைவில் வருகிறது",

    checklist: "மார்க்கெட்ப்ளேஸ் சரிபார்ப்பு பட்டியல்",
    checklistDescription:
      "உங்கள் தயாரிப்புகளை ஆன்லைனில் கொண்டு செல்லும் முன் இந்த படிகளை முடிக்கவும்.",

    step1: "தயாரிப்பு சேர்க்கவும்",
    step1Desc:
      "சரியான தகவலுடன் முழுமையான தயாரிப்பு பட்டியலை உருவாக்குங்கள்.",

    step2: "தயாரிப்பு படங்களை உருவாக்கவும்",
    step2Desc:
      "தொழில்முறை மார்க்கெட்ப்ளேஸ் படங்களை உருவாக்குங்கள்.",

    step3: "விலையை அமைக்கவும்",
    step3Desc:
      "AI Pricing மூலம் பயனுள்ள விலை பரிந்துரையைப் பெறுங்கள்.",

    step4: "தயாரிப்பை வெளியிடவும்",
    step4Desc:
      "தயாரான தயாரிப்பை draft இலிருந்து published ஆக மாற்றுங்கள்.",

    start: "தொடங்கு",
    products: "தயாரிப்புகளைப் பார்க்கவும்",
    photoshoot: "AI போட்டோஷூட்",
    pricing: "AI விலை நிர்ணயம்",

    note:
      "மார்க்கெட்ப்ளேஸ் இணைப்பு இன்னும் செயல்படுத்தப்படவில்லை. இந்தப் பக்கம் எதிர்கால இணைப்பிற்காக உங்கள் பட்டியலைத் தயாரிக்கிறது.",
  },

  te: {
    eyebrow: "ఆన్‌లైన్‌లో అమ్మండి",
    title: "మీ కళను ఆన్‌లైన్‌లోకి తీసుకెళ్లండి",
    description:
      "మెరుగైన లిస్టింగ్, పూర్తి ఉత్పత్తి సమాచారం మరియు మార్కెట్‌ప్లేస్‌కు సిద్ధమైన వివరాలతో మీ చేతిపనులను ఆన్‌లైన్ విక్రయానికి సిద్ధం చేయండి.",

    readyTitle: "మార్కెట్‌ప్లేస్ సిద్ధత",
    readyDescription:
      "ఆన్‌లైన్ మార్కెట్‌ప్లేస్‌కు కనెక్ట్ చేయడానికి ముందు మీ ఉత్పత్తులను ఇక్కడ సిద్ధం చేయండి.",

    productCatalog: "ఉత్పత్తి కేటలాగ్",
    productCatalogDesc:
      "పేరు, వివరణ, ధర, స్టాక్ మరియు ఉత్పత్తి వివరాలను క్రమబద్ధంగా ఉంచండి.",

    productImages: "ప్రొఫెషనల్ చిత్రాలు",
    productImagesDesc:
      "AI ఫోటోషూట్‌తో ఆన్‌లైన్ లిస్టింగ్‌లకు సరిపోయే చిత్రాలను రూపొందించండి.",

    smartPricing: "స్మార్ట్ ప్రైసింగ్",
    smartPricingDesc:
      "ప్రచురించడానికి ముందు AI Pricing ద్వారా ఉపయోగకరమైన అమ్మకపు ధర పొందండి.",

    multilingual: "బహుభాషా లిస్టింగ్‌లు",
    multilingualDesc:
      "ఎక్కువ మంది వినియోగదారులను చేరుకోవడానికి భారతీయ భాషల్లో ఉత్పత్తి సమాచారాన్ని రూపొందించండి.",

    ondcReady: "ONDC సిద్ధత",
    ondcReadyDesc:
      "భవిష్యత్ మార్కెట్‌ప్లేస్ కనెక్షన్ల కోసం మీ కేటలాగ్ మరియు ఉత్పత్తి సమాచారాన్ని సిద్ధం చేయండి.",

    comingSoon: "కనెక్టివిటీ త్వరలో వస్తుంది",

    checklist: "మార్కెట్‌ప్లేస్ చెక్‌లిస్ట్",
    checklistDescription:
      "మీ ఉత్పత్తులను ఆన్‌లైన్‌లోకి తీసుకెళ్లే ముందు ఈ దశలను పూర్తి చేయండి.",

    step1: "ఉత్పత్తిని జోడించండి",
    step1Desc:
      "సరైన సమాచారంతో పూర్తి ఉత్పత్తి లిస్టింగ్ రూపొందించండి.",

    step2: "ఉత్పత్తి చిత్రాలు రూపొందించండి",
    step2Desc:
      "ప్రొఫెషనల్ మార్కెట్‌ప్లేస్‌కు సిద్ధమైన చిత్రాలను రూపొందించండి.",

    step3: "ధరను నిర్ణయించండి",
    step3Desc:
      "AI Pricing ద్వారా ఉపయోగకరమైన ధర సూచన పొందండి.",

    step4: "ఉత్పత్తిని ప్రచురించండి",
    step4Desc:
      "పూర్తయిన ఉత్పత్తిని draft నుండి published గా మార్చండి.",

    start: "ప్రారంభించండి",
    products: "ఉత్పత్తులను చూడండి",
    photoshoot: "AI ఫోటోషూట్",
    pricing: "AI ప్రైసింగ్",

    note:
      "మార్కెట్‌ప్లేస్ కనెక్టివిటీ ఇంకా సక్రియంగా లేదు. ఈ పేజీ భవిష్యత్ ఇంటిగ్రేషన్ కోసం మీ కేటలాగ్‌ను సిద్ధం చేస్తుంది.",
  },

  mr: {
    eyebrow: "ऑनलाइन विक्री करा",
    title: "तुमची कला ऑनलाइन घेऊन जा",
    description:
      "चांगली लिस्टिंग, संपूर्ण उत्पादन माहिती आणि मार्केटप्लेससाठी तयार तपशीलांसह तुमची हस्तनिर्मित उत्पादने ऑनलाइन विक्रीसाठी तयार करा.",

    readyTitle: "मार्केटप्लेस तयारी",
    readyDescription:
      "ऑनलाइन मार्केटप्लेसशी जोडण्यापूर्वी तुमची उत्पादने येथे तयार करा.",

    productCatalog: "उत्पादन कॅटलॉग",
    productCatalogDesc:
      "नाव, माहिती, किंमत, स्टॉक आणि उत्पादन तपशील व्यवस्थित ठेवा.",

    productImages: "प्रोफेशनल फोटो",
    productImagesDesc:
      "AI फोटोशूट वापरून ऑनलाइन लिस्टिंगसाठी चांगले फोटो तयार करा.",

    smartPricing: "स्मार्ट प्राइसिंग",
    smartPricingDesc:
      "पब्लिश करण्यापूर्वी AI Pricing वापरून योग्य विक्री किंमत मिळवा.",

    multilingual: "बहुभाषिक लिस्टिंग",
    multilingualDesc:
      "अधिक लोकांपर्यंत पोहोचण्यासाठी अनेक भारतीय भाषांमध्ये उत्पादन माहिती तयार करा.",

    ondcReady: "ONDC तयारी",
    ondcReadyDesc:
      "भविष्यातील मार्केटप्लेस कनेक्शनसाठी तुमचा कॅटलॉग आणि उत्पादन माहिती तयार करा.",

    comingSoon: "कनेक्टिव्हिटी लवकरच येत आहे",

    checklist: "मार्केटप्लेस चेकलिस्ट",
    checklistDescription:
      "उत्पादने ऑनलाइन नेण्यापूर्वी हे टप्पे पूर्ण करा.",

    step1: "उत्पादन जोडा",
    step1Desc:
      "अचूक माहितीसह पूर्ण उत्पादन लिस्टिंग तयार करा.",

    step2: "उत्पादन फोटो तयार करा",
    step2Desc:
      "प्रोफेशनल मार्केटप्लेससाठी तयार फोटो बनवा.",

    step3: "किंमत ठरवा",
    step3Desc:
      "AI Pricing वापरून उपयोगी किंमत सूचना मिळवा.",

    step4: "उत्पादन पब्लिश करा",
    step4Desc:
      "तयार उत्पादनाला draft मधून published करा.",

    start: "सुरू करा",
    products: "उत्पादने पहा",
    photoshoot: "AI फोटोशूट",
    pricing: "AI प्राइसिंग",

    note:
      "मार्केटप्लेस कनेक्टिव्हिटी अजून सक्रिय नाही. हे पेज भविष्यातील इंटिग्रेशनसाठी तुमचा कॅटलॉग तयार करते.",
  },

  gu: {
    eyebrow: "ઓનલાઇન વેચો",
    title: "તમારી કારીગરીને ઓનલાઈન લઈ જાઓ",
    description:
      "સારી લિસ્ટિંગ, સંપૂર્ણ પ્રોડક્ટ માહિતી અને માર્કેટપ્લેસ-તૈયાર વિગતો સાથે તમારા હસ્તનિર્મિત ઉત્પાદનોને ઓનલાઈન વેચાણ માટે તૈયાર કરો.",

    readyTitle: "માર્કેટપ્લેસ તૈયારી",
    readyDescription:
      "ઓનલાઇન માર્કેટપ્લેસ સાથે જોડતા પહેલા તમારા ઉત્પાદનો અહીં તૈયાર કરો.",

    productCatalog: "પ્રોડક્ટ કેટલોગ",
    productCatalogDesc:
      "નામ, વર્ણન, કિંમત, સ્ટોક અને ઉત્પાદન માહિતી ગોઠવેલી રાખો.",

    productImages: "પ્રોફેશનલ ફોટા",
    productImagesDesc:
      "AI ફોટોશૂટથી ઓનલાઈન લિસ્ટિંગ માટે સુંદર ફોટા બનાવો.",

    smartPricing: "સ્માર્ટ પ્રાઇસિંગ",
    smartPricingDesc:
      "પબ્લિશ કરતા પહેલા AI Pricing વડે ઉપયોગી વેચાણ કિંમત મેળવો.",

    multilingual: "બહુભાષી લિસ્ટિંગ",
    multilingualDesc:
      "વધુ લોકો સુધી પહોંચવા માટે વિવિધ ભારતીય ભાષાઓમાં પ્રોડક્ટ માહિતી બનાવો.",

    ondcReady: "ONDC તૈયારી",
    ondcReadyDesc:
      "ભવિષ્યના માર્કેટપ્લેસ કનેક્શન માટે તમારો કેટલોગ અને પ્રોડક્ટ માહિતી તૈયાર કરો.",

    comingSoon: "કનેક્ટિવિટી ટૂંક સમયમાં આવશે",

    checklist: "માર્કેટપ્લેસ ચેકલિસ્ટ",
    checklistDescription:
      "તમારા ઉત્પાદનો ઓનલાઇન લેતા પહેલા આ પગલાં પૂર્ણ કરો.",

    step1: "પ્રોડક્ટ ઉમેરો",
    step1Desc:
      "સચોટ માહિતી સાથે સંપૂર્ણ પ્રોડક્ટ લિસ્ટિંગ બનાવો.",

    step2: "પ્રોડક્ટ ફોટા બનાવો",
    step2Desc:
      "પ્રોફેશનલ માર્કેટપ્લેસ-તૈયાર ફોટા બનાવો.",

    step3: "કિંમત નક્કી કરો",
    step3Desc:
      "AI Pricing દ્વારા ઉપયોગી કિંમતનો સૂચન મેળવો.",

    step4: "પ્રોડક્ટ પબ્લિશ કરો",
    step4Desc:
      "તૈયાર પ્રોડક્ટને draftમાંથી published કરો.",

    start: "શરૂ કરો",
    products: "પ્રોડક્ટ જુઓ",
    photoshoot: "AI ફોટોશૂટ",
    pricing: "AI પ્રાઇસિંગ",

    note:
      "માર્કેટપ્લેસ કનેક્ટિવિટી હજુ સક્રિય નથી. આ પેજ ભવિષ્યના ઇન્ટિગ્રેશન માટે તમારો કેટલોગ તૈયાર કરે છે.",
  },

  kn: {
    eyebrow: "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಮಾರಾಟ ಮಾಡಿ",
    title: "ನಿಮ್ಮ ಕಲೆಯನ್ನು ಆನ್‌ಲೈನ್‌ಗೆ ತೆಗೆದುಕೊಂಡು ಹೋಗಿ",
    description:
      "ಉತ್ತಮ ಲಿಸ್ಟಿಂಗ್, ಸಂಪೂರ್ಣ ಉತ್ಪನ್ನ ಮಾಹಿತಿ ಮತ್ತು ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್‌ಗೆ ಸಿದ್ಧ ವಿವರಗಳೊಂದಿಗೆ ನಿಮ್ಮ ಕೈತಯಾರಿಸಿದ ಉತ್ಪನ್ನಗಳನ್ನು ಆನ್‌ಲೈನ್ ಮಾರಾಟಕ್ಕೆ ಸಿದ್ಧಪಡಿಸಿ.",

    readyTitle: "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ಸಿದ್ಧತೆ",
    readyDescription:
      "ಆನ್‌ಲೈನ್ ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್‌ಗೆ ಸಂಪರ್ಕಿಸುವ ಮೊದಲು ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳನ್ನು ಇಲ್ಲಿ ಸಿದ್ಧಪಡಿಸಿ.",

    productCatalog: "ಉತ್ಪನ್ನ ಕ್ಯಾಟಲಾಗ್",
    productCatalogDesc:
      "ಹೆಸರು, ವಿವರಣೆ, ಬೆಲೆ, ಸ್ಟಾಕ್ ಮತ್ತು ಉತ್ಪನ್ನ ವಿವರಗಳನ್ನು ವ್ಯವಸ್ಥಿತವಾಗಿ ಇಡಿ.",

    productImages: "ವೃತ್ತಿಪರ ಚಿತ್ರಗಳು",
    productImagesDesc:
      "AI ಫೋಟೋಶೂಟ್ ಬಳಸಿ ಆನ್‌ಲೈನ್ ಲಿಸ್ಟಿಂಗ್‌ಗಳಿಗೆ ಚಿತ್ರಗಳನ್ನು ರಚಿಸಿ.",

    smartPricing: "ಸ್ಮಾರ್ಟ್ ಪ್ರೈಸಿಂಗ್",
    smartPricingDesc:
      "ಪಬ್ಲಿಷ್ ಮಾಡುವ ಮೊದಲು AI Pricing ಮೂಲಕ ಉಪಯುಕ್ತ ಮಾರಾಟ ಬೆಲೆ ಪಡೆಯಿರಿ.",

    multilingual: "ಬಹುಭಾಷಾ ಲಿಸ್ಟಿಂಗ್‌ಗಳು",
    multilingualDesc:
      "ಹೆಚ್ಚಿನ ಜನರನ್ನು ತಲುಪಲು ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಉತ್ಪನ್ನ ಮಾಹಿತಿಯನ್ನು ರಚಿಸಿ.",

    ondcReady: "ONDC ಸಿದ್ಧತೆ",
    ondcReadyDesc:
      "ಭವಿಷ್ಯದ ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ಸಂಪರ್ಕಕ್ಕಾಗಿ ನಿಮ್ಮ ಕ್ಯಾಟಲಾಗ್ ಮತ್ತು ಉತ್ಪನ್ನ ಮಾಹಿತಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಿ.",

    comingSoon: "ಕನೆಕ್ಟಿವಿಟಿ ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತದೆ",

    checklist: "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ಚೆಕ್‌ಲಿಸ್ಟ್",
    checklistDescription:
      "ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳನ್ನು ಆನ್‌ಲೈನ್‌ಗೆ ತೆಗೆದುಕೊಳ್ಳುವ ಮೊದಲು ಈ ಹಂತಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.",

    step1: "ಉತ್ಪನ್ನ ಸೇರಿಸಿ",
    step1Desc:
      "ಸರಿಯಾದ ಮಾಹಿತಿಯೊಂದಿಗೆ ಸಂಪೂರ್ಣ ಉತ್ಪನ್ನ ಲಿಸ್ಟಿಂಗ್ ರಚಿಸಿ.",

    step2: "ಉತ್ಪನ್ನ ಚಿತ್ರಗಳನ್ನು ರಚಿಸಿ",
    step2Desc:
      "ವೃತ್ತಿಪರ ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್-ಸಿದ್ಧ ಚಿತ್ರಗಳನ್ನು ರಚಿಸಿ.",

    step3: "ಬೆಲೆ ನಿಗದಿ ಮಾಡಿ",
    step3Desc:
      "AI Pricing ಮೂಲಕ ಉಪಯುಕ್ತ ಬೆಲೆ ಸಲಹೆ ಪಡೆಯಿರಿ.",

    step4: "ಉತ್ಪನ್ನ ಪ್ರಕಟಿಸಿ",
    step4Desc:
      "ಸಿದ್ಧ ಉತ್ಪನ್ನವನ್ನು draft ನಿಂದ published ಆಗಿ ಬದಲಾಯಿಸಿ.",

    start: "ಪ್ರಾರಂಭಿಸಿ",
    products: "ಉತ್ಪನ್ನಗಳನ್ನು ನೋಡಿ",
    photoshoot: "AI ಫೋಟೋಶೂಟ್",
    pricing: "AI ಪ್ರೈಸಿಂಗ್",

    note:
      "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ಕನೆಕ್ಟಿವಿಟಿ ಇನ್ನೂ ಸಕ್ರಿಯವಾಗಿಲ್ಲ. ಈ ಪುಟವು ಭವಿಷ್ಯದ ಇಂಟಿಗ್ರೇಶನ್‌ಗಾಗಿ ನಿಮ್ಮ ಕ್ಯಾಟಲಾಗ್ ಅನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತದೆ.",
  },

  ml: {
    eyebrow: "ഓൺലൈനിൽ വിൽക്കുക",
    title: "നിങ്ങളുടെ കരകൗശലം ഓൺലൈനിലേക്ക് കൊണ്ടുവരൂ",
    description:
      "മെച്ചപ്പെട്ട ലിസ്റ്റിംഗ്, പൂർണ്ണമായ ഉൽപ്പന്ന വിവരങ്ങൾ, മാർക്കറ്റ്പ്ലേസിനായി തയ്യാറായ വിശദാംശങ്ങൾ എന്നിവ ഉപയോഗിച്ച് നിങ്ങളുടെ കൈത്തറി ഉൽപ്പന്നങ്ങൾ ഓൺലൈൻ വിൽപ്പനയ്ക്ക് തയ്യാറാക്കൂ.",

    readyTitle: "മാർക്കറ്റ്പ്ലേസ് തയ്യാറെടുപ്പ്",
    readyDescription:
      "ഓൺലൈൻ മാർക്കറ്റ്പ്ലേസുമായി ബന്ധിപ്പിക്കുന്നതിന് മുമ്പ് നിങ്ങളുടെ ഉൽപ്പന്നങ്ങൾ ഇവിടെ തയ്യാറാക്കൂ.",

    productCatalog: "ഉൽപ്പന്ന കാറ്റലോഗ്",
    productCatalogDesc:
      "പേര്, വിവരണം, വില, സ്റ്റോക്ക്, ഉൽപ്പന്ന വിവരങ്ങൾ എന്നിവ ക്രമത്തിലാക്കൂ.",

    productImages: "പ്രൊഫഷണൽ ചിത്രങ്ങൾ",
    productImagesDesc:
      "AI ഫോട്ടോഷൂട്ട് ഉപയോഗിച്ച് ഓൺലൈൻ ലിസ്റ്റിംഗിനുള്ള ചിത്രങ്ങൾ സൃഷ്ടിക്കൂ.",

    smartPricing: "സ്മാർട്ട് പ്രൈസിംഗ്",
    smartPricingDesc:
      "പബ്ലിഷ് ചെയ്യുന്നതിന് മുമ്പ് AI Pricing വഴി പ്രായോഗിക വിൽപ്പന വില നേടൂ.",

    multilingual: "ബഹുഭാഷാ ലിസ്റ്റിംഗുകൾ",
    multilingualDesc:
      "കൂടുതൽ ആളുകളിലേക്ക് എത്താൻ ഇന്ത്യൻ ഭാഷകളിൽ ഉൽപ്പന്ന വിവരങ്ങൾ സൃഷ്ടിക്കൂ.",

    ondcReady: "ONDC തയ്യാറെടുപ്പ്",
    ondcReadyDesc:
      "ഭാവിയിലെ മാർക്കറ്റ്പ്ലേസ് കണക്ഷനുകൾക്കായി നിങ്ങളുടെ കാറ്റലോഗും ഉൽപ്പന്ന വിവരങ്ങളും തയ്യാറാക്കൂ.",

    comingSoon: "കണക്റ്റിവിറ്റി ഉടൻ വരുന്നു",

    checklist: "മാർക്കറ്റ്പ്ലേസ് ചെക്ക്ലിസ്റ്റ്",
    checklistDescription:
      "ഉൽപ്പന്നങ്ങൾ ഓൺലൈനിലേക്ക് കൊണ്ടുപോകുന്നതിന് മുമ്പ് ഈ ഘട്ടങ്ങൾ പൂർത്തിയാക്കൂ.",

    step1: "ഉൽപ്പന്നം ചേർക്കുക",
    step1Desc:
      "ശരിയായ വിവരങ്ങളോടെ പൂർണ്ണമായ ഉൽപ്പന്ന ലിസ്റ്റിംഗ് സൃഷ്ടിക്കൂ.",

    step2: "ഉൽപ്പന്ന ചിത്രങ്ങൾ സൃഷ്ടിക്കുക",
    step2Desc:
      "പ്രൊഫഷണൽ മാർക്കറ്റ്പ്ലേസ് തയ്യാറായ ചിത്രങ്ങൾ സൃഷ്ടിക്കൂ.",

    step3: "വില നിശ്ചയിക്കുക",
    step3Desc:
      "AI Pricing വഴി പ്രയോജനകരമായ വില നിർദ്ദേശം നേടൂ.",

    step4: "ഉൽപ്പന്നം പ്രസിദ്ധീകരിക്കുക",
    step4Desc:
      "തയ്യാറായ ഉൽപ്പന്നത്തെ draftൽ നിന്ന് published ആക്കൂ.",

    start: "ആരംഭിക്കുക",
    products: "ഉൽപ്പന്നങ്ങൾ കാണുക",
    photoshoot: "AI ഫോട്ടോഷൂട്ട്",
    pricing: "AI പ്രൈസിംഗ്",

    note:
      "മാർക്കറ്റ്പ്ലേസ് കണക്റ്റിവിറ്റി ഇപ്പോഴും സജീവമല്ല. ഭാവിയിലെ ഇന്റഗ്രേഷനായി നിങ്ങളുടെ കാറ്റലോഗ് തയ്യാറാക്കുകയാണ് ഈ പേജ്.",
  },

  pa: {
    eyebrow: "ਆਨਲਾਈਨ ਵੇਚੋ",
    title: "ਆਪਣੀ ਕਲਾ ਨੂੰ ਆਨਲਾਈਨ ਲੈ ਜਾਓ",
    description:
      "ਵਧੀਆ ਲਿਸਟਿੰਗ, ਪੂਰੀ ਉਤਪਾਦ ਜਾਣਕਾਰੀ ਅਤੇ ਮਾਰਕੀਟਪਲੇਸ ਲਈ ਤਿਆਰ ਵੇਰਵਿਆਂ ਨਾਲ ਆਪਣੇ ਹੱਥ ਨਾਲ ਬਣੇ ਉਤਪਾਦਾਂ ਨੂੰ ਆਨਲਾਈਨ ਵਿਕਰੀ ਲਈ ਤਿਆਰ ਕਰੋ।",

    readyTitle: "ਮਾਰਕੀਟਪਲੇਸ ਤਿਆਰੀ",
    readyDescription:
      "ਆਨਲਾਈਨ ਮਾਰਕੀਟਪਲੇਸ ਨਾਲ ਜੋੜਨ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੇ ਉਤਪਾਦ ਇੱਥੇ ਤਿਆਰ ਕਰੋ।",

    productCatalog: "ਉਤਪਾਦ ਕੈਟਾਲਾਗ",
    productCatalogDesc:
      "ਨਾਮ, ਵੇਰਵਾ, ਕੀਮਤ, ਸਟਾਕ ਅਤੇ ਉਤਪਾਦ ਜਾਣਕਾਰੀ ਨੂੰ ਵਿਵਸਥਿਤ ਰੱਖੋ।",

    productImages: "ਪ੍ਰੋਫੈਸ਼ਨਲ ਤਸਵੀਰਾਂ",
    productImagesDesc:
      "AI ਫੋਟੋਸ਼ੂਟ ਨਾਲ ਆਨਲਾਈਨ ਲਿਸਟਿੰਗ ਲਈ ਵਧੀਆ ਤਸਵੀਰਾਂ ਬਣਾਓ।",

    smartPricing: "ਸਮਾਰਟ ਪ੍ਰਾਈਸਿੰਗ",
    smartPricingDesc:
      "ਪਬਲਿਸ਼ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ AI Pricing ਰਾਹੀਂ ਵਰਤੋਂਯੋਗ ਵਿਕਰੀ ਕੀਮਤ ਲਵੋ।",

    multilingual: "ਬਹੁਭਾਸ਼ੀ ਲਿਸਟਿੰਗ",
    multilingualDesc:
      "ਹੋਰ ਲੋਕਾਂ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਤਪਾਦ ਜਾਣਕਾਰੀ ਬਣਾਓ।",

    ondcReady: "ONDC ਤਿਆਰੀ",
    ondcReadyDesc:
      "ਭਵਿੱਖ ਦੇ ਮਾਰਕੀਟਪਲੇਸ ਕਨੈਕਸ਼ਨਾਂ ਲਈ ਆਪਣਾ ਕੈਟਾਲਾਗ ਅਤੇ ਉਤਪਾਦ ਜਾਣਕਾਰੀ ਤਿਆਰ ਕਰੋ।",

    comingSoon: "ਕਨੈਕਟਿਵਿਟੀ ਜਲਦੀ ਆ ਰਹੀ ਹੈ",

    checklist: "ਮਾਰਕੀਟਪਲੇਸ ਚੈਕਲਿਸਟ",
    checklistDescription:
      "ਆਪਣੇ ਉਤਪਾਦ ਆਨਲਾਈਨ ਲੈ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਇਹ ਕਦਮ ਪੂਰੇ ਕਰੋ।",

    step1: "ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ",
    step1Desc:
      "ਸਹੀ ਜਾਣਕਾਰੀ ਨਾਲ ਪੂਰੀ ਉਤਪਾਦ ਲਿਸਟਿੰਗ ਬਣਾਓ।",

    step2: "ਉਤਪਾਦ ਤਸਵੀਰਾਂ ਬਣਾਓ",
    step2Desc:
      "ਪੇਸ਼ੇਵਰ ਮਾਰਕੀਟਪਲੇਸ-ਤਿਆਰ ਤਸਵੀਰਾਂ ਬਣਾਓ।",

    step3: "ਕੀਮਤ ਤੈਅ ਕਰੋ",
    step3Desc:
      "AI Pricing ਰਾਹੀਂ ਵਰਤੋਂਯੋਗ ਕੀਮਤ ਸੁਝਾਅ ਲਵੋ।",

    step4: "ਉਤਪਾਦ ਪਬਲਿਸ਼ ਕਰੋ",
    step4Desc:
      "ਤਿਆਰ ਉਤਪਾਦ ਨੂੰ draft ਤੋਂ published ਕਰੋ।",

    start: "ਸ਼ੁਰੂ ਕਰੋ",
    products: "ਉਤਪਾਦ ਵੇਖੋ",
    photoshoot: "AI ਫੋਟੋਸ਼ੂਟ",
    pricing: "AI ਪ੍ਰਾਈਸਿੰਗ",

    note:
      "ਮਾਰਕੀਟਪਲੇਸ ਕਨੈਕਟਿਵਿਟੀ ਹਾਲੇ ਸਰਗਰਮ ਨਹੀਂ ਹੈ। ਇਹ ਪੇਜ ਭਵਿੱਖ ਦੀ ਇੰਟੀਗ੍ਰੇਸ਼ਨ ਲਈ ਤੁਹਾਡਾ ਕੈਟਾਲਾਗ ਤਿਆਰ ਕਰਦਾ ਹੈ।",
  },
};

function Marketplace({
  onNavigate,
}) {
  const {
    language,
  } = useLanguage();

  const ui =
    MARKETPLACE_TRANSLATIONS[language] ||
    MARKETPLACE_TRANSLATIONS.en;

  /*
  =====================================================
  MARKETPLACE DATA
  =====================================================
  */

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  /*
  =====================================================
  LOAD PRODUCTS FROM MONGODB
  =====================================================
  */

  const loadMarketplaceData =
    async () => {
      try {
        setLoading(true);
        setError(false);

        const response =
          await fetch(
            `${BACKEND_URL}/api/products?artisan=${ARTISAN_ID}&lang=${language}`
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load products"
          );
        }

        const data =
          await response.json();

        const productList =
          Array.isArray(
            data.products
          )
            ? data.products
            : Array.isArray(data)
            ? data
            : [];

        setProducts(
          productList
        );
      } catch (err) {
        console.error(
          "Marketplace data error:",
          err
        );

        setProducts([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadMarketplaceData();
  }, [language]);

  /*
  =====================================================
  READINESS CALCULATION
  =====================================================
  */

  const hasProduct =
    products.length > 0;

  const hasProfessionalImages =
    products.some(
      (product) =>
        Boolean(
          product.studioImage
        ) ||
        Boolean(
          product.modelImage
        ) ||
        Boolean(
          product.closeupImage
        ) ||
        Boolean(
          product.lifestyleImage
        )
    );

  const hasPrice =
    products.some(
      (product) =>
        Number(
          product.sellingPrice || 0
        ) > 0
    );

  const hasPublishedProduct =
    products.some(
      (product) =>
        product.status ===
        "published"
    );

  const completedSteps = [
    hasProduct,
    hasProfessionalImages,
    hasPrice,
    hasPublishedProduct,
  ].filter(Boolean).length;

  const readinessPercentage =
    Math.round(
      (completedSteps / 4) * 100
    );

  /*
  =====================================================
  TOOLS
  =====================================================
  */

  const tools = [
    {
      icon: "📦",
      title:
        ui.productCatalog,
      description:
        ui.productCatalogDesc,
      action:
        "products",
    },

    {
      icon: "📸",
      title:
        ui.productImages,
      description:
        ui.productImagesDesc,
      action:
        "photoshoot",
    },

    {
      icon: "💰",
      title:
        ui.smartPricing,
      description:
        ui.smartPricingDesc,
      action:
        "pricing",
    },

    {
      icon: "🌐",
      title:
        ui.multilingual,
      description:
        ui.multilingualDesc,
      action:
        "products",
    },
  ];

  /*
  =====================================================
  CHECKLIST
  =====================================================
  */

  const checklist = [
    {
      number: "01",
      title:
        ui.step1,
      description:
        ui.step1Desc,
      action:
        "add-product",
      completed:
        hasProduct,
    },

    {
      number: "02",
      title:
        ui.step2,
      description:
        ui.step2Desc,
      action:
        "photoshoot",
      completed:
        hasProfessionalImages,
    },

    {
      number: "03",
      title:
        ui.step3,
      description:
        ui.step3Desc,
      action:
        "pricing",
      completed:
        hasPrice,
    },

    {
      number: "04",
      title:
        ui.step4,
      description:
        ui.step4Desc,
      action:
        "products",
      completed:
        hasPublishedProduct,
    },
  ];

  /*
  =====================================================
  RENDER
  =====================================================
  */

  return (
    <div className="marketplace-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="marketplace-hero">

        <div className="marketplace-hero-content">

          <span className="marketplace-eyebrow">

            <span className="marketplace-dot"></span>

            {ui.eyebrow}

          </span>

          <h1>
            {ui.title}
          </h1>

          <p>
            {ui.description}
          </p>

          <div className="marketplace-hero-actions">

            <button
              type="button"
              className="marketplace-primary-btn"
              onClick={() =>
                onNavigate(
                  "products"
                )
              }
            >
              📦 {ui.products}
            </button>

            <button
              type="button"
              className="marketplace-secondary-btn"
              onClick={() =>
                onNavigate(
                  "add-product"
                )
              }
            >
              + {ui.start}
            </button>

          </div>

        </div>

        <div className="marketplace-hero-visual">

          <div className="marketplace-orbit marketplace-orbit-one"></div>

          <div className="marketplace-orbit marketplace-orbit-two"></div>

          <div className="marketplace-main-icon">
            🛍️
          </div>

          <div className="marketplace-floating marketplace-floating-one">
            📦
          </div>

          <div className="marketplace-floating marketplace-floating-two">
            ✨
          </div>

          <div className="marketplace-floating marketplace-floating-three">
            ₹
          </div>

        </div>

      </section>

      {/* =================================================
          READINESS
      ================================================= */}

      <section className="marketplace-readiness">

        <div className="marketplace-section-heading">

          <span className="marketplace-section-label">
            {ui.eyebrow}
          </span>

          <h2>
            {ui.readyTitle}
          </h2>

          <p>
            {ui.readyDescription}
          </p>

        </div>

        <div className="marketplace-tools-grid">

          {tools.map(
            (tool) => (

              <article
                key={
                  tool.title
                }
                className="marketplace-tool-card"
                onClick={() =>
                  onNavigate(
                    tool.action
                  )
                }
              >

                <div className="marketplace-tool-icon">
                  {tool.icon}
                </div>

                <h3>
                  {tool.title}
                </h3>

                <p>
                  {tool.description}
                </p>

                <button
                  type="button"
                  className="marketplace-tool-link"
                  onClick={(
                    event
                  ) => {
                    event.stopPropagation();

                    onNavigate(
                      tool.action
                    );
                  }}
                >
                  {ui.start} →
                </button>

              </article>

            )
          )}

        </div>

      </section>

      {/* =================================================
          ONDC
      ================================================= */}

      <section className="ondc-section">

        <div className="ondc-badge">

          <span>
            ◎
          </span>

          ONDC

        </div>

        <div className="ondc-content">

          <h2>
            {ui.ondcReady}
          </h2>

          <p>
            {ui.ondcReadyDesc}
          </p>

        </div>

        <div className="ondc-readiness">

          <div className="ondc-readiness-top">

            <span>
              {loading
                ? "..."
                : `${readinessPercentage}%`}
            </span>

            <small>
              READY
            </small>

          </div>

          <div className="ondc-progress">

            <div
              className="ondc-progress-fill"
              style={{
                width: `${readinessPercentage}%`,
              }}
            ></div>

          </div>

        </div>

        <div className="ondc-status">

          <span className="ondc-status-dot"></span>

          {ui.comingSoon}

        </div>

      </section>

      {/* =================================================
          CHECKLIST
      ================================================= */}

      <section className="marketplace-checklist-section">

        <div className="marketplace-section-heading">

          <span className="marketplace-section-label">
            {ui.eyebrow}
          </span>

          <h2>
            {ui.checklist}
          </h2>

          <p>
            {ui.checklistDescription}
          </p>

        </div>

        {error && (
          <div className="marketplace-data-error">

            <span>
              ⚠️
            </span>

            <p>
              Unable to load your current product readiness.
            </p>

            <button
              type="button"
              onClick={
                loadMarketplaceData
              }
            >
              Retry
            </button>

          </div>
        )}

        <div className="marketplace-checklist">

          {checklist.map(
            (item) => (

              <article
                key={
                  item.number
                }
                className="marketplace-check-item"
              >

                <div
                  className={`marketplace-check-number ${
                    item.completed
                      ? "completed"
                      : ""
                  }`}
                >

                  {item.completed
                    ? "✓"
                    : item.number}

                </div>

                <div className="marketplace-check-content">

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>

                </div>

                <button
                  type="button"
                  className={`marketplace-check-action ${
                    item.completed
                      ? "completed"
                      : ""
                  }`}
                  onClick={() =>
                    onNavigate(
                      item.action
                    )
                  }
                >

                  {item.completed
                    ? "✓"
                    : "→"}

                </button>

              </article>

            )
          )}

        </div>

      </section>

      {/* =================================================
          FOOTER NOTE
      ================================================= */}

      <section className="marketplace-note">

        <span>
          ℹ️
        </span>

        <p>
          {ui.note}
        </p>

      </section>

    </div>
  );
}

export default Marketplace;
