import {
  useEffect,
  useState,
} from "react";

import "./Products.css";

import { useLanguage } from "../i18n/LanguageContext";

const BACKEND_URL =
  "http://localhost:5000";

const ARTISAN_ID =
  "6aa7d975f3c555e19062b4cd";

/*
=====================================================
PRODUCTS PAGE TRANSLATIONS
10 INDIAN LANGUAGES
=====================================================
*/

const PRODUCTS_TRANSLATIONS = {
  en: {
    catalog: "YOUR CATALOG",

    title: "Products",

    description:
      "Manage your products, prices, stock and professional photography.",

    addProduct: "Add Product",

    totalProducts: "Total Products",

    published: "Published",

    drafts: "Drafts",

    loadingTitle:
      "Loading your products...",

    loadingDescription:
      "Connecting to your KarigarConnect catalog.",

    errorTitle:
      "Something went wrong",

    retry: "Try Again",

    emptyTitle:
      "Your catalog is empty",

    emptyDescription:
      "Add your first handmade product to start building your digital catalog.",

    addFirst:
      "Add Your First Product",

    collection: "YOUR COLLECTION",

    allProducts: "All Products",

    refresh: "Refresh",

    unnamed:
      "Unnamed Product",

    uncategorized:
      "Uncategorized",

    view: "View",

    edit: "Edit",

    aiPhotoshoot:
      "AI Photoshoot",

    translating:
      "Translating product information...",

    stock: "Stock",

    original: "Original",

    main: "Main",

    studio: "Studio",

    closeup: "Close-up",

    lifestyle: "Lifestyle",

    model: "Model",

    product: "Product",

    draft: "Draft",
  },

  hi: {
    catalog: "आपका कैटलॉग",

    title: "उत्पाद",

    description:
      "अपने उत्पाद, कीमत, स्टॉक और प्रोफेशनल फोटोग्राफी को प्रबंधित करें।",

    addProduct: "उत्पाद जोड़ें",

    totalProducts: "कुल उत्पाद",

    published: "प्रकाशित",

    drafts: "ड्राफ्ट",

    loadingTitle:
      "आपके उत्पाद लोड हो रहे हैं...",

    loadingDescription:
      "आपके KarigarConnect कैटलॉग से कनेक्ट किया जा रहा है।",

    errorTitle:
      "कुछ गलत हो गया",

    retry: "फिर कोशिश करें",

    emptyTitle:
      "आपका कैटलॉग खाली है",

    emptyDescription:
      "अपना डिजिटल कैटलॉग बनाने के लिए अपना पहला हस्तनिर्मित उत्पाद जोड़ें।",

    addFirst:
      "अपना पहला उत्पाद जोड़ें",

    collection: "आपका संग्रह",

    allProducts: "सभी उत्पाद",

    refresh: "रिफ्रेश",

    unnamed:
      "बिना नाम का उत्पाद",

    uncategorized:
      "श्रेणी उपलब्ध नहीं",

    view: "देखें",

    edit: "संपादित करें",

    aiPhotoshoot:
      "AI फोटोशूट",

    translating:
      "उत्पाद जानकारी का अनुवाद हो रहा है...",

    stock: "स्टॉक",

    original: "मूल",

    main: "मुख्य",

    studio: "स्टूडियो",

    closeup: "क्लोज़-अप",

    lifestyle: "लाइफस्टाइल",

    model: "मॉडल",

    product: "उत्पाद",

    draft: "ड्राफ्ट",
  },

  bn: {
    catalog: "আপনার ক্যাটালগ",

    title: "পণ্য",

    description:
      "আপনার পণ্য, মূল্য, স্টক এবং পেশাদার ফটোগ্রাফি পরিচালনা করুন।",

    addProduct: "পণ্য যোগ করুন",

    totalProducts: "মোট পণ্য",

    published: "প্রকাশিত",

    drafts: "খসড়া",

    loadingTitle:
      "আপনার পণ্য লোড হচ্ছে...",

    loadingDescription:
      "আপনার KarigarConnect ক্যাটালগের সাথে সংযোগ করা হচ্ছে।",

    errorTitle:
      "কিছু ভুল হয়েছে",

    retry: "আবার চেষ্টা করুন",

    emptyTitle:
      "আপনার ক্যাটালগ খালি",

    emptyDescription:
      "আপনার ডিজিটাল ক্যাটালগ তৈরি করতে প্রথম হাতে তৈরি পণ্য যোগ করুন।",

    addFirst:
      "প্রথম পণ্য যোগ করুন",

    collection: "আপনার সংগ্রহ",

    allProducts: "সমস্ত পণ্য",

    refresh: "রিফ্রেশ",

    unnamed:
      "নামহীন পণ্য",

    uncategorized:
      "বিভাগ নেই",

    view: "দেখুন",

    edit: "সম্পাদনা",

    aiPhotoshoot:
      "AI ফটোশুট",

    translating:
      "পণ্যের তথ্য অনুবাদ করা হচ্ছে...",

    stock: "স্টক",

    original: "মূল",

    main: "প্রধান",

    studio: "স্টুডিও",

    closeup: "ক্লোজ-আপ",

    lifestyle: "লাইফস্টাইল",

    model: "মডেল",

    product: "পণ্য",

    draft: "খসড়া",
  },

  ta: {
    catalog: "உங்கள் பட்டியல்",

    title: "தயாரிப்புகள்",

    description:
      "உங்கள் தயாரிப்புகள், விலைகள், இருப்பு மற்றும் தொழில்முறை புகைப்படங்களை நிர்வகிக்கவும்.",

    addProduct: "தயாரிப்பைச் சேர்க்கவும்",

    totalProducts: "மொத்த தயாரிப்புகள்",

    published: "வெளியிடப்பட்டது",

    drafts: "வரைவுகள்",

    loadingTitle:
      "உங்கள் தயாரிப்புகள் ஏற்றப்படுகின்றன...",

    loadingDescription:
      "உங்கள் KarigarConnect பட்டியலுடன் இணைக்கப்படுகிறது.",

    errorTitle:
      "ஏதோ தவறு ஏற்பட்டது",

    retry: "மீண்டும் முயற்சிக்கவும்",

    emptyTitle:
      "உங்கள் பட்டியல் காலியாக உள்ளது",

    emptyDescription:
      "உங்கள் டிஜிட்டல் பட்டியலை உருவாக்க முதல் கைவினைப் பொருளைச் சேர்க்கவும்.",

    addFirst:
      "முதல் தயாரிப்பைச் சேர்க்கவும்",

    collection: "உங்கள் சேகரிப்பு",

    allProducts: "அனைத்து தயாரிப்புகள்",

    refresh: "புதுப்பிக்கவும்",

    unnamed:
      "பெயரில்லா தயாரிப்பு",

    uncategorized:
      "வகை இல்லை",

    view: "பார்க்கவும்",

    edit: "திருத்தவும்",

    aiPhotoshoot:
      "AI போட்டோஷூட்",

    translating:
      "தயாரிப்பு தகவல் மொழிபெயர்க்கப்படுகிறது...",

    stock: "இருப்பு",

    original: "அசல்",

    main: "முதன்மை",

    studio: "ஸ்டுடியோ",

    closeup: "க்ளோஸ்-அப்",

    lifestyle: "லைஃப்ஸ்டைல்",

    model: "மாடல்",

    product: "தயாரிப்பு",

    draft: "வரைவு",
  },

  te: {
    catalog: "మీ కేటలాగ్",

    title: "ఉత్పత్తులు",

    description:
      "మీ ఉత్పత్తులు, ధరలు, స్టాక్ మరియు ప్రొఫెషనల్ ఫోటోగ్రఫీని నిర్వహించండి.",

    addProduct: "ఉత్పత్తిని జోడించండి",

    totalProducts: "మొత్తం ఉత్పత్తులు",

    published: "ప్రచురించబడినవి",

    drafts: "డ్రాఫ్ట్‌లు",

    loadingTitle:
      "మీ ఉత్పత్తులు లోడ్ అవుతున్నాయి...",

    loadingDescription:
      "మీ KarigarConnect కేటలాగ్‌కు కనెక్ట్ అవుతోంది.",

    errorTitle:
      "ఏదో తప్పు జరిగింది",

    retry: "మళ్లీ ప్రయత్నించండి",

    emptyTitle:
      "మీ కేటలాగ్ ఖాళీగా ఉంది",

    emptyDescription:
      "మీ డిజిటల్ కేటలాగ్‌ను ప్రారంభించడానికి మొదటి చేతిపనిని జోడించండి.",

    addFirst:
      "మొదటి ఉత్పత్తిని జోడించండి",

    collection: "మీ సేకరణ",

    allProducts: "అన్ని ఉత్పత్తులు",

    refresh: "రిఫ్రెష్",

    unnamed:
      "పేరు లేని ఉత్పత్తి",

    uncategorized:
      "వర్గం లేదు",

    view: "చూడండి",

    edit: "సవరించండి",

    aiPhotoshoot:
      "AI ఫోటోషూట్",

    translating:
      "ఉత్పత్తి సమాచారం అనువదించబడుతోంది...",

    stock: "స్టాక్",

    original: "అసలు",

    main: "ప్రధాన",

    studio: "స్టూడియో",

    closeup: "క్లోజ్-అప్",

    lifestyle: "లైఫ్‌స్టైల్",

    model: "మోడల్",

    product: "ఉత్పత్తి",

    draft: "డ్రాఫ్ట్",
  },

  mr: {
    catalog: "तुमचा कॅटलॉग",

    title: "उत्पादने",

    description:
      "तुमची उत्पादने, किंमती, साठा आणि व्यावसायिक फोटोग्राफी व्यवस्थापित करा.",

    addProduct: "उत्पादन जोडा",

    totalProducts: "एकूण उत्पादने",

    published: "प्रकाशित",

    drafts: "मसुदे",

    loadingTitle:
      "तुमची उत्पादने लोड होत आहेत...",

    loadingDescription:
      "तुमच्या KarigarConnect कॅटलॉगशी जोडले जात आहे.",

    errorTitle:
      "काहीतरी चुकीचे झाले",

    retry: "पुन्हा प्रयत्न करा",

    emptyTitle:
      "तुमचा कॅटलॉग रिकामा आहे",

    emptyDescription:
      "तुमचा डिजिटल कॅटलॉग तयार करण्यासाठी पहिले हस्तनिर्मित उत्पादन जोडा.",

    addFirst:
      "पहिले उत्पादन जोडा",

    collection: "तुमचा संग्रह",

    allProducts: "सर्व उत्पादने",

    refresh: "रिफ्रेश",

    unnamed:
      "नाव नसलेले उत्पादन",

    uncategorized:
      "श्रेणी नाही",

    view: "पहा",

    edit: "संपादित करा",

    aiPhotoshoot:
      "AI फोटोशूट",

    translating:
      "उत्पादन माहितीचे भाषांतर केले जात आहे...",

    stock: "साठा",

    original: "मूळ",

    main: "मुख्य",

    studio: "स्टुडिओ",

    closeup: "क्लोज-अप",

    lifestyle: "लाइफस्टाइल",

    model: "मॉडेल",

    product: "उत्पादन",

    draft: "मसुदा",
  },

  gu: {
    catalog: "તમારો કેટલોગ",

    title: "ઉત્પાદનો",

    description:
      "તમારા ઉત્પાદનો, કિંમતો, સ્ટોક અને વ્યાવસાયિક ફોટોગ્રાફીનું સંચાલન કરો.",

    addProduct: "ઉત્પાદન ઉમેરો",

    totalProducts: "કુલ ઉત્પાદનો",

    published: "પ્રકાશિત",

    drafts: "ડ્રાફ્ટ",

    loadingTitle:
      "તમારા ઉત્પાદનો લોડ થઈ રહ્યા છે...",

    loadingDescription:
      "તમારા KarigarConnect કેટલોગ સાથે જોડાઈ રહ્યું છે.",

    errorTitle:
      "કંઈક ખોટું થયું",

    retry: "ફરી પ્રયાસ કરો",

    emptyTitle:
      "તમારો કેટલોગ ખાલી છે",

    emptyDescription:
      "તમારો ડિજિટલ કેટલોગ બનાવવા માટે તમારું પ્રથમ હસ્તનિર્મિત ઉત્પાદન ઉમેરો.",

    addFirst:
      "તમારું પ્રથમ ઉત્પાદન ઉમેરો",

    collection: "તમારો સંગ્રહ",

    allProducts: "બધા ઉત્પાદનો",

    refresh: "રિફ્રેશ",

    unnamed:
      "નામ વિનાનું ઉત્પાદન",

    uncategorized:
      "શ્રેણી નથી",

    view: "જુઓ",

    edit: "સંપાદિત કરો",

    aiPhotoshoot:
      "AI ફોટોશૂટ",

    translating:
      "ઉત્પાદનની માહિતીનો અનુવાદ થઈ રહ્યો છે...",

    stock: "સ્ટોક",

    original: "મૂળ",

    main: "મુખ્ય",

    studio: "સ્ટુડિયો",

    closeup: "ક્લોઝ-અપ",

    lifestyle: "લાઇફસ્ટાઇલ",

    model: "મોડેલ",

    product: "ઉત્પાદન",

    draft: "ડ્રાફ્ટ",
  },

  kn: {
    catalog: "ನಿಮ್ಮ ಕ್ಯಾಟಲಾಗ್",

    title: "ಉತ್ಪನ್ನಗಳು",

    description:
      "ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳು, ಬೆಲೆಗಳು, ಸ್ಟಾಕ್ ಮತ್ತು ವೃತ್ತಿಪರ ಛಾಯಾಗ್ರಹಣವನ್ನು ನಿರ್ವಹಿಸಿ.",

    addProduct: "ಉತ್ಪನ್ನ ಸೇರಿಸಿ",

    totalProducts: "ಒಟ್ಟು ಉತ್ಪನ್ನಗಳು",

    published: "ಪ್ರಕಟಿತ",

    drafts: "ಕರಡುಗಳು",

    loadingTitle:
      "ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...",

    loadingDescription:
      "ನಿಮ್ಮ KarigarConnect ಕ್ಯಾಟಲಾಗ್‌ಗೆ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ.",

    errorTitle:
      "ಏನೋ ತಪ್ಪಾಗಿದೆ",

    retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",

    emptyTitle:
      "ನಿಮ್ಮ ಕ್ಯಾಟಲಾಗ್ ಖಾಲಿಯಾಗಿದೆ",

    emptyDescription:
      "ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಕ್ಯಾಟಲಾಗ್ ಪ್ರಾರಂಭಿಸಲು ಮೊದಲ ಕೈತಯಾರಿಸಿದ ಉತ್ಪನ್ನವನ್ನು ಸೇರಿಸಿ.",

    addFirst:
      "ಮೊದಲ ಉತ್ಪನ್ನವನ್ನು ಸೇರಿಸಿ",

    collection: "ನಿಮ್ಮ ಸಂಗ್ರಹ",

    allProducts: "ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳು",

    refresh: "ರಿಫ್ರೆಶ್",

    unnamed:
      "ಹೆಸರಿಲ್ಲದ ಉತ್ಪನ್ನ",

    uncategorized:
      "ವರ್ಗವಿಲ್ಲ",

    view: "ನೋಡಿ",

    edit: "ಸಂಪಾದಿಸಿ",

    aiPhotoshoot:
      "AI ಫೋಟೋಶೂಟ್",

    translating:
      "ಉತ್ಪನ್ನದ ಮಾಹಿತಿಯನ್ನು ಅನುವಾದಿಸಲಾಗುತ್ತಿದೆ...",

    stock: "ಸ್ಟಾಕ್",

    original: "ಮೂಲ",

    main: "ಮುಖ್ಯ",

    studio: "ಸ್ಟುಡಿಯೋ",

    closeup: "ಕ್ಲೋಸ್-ಅಪ್",

    lifestyle: "ಲೈಫ್ಸ್ಟೈಲ್",

    model: "ಮಾದರಿ",

    product: "ಉತ್ಪನ್ನ",

    draft: "ಕರಡು",
  },

  ml: {
    catalog: "നിങ്ങളുടെ കാറ്റലോഗ്",

    title: "ഉൽപ്പന്നങ്ങൾ",

    description:
      "നിങ്ങളുടെ ഉൽപ്പന്നങ്ങൾ, വിലകൾ, സ്റ്റോക്ക്, പ്രൊഫഷണൽ ഫോട്ടോഗ്രഫി എന്നിവ നിയന്ത്രിക്കുക.",

    addProduct: "ഉൽപ്പന്നം ചേർക്കുക",

    totalProducts: "ആകെ ഉൽപ്പന്നങ്ങൾ",

    published: "പ്രസിദ്ധീകരിച്ചത്",

    drafts: "ഡ്രാഫ്റ്റുകൾ",

    loadingTitle:
      "നിങ്ങളുടെ ഉൽപ്പന്നങ്ങൾ ലോഡ് ചെയ്യുന്നു...",

    loadingDescription:
      "നിങ്ങളുടെ KarigarConnect കാറ്റലോഗുമായി ബന്ധിപ്പിക്കുന്നു.",

    errorTitle:
      "എന്തോ തെറ്റായി",

    retry: "വീണ്ടും ശ്രമിക്കുക",

    emptyTitle:
      "നിങ്ങളുടെ കാറ്റലോഗ് ശൂന്യമാണ്",

    emptyDescription:
      "നിങ്ങളുടെ ഡിജിറ്റൽ കാറ്റലോഗ് ആരംഭിക്കാൻ ആദ്യത്തെ കൈത്തറി ഉൽപ്പന്നം ചേർക്കുക.",

    addFirst:
      "ആദ്യ ഉൽപ്പന്നം ചേർക്കുക",

    collection: "നിങ്ങളുടെ ശേഖരം",

    allProducts: "എല്ലാ ഉൽപ്പന്നങ്ങളും",

    refresh: "പുതുക്കുക",

    unnamed:
      "പേരില്ലാത്ത ഉൽപ്പന്നം",

    uncategorized:
      "വിഭാഗമില്ല",

    view: "കാണുക",

    edit: "തിരുത്തുക",

    aiPhotoshoot:
      "AI ഫോട്ടോഷൂട്ട്",

    translating:
      "ഉൽപ്പന്ന വിവരങ്ങൾ വിവർത്തനം ചെയ്യുന്നു...",

    stock: "സ്റ്റോക്ക്",

    original: "യഥാർത്ഥം",

    main: "പ്രധാന",

    studio: "സ്റ്റുഡിയോ",

    closeup: "ക്ലോസ്-അപ്പ്",

    lifestyle: "ലൈഫ്‌സ്റ്റൈൽ",

    model: "മോഡൽ",

    product: "ഉൽപ്പന്നം",

    draft: "ഡ്രാഫ്റ്റ്",
  },

  pa: {
    catalog: "ਤੁਹਾਡਾ ਕੈਟਾਲਾਗ",

    title: "ਉਤਪਾਦ",

    description:
      "ਆਪਣੇ ਉਤਪਾਦਾਂ, ਕੀਮਤਾਂ, ਸਟਾਕ ਅਤੇ ਪੇਸ਼ੇਵਰ ਫੋਟੋਗ੍ਰਾਫੀ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ।",

    addProduct: "ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ",

    totalProducts: "ਕੁੱਲ ਉਤਪਾਦ",

    published: "ਪ੍ਰਕਾਸ਼ਿਤ",

    drafts: "ਡਰਾਫਟ",

    loadingTitle:
      "ਤੁਹਾਡੇ ਉਤਪਾਦ ਲੋਡ ਹੋ ਰਹੇ ਹਨ...",

    loadingDescription:
      "ਤੁਹਾਡੇ KarigarConnect ਕੈਟਾਲਾਗ ਨਾਲ ਜੁੜਿਆ ਜਾ ਰਿਹਾ ਹੈ।",

    errorTitle:
      "ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ",

    retry: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",

    emptyTitle:
      "ਤੁਹਾਡਾ ਕੈਟਾਲਾਗ ਖਾਲੀ ਹੈ",

    emptyDescription:
      "ਆਪਣਾ ਡਿਜ਼ਿਟਲ ਕੈਟਾਲਾਗ ਬਣਾਉਣ ਲਈ ਆਪਣਾ ਪਹਿਲਾ ਹੱਥ ਨਾਲ ਬਣਿਆ ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ।",

    addFirst:
      "ਪਹਿਲਾ ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ",

    collection: "ਤੁਹਾਡਾ ਸੰਗ੍ਰਹਿ",

    allProducts: "ਸਾਰੇ ਉਤਪਾਦ",

    refresh: "ਰਿਫ੍ਰੈਸ਼",

    unnamed:
      "ਬਿਨਾਂ ਨਾਮ ਦਾ ਉਤਪਾਦ",

    uncategorized:
      "ਸ਼੍ਰੇਣੀ ਨਹੀਂ",

    view: "ਵੇਖੋ",

    edit: "ਸੰਪਾਦਿਤ ਕਰੋ",

    aiPhotoshoot:
      "AI ਫੋਟੋਸ਼ੂਟ",

    translating:
      "ਉਤਪਾਦ ਜਾਣਕਾਰੀ ਦਾ ਅਨੁਵਾਦ ਹੋ ਰਿਹਾ ਹੈ...",

    stock: "ਸਟਾਕ",

    original: "ਮੂਲ",

    main: "ਮੁੱਖ",

    studio: "ਸਟੂਡੀਓ",

    closeup: "ਕਲੋਜ਼-ਅੱਪ",

    lifestyle: "ਲਾਈਫਸਟਾਈਲ",

    model: "ਮਾਡਲ",

    product: "ਉਤਪਾਦ",

    draft: "ਡਰਾਫਟ",
  },
};

function Products({
  onNavigate,
}) {
  const {
    language,
  } = useLanguage();

  /*
  =====================================================
  CURRENT LANGUAGE
  =====================================================
  */

  const currentLanguage =
    PRODUCTS_TRANSLATIONS[language]
      ? language
      : "en";

  const ui =
    PRODUCTS_TRANSLATIONS[
      currentLanguage
    ];

  /*
  =====================================================
  STATE
  =====================================================
  */

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeImage, setActiveImage] =
    useState({});

  const [translationLoading, setTranslationLoading] =
    useState(false);

  /*
  =====================================================
  FETCH PRODUCTS
  =====================================================
  */

  useEffect(() => {
    fetchProducts();
  }, [language]);

  const fetchProducts =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${BACKEND_URL}/api/products?artisan=${ARTISAN_ID}&lang=${language}`
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch products."
          );
        }

        setProducts(
          data.products || []
        );
      } catch (err) {
        console.error(
          "Fetch products error:",
          err
        );

        setError(
          err.message ||
            "Failed to load products."
        );
      } finally {
        setLoading(false);
      }
    };

  /*
  =====================================================
  AUTOMATIC MISSING TRANSLATIONS
  =====================================================
  */

  useEffect(() => {
    let cancelled = false;

    const createMissingTranslations =
      async () => {
        if (
          language === "en" ||
          products.length === 0
        ) {
          setTranslationLoading(
            false
          );

          return;
        }

        const missingProducts =
          products.filter(
            (product) => {
              const storedTranslation =
                product.translations?.[
                  language
                ];

              return !storedTranslation;
            }
          );

        if (
          missingProducts.length === 0
        ) {
          setTranslationLoading(
            false
          );

          return;
        }

        try {
          setTranslationLoading(
            true
          );

          for (
            const product of missingProducts
          ) {
            if (cancelled) {
              return;
            }

            try {
              const response =
                await fetch(
                  `${BACKEND_URL}/api/products/${product._id}/translations/auto`,
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body: JSON.stringify({
                      language,
                    }),
                  }
                );

              const data =
                await response.json();

              if (!response.ok) {
                console.error(
                  `Translation failed for ${product._id}:`,
                  data
                );

                continue;
              }
            } catch (
              translationError
            ) {
              console.error(
                `Automatic translation error for ${product._id}:`,
                translationError
              );
            }
          }

          if (!cancelled) {
            await fetchProducts();
          }
        } finally {
          if (!cancelled) {
            setTranslationLoading(
              false
            );
          }
        }
      };

    createMissingTranslations();

    return () => {
      cancelled = true;
    };
  }, [
    language,
    products.length,
  ]);

  /*
  =====================================================
  PRICE
  =====================================================
  */

  const formatPrice = (
    price
  ) => {
    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return "₹0";
    }

    return `₹${Number(
      price
    ).toLocaleString("en-IN")}`;
  };

  /*
  =====================================================
  IMAGE URL
  =====================================================
  */

  const getImageUrl = (
    image
  ) => {
    if (!image) {
      return null;
    }

    if (
      image.startsWith(
        "http://"
      ) ||
      image.startsWith(
        "https://"
      )
    ) {
      return image;
    }

    return `${BACKEND_URL}${image}`;
  };

  /*
  =====================================================
  IMAGE LIST
  =====================================================
  */

  const getProductImages = (
    product
  ) => {
    const images = [];

    if (product.originalImage) {
      images.push({
        type: "original",
        label: ui.original,
        image:
          product.originalImage,
      });
    }

    if (product.image) {
      images.push({
        type: "main",
        label: ui.main,
        image:
          product.image,
      });
    }

    if (
      product.studioImage
    ) {
      images.push({
        type: "studio",
        label: ui.studio,
        image:
          product.studioImage,
      });
    }

    if (
      product.closeupImage
    ) {
      images.push({
        type: "closeup",
        label: ui.closeup,
        image:
          product.closeupImage,
      });
    }

    if (
      product.lifestyleImage
    ) {
      images.push({
        type: "lifestyle",
        label: ui.lifestyle,
        image:
          product.lifestyleImage,
      });
    }

    if (
      product.modelImage
    ) {
      images.push({
        type: "model",
        label: ui.model,
        image:
          product.modelImage,
      });
    }

    return images;
  };

  /*
  =====================================================
  ACTIVE IMAGE
  =====================================================
  */

  const getActiveImage = (
    product
  ) => {
    const images =
      getProductImages(
        product
      );

    if (
      images.length === 0
    ) {
      return null;
    }

    const selectedType =
      activeImage[
        product._id
      ];

    return (
      images.find(
        (item) =>
          item.type ===
          selectedType
      ) ||
      images.find(
        (item) =>
          item.type ===
          "studio"
      ) ||
      images.find(
        (item) =>
          item.type ===
          "main"
      ) ||
      images[0]
    );
  };

  /*
  =====================================================
  IMAGE SELECT
  =====================================================
  */

  const handleImageSelect = (
    productId,
    imageType
  ) => {
    setActiveImage(
      (previous) => ({
        ...previous,

        [productId]:
          imageType,
      })
    );
  };

  /*
  =====================================================
  NAVIGATION
  =====================================================
  */

  const handleAddProduct =
    () => {
      if (onNavigate) {
        onNavigate(
          "add-product"
        );
      }
    };

  const handlePhotoshoot =
    (product) => {
      if (!onNavigate) {
        return;
      }

      onNavigate(
        "photoshoot",
        product
      );
    };

  /*
  =====================================================
  STATS
  =====================================================
  */

  const totalProducts =
    products.length;

  const publishedProducts =
    products.filter(
      (product) =>
        product.status ===
        "published"
    ).length;

  const draftProducts =
    products.filter(
      (product) =>
        product.status ===
        "draft"
    ).length;

  /*
  =====================================================
  PRODUCT DESCRIPTION
  =====================================================
  */

  const getProductDescription =
    (product) => {
      if (
        !product.description
      ) {
        return "";
      }

      if (
        typeof product.description ===
        "object"
      ) {
        return (
          product.description[
            language
          ] ||
          product.description.en ||
          product.description.hi ||
          ""
        );
      }

      return product.description;
    };

  /*
  =====================================================
  RENDER
  =====================================================
  */

  return (
    <div className="products-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="products-header">

        <div>

          <span className="products-label">
            {ui.catalog}
          </span>

          <h1>
            {ui.title}
          </h1>

          <p>
            {ui.description}
          </p>

        </div>

        <button
          type="button"
          className="add-product-button"
          onClick={
            handleAddProduct
          }
        >
          <span>
            ＋
          </span>

          {ui.addProduct}
        </button>

      </section>

      {/* =================================================
          STATS
      ================================================= */}

      <section className="products-stats">

        <div className="product-stat">

          <span>
            {ui.totalProducts}
          </span>

          <strong>
            {totalProducts}
          </strong>

        </div>

        <div className="product-stat">

          <span>
            {ui.published}
          </span>

          <strong>
            {publishedProducts}
          </strong>

        </div>

        <div className="product-stat">

          <span>
            {ui.drafts}
          </span>

          <strong>
            {draftProducts}
          </strong>

        </div>

      </section>

      {/* =================================================
          TRANSLATION STATUS
      ================================================= */}

      {translationLoading && (
        <div
          style={{
            marginBottom:
              "12px",

            fontSize:
              "11px",

            color:
              "var(--text-soft)",
          }}
        >
          {ui.translating}
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="empty-state">

          <h2>
            {ui.loadingTitle}
          </h2>

          <p>
            {ui.loadingDescription}
          </p>

        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading &&
        error && (
          <div className="error-state">

            <h2>
              {ui.errorTitle}
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={
                fetchProducts
              }
            >
              ↻ {ui.retry}
            </button>

          </div>
        )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        products.length ===
          0 && (
          <div className="empty-state">

            <div
              style={{
                fontSize:
                  "45px",
                marginBottom:
                  "15px",
              }}
            >
              🧵
            </div>

            <h2>
              {ui.emptyTitle}
            </h2>

            <p>
              {ui.emptyDescription}
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={
                handleAddProduct
              }
            >
              ＋ {ui.addFirst}
            </button>

          </div>
        )}

      {/* =================================================
          PRODUCTS
      ================================================= */}

      {!loading &&
        !error &&
        products.length >
          0 && (
          <section>

            <div className="section-top">

              <div>

                <span className="section-label">
                  {ui.collection}
                </span>

                <h2>
                  {ui.allProducts}
                </h2>

              </div>

              <button
                type="button"
                className="view-button"
                onClick={
                  fetchProducts
                }
              >
                ↻ {ui.refresh}
              </button>

            </div>

            <div className="product-grid">

              {products.map(
                (product) => {

                  const images =
                    getProductImages(
                      product
                    );

                  const active =
                    getActiveImage(
                      product
                    );

                  const activeUrl =
                    active
                      ? getImageUrl(
                          active.image
                        )
                      : null;

                  const productDescription =
                    getProductDescription(
                      product
                    );

                  return (
                    <article
                      className="product-card"
                      key={
                        product._id
                      }
                    >

                      {/* =================================================
                          IMAGE
                      ================================================= */}

                      <div
                        style={{
                          position:
                            "relative",
                        }}
                      >

                        {activeUrl ? (
                          <img
                            src={
                              activeUrl
                            }
                            alt={
                              product.name ||
                              ui.product
                            }
                          />
                        ) : (
                          <div
                            style={{
                              height:
                                "230px",

                              display:
                                "flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              background:
                                "linear-gradient(135deg,#edf3ed,#f6f1e8)",

                              fontSize:
                                "55px",
                            }}
                          >
                            🧵
                          </div>
                        )}

                        {active && (
                          <span
                            style={{
                              position:
                                "absolute",

                              top:
                                "12px",

                              left:
                                "12px",

                              padding:
                                "7px 10px",

                              borderRadius:
                                "9px",

                              background:
                                "rgba(23,35,29,0.84)",

                              color:
                                "#fff",

                              fontSize:
                                "10px",

                              fontWeight:
                                "800",
                            }}
                          >
                            {
                              active.label
                            }
                          </span>
                        )}

                      </div>

                      {/* =================================================
                          IMAGE SWITCHER
                      ================================================= */}

                      {images.length >
                        1 && (
                        <div className="product-image-switcher">

                          {images.map(
                            (
                              image
                            ) => {

                              const isActive =
                                active?.type ===
                                image.type;

                              return (
                                <button
                                  key={
                                    image.type
                                  }
                                  type="button"
                                  className={
                                    isActive
                                      ? "active"
                                      : ""
                                  }
                                  onClick={() =>
                                    handleImageSelect(
                                      product._id,
                                      image.type
                                    )
                                  }
                                >
                                  {
                                    image.label
                                  }
                                </button>
                              );
                            }
                          )}

                        </div>
                      )}

                      {/* =================================================
                          CONTENT
                      ================================================= */}

                      <div className="product-card-body">

                        <h3>
                          {
                            product.name ||
                            ui.unnamed
                          }
                        </h3>

                        <p>
                          {
                            product.category ||
                            ui.uncategorized
                          }
                        </p>

                        {/* DESCRIPTION */}

                        {productDescription && (
                          <p
                            style={{
                              marginTop:
                                "8px",

                              lineHeight:
                                "1.5",
                            }}
                          >
                            {
                              productDescription
                            }
                          </p>
                        )}

                        {/* META */}

                        <div className="product-meta">

                          <span
                            className={`product-status ${
                              product.status ===
                              "draft"
                                ? "draft"
                                : ""
                            }`}
                          >
                            {product.status ===
                            "published"
                              ? ui.published
                              : ui.draft}
                          </span>

                          <span className="product-price">
                            {
                              formatPrice(
                                product.sellingPrice
                              )
                            }
                          </span>

                        </div>

                        {/* DETAILS */}

                        <div
                          style={{
                            display:
                              "flex",

                            justifyContent:
                              "space-between",

                            gap:
                              "10px",

                            marginTop:
                              "12px",

                            color:
                              "#8a948d",

                            fontSize:
                              "11px",
                          }}
                        >

                          <span>
                            {ui.stock}:{" "}
                            {
                              product.stock ??
                              0
                            }
                          </span>

                          {product.region && (
                            <span>
                              📍{" "}
                              {
                                product.region
                              }
                            </span>
                          )}

                        </div>

                        {/* ACTIONS */}

                        <div className="product-actions">

                          <button
                            type="button"
                            className="view-button"
                            onClick={() =>
                              console.log(
                                "View product:",
                                product
                              )
                            }
                          >
                            {ui.view}
                          </button>

                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              console.log(
                                "Edit product:",
                                product
                              )
                            }
                          >
                            {ui.edit}
                          </button>

                        </div>

                        {/* AI PHOTOSHOOT */}

                        <button
                          type="button"
                          onClick={() =>
                            handlePhotoshoot(
                              product
                            )
                          }
                          style={{
                            width:
                              "100%",

                            marginTop:
                              "12px",

                            padding:
                              "12px 14px",

                            border:
                              "1px solid var(--primary)",

                            borderRadius:
                              "11px",

                            background:
                              "var(--primary-light)",

                            color:
                              "var(--primary)",

                            fontSize:
                              "12px",

                            fontWeight:
                              "800",

                            cursor:
                              "pointer",
                          }}
                        >
                          ✨{" "}
                          {
                            ui.aiPhotoshoot
                          }
                        </button>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          </section>
        )}

    </div>
  );
}

export default Products;