import { useEffect, useState } from "react";

import "./Insights.css";

import { useLanguage } from "../i18n/LanguageContext";

const BACKEND_URL =
  import.meta.env.VITE_API_URL;

const ARTISAN_ID =
  "6aa7d975f3c555e19062b4cd";

/*
=====================================================
10 LANGUAGE TRANSLATIONS
=====================================================
*/

const INSIGHTS_TRANSLATIONS = {
  en: {
    eyebrow: "BUSINESS INSIGHTS",
    title: "Understand your business.",
    description:
      "Simple insights from your products, stock and pricing.",

    backHome: "Back to Home",

    overview: "BUSINESS OVERVIEW",

    totalProducts: "Total Products",
    published: "Published",
    drafts: "Drafts",
    totalStock: "Total Stock",

    financial: "FINANCIAL OVERVIEW",

    averagePrice: "Average Selling Price",
    highestPrice: "Highest Selling Price",
    lowestPrice: "Lowest Selling Price",

    inventoryValue: "Inventory Value",
    productionCost: "Production Cost",
    potentialProfit: "Potential Profit",
    profitMargin: "Potential Profit Margin",

    stockHealth: "STOCK HEALTH",

    lowStock: "Low Stock",
    outOfStock: "Out of Stock",

    categories: "PRODUCT CATEGORIES",

    topProducts: "TOP PRICED PRODUCTS",

    product: "Product",
    price: "Price",
    stock: "Stock",

    lowStockProducts: "LOW STOCK PRODUCTS",

    loading: "Analyzing your business...",
    loadingDescription:
      "KarigarConnect is preparing your business insights.",

    errorTitle:
      "Insights could not be loaded",

    retry: "Try Again",

    noData:
      "Add products to start seeing business insights.",

    products: "products",
  },

  hi: {
    eyebrow: "व्यवसाय जानकारी",
    title: "अपने व्यवसाय को समझें।",
    description:
      "आपके उत्पाद, स्टॉक और कीमतों से सरल व्यावसायिक जानकारी।",

    backHome: "होम पर वापस जाएं",

    overview: "व्यवसाय का अवलोकन",

    totalProducts: "कुल उत्पाद",
    published: "प्रकाशित",
    drafts: "ड्राफ्ट",
    totalStock: "कुल स्टॉक",

    financial: "वित्तीय अवलोकन",

    averagePrice: "औसत बिक्री कीमत",
    highestPrice: "सबसे अधिक बिक्री कीमत",
    lowestPrice: "सबसे कम बिक्री कीमत",

    inventoryValue: "स्टॉक का कुल मूल्य",
    productionCost: "उत्पादन लागत",
    potentialProfit: "संभावित लाभ",
    profitMargin: "संभावित लाभ मार्जिन",

    stockHealth: "स्टॉक स्थिति",

    lowStock: "कम स्टॉक",
    outOfStock: "स्टॉक समाप्त",

    categories: "उत्पाद श्रेणियां",

    topProducts: "सबसे अधिक कीमत वाले उत्पाद",

    product: "उत्पाद",
    price: "कीमत",
    stock: "स्टॉक",

    lowStockProducts: "कम स्टॉक वाले उत्पाद",

    loading: "आपके व्यवसाय का विश्लेषण हो रहा है...",
    loadingDescription:
      "KarigarConnect आपकी व्यवसाय जानकारी तैयार कर रहा है।",

    errorTitle:
      "जानकारी लोड नहीं की जा सकी",

    retry: "फिर कोशिश करें",

    noData:
      "व्यवसाय की जानकारी देखने के लिए उत्पाद जोड़ें।",

    products: "उत्पाद",
  },

  bn: {
    eyebrow: "ব্যবসার তথ্য",
    title: "আপনার ব্যবসা বুঝুন।",
    description:
      "আপনার পণ্য, স্টক এবং মূল্যের সহজ ব্যবসায়িক তথ্য।",

    backHome: "হোমে ফিরে যান",

    overview: "ব্যবসার সারসংক্ষেপ",

    totalProducts: "মোট পণ্য",
    published: "প্রকাশিত",
    drafts: "খসড়া",
    totalStock: "মোট স্টক",

    financial: "আর্থিক সারসংক্ষেপ",

    averagePrice: "গড় বিক্রয় মূল্য",
    highestPrice: "সর্বোচ্চ বিক্রয় মূল্য",
    lowestPrice: "সর্বনিম্ন বিক্রয় মূল্য",

    inventoryValue: "স্টকের মোট মূল্য",
    productionCost: "উৎপাদন খরচ",
    potentialProfit: "সম্ভাব্য লাভ",
    profitMargin: "সম্ভাব্য লাভের হার",

    stockHealth: "স্টকের অবস্থা",

    lowStock: "কম স্টক",
    outOfStock: "স্টক শেষ",

    categories: "পণ্যের বিভাগ",

    topProducts: "সর্বোচ্চ মূল্যের পণ্য",

    product: "পণ্য",
    price: "মূল্য",
    stock: "স্টক",

    lowStockProducts: "কম স্টকের পণ্য",

    loading: "আপনার ব্যবসা বিশ্লেষণ করা হচ্ছে...",
    loadingDescription:
      "KarigarConnect আপনার ব্যবসার তথ্য প্রস্তুত করছে।",

    errorTitle:
      "তথ্য লোড করা যায়নি",

    retry: "আবার চেষ্টা করুন",

    noData:
      "ব্যবসার তথ্য দেখতে পণ্য যোগ করুন।",

    products: "পণ্য",
  },

  ta: {
    eyebrow: "வணிக தகவல்கள்",
    title: "உங்கள் வணிகத்தைப் புரிந்துகொள்ளுங்கள்.",
    description:
      "உங்கள் தயாரிப்புகள், இருப்பு மற்றும் விலைகளிலிருந்து எளிய வணிக தகவல்கள்.",

    backHome: "முகப்புக்குத் திரும்புங்கள்",

    overview: "வணிக மேலோட்டம்",

    totalProducts: "மொத்த தயாரிப்புகள்",
    published: "வெளியிடப்பட்டது",
    drafts: "வரைவுகள்",
    totalStock: "மொத்த இருப்பு",

    financial: "நிதி மேலோட்டம்",

    averagePrice: "சராசரி விற்பனை விலை",
    highestPrice: "அதிகபட்ச விற்பனை விலை",
    lowestPrice: "குறைந்தபட்ச விற்பனை விலை",

    inventoryValue: "இருப்பின் மொத்த மதிப்பு",
    productionCost: "உற்பத்திச் செலவு",
    potentialProfit: "சாத்தியமான லாபம்",
    profitMargin: "சாத்தியமான லாப விகிதம்",

    stockHealth: "இருப்பு நிலை",

    lowStock: "குறைந்த இருப்பு",
    outOfStock: "இருப்பு இல்லை",

    categories: "தயாரிப்பு வகைகள்",

    topProducts: "அதிக விலை தயாரிப்புகள்",

    product: "தயாரிப்பு",
    price: "விலை",
    stock: "இருப்பு",

    lowStockProducts: "குறைந்த இருப்பு தயாரிப்புகள்",

    loading: "உங்கள் வணிகம் பகுப்பாய்வு செய்யப்படுகிறது...",
    loadingDescription:
      "KarigarConnect உங்கள் வணிக தகவல்களைத் தயாரிக்கிறது.",

    errorTitle:
      "தகவல்களை ஏற்ற முடியவில்லை",

    retry: "மீண்டும் முயற்சிக்கவும்",

    noData:
      "வணிக தகவல்களைப் பார்க்க தயாரிப்புகளைச் சேர்க்கவும்.",

    products: "தயாரிப்புகள்",
  },

  te: {
    eyebrow: "వ్యాపార సమాచారం",
    title: "మీ వ్యాపారాన్ని అర్థం చేసుకోండి.",
    description:
      "మీ ఉత్పత్తులు, స్టాక్ మరియు ధరల నుండి సులభమైన వ్యాపార సమాచారం.",

    backHome: "హోమ్‌కు తిరిగి వెళ్లండి",

    overview: "వ్యాపార అవలోకనం",

    totalProducts: "మొత్తం ఉత్పత్తులు",
    published: "ప్రచురించబడినవి",
    drafts: "డ్రాఫ్ట్‌లు",
    totalStock: "మొత్తం స్టాక్",

    financial: "ఆర్థిక అవలోకనం",

    averagePrice: "సగటు అమ్మకపు ధర",
    highestPrice: "అత్యధిక అమ్మకపు ధర",
    lowestPrice: "అత్యల్ప అమ్మకపు ధర",

    inventoryValue: "స్టాక్ మొత్తం విలువ",
    productionCost: "ఉత్పత్తి ఖర్చు",
    potentialProfit: "సంభావ్య లాభం",
    profitMargin: "సంభావ్య లాభ మార్జిన్",

    stockHealth: "స్టాక్ పరిస్థితి",

    lowStock: "తక్కువ స్టాక్",
    outOfStock: "స్టాక్ లేదు",

    categories: "ఉత్పత్తి వర్గాలు",

    topProducts: "అధిక ధర ఉత్పత్తులు",

    product: "ఉత్పత్తి",
    price: "ధర",
    stock: "స్టాక్",

    lowStockProducts: "తక్కువ స్టాక్ ఉత్పత్తులు",

    loading: "మీ వ్యాపారం విశ్లేషించబడుతోంది...",
    loadingDescription:
      "KarigarConnect మీ వ్యాపార సమాచారాన్ని సిద్ధం చేస్తోంది.",

    errorTitle:
      "సమాచారాన్ని లోడ్ చేయలేకపోయాము",

    retry: "మళ్లీ ప్రయత్నించండి",

    noData:
      "వ్యాపార సమాచారాన్ని చూడటానికి ఉత్పత్తులను జోడించండి.",

    products: "ఉత్పత్తులు",
  },

  mr: {
    eyebrow: "व्यवसाय माहिती",
    title: "तुमचा व्यवसाय समजून घ्या.",
    description:
      "तुमची उत्पादने, साठा आणि किंमतींमधून सोपी व्यवसाय माहिती.",

    backHome: "होमवर परत जा",

    overview: "व्यवसायाचा आढावा",

    totalProducts: "एकूण उत्पादने",
    published: "प्रकाशित",
    drafts: "मसुदे",
    totalStock: "एकूण साठा",

    financial: "आर्थिक आढावा",

    averagePrice: "सरासरी विक्री किंमत",
    highestPrice: "सर्वाधिक विक्री किंमत",
    lowestPrice: "सर्वात कमी विक्री किंमत",

    inventoryValue: "साठ्याचे एकूण मूल्य",
    productionCost: "उत्पादन खर्च",
    potentialProfit: "संभाव्य नफा",
    profitMargin: "संभाव्य नफा मार्जिन",

    stockHealth: "साठ्याची स्थिती",

    lowStock: "कमी साठा",
    outOfStock: "साठा संपला",

    categories: "उत्पादन श्रेणी",

    topProducts: "सर्वाधिक किंमतीची उत्पादने",

    product: "उत्पादन",
    price: "किंमत",
    stock: "साठा",

    lowStockProducts: "कमी साठ्याची उत्पादने",

    loading: "तुमच्या व्यवसायाचे विश्लेषण केले जात आहे...",
    loadingDescription:
      "KarigarConnect तुमची व्यवसाय माहिती तयार करत आहे.",

    errorTitle:
      "माहिती लोड करता आली नाही",

    retry: "पुन्हा प्रयत्न करा",

    noData:
      "व्यवसायाची माहिती पाहण्यासाठी उत्पादने जोडा.",

    products: "उत्पादने",
  },

  gu: {
    eyebrow: "વ્યવસાય માહિતી",
    title: "તમારો વ્યવસાય સમજો.",
    description:
      "તમારા ઉત્પાદનો, સ્ટોક અને કિંમતો પરથી સરળ વ્યવસાય માહિતી.",

    backHome: "હોમ પર પાછા જાઓ",

    overview: "વ્યવસાયનો સારાંશ",

    totalProducts: "કુલ ઉત્પાદનો",
    published: "પ્રકાશિત",
    drafts: "ડ્રાફ્ટ",
    totalStock: "કુલ સ્ટોક",

    financial: "નાણાકીય સારાંશ",

    averagePrice: "સરેરાશ વેચાણ કિંમત",
    highestPrice: "સૌથી વધુ વેચાણ કિંમત",
    lowestPrice: "સૌથી ઓછી વેચાણ કિંમત",

    inventoryValue: "સ્ટોકનું કુલ મૂલ્ય",
    productionCost: "ઉત્પાદન ખર્ચ",
    potentialProfit: "સંભવિત નફો",
    profitMargin: "સંભવિત નફાનો માર્જિન",

    stockHealth: "સ્ટોક સ્થિતિ",

    lowStock: "ઓછો સ્ટોક",
    outOfStock: "સ્ટોક સમાપ્ત",

    categories: "ઉત્પાદન શ્રેણીઓ",

    topProducts: "સૌથી વધુ કિંમતવાળા ઉત્પાદનો",

    product: "ઉત્પાદન",
    price: "કિંમત",
    stock: "સ્ટોક",

    lowStockProducts: "ઓછા સ્ટોકવાળા ઉત્પાદનો",

    loading: "તમારા વ્યવસાયનું વિશ્લેષણ થઈ રહ્યું છે...",
    loadingDescription:
      "KarigarConnect તમારી વ્યવસાય માહિતી તૈયાર કરી રહ્યું છે.",

    errorTitle:
      "માહિતી લોડ કરી શકાય નથી",

    retry: "ફરી પ્રયાસ કરો",

    noData:
      "વ્યવસાયની માહિતી જોવા માટે ઉત્પાદનો ઉમેરો.",

    products: "ઉત્પાદનો",
  },

  kn: {
    eyebrow: "ವ್ಯವಹಾರ ಮಾಹಿತಿ",
    title: "ನಿಮ್ಮ ವ್ಯವಹಾರವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.",
    description:
      "ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳು, ಸ್ಟಾಕ್ ಮತ್ತು ಬೆಲೆಗಳಿಂದ ಸರಳ ವ್ಯವಹಾರ ಮಾಹಿತಿ.",

    backHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",

    overview: "ವ್ಯವಹಾರದ ಅವಲೋಕನ",

    totalProducts: "ಒಟ್ಟು ಉತ್ಪನ್ನಗಳು",
    published: "ಪ್ರಕಟಿತ",
    drafts: "ಕರಡುಗಳು",
    totalStock: "ಒಟ್ಟು ಸ್ಟಾಕ್",

    financial: "ಹಣಕಾಸಿನ ಅವಲೋಕನ",

    averagePrice: "ಸರಾಸರಿ ಮಾರಾಟ ಬೆಲೆ",
    highestPrice: "ಅತ್ಯಧಿಕ ಮಾರಾಟ ಬೆಲೆ",
    lowestPrice: "ಕಡಿಮೆ ಮಾರಾಟ ಬೆಲೆ",

    inventoryValue: "ಸ್ಟಾಕ್‌ನ ಒಟ್ಟು ಮೌಲ್ಯ",
    productionCost: "ಉತ್ಪಾದನಾ ವೆಚ್ಚ",
    potentialProfit: "ಸಂಭಾವ್ಯ ಲಾಭ",
    profitMargin: "ಸಂಭಾವ್ಯ ಲಾಭ ಮಾರ್ಜಿನ್",

    stockHealth: "ಸ್ಟಾಕ್ ಸ್ಥಿತಿ",

    lowStock: "ಕಡಿಮೆ ಸ್ಟಾಕ್",
    outOfStock: "ಸ್ಟಾಕ್ ಇಲ್ಲ",

    categories: "ಉತ್ಪನ್ನ ವರ್ಗಗಳು",

    topProducts: "ಅತ್ಯಧಿಕ ಬೆಲೆಯ ಉತ್ಪನ್ನಗಳು",

    product: "ಉತ್ಪನ್ನ",
    price: "ಬೆಲೆ",
    stock: "ಸ್ಟಾಕ್",

    lowStockProducts: "ಕಡಿಮೆ ಸ್ಟಾಕ್ ಉತ್ಪನ್ನಗಳು",

    loading: "ನಿಮ್ಮ ವ್ಯವಹಾರವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    loadingDescription:
      "KarigarConnect ನಿಮ್ಮ ವ್ಯವಹಾರ ಮಾಹಿತಿಯನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಿದೆ.",

    errorTitle:
      "ಮಾಹಿತಿಯನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ",

    retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",

    noData:
      "ವ್ಯವಹಾರ ಮಾಹಿತಿ ನೋಡಲು ಉತ್ಪನ್ನಗಳನ್ನು ಸೇರಿಸಿ.",

    products: "ಉತ್ಪನ್ನಗಳು",
  },

  ml: {
    eyebrow: "ബിസിനസ് വിവരങ്ങൾ",
    title: "നിങ്ങളുടെ ബിസിനസ് മനസ്സിലാക്കുക.",
    description:
      "നിങ്ങളുടെ ഉൽപ്പന്നങ്ങൾ, സ്റ്റോക്ക്, വിലകൾ എന്നിവയിൽ നിന്നുള്ള ലളിതമായ ബിസിനസ് വിവരങ്ങൾ.",

    backHome: "ഹോമിലേക്ക് മടങ്ങുക",

    overview: "ബിസിനസ് അവലോകനം",

    totalProducts: "ആകെ ഉൽപ്പന്നങ്ങൾ",
    published: "പ്രസിദ്ധീകരിച്ചത്",
    drafts: "ഡ്രാഫ്റ്റുകൾ",
    totalStock: "ആകെ സ്റ്റോക്ക്",

    financial: "സാമ്പത്തിക അവലോകനം",

    averagePrice: "ശരാശരി വിൽപ്പന വില",
    highestPrice: "ഏറ്റവും ഉയർന്ന വിൽപ്പന വില",
    lowestPrice: "ഏറ്റവും കുറഞ്ഞ വിൽപ്പന വില",

    inventoryValue: "സ്റ്റോക്കിന്റെ ആകെ മൂല്യം",
    productionCost: "ഉൽപ്പാദന ചെലവ്",
    potentialProfit: "സാധ്യതയുള്ള ലാഭം",
    profitMargin: "സാധ്യതയുള്ള ലാഭ മാർജിൻ",

    stockHealth: "സ്റ്റോക്ക് നില",

    lowStock: "കുറഞ്ഞ സ്റ്റോക്ക്",
    outOfStock: "സ്റ്റോക്ക് ഇല്ല",

    categories: "ഉൽപ്പന്ന വിഭാഗങ്ങൾ",

    topProducts: "ഏറ്റവും ഉയർന്ന വിലയുള്ള ഉൽപ്പന്നങ്ങൾ",

    product: "ഉൽപ്പന്നം",
    price: "വില",
    stock: "സ്റ്റോക്ക്",

    lowStockProducts: "കുറഞ്ഞ സ്റ്റോക്കുള്ള ഉൽപ്പന്നങ്ങൾ",

    loading: "നിങ്ങളുടെ ബിസിനസ് വിശകലനം ചെയ്യുന്നു...",
    loadingDescription:
      "KarigarConnect നിങ്ങളുടെ ബിസിനസ് വിവരങ്ങൾ തയ്യാറാക്കുന്നു.",

    errorTitle:
      "വിവരങ്ങൾ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല",

    retry: "വീണ്ടും ശ്രമിക്കുക",

    noData:
      "ബിസിനസ് വിവരങ്ങൾ കാണാൻ ഉൽപ്പന്നങ്ങൾ ചേർക്കുക.",

    products: "ഉൽപ്പന്നങ്ങൾ",
  },

  pa: {
    eyebrow: "ਕਾਰੋਬਾਰੀ ਜਾਣਕਾਰੀ",
    title: "ਆਪਣਾ ਕਾਰੋਬਾਰ ਸਮਝੋ।",
    description:
      "ਤੁਹਾਡੇ ਉਤਪਾਦਾਂ, ਸਟਾਕ ਅਤੇ ਕੀਮਤਾਂ ਤੋਂ ਸਧਾਰਨ ਕਾਰੋਬਾਰੀ ਜਾਣਕਾਰੀ।",

    backHome: "ਹੋਮ 'ਤੇ ਵਾਪਸ ਜਾਓ",

    overview: "ਕਾਰੋਬਾਰ ਦਾ ਜਾਇਜ਼ਾ",

    totalProducts: "ਕੁੱਲ ਉਤਪਾਦ",
    published: "ਪ੍ਰਕਾਸ਼ਿਤ",
    drafts: "ਡਰਾਫਟ",
    totalStock: "ਕੁੱਲ ਸਟਾਕ",

    financial: "ਵਿੱਤੀ ਜਾਇਜ਼ਾ",

    averagePrice: "ਔਸਤ ਵਿਕਰੀ ਕੀਮਤ",
    highestPrice: "ਸਭ ਤੋਂ ਵੱਧ ਵਿਕਰੀ ਕੀਮਤ",
    lowestPrice: "ਸਭ ਤੋਂ ਘੱਟ ਵਿਕਰੀ ਕੀਮਤ",

    inventoryValue: "ਸਟਾਕ ਦੀ ਕੁੱਲ ਕੀਮਤ",
    productionCost: "ਉਤਪਾਦਨ ਲਾਗਤ",
    potentialProfit: "ਸੰਭਾਵਿਤ ਮੁਨਾਫ਼ਾ",
    profitMargin: "ਸੰਭਾਵਿਤ ਮੁਨਾਫ਼ਾ ਮਾਰਜਿਨ",

    stockHealth: "ਸਟਾਕ ਦੀ ਸਥਿਤੀ",

    lowStock: "ਘੱਟ ਸਟਾਕ",
    outOfStock: "ਸਟਾਕ ਖਤਮ",

    categories: "ਉਤਪਾਦ ਸ਼੍ਰੇਣੀਆਂ",

    topProducts: "ਸਭ ਤੋਂ ਵੱਧ ਕੀਮਤ ਵਾਲੇ ਉਤਪਾਦ",

    product: "ਉਤਪਾਦ",
    price: "ਕੀਮਤ",
    stock: "ਸਟਾਕ",

    lowStockProducts: "ਘੱਟ ਸਟਾਕ ਵਾਲੇ ਉਤਪਾਦ",

    loading: "ਤੁਹਾਡੇ ਕਾਰੋਬਾਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    loadingDescription:
      "KarigarConnect ਤੁਹਾਡੀ ਕਾਰੋਬਾਰੀ ਜਾਣਕਾਰੀ ਤਿਆਰ ਕਰ ਰਿਹਾ ਹੈ।",

    errorTitle:
      "ਜਾਣਕਾਰੀ ਲੋਡ ਨਹੀਂ ਹੋ ਸਕੀ",

    retry: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",

    noData:
      "ਕਾਰੋਬਾਰੀ ਜਾਣਕਾਰੀ ਦੇਖਣ ਲਈ ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ।",

    products: "ਉਤਪਾਦ",
  },
};

/*
=====================================================
PRICE FORMATTER
=====================================================
*/

const formatPrice = (value) => {
  return `₹${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
};

/*
=====================================================
INSIGHTS PAGE
=====================================================
*/

function Insights({
  onNavigate,
}) {
  const {
    language,
  } = useLanguage();

  const ui =
    INSIGHTS_TRANSLATIONS[
      language
    ] ||
    INSIGHTS_TRANSLATIONS.en;

  const [insights, setInsights] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
  =====================================================
  FETCH INSIGHTS
  =====================================================
  */

  const fetchInsights =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${BACKEND_URL}/api/products/insights?artisan=${ARTISAN_ID}`
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load insights."
          );
        }

        setInsights(
          data.insights || null
        );
      } catch (err) {
        console.error(
          "Insights error:",
          err
        );

        setError(
          err.message ||
            "Failed to load business insights."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchInsights();
  }, []);

  /*
  =====================================================
  LOADING
  =====================================================
  */

  if (loading) {
    return (
      <div className="insights-page">

        <section className="insights-header">

          <div>
            <span className="insights-eyebrow">
              {ui.eyebrow}
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
            className="insights-back-button"
            onClick={() =>
              onNavigate(
                "home"
              )
            }
          >
            ← {ui.backHome}
          </button>

        </section>

        <div className="insights-loading">

          <div className="insights-loading-orb">
            ✦
          </div>

          <h2>
            {ui.loading}
          </h2>

          <p>
            {
              ui.loadingDescription
            }
          </p>

          <div className="insights-loading-lines">
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>

      </div>
    );
  }

  /*
  =====================================================
  ERROR
  =====================================================
  */

  if (error) {
    return (
      <div className="insights-page">

        <section className="insights-header">

          <div>
            <span className="insights-eyebrow">
              {ui.eyebrow}
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
            className="insights-back-button"
            onClick={() =>
              onNavigate(
                "home"
              )
            }
          >
            ← {ui.backHome}
          </button>

        </section>

        <div className="insights-error">

          <div className="insights-error-icon">
            !
          </div>

          <h2>
            {ui.errorTitle}
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="insights-primary-button"
            onClick={
              fetchInsights
            }
          >
            ↻ {ui.retry}
          </button>

        </div>

      </div>
    );
  }

  /*
  =====================================================
  NO DATA
  =====================================================
  */

  if (!insights) {
    return (
      <div className="insights-page">

        <div className="insights-empty">

          <div className="insights-empty-icon">
            📊
          </div>

          <h2>
            {ui.noData}
          </h2>

          <button
            type="button"
            className="insights-primary-button"
            onClick={() =>
              onNavigate(
                "add-product"
              )
            }
          >
            + {ui.totalProducts}
          </button>

        </div>

      </div>
    );
  }

  /*
  =====================================================
  RENDER DATA
  =====================================================
  */

  return (
    <div className="insights-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="insights-header">

        <div>

          <span className="insights-eyebrow">
            {ui.eyebrow}
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
          className="insights-back-button"
          onClick={() =>
            onNavigate(
              "home"
            )
          }
        >
          ← {ui.backHome}
        </button>

      </section>

      {/* =================================================
          OVERVIEW
      ================================================= */}

      <section className="insights-section">

        <div className="insights-section-heading">

          <span>
            {ui.overview}
          </span>

        </div>

        <div className="insights-stat-grid">

          <div className="insights-stat-card">

            <div className="insights-stat-icon">
              🧵
            </div>

            <span>
              {ui.totalProducts}
            </span>

            <strong>
              {
                insights.totalProducts
              }
            </strong>

          </div>

          <div className="insights-stat-card">

            <div className="insights-stat-icon">
              ✅
            </div>

            <span>
              {ui.published}
            </span>

            <strong>
              {
                insights.publishedProducts
              }
            </strong>

          </div>

          <div className="insights-stat-card">

            <div className="insights-stat-icon">
              📝
            </div>

            <span>
              {ui.drafts}
            </span>

            <strong>
              {
                insights.draftProducts
              }
            </strong>

          </div>

          <div className="insights-stat-card">

            <div className="insights-stat-icon">
              📦
            </div>

            <span>
              {ui.totalStock}
            </span>

            <strong>
              {
                insights.totalStock
              }
            </strong>

          </div>

        </div>

      </section>

      {/* =================================================
          FINANCIAL
      ================================================= */}

      <section className="insights-section">

        <div className="insights-section-heading">

          <span>
            {ui.financial}
          </span>

        </div>

        <div className="insights-financial-grid">

          <div className="insights-financial-card">

            <span>
              {ui.averagePrice}
            </span>

            <strong>
              {
                formatPrice(
                  insights.averageSellingPrice
                )
              }
            </strong>

          </div>

          <div className="insights-financial-card">

            <span>
              {ui.highestPrice}
            </span>

            <strong>
              {
                formatPrice(
                  insights.highestSellingPrice
                )
              }
            </strong>

          </div>

          <div className="insights-financial-card">

            <span>
              {ui.lowestPrice}
            </span>

            <strong>
              {
                formatPrice(
                  insights.lowestSellingPrice
                )
              }
            </strong>

          </div>

          <div className="insights-financial-card highlight">

            <span>
              {ui.inventoryValue}
            </span>

            <strong>
              {
                formatPrice(
                  insights.totalInventoryValue
                )
              }
            </strong>

          </div>

          <div className="insights-financial-card">

            <span>
              {ui.productionCost}
            </span>

            <strong>
              {
                formatPrice(
                  insights.totalProductionCost
                )
              }
            </strong>

          </div>

          <div className="insights-financial-card profit">

            <span>
              {ui.potentialProfit}
            </span>

            <strong>
              {
                formatPrice(
                  insights.potentialProfit
                )
              }
            </strong>

          </div>

          <div className="insights-financial-card margin">

            <span>
              {ui.profitMargin}
            </span>

            <strong>
              {
                Number(
                  insights.potentialProfitMargin ||
                    0
                )
              }
              %
            </strong>

          </div>

        </div>

      </section>

      {/* =================================================
          STOCK HEALTH
      ================================================= */}

      <section className="insights-section">

        <div className="insights-section-heading">

          <span>
            {ui.stockHealth}
          </span>

        </div>

        <div className="insights-health-grid">

          <div className="insights-health-card warning">

            <span>
              ⚠️
            </span>

            <div>

              <small>
                {ui.lowStock}
              </small>

              <strong>
                {
                  insights.lowStockProducts
                }
              </strong>

            </div>

          </div>

          <div className="insights-health-card danger">

            <span>
              ⛔
            </span>

            <div>

              <small>
                {ui.outOfStock}
              </small>

              <strong>
                {
                  insights.outOfStockProducts
                }
              </strong>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          CATEGORY BREAKDOWN
      ================================================= */}

      <section className="insights-section">

        <div className="insights-section-heading">

          <span>
            {ui.categories}
          </span>

        </div>

        <div className="insights-category-list">

          {insights.categoryBreakdown?.map(
            (
              category
            ) => (
              <div
                className="insights-category-row"
                key={
                  category.category
                }
              >

                <div>

                  <strong>
                    {
                      category.category
                    }
                  </strong>

                  <span>
                    {
                      category.count
                    }{" "}
                    {ui.products}
                  </span>

                </div>

                <strong>
                  {
                    category.count
                  }
                </strong>

              </div>
            )
          )}

        </div>

      </section>

      {/* =================================================
          TOP PRODUCTS
      ================================================= */}

      <section className="insights-section">

        <div className="insights-section-heading">

          <span>
            {ui.topProducts}
          </span>

        </div>

        <div className="insights-table">

          <div className="insights-table-header">

            <span>
              {ui.product}
            </span>

            <span>
              {ui.price}
            </span>

            <span>
              {ui.stock}
            </span>

          </div>

          {insights.topPricedProducts?.map(
            (
              product
            ) => (
              <div
                className="insights-table-row"
                key={
                  product.id
                }
              >

                <strong>
                  {
                    product.name
                  }
                </strong>

                <span>
                  {
                    formatPrice(
                      product.sellingPrice
                    )
                  }
                </span>

                <span>
                  {
                    product.stock
                  }
                </span>

              </div>
            )
          )}

        </div>

      </section>

      {/* =================================================
          LOW STOCK PRODUCTS
      ================================================= */}

      {insights.lowStockList?.length >
        0 && (
        <section className="insights-section">

          <div className="insights-section-heading">

            <span>
              {
                ui.lowStockProducts
              }
            </span>

          </div>

          <div className="insights-low-stock-list">

            {insights.lowStockList.map(
              (
                product
              ) => (
                <div
                  className="insights-low-stock-row"
                  key={
                    product.id
                  }
                >

                  <strong>
                    {
                      product.name
                    }
                  </strong>

                  <span>
                    {
                      product.stock
                    }
                  </span>

                </div>
              )
            )}

          </div>

        </section>
      )}

    </div>
  );
}

export default Insights;