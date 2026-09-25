
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { useLanguage } from "../i18n/LanguageContext";
import "./VoiceInput.css";

const BACKEND_URL =
  import.meta.env.VITE_API_URL;

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

const VOICE_TRANSLATIONS = {
  en: {
    eyebrow: "VOICE INPUT",
    title: "Describe your product by speaking",
    description:
      "Speak naturally in your own language. KarigarConnect will turn your words into structured product information.",

    language: "Voice language",
    chooseLanguage:
      "Choose the language you will speak",

    ready: "Ready to record",
    recording: "Recording...",
    processing: "Understanding your product...",

    startRecording: "Start Recording",
    stopRecording: "Stop Recording",
    processRecording: "Create Product Information",
    recordAgain: "Record Again",

    tipTitle: "What should you say?",
    tip1:
      "Tell us the product name and what you make.",
    tip2:
      "Mention material, color, craft technique and region.",
    tip3:
      "Tell us the approximate cost and selling price if known.",

    transcript: "Generated product information",
    name: "Product Name",
    category: "Category",
    region: "Region",
    description: "Description",

    useProduct:
      "Use this information in Add Product",
    addProduct:
      "Continue to Add Product",

    noRecording:
      "Please record your product description first.",

    microphoneError:
      "Microphone access is unavailable. Please allow microphone access and try again.",

    processingError:
      "Could not process your voice input. Please try again.",

    browserError:
      "Your browser does not support audio recording.",

    resultTitle:
      "Your product information is ready",

    languageUsed:
      "Selected language",

    emptyResult:
      "No product information was generated.",
  },

  hi: {
    eyebrow: "वॉइस इनपुट",
    title: "बोलकर अपने प्रोडक्ट का वर्णन करें",
    description:
      "अपनी भाषा में स्वाभाविक रूप से बोलें। KarigarConnect आपकी बात को व्यवस्थित प्रोडक्ट जानकारी में बदल देगा।",

    language: "वॉइस भाषा",
    chooseLanguage:
      "वह भाषा चुनें जिसमें आप बोलेंगे",

    ready: "रिकॉर्ड करने के लिए तैयार",
    recording: "रिकॉर्ड हो रहा है...",
    processing: "आपके प्रोडक्ट को समझा जा रहा है...",

    startRecording: "रिकॉर्डिंग शुरू करें",
    stopRecording: "रिकॉर्डिंग रोकें",
    processRecording: "प्रोडक्ट जानकारी बनाएं",
    recordAgain: "फिर रिकॉर्ड करें",

    tipTitle: "क्या बोलें?",
    tip1:
      "प्रोडक्ट का नाम और आप क्या बनाते हैं बताएं।",
    tip2:
      "सामग्री, रंग, कारीगरी और क्षेत्र बताएं।",
    tip3:
      "पता हो तो लागत और बिक्री कीमत बताएं।",

    transcript: "तैयार प्रोडक्ट जानकारी",
    name: "प्रोडक्ट नाम",
    category: "श्रेणी",
    region: "क्षेत्र",
    description: "विवरण",

    useProduct:
      "इस जानकारी का उपयोग Add Product में करें",
    addProduct:
      "Add Product पर जाएं",

    noRecording:
      "पहले अपने प्रोडक्ट का विवरण रिकॉर्ड करें।",

    microphoneError:
      "माइक्रोफोन उपलब्ध नहीं है। माइक्रोफोन की अनुमति दें और फिर कोशिश करें।",

    processingError:
      "वॉइस इनपुट प्रोसेस नहीं हो सका। फिर कोशिश करें।",

    browserError:
      "आपका ब्राउज़र ऑडियो रिकॉर्डिंग को सपोर्ट नहीं करता।",

    resultTitle:
      "आपकी प्रोडक्ट जानकारी तैयार है",

    languageUsed:
      "चुनी गई भाषा",

    emptyResult:
      "कोई प्रोडक्ट जानकारी नहीं बनाई गई।",
  },

  bn: {
    eyebrow: "ভয়েস ইনপুট",
    title: "কথা বলে আপনার পণ্যের বর্ণনা দিন",
    description:
      "নিজের ভাষায় স্বাভাবিকভাবে কথা বলুন। KarigarConnect আপনার কথাকে সংগঠিত পণ্যের তথ্যে পরিণত করবে।",

    language: "ভয়েস ভাষা",
    chooseLanguage: "আপনি যে ভাষায় বলবেন সেটি বেছে নিন",

    ready: "রেকর্ড করার জন্য প্রস্তুত",
    recording: "রেকর্ড হচ্ছে...",
    processing: "আপনার পণ্য বোঝা হচ্ছে...",

    startRecording: "রেকর্ড শুরু করুন",
    stopRecording: "রেকর্ড বন্ধ করুন",
    processRecording: "পণ্যের তথ্য তৈরি করুন",
    recordAgain: "আবার রেকর্ড করুন",

    tipTitle: "কী বলবেন?",
    tip1: "পণ্যের নাম এবং কী তৈরি করেন বলুন।",
    tip2: "উপাদান, রং, কারুশিল্প ও অঞ্চল বলুন।",
    tip3: "জানা থাকলে খরচ ও বিক্রয়মূল্য বলুন।",

    transcript: "তৈরি পণ্যের তথ্য",
    name: "পণ্যের নাম",
    category: "ক্যাটাগরি",
    region: "অঞ্চল",
    description: "বিবরণ",

    useProduct: "এই তথ্য Add Product-এ ব্যবহার করুন",
    addProduct: "Add Product-এ যান",

    noRecording: "প্রথমে পণ্যের বিবরণ রেকর্ড করুন।",
    microphoneError:
      "মাইক্রোফোন অ্যাক্সেস নেই। অনুমতি দিয়ে আবার চেষ্টা করুন।",
    processingError:
      "ভয়েস ইনপুট প্রক্রিয়া করা যায়নি। আবার চেষ্টা করুন।",
    browserError:
      "আপনার ব্রাউজার অডিও রেকর্ডিং সমর্থন করে না।",

    resultTitle: "আপনার পণ্যের তথ্য প্রস্তুত",
    languageUsed: "নির্বাচিত ভাষা",
    emptyResult: "কোনো পণ্যের তথ্য তৈরি হয়নি।",
  },

  ta: {
    eyebrow: "குரல் உள்ளீடு",
    title: "பேசி உங்கள் தயாரிப்பை விவரிக்கவும்",
    description:
      "உங்கள் மொழியில் இயல்பாக பேசுங்கள். KarigarConnect உங்கள் வார்த்தைகளை தயாரிப்பு தகவலாக மாற்றும்.",

    language: "குரல் மொழி",
    chooseLanguage:
      "நீங்கள் பேசும் மொழியைத் தேர்ந்தெடுக்கவும்",

    ready: "பதிவு செய்ய தயாராக உள்ளது",
    recording: "பதிவு செய்யப்படுகிறது...",
    processing: "உங்கள் தயாரிப்பு புரிந்துகொள்ளப்படுகிறது...",

    startRecording: "பதிவை தொடங்கவும்",
    stopRecording: "பதிவை நிறுத்தவும்",
    processRecording: "தயாரிப்பு தகவலை உருவாக்கவும்",
    recordAgain: "மீண்டும் பதிவு செய்யவும்",

    tipTitle: "என்ன பேச வேண்டும்?",
    tip1:
      "தயாரிப்பு பெயர் மற்றும் நீங்கள் உருவாக்குவது பற்றி சொல்லுங்கள்.",
    tip2:
      "பொருள், நிறம், கைவினை மற்றும் பகுதியை சொல்லுங்கள்.",
    tip3:
      "தெரிந்தால் செலவு மற்றும் விற்பனை விலையை சொல்லுங்கள்.",

    transcript: "உருவாக்கப்பட்ட தயாரிப்பு தகவல்",
    name: "தயாரிப்பு பெயர்",
    category: "வகை",
    region: "பகுதி",
    description: "விளக்கம்",

    useProduct:
      "இந்த தகவலை Add Product-ல் பயன்படுத்தவும்",
    addProduct: "Add Product செல்லவும்",

    noRecording:
      "முதலில் தயாரிப்பு விளக்கத்தை பதிவு செய்யவும்.",
    microphoneError:
      "மைக்ரோஃபோன் அணுகல் இல்லை. அனுமதி அளித்து மீண்டும் முயற்சிக்கவும்.",
    processingError:
      "குரல் உள்ளீட்டை செயலாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    browserError:
      "உங்கள் உலாவி ஆடியோ பதிவை ஆதரிக்கவில்லை.",

    resultTitle:
      "உங்கள் தயாரிப்பு தகவல் தயாராக உள்ளது",
    languageUsed: "தேர்ந்தெடுக்கப்பட்ட மொழி",
    emptyResult:
      "தயாரிப்பு தகவல் உருவாக்கப்படவில்லை.",
  },

  te: {
    eyebrow: "వాయిస్ ఇన్‌పుట్",
    title: "మాట్లాడి మీ ఉత్పత్తిని వివరించండి",
    description:
      "మీ స్వంత భాషలో సహజంగా మాట్లాడండి. KarigarConnect మీ మాటలను ఉత్పత్తి సమాచారంగా మార్చుతుంది.",

    language: "వాయిస్ భాష",
    chooseLanguage:
      "మీరు మాట్లాడే భాషను ఎంచుకోండి",

    ready: "రికార్డ్ చేయడానికి సిద్ధంగా ఉంది",
    recording: "రికార్డింగ్ జరుగుతోంది...",
    processing:
      "మీ ఉత్పత్తిని అర్థం చేసుకుంటోంది...",

    startRecording: "రికార్డింగ్ ప్రారంభించండి",
    stopRecording: "రికార్డింగ్ ఆపండి",
    processRecording:
      "ఉత్పత్తి సమాచారాన్ని సృష్టించండి",
    recordAgain: "మళ్లీ రికార్డ్ చేయండి",

    tipTitle: "ఏం చెప్పాలి?",
    tip1:
      "ఉత్పత్తి పేరు మరియు మీరు ఏమి తయారు చేస్తారో చెప్పండి.",
    tip2:
      "మెటీరియల్, రంగు, కళాకౌశలం మరియు ప్రాంతం చెప్పండి.",
    tip3:
      "తెలిస్తే ఖర్చు మరియు అమ్మకపు ధర చెప్పండి.",

    transcript: "సృష్టించిన ఉత్పత్తి సమాచారం",
    name: "ఉత్పత్తి పేరు",
    category: "వర్గం",
    region: "ప్రాంతం",
    description: "వివరణ",

    useProduct:
      "ఈ సమాచారాన్ని Add Product‌లో ఉపయోగించండి",
    addProduct:
      "Add Product‌కి కొనసాగండి",

    noRecording:
      "ముందుగా ఉత్పత్తి వివరణను రికార్డ్ చేయండి.",
    microphoneError:
      "మైక్రోఫోన్ యాక్సెస్ లేదు. అనుమతి ఇచ్చి మళ్లీ ప్రయత్నించండి.",
    processingError:
      "వాయిస్ ఇన్‌పుట్‌ను ప్రాసెస్ చేయలేకపోయాం. మళ్లీ ప్రయత్నించండి.",
    browserError:
      "మీ బ్రౌజర్ ఆడియో రికార్డింగ్‌ను సపోర్ట్ చేయదు.",

    resultTitle:
      "మీ ఉత్పత్తి సమాచారం సిద్ధంగా ఉంది",
    languageUsed: "ఎంచుకున్న భాష",
    emptyResult:
      "ఉత్పత్తి సమాచారం రూపొందించబడలేదు.",
  },

  mr: {
    eyebrow: "व्हॉइस इनपुट",
    title: "बोलून तुमच्या उत्पादनाचे वर्णन करा",
    description:
      "तुमच्या भाषेत नैसर्गिकपणे बोला. KarigarConnect तुमच्या बोलण्याचे उत्पादनाच्या माहितीमध्ये रूपांतर करेल.",

    language: "व्हॉइस भाषा",
    chooseLanguage:
      "तुम्ही ज्या भाषेत बोलणार आहात ती निवडा",

    ready: "रेकॉर्ड करण्यासाठी तयार",
    recording: "रेकॉर्ड होत आहे...",
    processing:
      "तुमचे उत्पादन समजून घेतले जात आहे...",

    startRecording: "रेकॉर्डिंग सुरू करा",
    stopRecording: "रेकॉर्डिंग थांबवा",
    processRecording:
      "उत्पादनाची माहिती तयार करा",
    recordAgain: "पुन्हा रेकॉर्ड करा",

    tipTitle: "काय बोलावे?",
    tip1:
      "उत्पादनाचे नाव आणि तुम्ही काय बनवता ते सांगा.",
    tip2:
      "साहित्य, रंग, कौशल्य आणि प्रदेश सांगा.",
    tip3:
      "माहित असल्यास खर्च आणि विक्री किंमत सांगा.",

    transcript: "तयार उत्पादन माहिती",
    name: "उत्पादनाचे नाव",
    category: "श्रेणी",
    region: "प्रदेश",
    description: "वर्णन",

    useProduct:
      "ही माहिती Add Product मध्ये वापरा",
    addProduct:
      "Add Product वर जा",

    noRecording:
      "प्रथम उत्पादनाचे वर्णन रेकॉर्ड करा.",
    microphoneError:
      "मायक्रोफोन उपलब्ध नाही. परवानगी द्या आणि पुन्हा प्रयत्न करा.",
    processingError:
      "व्हॉइस इनपुट प्रक्रिया करता आले नाही. पुन्हा प्रयत्न करा.",
    browserError:
      "तुमचा ब्राउझर ऑडिओ रेकॉर्डिंगला सपोर्ट करत नाही.",

    resultTitle:
      "तुमची उत्पादन माहिती तयार आहे",
    languageUsed: "निवडलेली भाषा",
    emptyResult:
      "उत्पादनाची माहिती तयार झाली नाही.",
  },

  gu: {
    eyebrow: "વૉઇસ ઇનપુટ",
    title: "બોલીને તમારા પ્રોડક્ટનું વર્ણન કરો",
    description:
      "તમારી ભાષામાં સ્વાભાવિક રીતે બોલો. KarigarConnect તમારી વાતને પ્રોડક્ટ માહિતીમાં ફેરવશે.",

    language: "વૉઇસ ભાષા",
    chooseLanguage:
      "તમે જે ભાષામાં બોલશો તે પસંદ કરો",

    ready: "રેકોર્ડ કરવા માટે તૈયાર",
    recording: "રેકોર્ડ થઈ રહ્યું છે...",
    processing:
      "તમારા પ્રોડક્ટને સમજવામાં આવી રહ્યું છે...",

    startRecording: "રેકોર્ડિંગ શરૂ કરો",
    stopRecording: "રેકોર્ડિંગ રોકો",
    processRecording:
      "પ્રોડક્ટ માહિતી બનાવો",
    recordAgain: "ફરી રેકોર્ડ કરો",

    tipTitle: "શું બોલવું?",
    tip1:
      "પ્રોડક્ટનું નામ અને તમે શું બનાવો છો તે કહો.",
    tip2:
      "સામગ્રી, રંગ, કારીગરી અને વિસ્તાર કહો.",
    tip3:
      "ખબર હોય તો ખર્ચ અને વેચાણ કિંમત કહો.",

    transcript: "બનાવેલી પ્રોડક્ટ માહિતી",
    name: "પ્રોડક્ટનું નામ",
    category: "કેટેગરી",
    region: "વિસ્તાર",
    description: "વર્ણન",

    useProduct:
      "આ માહિતી Add Productમાં વાપરો",
    addProduct:
      "Add Product પર ચાલુ રાખો",

    noRecording:
      "પહેલા પ્રોડક્ટનું વર્ણન રેકોર્ડ કરો.",
    microphoneError:
      "માઇક્રોફોન ઉપલબ્ધ નથી. પરવાનગી આપીને ફરી પ્રયાસ કરો.",
    processingError:
      "વૉઇસ ઇનપુટ પ્રોસેસ થઈ શક્યું નથી. ફરી પ્રયાસ કરો.",
    browserError:
      "તમારું બ્રાઉઝર ઑડિયો રેકોર્ડિંગને સપોર્ટ કરતું નથી.",

    resultTitle:
      "તમારી પ્રોડક્ટ માહિતી તૈયાર છે",
    languageUsed: "પસંદ કરેલી ભાષા",
    emptyResult:
      "કોઈ પ્રોડક્ટ માહિતી બનાવાઈ નથી.",
  },

  kn: {
    eyebrow: "ಧ್ವನಿ ಇನ್‌ಪುಟ್",
    title: "ಮಾತನಾಡಿ ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ವಿವರಿಸಿ",
    description:
      "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸಹಜವಾಗಿ ಮಾತನಾಡಿ. KarigarConnect ನಿಮ್ಮ ಮಾತುಗಳನ್ನು ಉತ್ಪನ್ನ ಮಾಹಿತಿಯಾಗಿ ಪರಿವರ್ತಿಸುತ್ತದೆ.",

    language: "ಧ್ವನಿ ಭಾಷೆ",
    chooseLanguage:
      "ನೀವು ಮಾತನಾಡುವ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",

    ready: "ರೆಕಾರ್ಡ್ ಮಾಡಲು ಸಿದ್ಧ",
    recording: "ರೆಕಾರ್ಡ್ ಆಗುತ್ತಿದೆ...",
    processing:
      "ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ...",

    startRecording: "ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ",
    stopRecording: "ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ",
    processRecording:
      "ಉತ್ಪನ್ನ ಮಾಹಿತಿಯನ್ನು ರಚಿಸಿ",
    recordAgain: "ಮತ್ತೆ ರೆಕಾರ್ಡ್ ಮಾಡಿ",

    tipTitle: "ಏನು ಹೇಳಬೇಕು?",
    tip1:
      "ಉತ್ಪನ್ನದ ಹೆಸರು ಮತ್ತು ನೀವು ಏನು ತಯಾರಿಸುತ್ತೀರಿ ಎಂದು ಹೇಳಿ.",
    tip2:
      "ವಸ್ತು, ಬಣ್ಣ, ಕರಕುಶಲ ಮತ್ತು ಪ್ರದೇಶವನ್ನು ಹೇಳಿ.",
    tip3:
      "ತಿಳಿದಿದ್ದರೆ ವೆಚ್ಚ ಮತ್ತು ಮಾರಾಟದ ಬೆಲೆಯನ್ನು ಹೇಳಿ.",

    transcript: "ರಚಿಸಲಾದ ಉತ್ಪನ್ನ ಮಾಹಿತಿ",
    name: "ಉತ್ಪನ್ನದ ಹೆಸರು",
    category: "ವರ್ಗ",
    region: "ಪ್ರದೇಶ",
    description: "ವಿವರಣೆ",

    useProduct:
      "ಈ ಮಾಹಿತಿಯನ್ನು Add Product ನಲ್ಲಿ ಬಳಸಿ",
    addProduct:
      "Add Product ಗೆ ಮುಂದುವರಿಯಿರಿ",

    noRecording:
      "ಮೊದಲು ಉತ್ಪನ್ನದ ವಿವರಣೆಯನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ.",
    microphoneError:
      "ಮೈಕ್ರೋಫೋನ್ ಪ್ರವೇಶ ಲಭ್ಯವಿಲ್ಲ. ಅನುಮತಿ ನೀಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    processingError:
      "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    browserError:
      "ನಿಮ್ಮ ಬ್ರೌಸರ್ ಆಡಿಯೋ ರೆಕಾರ್ಡಿಂಗ್ ಅನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ.",

    resultTitle:
      "ನಿಮ್ಮ ಉತ್ಪನ್ನ ಮಾಹಿತಿ ಸಿದ್ಧವಾಗಿದೆ",
    languageUsed: "ಆಯ್ಕೆ ಮಾಡಿದ ಭಾಷೆ",
    emptyResult:
      "ಯಾವುದೇ ಉತ್ಪನ್ನ ಮಾಹಿತಿ ರಚಿಸಲಾಗಿಲ್ಲ.",
  },

  ml: {
    eyebrow: "വോയ്സ് ഇൻപുട്ട്",
    title: "സംസാരിച്ച് നിങ്ങളുടെ ഉൽപ്പന്നം വിവരിക്കൂ",
    description:
      "നിങ്ങളുടെ ഭാഷയിൽ സ്വാഭാവികമായി സംസാരിക്കൂ. KarigarConnect നിങ്ങളുടെ വാക്കുകളെ ഉൽപ്പന്ന വിവരങ്ങളാക്കി മാറ്റും.",

    language: "വോയ്സ് ഭാഷ",
    chooseLanguage:
      "നിങ്ങൾ സംസാരിക്കുന്ന ഭാഷ തിരഞ്ഞെടുക്കുക",

    ready: "റെക്കോർഡ് ചെയ്യാൻ തയ്യാറാണ്",
    recording: "റെക്കോർഡ് ചെയ്യുന്നു...",
    processing:
      "നിങ്ങളുടെ ഉൽപ്പന്നം മനസ്സിലാക്കുന്നു...",

    startRecording: "റെക്കോർഡിംഗ് ആരംഭിക്കുക",
    stopRecording: "റെക്കോർഡിംഗ് നിർത്തുക",
    processRecording:
      "ഉൽപ്പന്ന വിവരം സൃഷ്ടിക്കുക",
    recordAgain: "വീണ്ടും റെക്കോർഡ് ചെയ്യുക",

    tipTitle: "എന്താണ് പറയേണ്ടത്?",
    tip1:
      "ഉൽപ്പന്നത്തിന്റെ പേര്, നിങ്ങൾ എന്താണ് നിർമ്മിക്കുന്നത് എന്നിവ പറയുക.",
    tip2:
      "മെറ്റീരിയൽ, നിറം, കരകൗശലം, പ്രദേശം എന്നിവ പറയുക.",
    tip3:
      "അറിയാമെങ്കിൽ ചെലവും വിൽപ്പന വിലയും പറയുക.",

    transcript: "സൃഷ്ടിച്ച ഉൽപ്പന്ന വിവരം",
    name: "ഉൽപ്പന്നത്തിന്റെ പേര്",
    category: "വിഭാഗം",
    region: "പ്രദേശം",
    description: "വിവരണം",

    useProduct:
      "ഈ വിവരം Add Product-ൽ ഉപയോഗിക്കുക",
    addProduct:
      "Add Product-ലേക്ക് തുടരുക",

    noRecording:
      "ആദ്യം ഉൽപ്പന്ന വിവരണം റെക്കോർഡ് ചെയ്യുക.",
    microphoneError:
      "മൈക്രോഫോൺ ആക്സസ് ലഭ്യമല്ല. അനുമതി നൽകി വീണ്ടും ശ്രമിക്കുക.",
    processingError:
      "വോയ്സ് ഇൻപുട്ട് പ്രോസസ് ചെയ്യാനായില്ല. വീണ്ടും ശ്രമിക്കുക.",
    browserError:
      "നിങ്ങളുടെ ബ്രൗസർ ഓഡിയോ റെക്കോർഡിംഗ് പിന്തുണയ്ക്കുന്നില്ല.",

    resultTitle:
      "നിങ്ങളുടെ ഉൽപ്പന്ന വിവരം തയ്യാറാണ്",
    languageUsed: "തിരഞ്ഞെടുത്ത ഭാഷ",
    emptyResult:
      "ഉൽപ്പന്ന വിവരം സൃഷ്ടിച്ചിട്ടില്ല.",
  },

  pa: {
    eyebrow: "ਵੌਇਸ ਇਨਪੁੱਟ",
    title: "ਬੋਲ ਕੇ ਆਪਣੇ ਉਤਪਾਦ ਦਾ ਵੇਰਵਾ ਦਿਓ",
    description:
      "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਕੁਦਰਤੀ ਤਰੀਕੇ ਨਾਲ ਬੋਲੋ। KarigarConnect ਤੁਹਾਡੀ ਗੱਲ ਨੂੰ ਉਤਪਾਦ ਜਾਣਕਾਰੀ ਵਿੱਚ ਬਦਲੇਗਾ।",

    language: "ਵੌਇਸ ਭਾਸ਼ਾ",
    chooseLanguage:
      "ਉਹ ਭਾਸ਼ਾ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਤੁਸੀਂ ਬੋਲੋਗੇ",

    ready: "ਰਿਕਾਰਡ ਕਰਨ ਲਈ ਤਿਆਰ",
    recording: "ਰਿਕਾਰਡ ਹੋ ਰਿਹਾ ਹੈ...",
    processing:
      "ਤੁਹਾਡੇ ਉਤਪਾਦ ਨੂੰ ਸਮਝਿਆ ਜਾ ਰਿਹਾ ਹੈ...",

    startRecording: "ਰਿਕਾਰਡਿੰਗ ਸ਼ੁਰੂ ਕਰੋ",
    stopRecording: "ਰਿਕਾਰਡਿੰਗ ਰੋਕੋ",
    processRecording:
      "ਉਤਪਾਦ ਜਾਣਕਾਰੀ ਬਣਾਓ",
    recordAgain: "ਦੁਬਾਰਾ ਰਿਕਾਰਡ ਕਰੋ",

    tipTitle: "ਕੀ ਬੋਲਣਾ ਹੈ?",
    tip1:
      "ਉਤਪਾਦ ਦਾ ਨਾਮ ਅਤੇ ਤੁਸੀਂ ਕੀ ਬਣਾਉਂਦੇ ਹੋ ਦੱਸੋ।",
    tip2:
      "ਸਮੱਗਰੀ, ਰੰਗ, ਕਾਰੀਗਰੀ ਅਤੇ ਖੇਤਰ ਦੱਸੋ।",
    tip3:
      "ਜੇ ਪਤਾ ਹੋਵੇ ਤਾਂ ਲਾਗਤ ਅਤੇ ਵਿਕਰੀ ਕੀਮਤ ਦੱਸੋ।",

    transcript: "ਬਣਾਈ ਗਈ ਉਤਪਾਦ ਜਾਣਕਾਰੀ",
    name: "ਉਤਪਾਦ ਦਾ ਨਾਮ",
    category: "ਸ਼੍ਰੇਣੀ",
    region: "ਖੇਤਰ",
    description: "ਵੇਰਵਾ",

    useProduct:
      "ਇਹ ਜਾਣਕਾਰੀ Add Product ਵਿੱਚ ਵਰਤੋ",
    addProduct:
      "Add Product ਤੇ ਜਾਰੀ ਰੱਖੋ",

    noRecording:
      "ਪਹਿਲਾਂ ਉਤਪਾਦ ਦਾ ਵੇਰਵਾ ਰਿਕਾਰਡ ਕਰੋ।",
    microphoneError:
      "ਮਾਈਕ੍ਰੋਫੋਨ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਇਜਾਜ਼ਤ ਦੇ ਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    processingError:
      "ਵੌਇਸ ਇਨਪੁੱਟ ਪ੍ਰੋਸੈਸ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    browserError:
      "ਤੁਹਾਡਾ ਬ੍ਰਾਊਜ਼ਰ ਆਡੀਓ ਰਿਕਾਰਡਿੰਗ ਨੂੰ ਸਪੋਰਟ ਨਹੀਂ ਕਰਦਾ।",

    resultTitle:
      "ਤੁਹਾਡੀ ਉਤਪਾਦ ਜਾਣਕਾਰੀ ਤਿਆਰ ਹੈ",
    languageUsed: "ਚੁਣੀ ਹੋਈ ਭਾਸ਼ਾ",
    emptyResult:
      "ਕੋਈ ਉਤਪਾਦ ਜਾਣਕਾਰੀ ਨਹੀਂ ਬਣੀ।",
  },
};

function VoiceInput({
  onNavigate,
}) {
  const { language } =
    useLanguage();

  const ui =
    VOICE_TRANSLATIONS[language] ||
    VOICE_TRANSLATIONS.en;

  const [selectedLanguage, setSelectedLanguage] =
    useState(
      VOICE_LANGUAGES.some(
        (item) => item.code === language
      )
        ? language
        : "en"
    );

  const [status, setStatus] =
    useState("idle");

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState(null);

  const [audioURL, setAudioURL] =
    useState("");

  const mediaRecorderRef =
    useRef(null);

  const mediaStreamRef =
    useRef(null);

  const audioChunksRef =
    useRef([]);

  /*
  =====================================================
  KEEP VOICE LANGUAGE IN SYNC WITH GLOBAL LANGUAGE
  =====================================================
  */

  useEffect(() => {
    if (
      VOICE_LANGUAGES.some(
        (item) => item.code === language
      )
    ) {
      setSelectedLanguage(
        language
      );
    }
  }, [language]);

  /*
  =====================================================
  CLEANUP
  =====================================================
  */

  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
          "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }

      if (
        mediaStreamRef.current
      ) {
        mediaStreamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      }

      if (audioURL) {
        URL.revokeObjectURL(
          audioURL
        );
      }
    };
  }, [audioURL]);

  /*
  =====================================================
  START RECORDING
  =====================================================
  */

  const startRecording =
    async () => {
      try {
        setError("");
        setResult(null);

        if (
          typeof MediaRecorder ===
          "undefined"
        ) {
          setError(
            ui.browserError
          );
          return;
        }

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
            }
          );

        mediaStreamRef.current =
          stream;

        audioChunksRef.current =
          [];

        const mimeTypes = [
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/ogg;codecs=opus",
        ];

        const supportedMimeType =
          mimeTypes.find(
            (type) =>
              MediaRecorder.isTypeSupported(
                type
              )
          );

        const recorder =
          supportedMimeType
            ? new MediaRecorder(
                stream,
                {
                  mimeType:
                    supportedMimeType,
                }
              )
            : new MediaRecorder(
                stream
              );

        mediaRecorderRef.current =
          recorder;

        recorder.ondataavailable = (
          event
        ) => {
          if (
            event.data &&
            event.data.size > 0
          ) {
            audioChunksRef.current.push(
              event.data
            );
          }
        };

        recorder.onstop = () => {
          const audioBlob =
            new Blob(
              audioChunksRef.current,
              {
                type:
                  recorder.mimeType ||
                  "audio/webm",
              }
            );

          if (audioURL) {
            URL.revokeObjectURL(
              audioURL
            );
          }

          const url =
            URL.createObjectURL(
              audioBlob
            );

          setAudioURL(url);

          stream
            .getTracks()
            .forEach((track) =>
              track.stop()
            );

          mediaStreamRef.current =
            null;

          setStatus("recorded");
        };

        recorder.onerror = () => {
          stream
            .getTracks()
            .forEach((track) =>
              track.stop()
            );

          setStatus("idle");
          setError(
            ui.microphoneError
          );
        };

        recorder.start();

        setStatus("recording");
      } catch (err) {
        console.error(
          "Microphone error:",
          err
        );

        setStatus("idle");
        setError(
          ui.microphoneError
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
      const recorder =
        mediaRecorderRef.current;

      if (
        recorder &&
        recorder.state !==
          "inactive"
      ) {
        recorder.stop();
      }
    };

  /*
  =====================================================
  SEND AUDIO TO BACKEND
  =====================================================
  */

  const processRecording =
    async () => {
      if (
        !audioChunksRef.current
          .length
      ) {
        setError(
          ui.noRecording
        );
        return;
      }

      try {
        setStatus("processing");
        setError("");

        const voiceLanguage =
          VOICE_LANGUAGES.find(
            (item) =>
              item.code ===
              selectedLanguage
          );

        const audioBlob =
          new Blob(
            audioChunksRef.current,
            {
              type:
                mediaRecorderRef
                  .current
                  ?.mimeType ||
                "audio/webm",
            }
          );

        const formData =
          new FormData();

        formData.append(
          "audio",
          audioBlob,
          "product-voice.webm"
        );

        formData.append(
          "language",
          selectedLanguage
        );

        const response =
          await fetch(
            `${BACKEND_URL}/api/voice/product`,
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Voice processing failed"
          );
        }

        const voiceResult =
          data.product ||
          data.result ||
          data;

        setResult({
          name:
            voiceResult.name ||
            "",
          category:
            voiceResult.category ||
            "",
          region:
            voiceResult.region ||
            "",
          descriptionEn:
            voiceResult.descriptionEn ||
            "",
          descriptionHi:
            voiceResult.descriptionHi ||
            "",
          descriptionSelected:
            voiceResult.descriptionSelected ||
            "",
          language:
            voiceResult.language ||
            selectedLanguage,
          languageName:
            voiceResult.languageName ||
            voiceLanguage?.nativeLabel ||
            selectedLanguage,
        });

        setStatus("success");
      } catch (err) {
        console.error(
          "Voice processing error:",
          err
        );

        setStatus("recorded");
        setError(
          ui.processingError
        );
      }
    };

  /*
  =====================================================
  USE RESULT IN ADD PRODUCT
  =====================================================
  */

  const continueToAddProduct =
    () => {
      if (!result) {
        return;
      }

      sessionStorage.setItem(
        "karigar-voice-product",
        JSON.stringify(
          result
        )
      );

      onNavigate(
        "add-product"
      );
    };

  /*
  =====================================================
  CURRENT LANGUAGE DETAILS
  =====================================================
  */

  const selectedLanguageInfo =
    VOICE_LANGUAGES.find(
      (item) =>
        item.code ===
        selectedLanguage
    );

  return (
    <div className="voice-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="voice-hero">

        <div className="voice-hero-content">

          <span className="voice-eyebrow">
            <span className="voice-eyebrow-dot"></span>
            {ui.eyebrow}
          </span>

          <h1>
            {ui.title}
          </h1>

          <p>
            {ui.description}
          </p>

          <div className="voice-language-box">

            <label
              htmlFor="voiceLanguage"
            >
              {ui.language}
            </label>

            <select
              id="voiceLanguage"
              value={
                selectedLanguage
              }
              onChange={(
                event
              ) =>
                setSelectedLanguage(
                  event.target.value
                )
              }
              disabled={
                status ===
                "recording" ||
                status ===
                "processing"
              }
            >
              {VOICE_LANGUAGES.map(
                (item) => (
                  <option
                    key={
                      item.code
                    }
                    value={
                      item.code
                    }
                  >
                    {item.nativeLabel} —{" "}
                    {item.label}
                  </option>
                )
              )}
            </select>

            <small>
              {
                ui.chooseLanguage
              }
            </small>

          </div>

        </div>

        {/* =================================================
            MICROPHONE VISUAL
        ================================================= */}

        <div className="voice-visual">

          <div
            className={`voice-ring voice-ring-one ${
              status ===
              "recording"
                ? "active"
                : ""
            }`}
          />

          <div
            className={`voice-ring voice-ring-two ${
              status ===
              "recording"
                ? "active"
                : ""
            }`}
          />

          <div
            className={`voice-mic-circle ${
              status ===
              "recording"
                ? "recording"
                : ""
            }`}
          >
            🎙️
          </div>

          <div className="voice-wave wave-one"></div>
          <div className="voice-wave wave-two"></div>
          <div className="voice-wave wave-three"></div>

        </div>

      </section>

      {/* =================================================
          RECORDING CARD
      ================================================= */}

      <section className="voice-record-section">

        <div className="voice-record-card">

          <div className="voice-status-row">

            <span
              className={`voice-status-dot ${
                status ===
                "recording"
                  ? "recording"
                  : ""
              }`}
            ></span>

            <span>

              {status ===
              "recording"
                ? ui.recording
                : status ===
                  "processing"
                ? ui.processing
                : status ===
                  "success"
                ? ui.resultTitle
                : status ===
                  "recorded"
                ? ui.ready
                : ui.ready}

            </span>

          </div>

          <div className="voice-record-main">

            <button
              type="button"
              className={`voice-record-button ${
                status ===
                "recording"
                  ? "stop"
                  : ""
              }`}
              onClick={
                status ===
                "recording"
                  ? stopRecording
                  : startRecording
              }
              disabled={
                status ===
                "processing"
              }
            >
              <span>
                {status ===
                "recording"
                  ? "■"
                  : "🎙️"}
              </span>

              {status ===
              "recording"
                ? ui.stopRecording
                : ui.startRecording}

            </button>

            {status ===
              "recorded" ||
            status ===
              "success" ? (
              <button
                type="button"
                className="voice-process-button"
                onClick={
                  processRecording
                }
                disabled={
                  status ===
                  "processing"
                }
              >
                ✨{" "}
                {ui.processRecording}
              </button>
            ) : null}

            {status ===
              "processing" && (
              <div className="voice-processing">
                <div className="voice-spinner"></div>

                <span>
                  {ui.processing}
                </span>
              </div>
            )}

          </div>

          {audioURL && (
            <div className="voice-audio-preview">

              <audio
                controls
                src={audioURL}
              />

              <button
                type="button"
                onClick={() => {
                  setAudioURL("");
                  setResult(null);
                  setError("");
                  setStatus("idle");
                  audioChunksRef.current =
                    [];
                }}
              >
                ↻{" "}
                {ui.recordAgain}
              </button>

            </div>
          )}

          {error && (
            <div className="voice-error">
              <span>
                ⚠️
              </span>

              <p>
                {error}
              </p>
            </div>
          )}

        </div>

      </section>

      {/* =================================================
          WHAT TO SAY
      ================================================= */}

      <section className="voice-tips-section">

        <div className="voice-section-heading">

          <span className="voice-section-label">
            {selectedLanguageInfo?.nativeLabel ||
              "Voice"}
          </span>

          <h2>
            {ui.tipTitle}
          </h2>

        </div>

        <div className="voice-tips-grid">

          <div className="voice-tip-card">

            <span>
              01
            </span>

            <p>
              {ui.tip1}
            </p>

          </div>

          <div className="voice-tip-card">

            <span>
              02
            </span>

            <p>
              {ui.tip2}
            </p>

          </div>

          <div className="voice-tip-card">

            <span>
              03
            </span>

            <p>
              {ui.tip3}
            </p>

          </div>

        </div>

      </section>

      {/* =================================================
          RESULT
      ================================================= */}

      {result && (
        <section className="voice-result-section">

          <div className="voice-section-heading">

            <span className="voice-section-label">
              {ui.languageUsed}:{" "}
              {result.languageName}
            </span>

            <h2>
              {ui.resultTitle}
            </h2>

          </div>

          <div className="voice-result-card">

            <div className="voice-result-grid">

              <div className="voice-result-field">

                <span>
                  {ui.name}
                </span>

                <strong>
                  {result.name ||
                    "—"}
                </strong>

              </div>

              <div className="voice-result-field">

                <span>
                  {ui.category}
                </span>

                <strong>
                  {result.category ||
                    "—"}
                </strong>

              </div>

              <div className="voice-result-field">

                <span>
                  {ui.region}
                </span>

                <strong>
                  {result.region ||
                    "—"}
                </strong>

              </div>

            </div>

            <div className="voice-description-box">

              <span>
                {ui.description}
              </span>

              <p>
                {result.descriptionSelected ||
                  result.descriptionEn ||
                  result.descriptionHi ||
                  ui.emptyResult}
              </p>

            </div>

            <button
              type="button"
              className="voice-add-product-btn"
              onClick={
                continueToAddProduct
              }
            >
              ✨{" "}
              {ui.addProduct}
            </button>

          </div>

        </section>
      )}

    </div>
  );
}

export default VoiceInput;
