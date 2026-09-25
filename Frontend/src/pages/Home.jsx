
import "./Home.css";

import {
  useEffect,
  useState,
} from "react";

import { useLanguage } from "../i18n/LanguageContext";

/*
=====================================================
HOME PAGE TRANSLATIONS
10 INDIAN LANGUAGES
=====================================================
*/

const HOME_TRANSLATIONS = {
  en: {
    heroEyebrow:
      "AI FOR EVERY ARTISAN",

    heroTitleOne:
      "Your craft.",
    heroTitleTwo:
      "Your business. Your future.",

    heroDescription:
      "Turn your handmade work into professional digital products, smarter prices and new online opportunities.",

    startAiPhotoshoot:
      "Start AI Photoshoot",

    aiReady:
      "AI Ready",

    smartPricing:
      "Smart Pricing",

    yourBusiness:
      "YOUR BUSINESS",

    businessOverview:
      "Business overview",

    thisMonth:
      "This Month",

    totalProducts:
      "Total Products",

    addFirstProduct:
      "Add your first product",

    published:
      "Published",

    productsOnline:
      "Products online",

    orders:
      "Orders",

    firstOrder:
      "Your first order is waiting",

    revenue:
      "Revenue",

    startSelling:
      "Start selling online",

    karigarTools:
      "KARIGAR TOOLS",

    everythingYouNeed:
      "Everything you need to grow",

    toolsDescription:
      "Simple AI-powered tools designed around the real needs of Indian artisans.",

    exploreFeature:
      "Explore feature",

    aiPhotoshoot:
      "AI Photoshoot",

    aiPhotoshootDescription:
      "Turn one real product photo into professional marketplace-ready images.",

    aiPowered:
      "AI POWERED",

    myProducts:
      "My Products",

    myProductsDescription:
      "Manage your digital catalog, products, prices and stock in one place.",

    catalog:
      "CATALOG",

    aiPricing:
      "AI Pricing",

    aiPricingDescription:
      "Get a practical selling price based on cost, time and craftsmanship.",

    smartPricingTag:
      "SMART PRICING",

    businessInsights:
      "Business Insights",

    businessInsightsDescription:
      "Understand your products, sales and business performance with simple insights.",

    insights:
      "INSIGHTS",

    marketplace:
      "Marketplace",

    marketplaceDescription:
      "Prepare your products for online selling and future marketplace connections.",

    sellOnline:
      "SELL ONLINE",

    voiceInput:
      "Voice Input",

    voiceInputDescription:
      "Create product information naturally by speaking in your own language.",

    comingSoon:
      "COMING SOON",

    getStarted:
      "GET STARTED",

    digitalJourney:
      "Start your digital journey",

    digitalJourneyDescription:
      "Add your first handmade product and let KarigarConnect help you turn your craft into a digital business.",

    addYourFirstProduct:
      "Add Your First Product",
  },

  hi: {
    heroEyebrow:
      "हर कारीगर के लिए AI",

    heroTitleOne:
      "आपकी कला।",
    heroTitleTwo:
      "आपका व्यवसाय। आपका भविष्य।",

    heroDescription:
      "अपने हस्तनिर्मित काम को प्रोफेशनल डिजिटल उत्पादों, बेहतर कीमतों और नए ऑनलाइन अवसरों में बदलें।",

    startAiPhotoshoot:
      "AI फोटोशूट शुरू करें",

    aiReady:
      "AI तैयार",

    smartPricing:
      "स्मार्ट मूल्य निर्धारण",

    yourBusiness:
      "आपका व्यवसाय",

    businessOverview:
      "व्यवसाय का अवलोकन",

    thisMonth:
      "इस महीने",

    totalProducts:
      "कुल उत्पाद",

    addFirstProduct:
      "अपना पहला उत्पाद जोड़ें",

    published:
      "प्रकाशित",

    productsOnline:
      "ऑनलाइन उत्पाद",

    orders:
      "ऑर्डर",

    firstOrder:
      "आपका पहला ऑर्डर इंतज़ार कर रहा है",

    revenue:
      "राजस्व",

    startSelling:
      "ऑनलाइन बेचना शुरू करें",

    karigarTools:
      "कारीगर टूल्स",

    everythingYouNeed:
      "बढ़ने के लिए आपको जो चाहिए",

    toolsDescription:
      "भारतीय कारीगरों की वास्तविक जरूरतों के अनुसार बनाए गए सरल AI टूल्स।",

    exploreFeature:
      "फीचर देखें",

    aiPhotoshoot:
      "AI फोटोशूट",

    aiPhotoshootDescription:
      "एक वास्तविक उत्पाद फोटो को प्रोफेशनल मार्केटप्लेस-तैयार तस्वीरों में बदलें।",

    aiPowered:
      "AI संचालित",

    myProducts:
      "मेरे उत्पाद",

    myProductsDescription:
      "अपने डिजिटल कैटलॉग, उत्पाद, कीमत और स्टॉक को एक जगह प्रबंधित करें।",

    catalog:
      "कैटलॉग",

    aiPricing:
      "AI मूल्य निर्धारण",

    aiPricingDescription:
      "लागत, समय और कारीगरी के आधार पर व्यावहारिक बिक्री कीमत प्राप्त करें।",

    smartPricingTag:
      "स्मार्ट मूल्य निर्धारण",

    businessInsights:
      "व्यवसाय जानकारी",

    businessInsightsDescription:
      "सरल जानकारी के साथ अपने उत्पादों, बिक्री और व्यवसाय के प्रदर्शन को समझें।",

    insights:
      "जानकारी",

    marketplace:
      "मार्केटप्लेस",

    marketplaceDescription:
      "अपने उत्पादों को ऑनलाइन बिक्री और भविष्य के मार्केटप्लेस कनेक्शन के लिए तैयार करें।",

    sellOnline:
      "ऑनलाइन बेचें",

    voiceInput:
      "आवाज़ से इनपुट",

    voiceInputDescription:
      "अपनी भाषा में बोलकर स्वाभाविक रूप से उत्पाद की जानकारी तैयार करें।",

    comingSoon:
      "जल्द आ रहा है",

    getStarted:
      "शुरू करें",

    digitalJourney:
      "अपनी डिजिटल यात्रा शुरू करें",

    digitalJourneyDescription:
      "अपना पहला हस्तनिर्मित उत्पाद जोड़ें और KarigarConnect को अपनी कला को डिजिटल व्यवसाय में बदलने दें।",

    addYourFirstProduct:
      "अपना पहला उत्पाद जोड़ें",
  },

  bn: {
    heroEyebrow:
      "প্রতিটি কারিগরের জন্য AI",

    heroTitleOne:
      "আপনার শিল্প।",
    heroTitleTwo:
      "আপনার ব্যবসা। আপনার ভবিষ্যৎ।",

    heroDescription:
      "আপনার হাতে তৈরি কাজকে পেশাদার ডিজিটাল পণ্য, স্মার্ট মূল্য এবং নতুন অনলাইন সুযোগে পরিণত করুন।",

    startAiPhotoshoot:
      "AI ফটোশুট শুরু করুন",

    aiReady:
      "AI প্রস্তুত",

    smartPricing:
      "স্মার্ট মূল্য নির্ধারণ",

    yourBusiness:
      "আপনার ব্যবসা",

    businessOverview:
      "ব্যবসার সারসংক্ষেপ",

    thisMonth:
      "এই মাস",

    totalProducts:
      "মোট পণ্য",

    addFirstProduct:
      "আপনার প্রথম পণ্য যোগ করুন",

    published:
      "প্রকাশিত",

    productsOnline:
      "অনলাইনে পণ্য",

    orders:
      "অর্ডার",

    firstOrder:
      "আপনার প্রথম অর্ডারের অপেক্ষায়",

    revenue:
      "রাজস্ব",

    startSelling:
      "অনলাইনে বিক্রি শুরু করুন",

    karigarTools:
      "কারিগর টুলস",

    everythingYouNeed:
      "বৃদ্ধির জন্য আপনার প্রয়োজনীয় সবকিছু",

    toolsDescription:
      "ভারতীয় কারিগরদের বাস্তব প্রয়োজন অনুযায়ী তৈরি সহজ AI টুলস।",

    exploreFeature:
      "ফিচার দেখুন",

    aiPhotoshoot:
      "AI ফটোশুট",

    aiPhotoshootDescription:
      "একটি আসল পণ্যের ছবি পেশাদার মার্কেটপ্লেস-প্রস্তুত ছবিতে পরিণত করুন।",

    aiPowered:
      "AI চালিত",

    myProducts:
      "আমার পণ্য",

    myProductsDescription:
      "আপনার ডিজিটাল ক্যাটালগ, পণ্য, মূল্য ও স্টক এক জায়গায় পরিচালনা করুন।",

    catalog:
      "ক্যাটালগ",

    aiPricing:
      "AI মূল্য নির্ধারণ",

    aiPricingDescription:
      "খরচ, সময় এবং কারুশিল্পের ভিত্তিতে একটি ব্যবহারিক বিক্রয় মূল্য পান।",

    smartPricingTag:
      "স্মার্ট মূল্য",

    businessInsights:
      "ব্যবসার তথ্য",

    businessInsightsDescription:
      "সহজ তথ্যের মাধ্যমে আপনার পণ্য, বিক্রয় এবং ব্যবসার কার্যকারিতা বুঝুন।",

    insights:
      "তথ্য",

    marketplace:
      "মার্কেটপ্লেস",

    marketplaceDescription:
      "অনলাইনে বিক্রি এবং ভবিষ্যতের মার্কেটপ্লেস সংযোগের জন্য আপনার পণ্য প্রস্তুত করুন।",

    sellOnline:
      "অনলাইনে বিক্রি করুন",

    voiceInput:
      "ভয়েস ইনপুট",

    voiceInputDescription:
      "নিজের ভাষায় কথা বলে স্বাভাবিকভাবে পণ্যের তথ্য তৈরি করুন।",

    comingSoon:
      "শীঘ্রই আসছে",

    getStarted:
      "শুরু করুন",

    digitalJourney:
      "আপনার ডিজিটাল যাত্রা শুরু করুন",

    digitalJourneyDescription:
      "আপনার প্রথম হাতে তৈরি পণ্য যোগ করুন এবং KarigarConnect-কে আপনার শিল্পকে ডিজিটাল ব্যবসায় রূপ দিতে দিন।",

    addYourFirstProduct:
      "প্রথম পণ্য যোগ করুন",
  },

  ta: {
    heroEyebrow:
      "ஒவ்வொரு கைவினைஞருக்கும் AI",

    heroTitleOne:
      "உங்கள் கலை.",
    heroTitleTwo:
      "உங்கள் வணிகம். உங்கள் எதிர்காலம்.",

    heroDescription:
      "உங்கள் கைவினைப் பணியை தொழில்முறை டிஜிட்டல் தயாரிப்புகள், சிறந்த விலைகள் மற்றும் புதிய ஆன்லைன் வாய்ப்புகளாக மாற்றுங்கள்.",

    startAiPhotoshoot:
      "AI போட்டோஷூட்டை தொடங்குங்கள்",

    aiReady:
      "AI தயார்",

    smartPricing:
      "ஸ்மார்ட் விலை நிர்ணயம்",

    yourBusiness:
      "உங்கள் வணிகம்",

    businessOverview:
      "வணிக மேலோட்டம்",

    thisMonth:
      "இந்த மாதம்",

    totalProducts:
      "மொத்த தயாரிப்புகள்",

    addFirstProduct:
      "உங்கள் முதல் தயாரிப்பைச் சேர்க்கவும்",

    published:
      "வெளியிடப்பட்டது",

    productsOnline:
      "ஆன்லைன் தயாரிப்புகள்",

    orders:
      "ஆர்டர்கள்",

    firstOrder:
      "உங்கள் முதல் ஆர்டர் காத்திருக்கிறது",

    revenue:
      "வருவாய்",

    startSelling:
      "ஆன்லைனில் விற்பனை தொடங்குங்கள்",

    karigarTools:
      "கைவினைஞர் கருவிகள்",

    everythingYouNeed:
      "வளர்ச்சிக்கு தேவையான அனைத்தும்",

    toolsDescription:
      "இந்திய கைவினைஞர்களின் உண்மையான தேவைகளுக்காக உருவாக்கப்பட்ட எளிய AI கருவிகள்.",

    exploreFeature:
      "அம்சத்தைப் பார்க்கவும்",

    aiPhotoshoot:
      "AI போட்டோஷூட்",

    aiPhotoshootDescription:
      "ஒரு உண்மையான தயாரிப்பு புகைப்படத்தை தொழில்முறை மார்க்கெட்ப்ளேஸ்-தயாரான படமாக மாற்றுங்கள்.",

    aiPowered:
      "AI மூலம்",

    myProducts:
      "என் தயாரிப்புகள்",

    myProductsDescription:
      "உங்கள் டிஜிட்டல் பட்டியல், தயாரிப்புகள், விலைகள் மற்றும் இருப்பை ஒரே இடத்தில் நிர்வகிக்கவும்.",

    catalog:
      "பட்டியல்",

    aiPricing:
      "AI விலை நிர்ணயம்",

    aiPricingDescription:
      "செலவு, நேரம் மற்றும் கைவினைத்திறன் அடிப்படையில் நடைமுறை விற்பனை விலையைப் பெறுங்கள்.",

    smartPricingTag:
      "ஸ்மார்ட் விலை",

    businessInsights:
      "வணிக தகவல்கள்",

    businessInsightsDescription:
      "எளிய தகவல்களின் மூலம் உங்கள் தயாரிப்புகள், விற்பனை மற்றும் வணிக செயல்திறனைப் புரிந்துகொள்ளுங்கள்.",

    insights:
      "தகவல்கள்",

    marketplace:
      "மார்க்கெட்ப்ளேஸ்",

    marketplaceDescription:
      "ஆன்லைன் விற்பனை மற்றும் எதிர்கால மார்க்கெட்ப்ளேஸ் இணைப்புகளுக்கு உங்கள் தயாரிப்புகளைத் தயாரிக்கவும்.",

    sellOnline:
      "ஆன்லைனில் விற்கவும்",

    voiceInput:
      "குரல் உள்ளீடு",

    voiceInputDescription:
      "உங்கள் சொந்த மொழியில் பேசி இயல்பாக தயாரிப்பு தகவலை உருவாக்குங்கள்.",

    comingSoon:
      "விரைவில் வருகிறது",

    getStarted:
      "தொடங்குங்கள்",

    digitalJourney:
      "உங்கள் டிஜிட்டல் பயணத்தைத் தொடங்குங்கள்",

    digitalJourneyDescription:
      "உங்கள் முதல் கைவினைப் பொருளைச் சேர்த்து, உங்கள் கலையை டிஜிட்டல் வணிகமாக மாற்ற KarigarConnect உதவட்டும்.",

    addYourFirstProduct:
      "உங்கள் முதல் தயாரிப்பைச் சேர்க்கவும்",
  },

  te: {
    heroEyebrow:
      "ప్రతి చేతివృత్తిదారుడి కోసం AI",

    heroTitleOne:
      "మీ కళ.",
    heroTitleTwo:
      "మీ వ్యాపారం. మీ భవిష్యత్తు.",

    heroDescription:
      "మీ చేతిపనిని ప్రొఫెషనల్ డిజిటల్ ఉత్పత్తులు, మెరుగైన ధరలు మరియు కొత్త ఆన్‌లైన్ అవకాశాలుగా మార్చండి.",

    startAiPhotoshoot:
      "AI ఫోటోషూట్ ప్రారంభించండి",

    aiReady:
      "AI సిద్ధంగా ఉంది",

    smartPricing:
      "స్మార్ట్ ధర నిర్ణయం",

    yourBusiness:
      "మీ వ్యాపారం",

    businessOverview:
      "వ్యాపార అవలోకనం",

    thisMonth:
      "ఈ నెల",

    totalProducts:
      "మొత్తం ఉత్పత్తులు",

    addFirstProduct:
      "మీ మొదటి ఉత్పత్తిని జోడించండి",

    published:
      "ప్రచురించబడినవి",

    productsOnline:
      "ఆన్‌లైన్ ఉత్పత్తులు",

    orders:
      "ఆర్డర్లు",

    firstOrder:
      "మీ మొదటి ఆర్డర్ కోసం వేచి ఉంది",

    revenue:
      "ఆదాయం",

    startSelling:
      "ఆన్‌లైన్‌లో అమ్మడం ప్రారంభించండి",

    karigarTools:
      "కార్మికుల సాధనాలు",

    everythingYouNeed:
      "వృద్ధికి అవసరమైన ప్రతిదీ",

    toolsDescription:
      "భారతీయ చేతివృత్తిదారుల నిజమైన అవసరాల కోసం రూపొందించిన సులభమైన AI సాధనాలు.",

    exploreFeature:
      "ఫీచర్ చూడండి",

    aiPhotoshoot:
      "AI ఫోటోషూట్",

    aiPhotoshootDescription:
      "ఒక నిజమైన ఉత్పత్తి ఫోటోను ప్రొఫెషనల్ మార్కెట్‌ప్లేస్-రెడీ చిత్రంగా మార్చండి.",

    aiPowered:
      "AI ఆధారితం",

    myProducts:
      "నా ఉత్పత్తులు",

    myProductsDescription:
      "మీ డిజిటల్ కేటలాగ్, ఉత్పత్తులు, ధరలు మరియు స్టాక్‌ను ఒకే చోట నిర్వహించండి.",

    catalog:
      "కేటలాగ్",

    aiPricing:
      "AI ధర నిర్ణయం",

    aiPricingDescription:
      "ఖర్చు, సమయం మరియు నైపుణ్యం ఆధారంగా ఉపయోగకరమైన అమ్మకపు ధర పొందండి.",

    smartPricingTag:
      "స్మార్ట్ ధర",

    businessInsights:
      "వ్యాపార సమాచారం",

    businessInsightsDescription:
      "సులభమైన సమాచారం ద్వారా మీ ఉత్పత్తులు, అమ్మకాలు మరియు వ్యాపార పనితీరును అర్థం చేసుకోండి.",

    insights:
      "సమాచారం",

    marketplace:
      "మార్కెట్‌ప్లేస్",

    marketplaceDescription:
      "ఆన్‌లైన్ అమ్మకాల కోసం మరియు భవిష్యత్ మార్కెట్‌ప్లేస్ కనెక్షన్‌ల కోసం మీ ఉత్పత్తులను సిద్ధం చేయండి.",

    sellOnline:
      "ఆన్‌లైన్‌లో అమ్మండి",

    voiceInput:
      "వాయిస్ ఇన్‌పుట్",

    voiceInputDescription:
      "మీ స్వంత భాషలో మాట్లాడి సహజంగా ఉత్పత్తి సమాచారాన్ని రూపొందించండి.",

    comingSoon:
      "త్వరలో వస్తుంది",

    getStarted:
      "ప్రారంభించండి",

    digitalJourney:
      "మీ డిజిటల్ ప్రయాణాన్ని ప్రారంభించండి",

    digitalJourneyDescription:
      "మీ మొదటి చేతిపనిని జోడించి, మీ కళను డిజిటల్ వ్యాపారంగా మార్చడానికి KarigarConnect సహాయం పొందండి.",

    addYourFirstProduct:
      "మీ మొదటి ఉత్పత్తిని జోడించండి",
  },

  mr: {
    heroEyebrow:
      "प्रत्येक कारागिरासाठी AI",

    heroTitleOne:
      "तुमची कला.",
    heroTitleTwo:
      "तुमचा व्यवसाय. तुमचे भविष्य.",

    heroDescription:
      "तुमच्या हस्तनिर्मित कामाला व्यावसायिक डिजिटल उत्पादने, योग्य किंमती आणि नवीन ऑनलाइन संधींमध्ये बदला.",

    startAiPhotoshoot:
      "AI फोटोशूट सुरू करा",

    aiReady:
      "AI तयार",

    smartPricing:
      "स्मार्ट किंमत निर्धारण",

    yourBusiness:
      "तुमचा व्यवसाय",

    businessOverview:
      "व्यवसायाचा आढावा",

    thisMonth:
      "या महिन्यात",

    totalProducts:
      "एकूण उत्पादने",

    addFirstProduct:
      "तुमचे पहिले उत्पादन जोडा",

    published:
      "प्रकाशित",

    productsOnline:
      "ऑनलाइन उत्पादने",

    orders:
      "ऑर्डर्स",

    firstOrder:
      "तुमची पहिली ऑर्डर वाट पाहत आहे",

    revenue:
      "महसूल",

    startSelling:
      "ऑनलाइन विक्री सुरू करा",

    karigarTools:
      "कारागिरांची साधने",

    everythingYouNeed:
      "वाढीसाठी आवश्यक सर्वकाही",

    toolsDescription:
      "भारतीय कारागिरांच्या वास्तविक गरजांसाठी तयार केलेली सोपी AI साधने.",

    exploreFeature:
      "फीचर पहा",

    aiPhotoshoot:
      "AI फोटोशूट",

    aiPhotoshootDescription:
      "एका वास्तविक उत्पादनाच्या फोटोला व्यावसायिक मार्केटप्लेससाठी तयार प्रतिमेत बदला.",

    aiPowered:
      "AI आधारित",

    myProducts:
      "माझी उत्पादने",

    myProductsDescription:
      "तुमचा डिजिटल कॅटलॉग, उत्पादने, किंमती आणि साठा एका ठिकाणी व्यवस्थापित करा.",

    catalog:
      "कॅटलॉग",

    aiPricing:
      "AI किंमत निर्धारण",

    aiPricingDescription:
      "खर्च, वेळ आणि कलेच्या आधारे व्यावहारिक विक्री किंमत मिळवा.",

    smartPricingTag:
      "स्मार्ट किंमत",

    businessInsights:
      "व्यवसाय माहिती",

    businessInsightsDescription:
      "सोप्या माहितीच्या मदतीने तुमची उत्पादने, विक्री आणि व्यवसाय कामगिरी समजून घ्या.",

    insights:
      "माहिती",

    marketplace:
      "मार्केटप्लेस",

    marketplaceDescription:
      "ऑनलाइन विक्री आणि भविष्यातील मार्केटप्लेस जोडणीसाठी तुमची उत्पादने तयार करा.",

    sellOnline:
      "ऑनलाइन विक्री करा",

    voiceInput:
      "व्हॉइस इनपुट",

    voiceInputDescription:
      "तुमच्या स्वतःच्या भाषेत बोलून उत्पादनाची माहिती सहज तयार करा.",

    comingSoon:
      "लवकरच येत आहे",

    getStarted:
      "सुरुवात करा",

    digitalJourney:
      "तुमचा डिजिटल प्रवास सुरू करा",

    digitalJourneyDescription:
      "तुमचे पहिले हस्तनिर्मित उत्पादन जोडा आणि तुमची कला डिजिटल व्यवसायात बदलण्यासाठी KarigarConnect ची मदत घ्या.",

    addYourFirstProduct:
      "तुमचे पहिले उत्पादन जोडा",
  },

  gu: {
    heroEyebrow:
      "દરેક કારીગર માટે AI",

    heroTitleOne:
      "તમારી કલા.",
    heroTitleTwo:
      "તમારો વ્યવસાય. તમારું ભવિષ્ય.",

    heroDescription:
      "તમારા હસ્તનિર્મિત કામને વ્યાવસાયિક ડિજિટલ ઉત્પાદનો, વધુ સારી કિંમતો અને નવી ઑનલાઇન તકોમાં બદલો.",

    startAiPhotoshoot:
      "AI ફોટોશૂટ શરૂ કરો",

    aiReady:
      "AI તૈયાર",

    smartPricing:
      "સ્માર્ટ કિંમત નિર્ધારણ",

    yourBusiness:
      "તમારો વ્યવસાય",

    businessOverview:
      "વ્યવસાયનો સારાંશ",

    thisMonth:
      "આ મહિને",

    totalProducts:
      "કુલ ઉત્પાદનો",

    addFirstProduct:
      "તમારું પ્રથમ ઉત્પાદન ઉમેરો",

    published:
      "પ્રકાશિત",

    productsOnline:
      "ઓનલાઇન ઉત્પાદનો",

    orders:
      "ઓર્ડર્સ",

    firstOrder:
      "તમારો પહેલો ઓર્ડર રાહ જોઈ રહ્યો છે",

    revenue:
      "આવક",

    startSelling:
      "ઓનલાઇન વેચાણ શરૂ કરો",

    karigarTools:
      "કારીગર સાધનો",

    everythingYouNeed:
      "વધવા માટે તમને જરૂરી બધું",

    toolsDescription:
      "ભારતીય કારીગરોની વાસ્તવિક જરૂરિયાતો માટે બનાવેલા સરળ AI સાધનો.",

    exploreFeature:
      "ફીચર જુઓ",

    aiPhotoshoot:
      "AI ફોટોશૂટ",

    aiPhotoshootDescription:
      "એક વાસ્તવિક ઉત્પાદન ફોટોને વ્યાવસાયિક માર્કેટપ્લેસ-તૈયાર છબીમાં બદલો.",

    aiPowered:
      "AI આધારિત",

    myProducts:
      "મારા ઉત્પાદનો",

    myProductsDescription:
      "તમારો ડિજિટલ કેટલોગ, ઉત્પાદનો, કિંમતો અને સ્ટોક એક જગ્યાએ સંચાલિત કરો.",

    catalog:
      "કેટલોગ",

    aiPricing:
      "AI કિંમત નિર્ધારણ",

    aiPricingDescription:
      "ખર્ચ, સમય અને કારીગરીના આધારે વ્યવહારુ વેચાણ કિંમત મેળવો.",

    smartPricingTag:
      "સ્માર્ટ કિંમત",

    businessInsights:
      "વ્યવસાય માહિતી",

    businessInsightsDescription:
      "સરળ માહિતી દ્વારા તમારા ઉત્પાદનો, વેચાણ અને વ્યવસાયના પ્રદર્શનને સમજો.",

    insights:
      "માહિતી",

    marketplace:
      "માર્કેટપ્લેસ",

    marketplaceDescription:
      "ઓનલાઇન વેચાણ અને ભવિષ્યના માર્કેટપ્લેસ કનેક્શન માટે તમારા ઉત્પાદનો તૈયાર કરો.",

    sellOnline:
      "ઓનલાઇન વેચો",

    voiceInput:
      "વૉઇસ ઇનપુટ",

    voiceInputDescription:
      "તમારી પોતાની ભાષામાં બોલીને સ્વાભાવિક રીતે ઉત્પાદનની માહિતી બનાવો.",

    comingSoon:
      "ટૂંક સમયમાં આવી રહ્યું છે",

    getStarted:
      "શરૂ કરો",

    digitalJourney:
      "તમારી ડિજિટલ યાત્રા શરૂ કરો",

    digitalJourneyDescription:
      "તમારું પ્રથમ હસ્તનિર્મિત ઉત્પાદન ઉમેરો અને KarigarConnectને તમારી કલાને ડિજિટલ વ્યવસાયમાં ફેરવવામાં મદદ કરવા દો.",

    addYourFirstProduct:
      "તમારું પ્રથમ ઉત્પાદન ઉમેરો",
  },

  kn: {
    heroEyebrow:
      "ಪ್ರತಿ ಕುಶಲಕರ್ಮಿಗಾಗಿ AI",

    heroTitleOne:
      "ನಿಮ್ಮ ಕಲೆ.",
    heroTitleTwo:
      "ನಿಮ್ಮ ವ್ಯವಹಾರ. ನಿಮ್ಮ ಭವಿಷ್ಯ.",

    heroDescription:
      "ನಿಮ್ಮ ಕೈತಯಾರಿಸಿದ ಕೆಲಸವನ್ನು ವೃತ್ತಿಪರ ಡಿಜಿಟಲ್ ಉತ್ಪನ್ನಗಳು, ಉತ್ತಮ ಬೆಲೆಗಳು ಮತ್ತು ಹೊಸ ಆನ್‌ಲೈನ್ ಅವಕಾಶಗಳಾಗಿ ಪರಿವರ್ತಿಸಿ.",

    startAiPhotoshoot:
      "AI ಫೋಟೋಶೂಟ್ ಪ್ರಾರಂಭಿಸಿ",

    aiReady:
      "AI ಸಿದ್ಧ",

    smartPricing:
      "ಸ್ಮಾರ್ಟ್ ಬೆಲೆ ನಿರ್ಧಾರ",

    yourBusiness:
      "ನಿಮ್ಮ ವ್ಯವಹಾರ",

    businessOverview:
      "ವ್ಯವಹಾರದ ಅವಲೋಕನ",

    thisMonth:
      "ಈ ತಿಂಗಳು",

    totalProducts:
      "ಒಟ್ಟು ಉತ್ಪನ್ನಗಳು",

    addFirstProduct:
      "ನಿಮ್ಮ ಮೊದಲ ಉತ್ಪನ್ನವನ್ನು ಸೇರಿಸಿ",

    published:
      "ಪ್ರಕಟಿತ",

    productsOnline:
      "ಆನ್‌ಲೈನ್ ಉತ್ಪನ್ನಗಳು",

    orders:
      "ಆರ್ಡರ್‌ಗಳು",

    firstOrder:
      "ನಿಮ್ಮ ಮೊದಲ ಆರ್ಡರ್ ಕಾಯುತ್ತಿದೆ",

    revenue:
      "ಆದಾಯ",

    startSelling:
      "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಮಾರಾಟ ಪ್ರಾರಂಭಿಸಿ",

    karigarTools:
      "ಕುಶಲಕರ್ಮಿ ಸಾಧನಗಳು",

    everythingYouNeed:
      "ಬೆಳವಣಿಗೆಗೆ ಬೇಕಾದ ಎಲ್ಲವೂ",

    toolsDescription:
      "ಭಾರತೀಯ ಕುಶಲಕರ್ಮಿಗಳ ನೈಜ ಅಗತ್ಯಗಳಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಸರಳ AI ಸಾಧನಗಳು.",

    exploreFeature:
      "ವೈಶಿಷ್ಟ್ಯವನ್ನು ನೋಡಿ",

    aiPhotoshoot:
      "AI ಫೋಟೋಶೂಟ್",

    aiPhotoshootDescription:
      "ಒಂದು ನೈಜ ಉತ್ಪನ್ನದ ಫೋಟೋವನ್ನು ವೃತ್ತಿಪರ ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ಚಿತ್ರವಾಗಿ ಪರಿವರ್ತಿಸಿ.",

    aiPowered:
      "AI ಚಾಲಿತ",

    myProducts:
      "ನನ್ನ ಉತ್ಪನ್ನಗಳು",

    myProductsDescription:
      "ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಕ್ಯಾಟಲಾಗ್, ಉತ್ಪನ್ನಗಳು, ಬೆಲೆಗಳು ಮತ್ತು ಸ್ಟಾಕ್ ಅನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ನಿರ್ವಹಿಸಿ.",

    catalog:
      "ಕ್ಯಾಟಲಾಗ್",

    aiPricing:
      "AI ಬೆಲೆ ನಿರ್ಧಾರ",

    aiPricingDescription:
      "ವೆಚ್ಚ, ಸಮಯ ಮತ್ತು ಕೌಶಲ್ಯದ ಆಧಾರದ ಮೇಲೆ ಪ್ರಾಯೋಗಿಕ ಮಾರಾಟ ಬೆಲೆಯನ್ನು ಪಡೆಯಿರಿ.",

    smartPricingTag:
      "ಸ್ಮಾರ್ಟ್ ಬೆಲೆ",

    businessInsights:
      "ವ್ಯವಹಾರ ಮಾಹಿತಿ",

    businessInsightsDescription:
      "ಸರಳ ಮಾಹಿತಿಯ ಮೂಲಕ ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳು, ಮಾರಾಟ ಮತ್ತು ವ್ಯವಹಾರದ ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.",

    insights:
      "ಮಾಹಿತಿ",

    marketplace:
      "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್",

    marketplaceDescription:
      "ಆನ್‌ಲೈನ್ ಮಾರಾಟ ಮತ್ತು ಭವಿಷ್ಯದ ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ಸಂಪರ್ಕಗಳಿಗೆ ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ.",

    sellOnline:
      "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಮಾರಾಟ ಮಾಡಿ",

    voiceInput:
      "ಧ್ವನಿ ಇನ್‌ಪುಟ್",

    voiceInputDescription:
      "ನಿಮ್ಮ ಸ್ವಂತ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ ಸಹಜವಾಗಿ ಉತ್ಪನ್ನದ ಮಾಹಿತಿಯನ್ನು ರಚಿಸಿ.",

    comingSoon:
      "ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತಿದೆ",

    getStarted:
      "ಪ್ರಾರಂಭಿಸಿ",

    digitalJourney:
      "ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ",

    digitalJourneyDescription:
      "ನಿಮ್ಮ ಮೊದಲ ಕೈತಯಾರಿಸಿದ ಉತ್ಪನ್ನವನ್ನು ಸೇರಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಕಲೆಯನ್ನು ಡಿಜಿಟಲ್ ವ್ಯವಹಾರವಾಗಿ ಪರಿವರ್ತಿಸಲು KarigarConnect ಸಹಾಯ ಪಡೆಯಿರಿ.",

    addYourFirstProduct:
      "ನಿಮ್ಮ ಮೊದಲ ಉತ್ಪನ್ನವನ್ನು ಸೇರಿಸಿ",
  },

  ml: {
    heroEyebrow:
      "ഓരോ കരകൗശല തൊഴിലാളിക്കും AI",

    heroTitleOne:
      "നിങ്ങളുടെ കല.",
    heroTitleTwo:
      "നിങ്ങളുടെ ബിസിനസ്. നിങ്ങളുടെ ഭാവി.",

    heroDescription:
      "നിങ്ങളുടെ കൈത്തറി ജോലിയെ പ്രൊഫഷണൽ ഡിജിറ്റൽ ഉൽപ്പന്നങ്ങൾ, മികച്ച വിലകൾ, പുതിയ ഓൺലൈൻ അവസരങ്ങൾ എന്നിവയാക്കി മാറ്റുക.",

    startAiPhotoshoot:
      "AI ഫോട്ടോഷൂട്ട് ആരംഭിക്കുക",

    aiReady:
      "AI തയ്യാറാണ്",

    smartPricing:
      "സ്മാർട്ട് വില നിർണ്ണയം",

    yourBusiness:
      "നിങ്ങളുടെ ബിസിനസ്",

    businessOverview:
      "ബിസിനസ് അവലോകനം",

    thisMonth:
      "ഈ മാസം",

    totalProducts:
      "ആകെ ഉൽപ്പന്നങ്ങൾ",

    addFirstProduct:
      "നിങ്ങളുടെ ആദ്യ ഉൽപ്പന്നം ചേർക്കുക",

    published:
      "പ്രസിദ്ധീകരിച്ചത്",

    productsOnline:
      "ഓൺലൈൻ ഉൽപ്പന്നങ്ങൾ",

    orders:
      "ഓർഡറുകൾ",

    firstOrder:
      "നിങ്ങളുടെ ആദ്യ ഓർഡർ കാത്തിരിക്കുന്നു",

    revenue:
      "വരുമാനം",

    startSelling:
      "ഓൺലൈനിൽ വിൽക്കാൻ തുടങ്ങുക",

    karigarTools:
      "കരകൗശല ഉപകരണങ്ങൾ",

    everythingYouNeed:
      "വളരാൻ ആവശ്യമായ എല്ലാം",

    toolsDescription:
      "ഇന്ത്യൻ കരകൗശല തൊഴിലാളികളുടെ യഥാർത്ഥ ആവശ്യങ്ങൾക്കായി നിർമ്മിച്ച ലളിതമായ AI ഉപകരണങ്ങൾ.",

    exploreFeature:
      "ഫീച്ചർ കാണുക",

    aiPhotoshoot:
      "AI ഫോട്ടോഷൂട്ട്",

    aiPhotoshootDescription:
      "ഒരു യഥാർത്ഥ ഉൽപ്പന്ന ഫോട്ടോയെ പ്രൊഫഷണൽ മാർക്കറ്റ്പ്ലേസ് ചിത്രമാക്കി മാറ്റുക.",

    aiPowered:
      "AI അധിഷ്ഠിതം",

    myProducts:
      "എന്റെ ഉൽപ്പന്നങ്ങൾ",

    myProductsDescription:
      "നിങ്ങളുടെ ഡിജിറ്റൽ കാറ്റലോഗ്, ഉൽപ്പന്നങ്ങൾ, വിലകൾ, സ്റ്റോക്ക് എന്നിവ ഒരിടത്ത് നിയന്ത്രിക്കുക.",

    catalog:
      "കാറ്റലോഗ്",

    aiPricing:
      "AI വില നിർണ്ണയം",

    aiPricingDescription:
      "ചെലവ്, സമയം, കരകൗശലം എന്നിവയുടെ അടിസ്ഥാനത്തിൽ പ്രായോഗിക വിൽപ്പന വില നേടുക.",

    smartPricingTag:
      "സ്മാർട്ട് വില",

    businessInsights:
      "ബിസിനസ് വിവരങ്ങൾ",

    businessInsightsDescription:
      "ലളിതമായ വിവരങ്ങളിലൂടെ നിങ്ങളുടെ ഉൽപ്പന്നങ്ങൾ, വിൽപ്പന, ബിസിനസ് പ്രകടനം എന്നിവ മനസ്സിലാക്കുക.",

    insights:
      "വിവരങ്ങൾ",

    marketplace:
      "മാർക്കറ്റ്പ്ലേസ്",

    marketplaceDescription:
      "ഓൺലൈൻ വിൽപ്പനയ്ക്കും ഭാവിയിലെ മാർക്കറ്റ്പ്ലേസ് കണക്ഷനുകൾക്കുമായി നിങ്ങളുടെ ഉൽപ്പന്നങ്ങൾ തയ്യാറാക്കുക.",

    sellOnline:
      "ഓൺലൈനിൽ വിൽക്കുക",

    voiceInput:
      "വോയ്സ് ഇൻപുട്ട്",

    voiceInputDescription:
      "നിങ്ങളുടെ സ്വന്തം ഭാഷയിൽ സംസാരിച്ച് സ്വാഭാവികമായി ഉൽപ്പന്ന വിവരങ്ങൾ സൃഷ്ടിക്കുക.",

    comingSoon:
      "ഉടൻ വരുന്നു",

    getStarted:
      "ആരംഭിക്കുക",

    digitalJourney:
      "നിങ്ങളുടെ ഡിജിറ്റൽ യാത്ര ആരംഭിക്കുക",

    digitalJourneyDescription:
      "നിങ്ങളുടെ ആദ്യ കൈത്തറി ഉൽപ്പന്നം ചേർത്ത് നിങ്ങളുടെ കലയെ ഡിജിറ്റൽ ബിസിനസാക്കി മാറ്റാൻ KarigarConnect സഹായിക്കട്ടെ.",

    addYourFirstProduct:
      "ആദ്യ ഉൽപ്പന്നം ചേർക്കുക",
  },

  pa: {
    heroEyebrow:
      "ਹਰ ਕਾਰੀਗਰ ਲਈ AI",

    heroTitleOne:
      "ਤੁਹਾਡੀ ਕਲਾ।",
    heroTitleTwo:
      "ਤੁਹਾਡਾ ਕਾਰੋਬਾਰ। ਤੁਹਾਡਾ ਭਵਿੱਖ।",

    heroDescription:
      "ਆਪਣੇ ਹੱਥ ਨਾਲ ਬਣੇ ਕੰਮ ਨੂੰ ਪੇਸ਼ੇਵਰ ਡਿਜ਼ਿਟਲ ਉਤਪਾਦਾਂ, ਵਧੀਆ ਕੀਮਤਾਂ ਅਤੇ ਨਵੇਂ ਆਨਲਾਈਨ ਮੌਕਿਆਂ ਵਿੱਚ ਬਦਲੋ।",

    startAiPhotoshoot:
      "AI ਫੋਟੋਸ਼ੂਟ ਸ਼ੁਰੂ ਕਰੋ",

    aiReady:
      "AI ਤਿਆਰ",

    smartPricing:
      "ਸਮਾਰਟ ਕੀਮਤ ਨਿਰਧਾਰਨ",

    yourBusiness:
      "ਤੁਹਾਡਾ ਕਾਰੋਬਾਰ",

    businessOverview:
      "ਕਾਰੋਬਾਰ ਦਾ ਜਾਇਜ਼ਾ",

    thisMonth:
      "ਇਸ ਮਹੀਨੇ",

    totalProducts:
      "ਕੁੱਲ ਉਤਪਾਦ",

    addFirstProduct:
      "ਆਪਣਾ ਪਹਿਲਾ ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ",

    published:
      "ਪ੍ਰਕਾਸ਼ਿਤ",

    productsOnline:
      "ਆਨਲਾਈਨ ਉਤਪਾਦ",

    orders:
      "ਆਰਡਰ",

    firstOrder:
      "ਤੁਹਾਡਾ ਪਹਿਲਾ ਆਰਡਰ ਉਡੀਕ ਕਰ ਰਿਹਾ ਹੈ",

    revenue:
      "ਆਮਦਨ",

    startSelling:
      "ਆਨਲਾਈਨ ਵੇਚਣਾ ਸ਼ੁਰੂ ਕਰੋ",

    karigarTools:
      "ਕਾਰੀਗਰ ਟੂਲ",

    everythingYouNeed:
      "ਵਧਣ ਲਈ ਤੁਹਾਨੂੰ ਲੋੜੀਂਦੀ ਹਰ ਚੀਜ਼",

    toolsDescription:
      "ਭਾਰਤੀ ਕਾਰੀਗਰਾਂ ਦੀਆਂ ਅਸਲ ਲੋੜਾਂ ਲਈ ਬਣਾਏ ਗਏ ਸਧਾਰਨ AI ਟੂਲ।",

    exploreFeature:
      "ਫੀਚਰ ਵੇਖੋ",

    aiPhotoshoot:
      "AI ਫੋਟੋਸ਼ੂਟ",

    aiPhotoshootDescription:
      "ਇੱਕ ਅਸਲੀ ਉਤਪਾਦ ਫੋਟੋ ਨੂੰ ਪੇਸ਼ੇਵਰ ਮਾਰਕੀਟਪਲੇਸ-ਤਿਆਰ ਤਸਵੀਰ ਵਿੱਚ ਬਦਲੋ।",

    aiPowered:
      "AI ਦੁਆਰਾ ਸੰਚਾਲਿਤ",

    myProducts:
      "ਮੇਰੇ ਉਤਪਾਦ",

    myProductsDescription:
      "ਆਪਣਾ ਡਿਜ਼ਿਟਲ ਕੈਟਾਲਾਗ, ਉਤਪਾਦ, ਕੀਮਤਾਂ ਅਤੇ ਸਟਾਕ ਇੱਕੋ ਥਾਂ ਪ੍ਰਬੰਧਿਤ ਕਰੋ।",

    catalog:
      "ਕੈਟਾਲਾਗ",

    aiPricing:
      "AI ਕੀਮਤ ਨਿਰਧਾਰਨ",

    aiPricingDescription:
      "ਲਾਗਤ, ਸਮਾਂ ਅਤੇ ਕਾਰੀਗਰੀ ਦੇ ਆਧਾਰ 'ਤੇ ਵਰਤੋਂਯੋਗ ਵਿਕਰੀ ਕੀਮਤ ਪ੍ਰਾਪਤ ਕਰੋ।",

    smartPricingTag:
      "ਸਮਾਰਟ ਕੀਮਤ",

    businessInsights:
      "ਕਾਰੋਬਾਰੀ ਜਾਣਕਾਰੀ",

    businessInsightsDescription:
      "ਸਧਾਰਨ ਜਾਣਕਾਰੀ ਰਾਹੀਂ ਆਪਣੇ ਉਤਪਾਦਾਂ, ਵਿਕਰੀ ਅਤੇ ਕਾਰੋਬਾਰੀ ਪ੍ਰਦਰਸ਼ਨ ਨੂੰ ਸਮਝੋ।",

    insights:
      "ਜਾਣਕਾਰੀ",

    marketplace:
      "ਮਾਰਕੀਟਪਲੇਸ",

    marketplaceDescription:
      "ਆਨਲਾਈਨ ਵਿਕਰੀ ਅਤੇ ਭਵਿੱਖ ਦੇ ਮਾਰਕੀਟਪਲੇਸ ਕਨੈਕਸ਼ਨਾਂ ਲਈ ਆਪਣੇ ਉਤਪਾਦ ਤਿਆਰ ਕਰੋ।",

    sellOnline:
      "ਆਨਲਾਈਨ ਵੇਚੋ",

    voiceInput:
      "ਵੌਇਸ ਇਨਪੁੱਟ",

    voiceInputDescription:
      "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲ ਕੇ ਕੁਦਰਤੀ ਤਰੀਕੇ ਨਾਲ ਉਤਪਾਦ ਦੀ ਜਾਣਕਾਰੀ ਬਣਾਓ।",

    comingSoon:
      "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ",

    getStarted:
      "ਸ਼ੁਰੂ ਕਰੋ",

    digitalJourney:
      "ਆਪਣੀ ਡਿਜ਼ਿਟਲ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ",

    digitalJourneyDescription:
      "ਆਪਣਾ ਪਹਿਲਾ ਹੱਥ ਨਾਲ ਬਣਿਆ ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ ਅਤੇ KarigarConnect ਨੂੰ ਆਪਣੀ ਕਲਾ ਨੂੰ ਡਿਜ਼ਿਟਲ ਕਾਰੋਬਾਰ ਵਿੱਚ ਬਦਲਣ ਵਿੱਚ ਮਦਦ ਕਰਨ ਦਿਓ।",

    addYourFirstProduct:
      "ਆਪਣਾ ਪਹਿਲਾ ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ",
  },
};

const BACKEND_URL =
  "http://localhost:5000";

const ARTISAN_ID =
  "6aa7d975f3c555e19062b4cd";

function Home({
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
    HOME_TRANSLATIONS[language]
      ? language
      : "en";

  const ui =
    HOME_TRANSLATIONS[
      currentLanguage
    ];

  /*
  =====================================================
  DASHBOARD STATE
  =====================================================
  */

  const [dashboardStats, setDashboardStats] =
    useState({
      totalProducts: 0,
      publishedProducts: 0,
      loading: true,
      error: false,
    });

  /*
  =====================================================
  LOAD REAL PRODUCT DATA
  =====================================================
  */

  const loadDashboardStats =
    async () => {
      try {
        setDashboardStats(
          (previous) => ({
            ...previous,
            loading: true,
            error: false,
          })
        );

        const response =
          await fetch(
            `${BACKEND_URL}/api/products?artisan=${ARTISAN_ID}&lang=${currentLanguage}`
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load products"
          );
        }

        const data =
          await response.json();

        const products =
          Array.isArray(
            data.products
          )
            ? data.products
            : Array.isArray(data)
            ? data
            : [];

        const totalProducts =
          products.length;

        const publishedProducts =
          products.filter(
            (product) =>
              product.status ===
              "published"
          ).length;

        setDashboardStats({
          totalProducts,
          publishedProducts,
          loading: false,
          error: false,
        });
      } catch (error) {
        console.error(
          "Home dashboard error:",
          error
        );

        setDashboardStats({
          totalProducts: 0,
          publishedProducts: 0,
          loading: false,
          error: true,
        });
      }
    };

  useEffect(() => {
    loadDashboardStats();
  }, [currentLanguage]);

  /*
  =====================================================
  FEATURES
  =====================================================
  */

  const features = [
    {
      id: "photoshoot",
      icon: "📸",
      title:
        ui.aiPhotoshoot,
      description:
        ui.aiPhotoshootDescription,
      tag:
        ui.aiPowered,
      className:
        "feature-large feature-green",
    },

    {
      id: "products",
      icon: "🧵",
      title:
        ui.myProducts,
      description:
        ui.myProductsDescription,
      tag:
        ui.catalog,
      className:
        "feature-large feature-gold",
    },

    {
      id: "pricing",
      icon: "💰",
      title:
        ui.aiPricing,
      description:
        ui.aiPricingDescription,
      tag:
        ui.smartPricingTag,
      className:
        "feature-medium feature-dark",
    },

    {
      id: "insights",
      icon: "📊",
      title:
        ui.businessInsights,
      description:
        ui.businessInsightsDescription,
      tag:
        ui.insights,
      className:
        "feature-medium feature-light",
    },

    {
      id: "marketplace",
      icon: "🛍️",
      title:
        ui.marketplace,
      description:
        ui.marketplaceDescription,
      tag:
        ui.sellOnline,
      className:
        "feature-small feature-market",
    },

    {
      id: "voice",
      icon: "🎙️",
      title:
        ui.voiceInput,
      description:
        ui.voiceInputDescription,
      tag:
        ui.comingSoon,
      className:
        "feature-small feature-voice",
    },
  ];

  /*
  =====================================================
  RENDER
  =====================================================
  */

  return (
    <div className="home-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="home-hero">

        <div className="home-hero-content">

          <div className="home-eyebrow">

            <span className="eyebrow-dot"></span>

            {ui.heroEyebrow}

          </div>

          <h1>

            {ui.heroTitleOne}

            <br />

            <span>
              {ui.heroTitleTwo}
            </span>

          </h1>

          <p>
            {ui.heroDescription}
          </p>

          <button
            type="button"
            className="hero-action"
            onClick={() =>
              onNavigate(
                "photoshoot"
              )
            }
          >

            <span>
              ✨
            </span>

            {ui.startAiPhotoshoot}

            <span className="arrow">
              →
            </span>

          </button>

        </div>

        {/* HERO ART */}

        <div className="hero-art">

          <div className="hero-circle hero-circle-one"></div>

          <div className="hero-circle hero-circle-two"></div>

          <div className="craft-symbol">
            🧶
          </div>

          <div className="floating-card floating-card-one">

            <span>
              ✨
            </span>

            {ui.aiReady}

          </div>

          <div className="floating-card floating-card-two">

            <span>
              ₹
            </span>

            {ui.smartPricing}

          </div>

        </div>

      </section>

      {/* =================================================
          BUSINESS OVERVIEW
      ================================================= */}

      <section className="overview-section">

        <div className="section-top">

          <div>

            <span className="section-label">
              {ui.yourBusiness}
            </span>

            <h2>
              {ui.businessOverview}
            </h2>

          </div>

          <span className="overview-period">
            {ui.thisMonth}
          </span>

        </div>

        <div className="overview-grid">

          {/* TOTAL PRODUCTS */}

          <div className="overview-card">

            <div className="overview-icon green">
              🧵
            </div>

            <div>

              <span>
                {ui.totalProducts}
              </span>

              <strong>

                {dashboardStats.loading
                  ? "..."
                  : dashboardStats.totalProducts}

              </strong>

            </div>

            <small>
              {ui.addFirstProduct}
            </small>

          </div>

          {/* PUBLISHED */}

          <div className="overview-card">

            <div className="overview-icon gold">
              📦
            </div>

            <div>

              <span>
                {ui.published}
              </span>

              <strong>

                {dashboardStats.loading
                  ? "..."
                  : dashboardStats.publishedProducts}

              </strong>

            </div>

            <small>
              {ui.productsOnline}
            </small>

          </div>

          {/* ORDERS */}

          <div className="overview-card">

            <div className="overview-icon blue">
              🛒
            </div>

            <div>

              <span>
                {ui.orders}
              </span>

              <strong>
                0
              </strong>

            </div>

            <small>
              {ui.firstOrder}
            </small>

          </div>

          {/* REVENUE */}

          <div className="overview-card">

            <div className="overview-icon purple">
              📈
            </div>

            <div>

              <span>
                {ui.revenue}
              </span>

              <strong>
                ₹0
              </strong>

            </div>

            <small>
              {ui.startSelling}
            </small>

          </div>

        </div>

        {dashboardStats.error && (
          <div
            style={{
              marginTop: "12px",
              fontSize: "12px",
              color: "#a05a00",
            }}
          >
            Dashboard data could not be loaded.
          </div>
        )}

      </section>

      {/* =================================================
          FEATURES
      ================================================= */}

      <section className="features-section">

        <div className="section-top features-heading">

          <div>

            <span className="section-label">
              {ui.karigarTools}
            </span>

            <h2>
              {ui.everythingYouNeed}
            </h2>

            <p>
              {ui.toolsDescription}
            </p>

          </div>

        </div>

        <div className="features-grid">

          {features.map(
            (feature) => (

              <article
                key={
                  feature.id
                }
                className={`feature-card-new ${feature.className}`}
                onClick={() =>
                  onNavigate(
                    feature.id
                  )
                }
              >

                <div className="feature-top">

                  <div className="feature-icon">
                    {
                      feature.icon
                    }
                  </div>

                  <span className="feature-tag">
                    {
                      feature.tag
                    }
                  </span>

                </div>

                <div className="feature-content">

                  <h3>
                    {
                      feature.title
                    }
                  </h3>

                  <p>
                    {
                      feature.description
                    }
                  </p>

                </div>

                <div className="feature-footer">

                  <span>
                    {ui.exploreFeature}
                  </span>

                  <span className="feature-arrow">
                    →
                  </span>

                </div>

              </article>

            )
          )}

        </div>

      </section>

      {/* =================================================
          QUICK START
      ================================================= */}

      <section className="quick-start">

        <div>

          <span className="section-label">
            {ui.getStarted}
          </span>

          <h2>
            {ui.digitalJourney}
          </h2>

          <p>
            {
              ui.digitalJourneyDescription
            }
          </p>

        </div>

        <button
          type="button"
          className="quick-start-button"
          onClick={() =>
            onNavigate(
              "products"
            )
          }
        >

          {ui.addYourFirstProduct}

          <span>
            →
          </span>

        </button>

      </section>

    </div>
  );
}

export default Home;
