import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";
import "./Profile.css";

const API = import.meta.env.VITE_API_URL;

const PROFILE_TRANSLATIONS = {
  en: {
    label: "ARTISAN PROFILE",
    completeTitle: "Complete your artisan profile",
    completeDescription: "Add your workshop and craft credentials to build customer trust.",
    edit: "Edit profile",
    cancel: "Cancel",
    editTitle: "Edit artisan profile",
    name: "Name",
    business: "Business name",
    craft: "Primary craft",
    experience: "Years of experience",
    certificates: "Certificates",
    certificatesPlaceholder: "GI tag, training certificate…",
    credentials: "Credentials / awards",
    credentialsPlaceholder: "Awards, artisan ID, memberships…",
    about: "About your craft",
    save: "Save profile",
    saving: "Saving…",
    saved: "✓ Profile saved successfully.",
    artisanDetails: "Artisan details",
    businessCredentials: "Business credentials",
    years: "years",
    notAdded: "Not added — edit profile",
    loading: "Loading profile…",
    loadError: "Could not load your profile.",
    saveError: "Could not save profile. Please try again.",
    required: "Name is required.",
  },
  hi: {
    label: "कारीगर प्रोफ़ाइल",
    completeTitle: "अपनी कारीगर प्रोफ़ाइल पूरी करें",
    completeDescription: "ग्राहकों का भरोसा बढ़ाने के लिए अपनी कार्यशाला और कारीगरी की जानकारी जोड़ें।",
    edit: "प्रोफ़ाइल संपादित करें",
    cancel: "रद्द करें",
    editTitle: "कारीगर प्रोफ़ाइल संपादित करें",
    name: "नाम",
    business: "व्यवसाय का नाम",
    craft: "मुख्य कारीगरी",
    experience: "अनुभव के वर्ष",
    certificates: "प्रमाणपत्र",
    certificatesPlaceholder: "GI टैग, प्रशिक्षण प्रमाणपत्र…",
    credentials: "उपलब्धियाँ / पुरस्कार",
    credentialsPlaceholder: "पुरस्कार, कारीगर ID, सदस्यताएँ…",
    about: "अपनी कारीगरी के बारे में",
    save: "प्रोफ़ाइल सेव करें",
    saving: "सेव हो रहा है…",
    saved: "✓ प्रोफ़ाइल सफलतापूर्वक सेव हो गई।",
    artisanDetails: "कारीगर की जानकारी",
    businessCredentials: "व्यवसाय की जानकारी",
    years: "वर्ष",
    notAdded: "जोड़ा नहीं गया — प्रोफ़ाइल संपादित करें",
    loading: "प्रोफ़ाइल लोड हो रही है…",
    loadError: "प्रोफ़ाइल लोड नहीं हो सकी।",
    saveError: "प्रोफ़ाइल सेव नहीं हो सकी। कृपया दोबारा प्रयास करें।",
    required: "नाम आवश्यक है।",
  },
  bn: {
    label: "কারিগর প্রোফাইল", completeTitle: "আপনার কারিগর প্রোফাইল সম্পূর্ণ করুন",
    completeDescription: "গ্রাহকের আস্থা বাড়াতে আপনার কর্মশালা ও কারুশিল্পের তথ্য যোগ করুন।",
    edit: "প্রোফাইল সম্পাদনা", cancel: "বাতিল", editTitle: "কারিগর প্রোফাইল সম্পাদনা",
    name: "নাম", business: "ব্যবসার নাম", craft: "প্রধান কারুশিল্প", experience: "অভিজ্ঞতার বছর",
    certificates: "সার্টিফিকেট", certificatesPlaceholder: "GI ট্যাগ, প্রশিক্ষণ সার্টিফিকেট…",
    credentials: "যোগ্যতা / পুরস্কার", credentialsPlaceholder: "পুরস্কার, কারিগর ID, সদস্যপদ…",
    about: "আপনার কারুশিল্প সম্পর্কে", save: "প্রোফাইল সংরক্ষণ করুন", saving: "সংরক্ষণ হচ্ছে…",
    saved: "✓ প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে।", artisanDetails: "কারিগরের তথ্য",
    businessCredentials: "ব্যবসার তথ্য", years: "বছর", notAdded: "যোগ করা হয়নি — প্রোফাইল সম্পাদনা করুন",
    loading: "প্রোফাইল লোড হচ্ছে…", loadError: "প্রোফাইল লোড করা যায়নি।",
    saveError: "প্রোফাইল সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।", required: "নাম প্রয়োজন।",
  },
  mr: {
    label: "कारागीर प्रोफाइल", completeTitle: "तुमची कारागीर प्रोफाइल पूर्ण करा",
    completeDescription: "ग्राहकांचा विश्वास वाढवण्यासाठी तुमच्या कार्यशाळेची आणि कलेची माहिती जोडा.",
    edit: "प्रोफाइल संपादित करा", cancel: "रद्द करा", editTitle: "कारागीर प्रोफाइल संपादित करा",
    name: "नाव", business: "व्यवसायाचे नाव", craft: "मुख्य कला", experience: "अनुभवाची वर्षे",
    certificates: "प्रमाणपत्रे", certificatesPlaceholder: "GI टॅग, प्रशिक्षण प्रमाणपत्र…",
    credentials: "उपलब्धी / पुरस्कार", credentialsPlaceholder: "पुरस्कार, कारागीर ID, सदस्यत्व…",
    about: "तुमच्या कलेबद्दल", save: "प्रोफाइल जतन करा", saving: "जतन होत आहे…",
    saved: "✓ प्रोफाइल यशस्वीरित्या जतन झाली.", artisanDetails: "कारागीर माहिती",
    businessCredentials: "व्यवसायाची माहिती", years: "वर्षे", notAdded: "जोडलेले नाही — प्रोफाइल संपादित करा",
    loading: "प्रोफाइल लोड होत आहे…", loadError: "प्रोफाइल लोड करता आली नाही.",
    saveError: "प्रोफाइल जतन करता आली नाही. पुन्हा प्रयत्न करा.", required: "नाव आवश्यक आहे.",
  },
  gu: {
    label: "કારીગર પ્રોફાઇલ", completeTitle: "તમારી કારીગર પ્રોફાઇલ પૂર્ણ કરો",
    completeDescription: "ગ્રાહકોનો વિશ્વાસ વધારવા માટે તમારી વર્કશોપ અને કારીગરીની માહિતી ઉમેરો.",
    edit: "પ્રોફાઇલ સંપાદિત કરો", cancel: "રદ કરો", editTitle: "કારીગર પ્રોફાઇલ સંપાદિત કરો",
    name: "નામ", business: "વ્યવસાયનું નામ", craft: "મુખ્ય કારીગરી", experience: "અનુભવના વર્ષો",
    certificates: "પ્રમાણપત્રો", certificatesPlaceholder: "GI ટેગ, તાલીમ પ્રમાણપત્ર…",
    credentials: "લાયકાત / પુરસ્કારો", credentialsPlaceholder: "પુરસ્કારો, કારીગર ID, સભ્યપદ…",
    about: "તમારી કારીગરી વિશે", save: "પ્રોફાઇલ સાચવો", saving: "સાચવી રહ્યા છીએ…",
    saved: "✓ પ્રોફાઇલ સફળતાપૂર્વક સાચવાઈ.", artisanDetails: "કારીગરની માહિતી",
    businessCredentials: "વ્યવસાયની માહિતી", years: "વર્ષ", notAdded: "ઉમેર્યું નથી — પ્રોફાઇલ સંપાદિત કરો",
    loading: "પ્રોફાઇલ લોડ થઈ રહી છે…", loadError: "પ્રોફાઇલ લોડ થઈ શકી નથી.",
    saveError: "પ્રોફાઇલ સાચવી શકાઈ નથી. ફરી પ્રયાસ કરો.", required: "નામ જરૂરી છે.",
  },
  ta: {
    label: "கைவினைஞர் சுயவிவரம்", completeTitle: "உங்கள் கைவினைஞர் சுயவிவரத்தை முடிக்கவும்",
    completeDescription: "வாடிக்கையாளர் நம்பிக்கையை அதிகரிக்க உங்கள் பணிமனை மற்றும் கைவினைத் தகவல்களைச் சேர்க்கவும்.",
    edit: "சுயவிவரத்தைத் திருத்து", cancel: "ரத்து", editTitle: "கைவினைஞர் சுயவிவரத்தைத் திருத்து",
    name: "பெயர்", business: "வணிகப் பெயர்", craft: "முக்கிய கைவினை", experience: "அனுபவ ஆண்டுகள்",
    certificates: "சான்றிதழ்கள்", certificatesPlaceholder: "GI குறிச்சொல், பயிற்சி சான்றிதழ்…",
    credentials: "சாதனைகள் / விருதுகள்", credentialsPlaceholder: "விருதுகள், கைவினைஞர் ID, உறுப்பினர்கள்…",
    about: "உங்கள் கைவினை பற்றி", save: "சுயவிவரத்தைச் சேமி", saving: "சேமிக்கப்படுகிறது…",
    saved: "✓ சுயவிவரம் வெற்றிகரமாக சேமிக்கப்பட்டது.", artisanDetails: "கைவினைஞர் விவரங்கள்",
    businessCredentials: "வணிக விவரங்கள்", years: "ஆண்டுகள்", notAdded: "சேர்க்கப்படவில்லை — சுயவிவரத்தைத் திருத்தவும்",
    loading: "சுயவிவரம் ஏற்றப்படுகிறது…", loadError: "சுயவிவரத்தை ஏற்ற முடியவில்லை.",
    saveError: "சுயவிவரத்தைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.", required: "பெயர் தேவை.",
  },
  te: {
    label: "కళాకారుడి ప్రొఫైల్", completeTitle: "మీ కళాకారుడి ప్రొఫైల్‌ను పూర్తి చేయండి",
    completeDescription: "కస్టమర్ల నమ్మకాన్ని పెంచడానికి మీ వర్క్‌షాప్ మరియు కళా వివరాలను జోడించండి.",
    edit: "ప్రొఫైల్‌ను సవరించండి", cancel: "రద్దు", editTitle: "కళాకారుడి ప్రొఫైల్‌ను సవరించండి",
    name: "పేరు", business: "వ్యాపారం పేరు", craft: "ప్రధాన కళ", experience: "అనుభవ సంవత్సరాలు",
    certificates: "సర్టిఫికెట్లు", certificatesPlaceholder: "GI ట్యాగ్, శిక్షణ సర్టిఫికెట్…",
    credentials: "అవార్డులు / అర్హతలు", credentialsPlaceholder: "అవార్డులు, కళాకారుడి ID, సభ్యత్వాలు…",
    about: "మీ కళ గురించి", save: "ప్రొఫైల్ సేవ్ చేయండి", saving: "సేవ్ అవుతోంది…",
    saved: "✓ ప్రొఫైల్ విజయవంతంగా సేవ్ చేయబడింది.", artisanDetails: "కళాకారుడి వివరాలు",
    businessCredentials: "వ్యాపార వివరాలు", years: "సంవత్సరాలు", notAdded: "జోడించలేదు — ప్రొఫైల్‌ను సవరించండి",
    loading: "ప్రొఫైల్ లోడ్ అవుతోంది…", loadError: "ప్రొఫైల్ లోడ్ కాలేదు.",
    saveError: "ప్రొఫైల్ సేవ్ కాలేదు. మళ్లీ ప్రయత్నించండి.", required: "పేరు అవసరం.",
  },
  kn: {
    label: "ಕುಶಲಕರ್ಮಿ ಪ್ರೊಫೈಲ್", completeTitle: "ನಿಮ್ಮ ಕುಶಲಕರ್ಮಿ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ",
    completeDescription: "ಗ್ರಾಹಕರ ವಿಶ್ವಾಸ ಹೆಚ್ಚಿಸಲು ನಿಮ್ಮ ಕಾರ್ಯಾಗಾರ ಮತ್ತು ಕಲೆಗಳ ಮಾಹಿತಿಯನ್ನು ಸೇರಿಸಿ.",
    edit: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ", cancel: "ರದ್ದು", editTitle: "ಕುಶಲಕರ್ಮಿ ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
    name: "ಹೆಸರು", business: "ವ್ಯವಹಾರದ ಹೆಸರು", craft: "ಮುಖ್ಯ ಕಲೆ", experience: "ಅನುಭವದ ವರ್ಷಗಳು",
    certificates: "ಪ್ರಮಾಣಪತ್ರಗಳು", certificatesPlaceholder: "GI ಟ್ಯಾಗ್, ತರಬೇತಿ ಪ್ರಮಾಣಪತ್ರ…",
    credentials: "ಅರ್ಹತೆ / ಪ್ರಶಸ್ತಿಗಳು", credentialsPlaceholder: "ಪ್ರಶಸ್ತಿಗಳು, ಕುಶಲಕರ್ಮಿ ID, ಸದಸ್ಯತ್ವ…",
    about: "ನಿಮ್ಮ ಕಲೆ ಬಗ್ಗೆ", save: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ", saving: "ಉಳಿಸಲಾಗುತ್ತಿದೆ…",
    saved: "✓ ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ.", artisanDetails: "ಕುಶಲಕರ್ಮಿ ವಿವರಗಳು",
    businessCredentials: "ವ್ಯವಹಾರ ವಿವರಗಳು", years: "ವರ್ಷಗಳು", notAdded: "ಸೇರಿಸಲಾಗಿಲ್ಲ — ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
    loading: "ಪ್ರೊಫೈಲ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ…", loadError: "ಪ್ರೊಫೈಲ್ ಲೋಡ್ ಆಗಲಿಲ್ಲ.",
    saveError: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಲಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", required: "ಹೆಸರು ಅಗತ್ಯವಿದೆ.",
  },
  ml: {
    label: "കരകൗശല വിദഗ്ധന്റെ പ്രൊഫൈൽ", completeTitle: "നിങ്ങളുടെ കരകൗശല പ്രൊഫൈൽ പൂർത്തിയാക്കുക",
    completeDescription: "ഉപഭോക്താക്കളുടെ വിശ്വാസം വർധിപ്പിക്കാൻ നിങ്ങളുടെ വർക്ക്‌ഷോപ്പിന്റെയും കരകൗശലത്തിന്റെയും വിവരങ്ങൾ ചേർക്കുക.",
    edit: "പ്രൊഫൈൽ തിരുത്തുക", cancel: "റദ്ദാക്കുക", editTitle: "കരകൗശല പ്രൊഫൈൽ തിരുത്തുക",
    name: "പേര്", business: "ബിസിനസ് പേര്", craft: "പ്രധാന കരകൗശലം", experience: "പരിചയ വർഷങ്ങൾ",
    certificates: "സർട്ടിഫിക്കറ്റുകൾ", certificatesPlaceholder: "GI ടാഗ്, പരിശീലന സർട്ടിഫിക്കറ്റ്…",
    credentials: "അംഗീകാരങ്ങൾ / പുരസ്കാരങ്ങൾ", credentialsPlaceholder: "പുരസ്കാരങ്ങൾ, ആർട്ടിസൻ ID, അംഗത്വങ്ങൾ…",
    about: "നിങ്ങളുടെ കരകൗശലത്തെക്കുറിച്ച്", save: "പ്രൊഫൈൽ സേവ് ചെയ്യുക", saving: "സേവ് ചെയ്യുന്നു…",
    saved: "✓ പ്രൊഫൈൽ വിജയകരമായി സേവ് ചെയ്തു.", artisanDetails: "കരകൗശല വിവരങ്ങൾ",
    businessCredentials: "ബിസിനസ് വിവരങ്ങൾ", years: "വർഷം", notAdded: "ചേർത്തിട്ടില്ല — പ്രൊഫൈൽ തിരുത്തുക",
    loading: "പ്രൊഫൈൽ ലോഡ് ചെയ്യുന്നു…", loadError: "പ്രൊഫൈൽ ലോഡ് ചെയ്യാനായില്ല.",
    saveError: "പ്രൊഫൈൽ സേവ് ചെയ്യാനായില്ല. വീണ്ടും ശ്രമിക്കുക.", required: "പേര് ആവശ്യമാണ്.",
  },
  pa: {
    label: "ਕਾਰੀਗਰ ਪ੍ਰੋਫਾਈਲ", completeTitle: "ਆਪਣੀ ਕਾਰੀਗਰ ਪ੍ਰੋਫਾਈਲ ਪੂਰੀ ਕਰੋ",
    completeDescription: "ਗਾਹਕਾਂ ਦਾ ਭਰੋਸਾ ਵਧਾਉਣ ਲਈ ਆਪਣੀ ਵਰਕਸ਼ਾਪ ਅਤੇ ਕਾਰੀਗਰੀ ਦੀ ਜਾਣਕਾਰੀ ਸ਼ਾਮਲ ਕਰੋ।",
    edit: "ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ", cancel: "ਰੱਦ ਕਰੋ", editTitle: "ਕਾਰੀਗਰ ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ",
    name: "ਨਾਮ", business: "ਕਾਰੋਬਾਰ ਦਾ ਨਾਮ", craft: "ਮੁੱਖ ਕਾਰੀਗਰੀ", experience: "ਤਜਰਬੇ ਦੇ ਸਾਲ",
    certificates: "ਸਰਟੀਫਿਕੇਟ", certificatesPlaceholder: "GI ਟੈਗ, ਟ੍ਰੇਨਿੰਗ ਸਰਟੀਫਿਕੇਟ…",
    credentials: "ਪ੍ਰਾਪਤੀਆਂ / ਇਨਾਮ", credentialsPlaceholder: "ਇਨਾਮ, ਕਾਰੀਗਰ ID, ਮੈਂਬਰਸ਼ਿਪ…",
    about: "ਤੁਹਾਡੀ ਕਾਰੀਗਰੀ ਬਾਰੇ", save: "ਪ੍ਰੋਫਾਈਲ ਸੇਵ ਕਰੋ", saving: "ਸੇਵ ਹੋ ਰਿਹਾ ਹੈ…",
    saved: "✓ ਪ੍ਰੋਫਾਈਲ ਸਫਲਤਾਪੂਰਵਕ ਸੇਵ ਹੋ ਗਈ।", artisanDetails: "ਕਾਰੀਗਰ ਵੇਰਵੇ",
    businessCredentials: "ਕਾਰੋਬਾਰੀ ਵੇਰਵੇ", years: "ਸਾਲ", notAdded: "ਸ਼ਾਮਲ ਨਹੀਂ — ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ",
    loading: "ਪ੍ਰੋਫਾਈਲ ਲੋਡ ਹੋ ਰਹੀ ਹੈ…", loadError: "ਪ੍ਰੋਫਾਈਲ ਲੋਡ ਨਹੀਂ ਹੋ ਸਕੀ।",
    saveError: "ਪ੍ਰੋਫਾਈਲ ਸੇਵ ਨਹੀਂ ਹੋ ਸਕੀ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।", required: "ਨਾਮ ਲਾਜ਼ਮੀ ਹੈ।",
  },
};

const list = (value) =>
  Array.isArray(value) ? value.join(", ") : value || "";

const buildForm = (u = {}) => ({
  ...u,
  certificates: list(u.certificates),
  credentials: list(u.credentials),
  experienceYears:
    u.experienceYears === null || u.experienceYears === undefined
      ? ""
      : u.experienceYears,
});

export default function Profile() {
  const { user = {}, setUser } = useAuth();
  const { language } = useLanguage();

  // Exactly like Photoshoot.jsx: read the global language context.
  // There is NO separate language button/state on this page.
  const languageKey = String(language || "en").toLowerCase().split("-")[0];
  const text =
    PROFILE_TRANSLATIONS[languageKey] || PROFILE_TRANSLATIONS.en;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => buildForm(user));
  const [status, setStatus] = useState({ type: "", message: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const editingRef = useRef(false);

  useEffect(() => {
    editingRef.current = editing;
  }, [editing]);

  useEffect(() => {
    if (!editingRef.current) {
      setForm(buildForm(user));
    }
  }, [user]);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${API}/api/users/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(text.loadError);
        }

        const data = await response.json();

        if (active && data?.user) {
          setUser(data.user);

          if (!editingRef.current) {
            setForm(buildForm(data.user));
          }
        }
      } catch {
        if (active) {
          setStatus({
            type: "error",
            message: text.loadError,
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [setUser, text.loadError]);

  const change = (key) => (event) => {
    setForm((previous) => ({
      ...previous,
      [key]: event.target.value,
    }));
  };

  // This is the functional Edit Profile button.
  const startEditing = () => {
    setForm(buildForm(user));
    setStatus({ type: "", message: "" });
    setEditing(true);
  };

  const cancelEditing = () => {
    setForm(buildForm(user));
    setStatus({ type: "", message: "" });
    setEditing(false);
  };

  const save = async (event) => {
    event.preventDefault();

    if (!String(form.name || "").trim()) {
      setStatus({
        type: "error",
        message: text.required,
      });
      return;
    }

    setSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = {
        ...form,
        name: String(form.name || "").trim(),
        businessName: String(form.businessName || "").trim(),
        craftType: String(form.craftType || "").trim(),
        bio: String(form.bio || "").trim(),
        experienceYears: Number(form.experienceYears) || 0,
        certificates: String(form.certificates || "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        credentials: String(form.credentials || "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      };

      const response = await fetch(`${API}/api/users/me`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || text.saveError);
      }

      const updatedUser = data?.user || payload;

      setUser(updatedUser);
      localStorage.setItem("karigar-user", JSON.stringify(updatedUser));
      setForm(buildForm(updatedUser));
      setEditing(false);

      setStatus({
        type: "success",
        message: text.saved,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || text.saveError,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p className="profile-saved-message">{text.loading}</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-avatar">
          {(user.name || "A").charAt(0).toUpperCase()}
        </div>

        <div className="profile-hero-content">
          <span className="profile-label">{text.label}</span>
          <h1>{user.name || text.completeTitle}</h1>
          <p>
            {user.businessName || text.completeDescription}
          </p>
        </div>

        <button
          type="button"
          className="profile-edit-button"
          onClick={editing ? cancelEditing : startEditing}
        >
          {editing ? text.cancel : text.edit}
        </button>
      </section>

      {status.message && (
        <p
          className={`profile-saved-message${
            status.type === "error" ? " error" : ""
          }`}
          role="status"
        >
          {status.message}
        </p>
      )}

      {editing ? (
        <form
          className="profile-section-card profile-form"
          onSubmit={save}
        >
          <h2>{text.editTitle}</h2>

          <div className="profile-form-grid">
            <label>
              {text.name}
              <input
                value={form.name || ""}
                onChange={change("name")}
                required
              />
            </label>

            <label>
              {text.business}
              <input
                value={form.businessName || ""}
                onChange={change("businessName")}
              />
            </label>

            <label>
              {text.craft}
              <input
                value={form.craftType || ""}
                onChange={change("craftType")}
              />
            </label>

            <label>
              {text.experience}
              <input
                type="number"
                min="0"
                value={form.experienceYears}
                onChange={change("experienceYears")}
              />
            </label>

            <label className="profile-form-full">
              {text.certificates}
              <input
                value={form.certificates || ""}
                onChange={change("certificates")}
                placeholder={text.certificatesPlaceholder}
              />
            </label>

            <label className="profile-form-full">
              {text.credentials}
              <input
                value={form.credentials || ""}
                onChange={change("credentials")}
                placeholder={text.credentialsPlaceholder}
              />
            </label>

            <label className="profile-form-full">
              {text.about}
              <textarea
                value={form.bio || ""}
                onChange={change("bio")}
                rows="4"
              />
            </label>
          </div>

          <button
            type="submit"
            className="profile-save-button"
            disabled={saving}
          >
            {saving ? text.saving : text.save}
          </button>
        </form>
      ) : (
        <div className="profile-content">
          <Card
            title={text.artisanDetails}
            rows={[
              ["👤", text.name, user.name],
              ["🧵", text.craft, user.craftType],
              [
                "⏳",
                text.experience,
                user.experienceYears
                  ? `${user.experienceYears} ${text.years}`
                  : "",
              ],
            ]}
            emptyText={text.notAdded}
          />

          <Card
            title={text.businessCredentials}
            rows={[
              ["🏪", text.business, user.businessName],
              ["📜", text.certificates, list(user.certificates)],
              ["🏆", text.credentials, list(user.credentials)],
              ["📝", text.about, user.bio],
            ]}
            emptyText={text.notAdded}
          />
        </div>
      )}
    </div>
  );
}

function Card({ title, rows, emptyText }) {
  return (
    <section className="profile-section-card">
      <h2>{title}</h2>

      {rows.map(([icon, label, value]) => (
        <div className="profile-row" key={label}>
          <div className="profile-row-icon">{icon}</div>

          <div className="profile-row-content">
            <span>{label}</span>
            <strong>{value || emptyText}</strong>
          </div>
        </div>
      ))}
    </section>
  );
}