import { useState } from "react";
import "./Pricing.css";

import { useLanguage } from "../i18n/LanguageContext";

const BACKEND_URL =
  "http://localhost:5000";

/*
=====================================================
PRICING TRANSLATIONS
10 INDIAN LANGUAGES
=====================================================
*/

const PRICING_TRANSLATIONS = {
  en: {
    label: "AI PRICING ASSISTANT",
    heroTitleOne: "Know what your craft",
    heroTitleTwo: "is worth.",
    heroDescription:
      "Tell KarigarConnect about your product and get a practical pricing recommendation based on your cost, time and craftsmanship.",
    home: "Home",
    smartPricing: "SMART PRICING",
    fairPriceTitle:
      "Your work deserves a fair price.",
    fairPriceDescription:
      "AI considers production cost, craftsmanship, material quality and time required to make your product.",
    productDetails: "Product details",
    productDetailsHelp:
      "Give AI enough information to make a useful recommendation.",
    productName: "Product Name",
    category: "Category",
    material: "Material",
    color: "Color",
    craftType: "Craft Type",
    craftTechnique: "Technique",
    region: "Region",
    productionTime: "Production Time",
    costPrice: "Your Cost",
    stock: "Current Stock",
    generatePricing: "Generate AI Price",
    calculating: "AI is calculating...",
    aiPricePreview: "AI PRICE PREVIEW",
    recommendationPlaceholder:
      "Your recommendation will appear here.",
    recommendationHelp:
      "Enter your product details and let KarigarConnect calculate a practical selling range.",
    cost: "Cost",
    craftValue: "Craft Value",
    time: "Time",
    fairPrice: "Fair Price",
    aiAnalysis: "AI ANALYSIS",
    understandingCraft:
      "Understanding your craft...",
    analysisHelp:
      "KarigarConnect is evaluating the product information and preparing a recommendation.",
    aiRecommendation: "AI RECOMMENDATION",
    suggestedSellingPrice:
      "Suggested selling price",
    confidence: "confidence",
    recommended: "RECOMMENDED",
    practicalPrice:
      "A practical price for your product",
    minimum: "Minimum",
    maximum: "Maximum",
    whyThisPrice: "WHY THIS PRICE?",
    factorsConsidered:
      "FACTORS CONSIDERED",
    useThisPrice:
      "Use this price in Add Product",
    pricingErrorTitle:
      "Pricing could not be generated.",
  },

  hi: {
    label: "AI मूल्य निर्धारण सहायक",
    heroTitleOne: "जानें आपकी कला की",
    heroTitleTwo: "सही कीमत क्या है।",
    heroDescription:
      "अपने उत्पाद के बारे में KarigarConnect को बताएं और लागत, समय और कारीगरी के आधार पर व्यावहारिक मूल्य सुझाव प्राप्त करें।",
    home: "होम",
    smartPricing: "स्मार्ट मूल्य निर्धारण",
    fairPriceTitle:
      "आपका काम उचित कीमत का हकदार है।",
    fairPriceDescription:
      "AI उत्पादन लागत, कारीगरी, सामग्री की गुणवत्ता और उत्पाद बनाने में लगने वाले समय को ध्यान में रखता है।",
    productDetails: "उत्पाद विवरण",
    productDetailsHelp:
      "उपयोगी सुझाव देने के लिए AI को पर्याप्त जानकारी दें।",
    productName: "उत्पाद का नाम",
    category: "श्रेणी",
    material: "सामग्री",
    color: "रंग",
    craftType: "कारीगरी का प्रकार",
    craftTechnique: "तकनीक",
    region: "क्षेत्र",
    productionTime: "उत्पादन समय",
    costPrice: "आपकी लागत",
    stock: "वर्तमान स्टॉक",
    generatePricing: "AI कीमत बनाएं",
    calculating: "AI गणना कर रहा है...",
    aiPricePreview: "AI मूल्य पूर्वावलोकन",
    recommendationPlaceholder:
      "आपकी सिफारिश यहां दिखाई देगी।",
    recommendationHelp:
      "अपने उत्पाद का विवरण भरें और KarigarConnect को व्यावहारिक बिक्री मूल्य की गणना करने दें।",
    cost: "लागत",
    craftValue: "कारीगरी मूल्य",
    time: "समय",
    fairPrice: "उचित कीमत",
    aiAnalysis: "AI विश्लेषण",
    understandingCraft:
      "आपकी कारीगरी को समझा जा रहा है...",
    analysisHelp:
      "KarigarConnect उत्पाद की जानकारी का मूल्यांकन कर रहा है और सुझाव तैयार कर रहा है।",
    aiRecommendation: "AI सिफारिश",
    suggestedSellingPrice:
      "सुझाई गई बिक्री कीमत",
    confidence: "विश्वास",
    recommended: "अनुशंसित",
    practicalPrice:
      "आपके उत्पाद के लिए व्यावहारिक कीमत",
    minimum: "न्यूनतम",
    maximum: "अधिकतम",
    whyThisPrice: "यह कीमत क्यों?",
    factorsConsidered:
      "ध्यान में रखे गए कारक",
    useThisPrice:
      "Add Product में यह कीमत इस्तेमाल करें",
    pricingErrorTitle:
      "कीमत उत्पन्न नहीं की जा सकी।",
  },

  bn: {
    label: "AI মূল্য সহায়ক",
    heroTitleOne: "জানুন আপনার কারুশিল্পের",
    heroTitleTwo: "মূল্য কত।",
    heroDescription:
      "আপনার পণ্য সম্পর্কে KarigarConnect-কে বলুন এবং খরচ, সময় ও কারুশিল্পের ভিত্তিতে একটি ব্যবহারিক মূল্য প্রস্তাব পান।",
    home: "হোম",
    smartPricing: "স্মার্ট মূল্য নির্ধারণ",
    fairPriceTitle:
      "আপনার কাজ একটি ন্যায্য মূল্যের দাবিদার।",
    fairPriceDescription:
      "AI উৎপাদন খরচ, কারুশিল্প, উপকরণের মান এবং পণ্য তৈরিতে লাগা সময় বিবেচনা করে।",
    productDetails: "পণ্যের বিবরণ",
    productDetailsHelp:
      "একটি কার্যকর সুপারিশের জন্য AI-কে যথেষ্ট তথ্য দিন।",
    productName: "পণ্যের নাম",
    category: "বিভাগ",
    material: "উপাদান",
    color: "রঙ",
    craftType: "কারুশিল্পের ধরন",
    craftTechnique: "কৌশল",
    region: "অঞ্চল",
    productionTime: "উৎপাদনের সময়",
    costPrice: "আপনার খরচ",
    stock: "বর্তমান স্টক",
    generatePricing: "AI মূল্য তৈরি করুন",
    calculating: "AI হিসাব করছে...",
    aiPricePreview: "AI মূল্য পূর্বরূপ",
    recommendationPlaceholder:
      "আপনার সুপারিশ এখানে দেখা যাবে।",
    recommendationHelp:
      "আপনার পণ্যের বিবরণ দিন এবং KarigarConnect-কে একটি ব্যবহারিক বিক্রয় মূল্য গণনা করতে দিন।",
    cost: "খরচ",
    craftValue: "কারুশিল্পের মূল্য",
    time: "সময়",
    fairPrice: "ন্যায্য মূল্য",
    aiAnalysis: "AI বিশ্লেষণ",
    understandingCraft:
      "আপনার কারুশিল্প বোঝা হচ্ছে...",
    analysisHelp:
      "KarigarConnect পণ্যের তথ্য বিশ্লেষণ করছে এবং একটি সুপারিশ প্রস্তুত করছে।",
    aiRecommendation: "AI সুপারিশ",
    suggestedSellingPrice:
      "প্রস্তাবিত বিক্রয় মূল্য",
    confidence: "আস্থা",
    recommended: "প্রস্তাবিত",
    practicalPrice:
      "আপনার পণ্যের জন্য একটি ব্যবহারিক মূল্য",
    minimum: "সর্বনিম্ন",
    maximum: "সর্বোচ্চ",
    whyThisPrice: "এই মূল্য কেন?",
    factorsConsidered:
      "বিবেচিত বিষয়গুলি",
    useThisPrice:
      "Add Product-এ এই মূল্য ব্যবহার করুন",
    pricingErrorTitle:
      "মূল্য তৈরি করা যায়নি।",
  },

  ta: {
    label: "AI விலை நிர்ணய உதவியாளர்",
    heroTitleOne:
      "உங்கள் கைவினையின் மதிப்பை",
    heroTitleTwo: "அறிந்து கொள்ளுங்கள்.",
    heroDescription:
      "உங்கள் தயாரிப்பு பற்றி KarigarConnect-க்கு சொல்லுங்கள். செலவு, நேரம் மற்றும் கைவினைத்திறன் அடிப்படையில் நடைமுறை விலை பரிந்துரையைப் பெறுங்கள்.",
    home: "முகப்பு",
    smartPricing: "ஸ்மார்ட் விலை நிர்ணயம்",
    fairPriceTitle:
      "உங்கள் வேலை நியாயமான விலைக்கு தகுதியானது.",
    fairPriceDescription:
      "AI உற்பத்திச் செலவு, கைவினைத்திறன், பொருள் தரம் மற்றும் தயாரிக்க வேண்டிய நேரத்தை கருத்தில் கொள்கிறது.",
    productDetails: "தயாரிப்பு விவரங்கள்",
    productDetailsHelp:
      "பயனுள்ள பரிந்துரைக்காக AI-க்கு போதுமான தகவல் வழங்குங்கள்.",
    productName: "தயாரிப்பு பெயர்",
    category: "வகை",
    material: "பொருள்",
    color: "நிறம்",
    craftType: "கைவினை வகை",
    craftTechnique: "நுட்பம்",
    region: "பகுதி",
    productionTime: "உற்பத்தி நேரம்",
    costPrice: "உங்கள் செலவு",
    stock: "தற்போதைய இருப்பு",
    generatePricing: "AI விலையை உருவாக்கு",
    calculating: "AI கணக்கிடுகிறது...",
    aiPricePreview: "AI விலை முன்னோட்டம்",
    recommendationPlaceholder:
      "உங்கள் பரிந்துரை இங்கே தோன்றும்.",
    recommendationHelp:
      "உங்கள் தயாரிப்பு விவரங்களை உள்ளிட்டு நடைமுறை விற்பனை விலையை கணக்கிட KarigarConnect-ஐ அனுமதிக்கவும்.",
    cost: "செலவு",
    craftValue: "கைவினை மதிப்பு",
    time: "நேரம்",
    fairPrice: "நியாயமான விலை",
    aiAnalysis: "AI பகுப்பாய்வு",
    understandingCraft:
      "உங்கள் கைவினை புரிந்துகொள்ளப்படுகிறது...",
    analysisHelp:
      "KarigarConnect தயாரிப்பு தகவலை மதிப்பீடு செய்து பரிந்துரையைத் தயாரிக்கிறது.",
    aiRecommendation: "AI பரிந்துரை",
    suggestedSellingPrice:
      "பரிந்துரைக்கப்பட்ட விற்பனை விலை",
    confidence: "நம்பிக்கை",
    recommended: "பரிந்துரை",
    practicalPrice:
      "உங்கள் தயாரிப்பிற்கான நடைமுறை விலை",
    minimum: "குறைந்தபட்சம்",
    maximum: "அதிகபட்சம்",
    whyThisPrice: "இந்த விலை ஏன்?",
    factorsConsidered:
      "கருத்தில் கொள்ளப்பட்ட காரணிகள்",
    useThisPrice:
      "Add Product-ல் இந்த விலையைப் பயன்படுத்துங்கள்",
    pricingErrorTitle:
      "விலையை உருவாக்க முடியவில்லை.",
  },

  te: {
    label: "AI ధర సహాయకుడు",
    heroTitleOne: "మీ చేతిపని విలువను",
    heroTitleTwo: "తెలుసుకోండి.",
    heroDescription:
      "మీ ఉత్పత్తి గురించి KarigarConnectకు చెప్పండి. ఖర్చు, సమయం మరియు నైపుణ్యాన్ని ఆధారంగా చేసుకుని ఉపయోగకరమైన ధర సిఫార్సును పొందండి.",
    home: "హోమ్",
    smartPricing: "స్మార్ట్ ధర నిర్ణయం",
    fairPriceTitle:
      "మీ పని న్యాయమైన ధరకు అర్హమైనది.",
    fairPriceDescription:
      "AI ఉత్పత్తి ఖర్చు, నైపుణ్యం, పదార్థాల నాణ్యత మరియు తయారీ సమయాన్ని పరిగణనలోకి తీసుకుంటుంది.",
    productDetails: "ఉత్పత్తి వివరాలు",
    productDetailsHelp:
      "ఉపయోగకరమైన సిఫార్సు కోసం AIకి తగిన సమాచారం ఇవ్వండి.",
    productName: "ఉత్పత్తి పేరు",
    category: "వర్గం",
    material: "పదార్థం",
    color: "రంగు",
    craftType: "కళా రకం",
    craftTechnique: "సాంకేతికత",
    region: "ప్రాంతం",
    productionTime: "ఉత్పత్తి సమయం",
    costPrice: "మీ ఖర్చు",
    stock: "ప్రస్తుత స్టాక్",
    generatePricing: "AI ధరను రూపొందించండి",
    calculating: "AI లెక్కిస్తోంది...",
    aiPricePreview: "AI ధర ముందుచూపు",
    recommendationPlaceholder:
      "మీ సిఫార్సు ఇక్కడ కనిపిస్తుంది.",
    recommendationHelp:
      "మీ ఉత్పత్తి వివరాలను నమోదు చేసి, KarigarConnect ఉపయోగకరమైన అమ్మకపు ధరను లెక్కించనివ్వండి.",
    cost: "ఖర్చు",
    craftValue: "కళ విలువ",
    time: "సమయం",
    fairPrice: "న్యాయమైన ధర",
    aiAnalysis: "AI విశ్లేషణ",
    understandingCraft:
      "మీ చేతిపనిని అర్థం చేసుకుంటోంది...",
    analysisHelp:
      "KarigarConnect ఉత్పత్తి సమాచారాన్ని విశ్లేషించి సిఫార్సును సిద్ధం చేస్తోంది.",
    aiRecommendation: "AI సిఫార్సు",
    suggestedSellingPrice:
      "సూచించిన అమ్మకపు ధర",
    confidence: "నమ్మకం",
    recommended: "సిఫార్సు",
    practicalPrice:
      "మీ ఉత్పత్తికి ఉపయోగకరమైన ధర",
    minimum: "కనిష్టం",
    maximum: "గరిష్టం",
    whyThisPrice: "ఈ ధర ఎందుకు?",
    factorsConsidered:
      "పరిగణించిన అంశాలు",
    useThisPrice:
      "Add Productలో ఈ ధరను ఉపయోగించండి",
    pricingErrorTitle:
      "ధరను రూపొందించలేకపోయాము.",
  },

  mr: {
    label: "AI किंमत सहाय्यक",
    heroTitleOne: "तुमच्या कलेची",
    heroTitleTwo: "किंमत जाणून घ्या.",
    heroDescription:
      "तुमच्या उत्पादनाबद्दल KarigarConnect ला सांगा आणि खर्च, वेळ व कौशल्यावर आधारित व्यावहारिक किंमत मिळवा.",
    home: "होम",
    smartPricing: "स्मार्ट किंमत निर्धारण",
    fairPriceTitle:
      "तुमचे काम योग्य किंमतीस पात्र आहे.",
    fairPriceDescription:
      "AI उत्पादन खर्च, कौशल्य, साहित्याची गुणवत्ता आणि उत्पादनासाठी लागणारा वेळ विचारात घेतो.",
    productDetails: "उत्पादन तपशील",
    productDetailsHelp:
      "उपयुक्त शिफारसीसाठी AI ला पुरेशी माहिती द्या.",
    productName: "उत्पादनाचे नाव",
    category: "श्रेणी",
    material: "साहित्य",
    color: "रंग",
    craftType: "कलेचा प्रकार",
    craftTechnique: "तंत्र",
    region: "प्रदेश",
    productionTime: "उत्पादन वेळ",
    costPrice: "तुमचा खर्च",
    stock: "सध्याचा साठा",
    generatePricing: "AI किंमत तयार करा",
    calculating: "AI गणना करत आहे...",
    aiPricePreview: "AI किंमत पूर्वदृश्य",
    recommendationPlaceholder:
      "तुमची शिफारस येथे दिसेल.",
    recommendationHelp:
      "तुमच्या उत्पादनाचा तपशील भरा आणि KarigarConnect ला व्यावहारिक विक्री किंमत मोजू द्या.",
    cost: "खर्च",
    craftValue: "कलेची किंमत",
    time: "वेळ",
    fairPrice: "योग्य किंमत",
    aiAnalysis: "AI विश्लेषण",
    understandingCraft:
      "तुमची कला समजून घेत आहे...",
    analysisHelp:
      "KarigarConnect उत्पादनाची माहिती तपासत आहे आणि शिफारस तयार करत आहे.",
    aiRecommendation: "AI शिफारस",
    suggestedSellingPrice:
      "सुचवलेली विक्री किंमत",
    confidence: "विश्वास",
    recommended: "शिफारस",
    practicalPrice:
      "तुमच्या उत्पादनासाठी व्यावहारिक किंमत",
    minimum: "किमान",
    maximum: "कमाल",
    whyThisPrice: "ही किंमत का?",
    factorsConsidered:
      "विचारात घेतलेले घटक",
    useThisPrice:
      "Add Product मध्ये ही किंमत वापरा",
    pricingErrorTitle:
      "किंमत तयार करता आली नाही.",
  },

  gu: {
    label: "AI કિંમત સહાયક",
    heroTitleOne: "તમારી કળાની",
    heroTitleTwo: "કિંમત જાણો.",
    heroDescription:
      "તમારા ઉત્પાદન વિશે KarigarConnectને કહો અને ખર્ચ, સમય અને કારીગરીના આધારે વ્યવહારુ કિંમત મેળવો.",
    home: "હોમ",
    smartPricing: "સ્માર્ટ કિંમત નિર્ધારણ",
    fairPriceTitle:
      "તમારું કામ યોગ્ય કિંમતને લાયક છે.",
    fairPriceDescription:
      "AI ઉત્પાદન ખર્ચ, કારીગરી, સામગ્રીની ગુણવત્તા અને ઉત્પાદન માટે લાગતો સમય ધ્યાનમાં લે છે.",
    productDetails: "ઉત્પાદન વિગતો",
    productDetailsHelp:
      "ઉપયોગી ભલામણ માટે AIને પૂરતી માહિતી આપો.",
    productName: "ઉત્પાદનનું નામ",
    category: "શ્રેણી",
    material: "સામગ્રી",
    color: "રંગ",
    craftType: "કારીગરીનો પ્રકાર",
    craftTechnique: "તકનીક",
    region: "વિસ્તાર",
    productionTime: "ઉત્પાદન સમય",
    costPrice: "તમારો ખર્ચ",
    stock: "હાલનો સ્ટોક",
    generatePricing: "AI કિંમત બનાવો",
    calculating: "AI ગણતરી કરી રહ્યું છે...",
    aiPricePreview: "AI કિંમત પૂર્વાવલોકન",
    recommendationPlaceholder:
      "તમારી ભલામણ અહીં દેખાશે.",
    recommendationHelp:
      "તમારા ઉત્પાદનની વિગતો દાખલ કરો અને KarigarConnectને વ્યવહારુ વેચાણ કિંમત ગણવા દો.",
    cost: "ખર્ચ",
    craftValue: "કારીગરીનું મૂલ્ય",
    time: "સમય",
    fairPrice: "યોગ્ય કિંમત",
    aiAnalysis: "AI વિશ્લેષણ",
    understandingCraft:
      "તમારી કારીગરી સમજાઈ રહી છે...",
    analysisHelp:
      "KarigarConnect ઉત્પાદનની માહિતીનું મૂલ્યાંકન કરી રહ્યું છે અને ભલામણ તૈયાર કરી રહ્યું છે.",
    aiRecommendation: "AI ભલામણ",
    suggestedSellingPrice:
      "સૂચવેલી વેચાણ કિંમત",
    confidence: "વિશ્વાસ",
    recommended: "ભલામણ કરેલ",
    practicalPrice:
      "તમારા ઉત્પાદન માટે વ્યવહારુ કિંમત",
    minimum: "ન્યૂનતમ",
    maximum: "મહત્તમ",
    whyThisPrice: "આ કિંમત શા માટે?",
    factorsConsidered:
      "ધ્યાનમાં લેવામાં આવેલા પરિબળો",
    useThisPrice:
      "Add Productમાં આ કિંમત વાપરો",
    pricingErrorTitle:
      "કિંમત બનાવી શકાઈ નથી.",
  },

  kn: {
    label: "AI ಬೆಲೆ ಸಹಾಯಕ",
    heroTitleOne: "ನಿಮ್ಮ ಕೈಗಾರಿಕೆಯ",
    heroTitleTwo: "ಮೌಲ್ಯ ತಿಳಿಯಿರಿ.",
    heroDescription:
      "ನಿಮ್ಮ ಉತ್ಪನ್ನದ ಬಗ್ಗೆ KarigarConnectಗೆ ತಿಳಿಸಿ ಮತ್ತು ವೆಚ್ಚ, ಸಮಯ ಹಾಗೂ ಕೌಶಲ್ಯದ ಆಧಾರದ ಮೇಲೆ ಪ್ರಾಯೋಗಿಕ ಬೆಲೆ ಶಿಫಾರಸು ಪಡೆಯಿರಿ.",
    home: "ಮುಖಪುಟ",
    smartPricing: "ಸ್ಮಾರ್ಟ್ ಬೆಲೆ ನಿರ್ಧಾರ",
    fairPriceTitle:
      "ನಿಮ್ಮ ಕೆಲಸ ನ್ಯಾಯಸಮ್ಮತ ಬೆಲೆಗೆ ಅರ್ಹವಾಗಿದೆ.",
    fairPriceDescription:
      "AI ಉತ್ಪಾದನಾ ವೆಚ್ಚ, ಕೌಶಲ್ಯ, ವಸ್ತು ಗುಣಮಟ್ಟ ಮತ್ತು ತಯಾರಿಸಲು ಬೇಕಾದ ಸಮಯವನ್ನು ಪರಿಗಣಿಸುತ್ತದೆ.",
    productDetails: "ಉತ್ಪನ್ನ ವಿವರಗಳು",
    productDetailsHelp:
      "ಉಪಯುಕ್ತ ಶಿಫಾರಸಿಗಾಗಿ AIಗೆ ಸಾಕಷ್ಟು ಮಾಹಿತಿ ನೀಡಿ.",
    productName: "ಉತ್ಪನ್ನದ ಹೆಸರು",
    category: "ವರ್ಗ",
    material: "ವಸ್ತು",
    color: "ಬಣ್ಣ",
    craftType: "ಕೈಗಾರಿಕೆ ಪ್ರಕಾರ",
    craftTechnique: "ತಂತ್ರ",
    region: "ಪ್ರದೇಶ",
    productionTime: "ಉತ್ಪಾದನಾ ಸಮಯ",
    costPrice: "ನಿಮ್ಮ ವೆಚ್ಚ",
    stock: "ಪ್ರಸ್ತುತ ಸ್ಟಾಕ್",
    generatePricing: "AI ಬೆಲೆ ರಚಿಸಿ",
    calculating: "AI ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತಿದೆ...",
    aiPricePreview: "AI ಬೆಲೆ ಪೂರ್ವವೀಕ್ಷಣೆ",
    recommendationPlaceholder:
      "ನಿಮ್ಮ ಶಿಫಾರಸು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.",
    recommendationHelp:
      "ನಿಮ್ಮ ಉತ್ಪನ್ನದ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ಮತ್ತು KarigarConnectಗೆ ಪ್ರಾಯೋಗಿಕ ಮಾರಾಟ ಬೆಲೆಯನ್ನು ಲೆಕ್ಕಿಸಲು ಅವಕಾಶ ನೀಡಿ.",
    cost: "ವೆಚ್ಚ",
    craftValue: "ಕೈಗಾರಿಕೆಯ ಮೌಲ್ಯ",
    time: "ಸಮಯ",
    fairPrice: "ನ್ಯಾಯಬೆಲೆ",
    aiAnalysis: "AI ವಿಶ್ಲೇಷಣೆ",
    understandingCraft:
      "ನಿಮ್ಮ ಕೈಗಾರಿಕೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ...",
    analysisHelp:
      "KarigarConnect ಉತ್ಪನ್ನದ ಮಾಹಿತಿಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ ಶಿಫಾರಸನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಿದೆ.",
    aiRecommendation: "AI ಶಿಫಾರಸು",
    suggestedSellingPrice:
      "ಸೂಚಿಸಲಾದ ಮಾರಾಟ ಬೆಲೆ",
    confidence: "ವಿಶ್ವಾಸ",
    recommended: "ಶಿಫಾರಸು",
    practicalPrice:
      "ನಿಮ್ಮ ಉತ್ಪನ್ನಕ್ಕೆ ಪ್ರಾಯೋಗಿಕ ಬೆಲೆ",
    minimum: "ಕನಿಷ್ಠ",
    maximum: "ಗರಿಷ್ಠ",
    whyThisPrice: "ಈ ಬೆಲೆ ಏಕೆ?",
    factorsConsidered:
      "ಪರಿಗಣಿಸಿದ ಅಂಶಗಳು",
    useThisPrice:
      "Add Productನಲ್ಲಿ ಈ ಬೆಲೆಯನ್ನು ಬಳಸಿ",
    pricingErrorTitle:
      "ಬೆಲೆಯನ್ನು ರಚಿಸಲಾಗಲಿಲ್ಲ.",
  },

  ml: {
    label: "AI വില സഹായി",
    heroTitleOne:
      "നിങ്ങളുടെ കരകൗശലത്തിന്റെ",
    heroTitleTwo: "മൂല്യം അറിയൂ.",
    heroDescription:
      "നിങ്ങളുടെ ഉൽപ്പന്നത്തെക്കുറിച്ച് KarigarConnectനോട് പറയൂ. ചെലവ്, സമയം, കരകൗശലം എന്നിവയുടെ അടിസ്ഥാനത്തിൽ പ്രായോഗിക വില ശുപാർശ നേടൂ.",
    home: "ഹോം",
    smartPricing: "സ്മാർട്ട് വില നിർണ്ണയം",
    fairPriceTitle:
      "നിങ്ങളുടെ ജോലിക്ക് ന്യായമായ വില ലഭിക്കണം.",
    fairPriceDescription:
      "AI ഉൽപ്പാദന ചെലവ്, കരകൗശലം, വസ്തുവിന്റെ ഗുണമേന്മ, നിർമ്മാണ സമയം എന്നിവ പരിഗണിക്കുന്നു.",
    productDetails: "ഉൽപ്പന്ന വിവരങ്ങൾ",
    productDetailsHelp:
      "ഉപയോഗപ്രദമായ ശുപാർശയ്ക്കായി AIക്ക് ആവശ്യമായ വിവരങ്ങൾ നൽകൂ.",
    productName: "ഉൽപ്പന്നത്തിന്റെ പേര്",
    category: "വിഭാഗം",
    material: "വസ്തു",
    color: "നിറം",
    craftType: "കരകൗശല തരം",
    craftTechnique: "രീതി",
    region: "പ്രദേശം",
    productionTime: "ഉൽപ്പാദന സമയം",
    costPrice: "നിങ്ങളുടെ ചെലവ്",
    stock: "നിലവിലെ സ്റ്റോക്ക്",
    generatePricing: "AI വില സൃഷ്ടിക്കുക",
    calculating: "AI കണക്കാക്കുന്നു...",
    aiPricePreview: "AI വില മുൻകാഴ്ച",
    recommendationPlaceholder:
      "നിങ്ങളുടെ ശുപാർശ ഇവിടെ കാണാം.",
    recommendationHelp:
      "ഉൽപ്പന്ന വിവരങ്ങൾ നൽകൂ, KarigarConnect നിങ്ങളുടെ പ്രായോഗിക വിൽപ്പന വില കണക്കാക്കട്ടെ.",
    cost: "ചെലവ്",
    craftValue: "കരകൗശല മൂല്യം",
    time: "സമയം",
    fairPrice: "ന്യായമായ വില",
    aiAnalysis: "AI വിശകലനം",
    understandingCraft:
      "നിങ്ങളുടെ കരകൗശലം മനസ്സിലാക്കുന്നു...",
    analysisHelp:
      "KarigarConnect ഉൽപ്പന്ന വിവരങ്ങൾ വിലയിരുത്തി ശുപാർശ തയ്യാറാക്കുന്നു.",
    aiRecommendation: "AI ശുപാർശ",
    suggestedSellingPrice:
      "ശുപാർശ ചെയ്യുന്ന വിൽപ്പന വില",
    confidence: "വിശ്വാസം",
    recommended: "ശുപാർശ",
    practicalPrice:
      "നിങ്ങളുടെ ഉൽപ്പന്നത്തിന് പ്രായോഗിക വില",
    minimum: "കുറഞ്ഞത്",
    maximum: "പരമാവധി",
    whyThisPrice: "ഈ വില എന്തുകൊണ്ട്?",
    factorsConsidered:
      "പരിഗണിച്ച ഘടകങ്ങൾ",
    useThisPrice:
      "Add Productൽ ഈ വില ഉപയോഗിക്കുക",
    pricingErrorTitle:
      "വില സൃഷ്ടിക്കാനായില്ല.",
  },

  pa: {
    label: "AI ਕੀਮਤ ਸਹਾਇਕ",
    heroTitleOne: "ਆਪਣੀ ਕਲਾ ਦੀ",
    heroTitleTwo: "ਕੀਮਤ ਜਾਣੋ।",
    heroDescription:
      "ਆਪਣੇ ਉਤਪਾਦ ਬਾਰੇ KarigarConnect ਨੂੰ ਦੱਸੋ ਅਤੇ ਲਾਗਤ, ਸਮਾਂ ਅਤੇ ਕਾਰੀਗਰੀ ਦੇ ਆਧਾਰ 'ਤੇ ਵਰਤੋਂਯੋਗ ਕੀਮਤ ਦੀ ਸਿਫਾਰਸ਼ ਲਵੋ।",
    home: "ਹੋਮ",
    smartPricing: "ਸਮਾਰਟ ਕੀਮਤ ਨਿਰਧਾਰਨ",
    fairPriceTitle:
      "ਤੁਹਾਡਾ ਕੰਮ ਉਚਿਤ ਕੀਮਤ ਦਾ ਹੱਕਦਾਰ ਹੈ।",
    fairPriceDescription:
      "AI ਉਤਪਾਦਨ ਲਾਗਤ, ਕਾਰੀਗਰੀ, ਸਮੱਗਰੀ ਦੀ ਗੁਣਵੱਤਾ ਅਤੇ ਉਤਪਾਦ ਬਣਾਉਣ ਲਈ ਲੱਗਣ ਵਾਲੇ ਸਮੇਂ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖਦਾ ਹੈ।",
    productDetails: "ਉਤਪਾਦ ਵੇਰਵੇ",
    productDetailsHelp:
      "ਉਪਯੋਗੀ ਸਿਫਾਰਸ਼ ਲਈ AI ਨੂੰ ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ ਦਿਓ।",
    productName: "ਉਤਪਾਦ ਦਾ ਨਾਮ",
    category: "ਸ਼੍ਰੇਣੀ",
    material: "ਸਮੱਗਰੀ",
    color: "ਰੰਗ",
    craftType: "ਕਾਰੀਗਰੀ ਦੀ ਕਿਸਮ",
    craftTechnique: "ਤਕਨੀਕ",
    region: "ਖੇਤਰ",
    productionTime: "ਉਤਪਾਦਨ ਸਮਾਂ",
    costPrice: "ਤੁਹਾਡੀ ਲਾਗਤ",
    stock: "ਮੌਜੂਦਾ ਸਟਾਕ",
    generatePricing: "AI ਕੀਮਤ ਬਣਾਓ",
    calculating: "AI ਗਣਨਾ ਕਰ ਰਿਹਾ ਹੈ...",
    aiPricePreview: "AI ਕੀਮਤ ਝਲਕ",
    recommendationPlaceholder:
      "ਤੁਹਾਡੀ ਸਿਫਾਰਸ਼ ਇੱਥੇ ਦਿਖਾਈ ਦੇਵੇਗੀ।",
    recommendationHelp:
      "ਆਪਣੇ ਉਤਪਾਦ ਦੇ ਵੇਰਵੇ ਭਰੋ ਅਤੇ KarigarConnect ਨੂੰ ਵਰਤੋਂਯੋਗ ਵਿਕਰੀ ਕੀਮਤ ਦੀ ਗਣਨਾ ਕਰਨ ਦਿਓ।",
    cost: "ਲਾਗਤ",
    craftValue: "ਕਾਰੀਗਰੀ ਮੁੱਲ",
    time: "ਸਮਾਂ",
    fairPrice: "ਉਚਿਤ ਕੀਮਤ",
    aiAnalysis: "AI ਵਿਸ਼ਲੇਸ਼ਣ",
    understandingCraft:
      "ਤੁਹਾਡੀ ਕਾਰੀਗਰੀ ਨੂੰ ਸਮਝਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
    analysisHelp:
      "KarigarConnect ਉਤਪਾਦ ਦੀ ਜਾਣਕਾਰੀ ਦਾ ਮੁਲਾਂਕਣ ਕਰ ਰਿਹਾ ਹੈ ਅਤੇ ਸਿਫਾਰਸ਼ ਤਿਆਰ ਕਰ ਰਿਹਾ ਹੈ।",
    aiRecommendation: "AI ਸਿਫਾਰਸ਼",
    suggestedSellingPrice:
      "ਸੁਝਾਈ ਗਈ ਵਿਕਰੀ ਕੀਮਤ",
    confidence: "ਭਰੋਸਾ",
    recommended: "ਸਿਫਾਰਸ਼ੀ",
    practicalPrice:
      "ਤੁਹਾਡੇ ਉਤਪਾਦ ਲਈ ਵਰਤੋਂਯੋਗ ਕੀਮਤ",
    minimum: "ਘੱਟੋ-ਘੱਟ",
    maximum: "ਵੱਧ ਤੋਂ ਵੱਧ",
    whyThisPrice: "ਇਹ ਕੀਮਤ ਕਿਉਂ?",
    factorsConsidered:
      "ਵਿਚਾਰੇ ਗਏ ਕਾਰਕ",
    useThisPrice:
      "Add Product ਵਿੱਚ ਇਹ ਕੀਮਤ ਵਰਤੋ",
    pricingErrorTitle:
      "ਕੀਮਤ ਬਣਾਈ ਨਹੀਂ ਜਾ ਸਕੀ।",
  },
};

function Pricing({ onNavigate }) {
  const {
    language,
  } = useLanguage();

  const currentLanguage =
    PRICING_TRANSLATIONS[language]
      ? language
      : "en";

  const ui =
    PRICING_TRANSLATIONS[
      currentLanguage
    ];

  const [formData, setFormData] =
    useState({
      name: "",
      category: "",
      material: "",
      color: "",
      craftType: "",
      craftTechnique: "",
      region: "",
      productionTimeDays: "",
      costPrice: "",
      stock: "",
    });

  const [pricing, setPricing] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
  =====================================================
  FORM CHANGE
  =====================================================
  */

  const handleChange = (event) => {
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
  GENERATE PRICING
  =====================================================
  */

  const generatePricing =
    async (event) => {
      event.preventDefault();

      setLoading(true);
      setError("");
      setPricing(null);

      try {
        if (
          !formData.name.trim() ||
          !formData.category.trim()
        ) {
          throw new Error(
            language === "hi"
              ? "उत्पाद का नाम और श्रेणी आवश्यक है।"
              : "Product name and category are required."
          );
        }

        const payload = {
          ...formData,

          name:
            formData.name.trim(),

          category:
            formData.category.trim(),

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

          productionTimeDays:
            Number(
              formData.productionTimeDays
            ) || 0,

          costPrice:
            Number(
              formData.costPrice
            ) || 0,

          stock:
            Number(
              formData.stock
            ) || 0,
        };

        const response =
          await fetch(
            `${BACKEND_URL}/api/pricing/suggest`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                payload
              ),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to generate pricing."
          );
        }

        setPricing(
          data.pricing
        );
      } catch (err) {
        console.error(
          "Pricing error:",
          err
        );

        setError(
          err.message ||
            "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

  /*
  =====================================================
  PRICE FORMAT
  =====================================================
  */

  const formatPrice = (
    value
  ) => {
    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN")}`;
  };

  /*
  =====================================================
  USE SUGGESTED PRICE
  =====================================================
  */

  const useSuggestedPrice =
    () => {
      const suggestedPrice =
        Number(
          pricing?.suggestedPrice
        ) || 0;

      if (!suggestedPrice) {
        return;
      }

      localStorage.setItem(
        "karigar-suggested-price",
        String(
          suggestedPrice
        )
      );

      localStorage.setItem(
        "karigar-pricing-product",
        JSON.stringify({
          name:
            formData.name,

          category:
            formData.category,

          material:
            formData.material,

          color:
            formData.color,

          craftType:
            formData.craftType,

          craftTechnique:
            formData.craftTechnique,

          region:
            formData.region,

          productionTimeDays:
            formData.productionTimeDays,

          costPrice:
            formData.costPrice,

          stock:
            formData.stock,
        })
      );

      onNavigate(
        "add-product"
      );
    };

  /*
  =====================================================
  RENDER
  =====================================================
  */

  return (
    <div className="pricing-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="pricing-hero">

        <div>

          <span className="pricing-label">
            {ui.label}
          </span>

          <h1>
            {ui.heroTitleOne}

            <span>
              {ui.heroTitleTwo}
            </span>
          </h1>

          <p>
            {ui.heroDescription}
          </p>

        </div>

        <button
          type="button"
          className="pricing-back-button"
          onClick={() =>
            onNavigate("home")
          }
        >
          ← {ui.home}
        </button>

      </section>

      {/* =================================================
          AI INTRO
      ================================================= */}

      <section className="pricing-ai-card">

        <div className="pricing-ai-orb">
          ✦
        </div>

        <div>

          <span>
            {ui.smartPricing}
          </span>

          <h2>
            {ui.fairPriceTitle}
          </h2>

          <p>
            {ui.fairPriceDescription}
          </p>

        </div>

      </section>

      {/* =================================================
          MAIN LAYOUT
      ================================================= */}

      <div className="pricing-layout">

        {/* =================================================
            FORM
        ================================================= */}

        <section className="pricing-form-card">

          <div className="pricing-card-heading">

            <div>

              <span>
                01
              </span>

              <h2>
                {ui.productDetails}
              </h2>

              <p>
                {
                  ui.productDetailsHelp
                }
              </p>

            </div>

            <div className="pricing-card-icon">
              🧵
            </div>

          </div>

          <form
            onSubmit={
              generatePricing
            }
          >

            <div className="pricing-form-grid">

              {/* PRODUCT NAME */}

              <div className="pricing-field pricing-full">

                <label htmlFor="pricing-name">
                  {ui.productName} *
                </label>

                <input
                  id="pricing-name"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    currentLanguage ===
                    "hi"
                      ? "जैसे: बनारसी सिल्क साड़ी"
                      : "e.g. Banarasi Silk Saree"
                  }
                  required
                />

              </div>

              {/* CATEGORY */}

              <div className="pricing-field">

                <label htmlFor="pricing-category">
                  {ui.category} *
                </label>

                <input
                  id="pricing-category"
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    currentLanguage ===
                    "hi"
                      ? "जैसे: हस्तकरघा"
                      : "e.g. Handloom"
                  }
                  required
                />

              </div>

              {/* MATERIAL */}

              <div className="pricing-field">

                <label htmlFor="pricing-material">
                  {ui.material}
                </label>

                <input
                  id="pricing-material"
                  name="material"
                  value={
                    formData.material
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    currentLanguage ===
                    "hi"
                      ? "रेशम, कपास"
                      : "Silk, Cotton"
                  }
                />

              </div>

              {/* COLOR */}

              <div className="pricing-field">

                <label htmlFor="pricing-color">
                  {ui.color}
                </label>

                <input
                  id="pricing-color"
                  name="color"
                  value={
                    formData.color
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    currentLanguage ===
                    "hi"
                      ? "लाल, सुनहरा"
                      : "Red, Gold"
                  }
                />

              </div>

              {/* CRAFT TYPE */}

              <div className="pricing-field">

                <label htmlFor="pricing-craft-type">
                  {ui.craftType}
                </label>

                <input
                  id="pricing-craft-type"
                  name="craftType"
                  value={
                    formData.craftType
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    currentLanguage ===
                    "hi"
                      ? "पारंपरिक बुनाई"
                      : "Traditional weaving"
                  }
                />

              </div>

              {/* TECHNIQUE */}

              <div className="pricing-field">

                <label htmlFor="pricing-technique">
                  {ui.craftTechnique}
                </label>

                <input
                  id="pricing-technique"
                  name="craftTechnique"
                  value={
                    formData.craftTechnique
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    currentLanguage ===
                    "hi"
                      ? "हाथ की कढ़ाई"
                      : "Hand embroidery"
                  }
                />

              </div>

              {/* REGION */}

              <div className="pricing-field">

                <label htmlFor="pricing-region">
                  {ui.region}
                </label>

                <input
                  id="pricing-region"
                  name="region"
                  value={
                    formData.region
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    currentLanguage ===
                    "hi"
                      ? "वाराणसी"
                      : "Varanasi"
                  }
                />

              </div>

              {/* PRODUCTION TIME */}

              <div className="pricing-field">

                <label htmlFor="pricing-days">
                  {ui.productionTime}
                </label>

                <input
                  id="pricing-days"
                  name="productionTimeDays"
                  type="number"
                  min="0"
                  value={
                    formData.productionTimeDays
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="10"
                />

              </div>

              {/* COST */}

              <div className="pricing-field">

                <label htmlFor="pricing-cost">
                  {ui.costPrice} *
                </label>

                <div className="pricing-input-prefix">

                  <span>
                    ₹
                  </span>

                  <input
                    id="pricing-cost"
                    name="costPrice"
                    type="number"
                    min="0"
                    value={
                      formData.costPrice
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="2500"
                    required
                  />

                </div>

              </div>

              {/* STOCK */}

              <div className="pricing-field">

                <label htmlFor="pricing-stock">
                  {ui.stock}
                </label>

                <input
                  id="pricing-stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={
                    formData.stock
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="5"
                />

              </div>

            </div>

            {/* GENERATE BUTTON */}

            <button
              type="submit"
              className="generate-pricing-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="pricing-button-spinner"></span>

                  {ui.calculating}
                </>
              ) : (
                <>
                  ✨ {ui.generatePricing}

                  <span>
                    →
                  </span>
                </>
              )}

            </button>

          </form>

        </section>

        {/* =================================================
            RESULT
        ================================================= */}

        <section className="pricing-result-card">

          {!pricing &&
            !loading && (
              <div className="pricing-empty">

                <div className="pricing-empty-icon">
                  ₹
                </div>

                <span>
                  {ui.aiPricePreview}
                </span>

                <h2>
                  {
                    ui.recommendationPlaceholder
                  }
                </h2>

                <p>
                  {
                    ui.recommendationHelp
                  }
                </p>

                <div className="pricing-mini-flow">

                  <span>
                    {ui.cost}
                  </span>

                  <b>
                    +
                  </b>

                  <span>
                    {ui.craftValue}
                  </span>

                  <b>
                    +
                  </b>

                  <span>
                    {ui.time}
                  </span>

                  <b>
                    →
                  </b>

                  <strong>
                    {ui.fairPrice}
                  </strong>

                </div>

              </div>
            )}

          {loading && (
            <div className="pricing-empty">

              <div className="pricing-loading-orb">
                ✦
              </div>

              <span>
                {ui.aiAnalysis}
              </span>

              <h2>
                {
                  ui.understandingCraft
                }
              </h2>

              <p>
                {
                  ui.analysisHelp
                }
              </p>

              <div className="pricing-loading-lines">

                <span></span>
                <span></span>
                <span></span>

              </div>

            </div>
          )}

          {pricing &&
            !loading && (
              <div className="pricing-result">

                <div className="result-top">

                  <div>

                    <span>
                      {
                        ui.aiRecommendation
                      }
                    </span>

                    <h2>
                      {
                        ui.suggestedSellingPrice
                      }
                    </h2>

                  </div>

                  <div className="confidence-badge">

                    {Math.round(
                      Number(
                        pricing.confidence ||
                          0
                      )
                    )}

                    %{" "}

                    {ui.confidence}

                  </div>

                </div>

                <div className="suggested-price">

                  <small>
                    {
                      ui.recommended
                    }
                  </small>

                  <strong>
                    {
                      formatPrice(
                        pricing.suggestedPrice
                      )
                    }
                  </strong>

                  <p>
                    {
                      ui.practicalPrice
                    }
                  </p>

                </div>

                <div className="price-range">

                  <div>

                    <span>
                      {ui.minimum}
                    </span>

                    <strong>
                      {
                        formatPrice(
                          pricing.minimumPrice
                        )
                      }
                    </strong>

                  </div>

                  <div className="range-line">

                    <span></span>

                  </div>

                  <div>

                    <span>
                      {ui.maximum}
                    </span>

                    <strong>
                      {
                        formatPrice(
                          pricing.maximumPrice
                        )
                      }
                    </strong>

                  </div>

                </div>

                {pricing.reasoning && (
                  <div className="pricing-reasoning">

                    <span>
                      {
                        ui.whyThisPrice
                      }
                    </span>

                    <p>
                      {
                        pricing.reasoning
                      }
                    </p>

                  </div>
                )}

                {Array.isArray(
                  pricing.factors
                ) &&
                  pricing.factors.length >
                    0 && (
                    <div className="pricing-factors">

                      <span>
                        {
                          ui.factorsConsidered
                        }
                      </span>

                      <div>

                        {pricing.factors.map(
                          (
                            factor,
                            index
                          ) => (
                            <span
                              key={
                                index
                              }
                            >
                              ✓ {factor}
                            </span>
                          )
                        )}

                      </div>

                    </div>
                  )}

                <button
                  type="button"
                  className="use-price-button"
                  onClick={
                    useSuggestedPrice
                  }
                >
                  {
                    ui.useThisPrice
                  }

                  <span>
                    →
                  </span>

                </button>

              </div>
            )}

        </section>

      </div>

      {error && (
        <div className="pricing-error">

          <strong>
            {
              ui.pricingErrorTitle
            }
          </strong>

          <p>
            {error}
          </p>

        </div>
      )}

    </div>
  );
}

export default Pricing;