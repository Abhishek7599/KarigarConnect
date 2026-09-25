import { useEffect, useState } from "react";
 
import "./App.css";
 
import { useLanguage } from "./i18n/LanguageContext";
 
import Home from "./pages/Home";
import Photoshoot from "./pages/Photoshoot";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import AddProduct from "./pages/AddProduct";
import Pricing from "./pages/Pricing";
import Insights from "./pages/Insights";
import Marketplace from "./pages/Marketplace";
import VoiceInput from "./pages/VoiceInput";
import Auth from "./pages/Auth";
import { useAuth } from "./auth/AuthContext";
 
/*
=====================================================
10-LANGUAGE FEATURE PAGE TEXT
=====================================================
*/
 
const FEATURE_PAGE_TRANSLATIONS = {
  en: {
    insightsTitle: "Business Insights",
    insightsDescription:
      "Understand your business performance with simple AI-powered insights.",
    insightsBadge: "COMING SOON",
    insightsIcon: "📊",
 
    marketplaceTitle: "Marketplace",
    marketplaceDescription:
      "Prepare your products for online selling and future marketplace connections.",
    marketplaceBadge: "COMING SOON",
    marketplaceIcon: "🛍️",
 
    voiceTitle: "Voice Input",
    voiceDescription:
      "Create product information naturally by speaking in your own language.",
    voiceBadge: "COMING SOON",
    voiceIcon: "🎙️",
 
    backHome: "Back to Home",
 
    comingSoonTitle:
      "This feature is coming next.",
    comingSoonDescription:
      "The KarigarConnect team is preparing this feature for the next stage of the platform.",
  },
 
  hi: {
    insightsTitle: "व्यवसाय जानकारी",
    insightsDescription:
      "सरल AI आधारित जानकारी के साथ अपने व्यवसाय के प्रदर्शन को समझें।",
    insightsBadge: "जल्द आ रहा है",
    insightsIcon: "📊",
 
    marketplaceTitle: "मार्केटप्लेस",
    marketplaceDescription:
      "अपने उत्पादों को ऑनलाइन बिक्री और भविष्य के मार्केटप्लेस कनेक्शन के लिए तैयार करें।",
    marketplaceBadge: "जल्द आ रहा है",
    marketplaceIcon: "🛍️",
 
    voiceTitle: "आवाज़ से इनपुट",
    voiceDescription:
      "अपनी भाषा में बोलकर स्वाभाविक रूप से उत्पाद की जानकारी तैयार करें।",
    voiceBadge: "जल्द आ रहा है",
    voiceIcon: "🎙️",
 
    backHome: "होम पर वापस जाएं",
 
    comingSoonTitle:
      "यह फीचर जल्द आ रहा है।",
    comingSoonDescription:
      "KarigarConnect टीम इस फीचर को प्लेटफ़ॉर्म के अगले चरण के लिए तैयार कर रही है।",
  },
 
  bn: {
    insightsTitle: "ব্যবসার তথ্য",
    insightsDescription:
      "সহজ AI-চালিত তথ্যের মাধ্যমে আপনার ব্যবসার কার্যকারিতা বুঝুন।",
    insightsBadge: "শীঘ্রই আসছে",
    insightsIcon: "📊",
 
    marketplaceTitle: "মার্কেটপ্লেস",
    marketplaceDescription:
      "অনলাইন বিক্রয় এবং ভবিষ্যতের মার্কেটপ্লেস সংযোগের জন্য আপনার পণ্য প্রস্তুত করুন।",
    marketplaceBadge: "শীঘ্রই আসছে",
    marketplaceIcon: "🛍️",
 
    voiceTitle: "ভয়েস ইনপুট",
    voiceDescription:
      "নিজের ভাষায় কথা বলে স্বাভাবিকভাবে পণ্যের তথ্য তৈরি করুন।",
    voiceBadge: "শীঘ্রই আসছে",
    voiceIcon: "🎙️",
 
    backHome: "হোমে ফিরে যান",
 
    comingSoonTitle:
      "এই ফিচারটি শীঘ্রই আসছে।",
    comingSoonDescription:
      "KarigarConnect টিম প্ল্যাটফর্মের পরবর্তী ধাপের জন্য এই ফিচারটি প্রস্তুত করছে।",
  },
 
  ta: {
    insightsTitle: "வணிக தகவல்கள்",
    insightsDescription:
      "எளிய AI தகவல்களின் மூலம் உங்கள் வணிக செயல்திறனைப் புரிந்துகொள்ளுங்கள்.",
    insightsBadge: "விரைவில் வருகிறது",
    insightsIcon: "📊",
 
    marketplaceTitle: "மார்க்கெட்ப்ளேஸ்",
    marketplaceDescription:
      "ஆன்லைன் விற்பனை மற்றும் எதிர்கால மார்க்கெட்ப்ளேஸ் இணைப்புகளுக்காக உங்கள் தயாரிப்புகளைத் தயாரிக்கவும்.",
    marketplaceBadge: "விரைவில் வருகிறது",
    marketplaceIcon: "🛍️",
 
    voiceTitle: "குரல் உள்ளீடு",
    voiceDescription:
      "உங்கள் சொந்த மொழியில் பேசி இயல்பாக தயாரிப்பு தகவலை உருவாக்குங்கள்.",
    voiceBadge: "விரைவில் வருகிறது",
    voiceIcon: "🎙️",
 
    backHome: "முகப்புக்கு திரும்புங்கள்",
 
    comingSoonTitle:
      "இந்த அம்சம் விரைவில் வருகிறது.",
    comingSoonDescription:
      "KarigarConnect குழு தளத்தின் அடுத்த கட்டத்திற்காக இந்த அம்சத்தைத் தயாரித்து வருகிறது.",
  },
 
  te: {
    insightsTitle: "వ్యాపార సమాచారం",
    insightsDescription:
      "సులభమైన AI ఆధారిత సమాచారంతో మీ వ్యాపార పనితీరును అర్థం చేసుకోండి.",
    insightsBadge: "త్వరలో వస్తుంది",
    insightsIcon: "📊",
 
    marketplaceTitle: "మార్కెట్‌ప్లేస్",
    marketplaceDescription:
      "ఆన్‌లైన్ అమ్మకాలు మరియు భవిష్యత్ మార్కెట్‌ప్లేస్ కనెక్షన్‌ల కోసం మీ ఉత్పత్తులను సిద్ధం చేయండి.",
    marketplaceBadge: "త్వరలో వస్తుంది",
    marketplaceIcon: "🛍️",
 
    voiceTitle: "వాయిస్ ఇన్‌పుట్",
    voiceDescription:
      "మీ స్వంత భాషలో మాట్లాడి సహజంగా ఉత్పత్తి సమాచారాన్ని రూపొందించండి.",
    voiceBadge: "త్వరలో వస్తుంది",
    voiceIcon: "🎙️",
 
    backHome: "హోమ్‌కు తిరిగి వెళ్లండి",
 
    comingSoonTitle:
      "ఈ ఫీచర్ త్వరలో వస్తుంది.",
    comingSoonDescription:
      "KarigarConnect బృందం ప్లాట్‌ఫారమ్ తదుపరి దశ కోసం ఈ ఫీచర్‌ను సిద్ధం చేస్తోంది.",
  },
 
  mr: {
    insightsTitle: "व्यवसाय माहिती",
    insightsDescription:
      "सोप्या AI आधारित माहितीच्या मदतीने तुमच्या व्यवसायाची कामगिरी समजून घ्या.",
    insightsBadge: "लवकरच येत आहे",
    insightsIcon: "📊",
 
    marketplaceTitle: "मार्केटप्लेस",
    marketplaceDescription:
      "ऑनलाइन विक्री आणि भविष्यातील मार्केटप्लेस जोडणीसाठी तुमची उत्पादने तयार करा.",
    marketplaceBadge: "लवकरच येत आहे",
    marketplaceIcon: "🛍️",
 
    voiceTitle: "व्हॉइस इनपुट",
    voiceDescription:
      "तुमच्या स्वतःच्या भाषेत बोलून उत्पादनाची माहिती सहज तयार करा.",
    voiceBadge: "लवकरच येत आहे",
    voiceIcon: "🎙️",
 
    backHome: "होमवर परत जा",
 
    comingSoonTitle:
      "हे फीचर लवकरच येत आहे.",
    comingSoonDescription:
      "KarigarConnect टीम प्लॅटफॉर्मच्या पुढील टप्प्यासाठी हे फीचर तयार करत आहे.",
  },
 
  gu: {
    insightsTitle: "વ્યવસાય માહિતી",
    insightsDescription:
      "સરળ AI આધારિત માહિતીથી તમારા વ્યવસાયના પ્રદર્શનને સમજો.",
    insightsBadge: "ટૂંક સમયમાં આવી રહ્યું છે",
    insightsIcon: "📊",
 
    marketplaceTitle: "માર્કેટપ્લેસ",
    marketplaceDescription:
      "ઑનલાઇન વેચાણ અને ભવિષ્યના માર્કેટપ્લેસ કનેક્શન માટે તમારા ઉત્પાદનો તૈયાર કરો.",
    marketplaceBadge: "ટૂંક સમયમાં આવી રહ્યું છે",
    marketplaceIcon: "🛍️",
 
    voiceTitle: "વૉઇસ ઇનપુટ",
    voiceDescription:
      "તમારી પોતાની ભાષામાં બોલીને સ્વાભાવિક રીતે ઉત્પાદનની માહિતી બનાવો.",
    voiceBadge: "ટૂંક સમયમાં આવી રહ્યું છે",
    voiceIcon: "🎙️",
 
    backHome: "હોમ પર પાછા જાઓ",
 
    comingSoonTitle:
      "આ ફીચર ટૂંક સમયમાં આવી રહ્યું છે.",
    comingSoonDescription:
      "KarigarConnect ટીમ પ્લેટફોર્મના આગામી તબક્કા માટે આ ફીચર તૈયાર કરી રહી છે.",
  },
 
  kn: {
    insightsTitle: "ವ್ಯವಹಾರ ಮಾಹಿತಿ",
    insightsDescription:
      "ಸರಳ AI ಆಧಾರಿತ ಮಾಹಿತಿಯ ಮೂಲಕ ನಿಮ್ಮ ವ್ಯವಹಾರದ ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.",
    insightsBadge: "ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತಿದೆ",
    insightsIcon: "📊",
 
    marketplaceTitle: "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್",
    marketplaceDescription:
      "ಆನ್‌ಲೈನ್ ಮಾರಾಟ ಮತ್ತು ಭವಿಷ್ಯದ ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ಸಂಪರ್ಕಗಳಿಗೆ ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ.",
    marketplaceBadge: "ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತಿದೆ",
    marketplaceIcon: "🛍️",
 
    voiceTitle: "ಧ್ವನಿ ಇನ್‌ಪುಟ್",
    voiceDescription:
      "ನಿಮ್ಮ ಸ್ವಂತ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ ಸಹಜವಾಗಿ ಉತ್ಪನ್ನದ ಮಾಹಿತಿಯನ್ನು ರಚಿಸಿ.",
    voiceBadge: "ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತಿದೆ",
    voiceIcon: "🎙️",
 
    backHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
 
    comingSoonTitle:
      "ಈ ವೈಶಿಷ್ಟ್ಯ ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತಿದೆ.",
    comingSoonDescription:
      "KarigarConnect ತಂಡವು ವೇದಿಕೆಯ ಮುಂದಿನ ಹಂತಕ್ಕಾಗಿ ಈ ವೈಶಿಷ್ಟ್ಯವನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಿದೆ.",
  },
 
  ml: {
    insightsTitle: "ബിസിനസ് വിവരങ്ങൾ",
    insightsDescription:
      "ലളിതമായ AI അടിസ്ഥാനത്തിലുള്ള വിവരങ്ങളിലൂടെ നിങ്ങളുടെ ബിസിനസ് പ്രകടനം മനസ്സിലാക്കുക.",
    insightsBadge: "ഉടൻ വരുന്നു",
    insightsIcon: "📊",
 
    marketplaceTitle: "മാർക്കറ്റ്പ്ലേസ്",
    marketplaceDescription:
      "ഓൺലൈൻ വിൽപ്പനയ്ക്കും ഭാവിയിലെ മാർക്കറ്റ്പ്ലേസ് കണക്ഷനുകൾക്കുമായി നിങ്ങളുടെ ഉൽപ്പന്നങ്ങൾ തയ്യാറാക്കുക.",
    marketplaceBadge: "ഉടൻ വരുന്നു",
    marketplaceIcon: "🛍️",
 
    voiceTitle: "വോയ്സ് ഇൻപുട്ട്",
    voiceDescription:
      "നിങ്ങളുടെ സ്വന്തം ഭാഷയിൽ സംസാരിച്ച് സ്വാഭാവികമായി ഉൽപ്പന്ന വിവരങ്ങൾ സൃഷ്ടിക്കുക.",
    voiceBadge: "ഉടൻ വരുന്നു",
    voiceIcon: "🎙️",
 
    backHome: "ഹോമിലേക്ക് മടങ്ങുക",
 
    comingSoonTitle:
      "ഈ ഫീച്ചർ ഉടൻ വരുന്നു.",
    comingSoonDescription:
      "KarigarConnect ടീം പ്ലാറ്റ്ഫോമിന്റെ അടുത്ത ഘട്ടത്തിനായി ഈ ഫീച്ചർ തയ്യാറാക്കുന്നു.",
  },
 
  pa: {
    insightsTitle: "ਕਾਰੋਬਾਰੀ ਜਾਣਕਾਰੀ",
    insightsDescription:
      "ਸਧਾਰਨ AI ਜਾਣਕਾਰੀ ਰਾਹੀਂ ਆਪਣੇ ਕਾਰੋਬਾਰ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਨੂੰ ਸਮਝੋ।",
    insightsBadge: "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ",
    insightsIcon: "📊",
 
    marketplaceTitle: "ਮਾਰਕੀਟਪਲੇਸ",
    marketplaceDescription:
      "ਆਨਲਾਈਨ ਵਿਕਰੀ ਅਤੇ ਭਵਿੱਖ ਦੇ ਮਾਰਕੀਟਪਲੇਸ ਕਨੈਕਸ਼ਨਾਂ ਲਈ ਆਪਣੇ ਉਤਪਾਦ ਤਿਆਰ ਕਰੋ।",
    marketplaceBadge: "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ",
    marketplaceIcon: "🛍️",
 
    voiceTitle: "ਵੌਇਸ ਇਨਪੁੱਟ",
    voiceDescription:
      "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲ ਕੇ ਕੁਦਰਤੀ ਤਰੀਕੇ ਨਾਲ ਉਤਪਾਦ ਦੀ ਜਾਣਕਾਰੀ ਬਣਾਓ।",
    voiceBadge: "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ",
    voiceIcon: "🎙️",
 
    backHome: "ਹੋਮ 'ਤੇ ਵਾਪਸ ਜਾਓ",
 
    comingSoonTitle:
      "ਇਹ ਫੀਚਰ ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ।",
    comingSoonDescription:
      "KarigarConnect ਟੀਮ ਪਲੇਟਫਾਰਮ ਦੇ ਅਗਲੇ ਪੜਾਅ ਲਈ ਇਹ ਫੀਚਰ ਤਿਆਰ ਕਰ ਰਹੀ ਹੈ।",
  },
};
 
/*
=====================================================
COMING SOON PAGE
=====================================================
*/
 
function FeatureComingSoon({
  feature,
  onNavigate,
  ui,
}) {
  let title = "";
  let description = "";
  let badge = "";
  let icon = "";
 
  if (feature === "insights") {
    title = ui.insightsTitle;
    description =
      ui.insightsDescription;
    badge = ui.insightsBadge;
    icon = ui.insightsIcon;
  }
 
  if (feature === "marketplace") {
    title = ui.marketplaceTitle;
    description =
      ui.marketplaceDescription;
    badge = ui.marketplaceBadge;
    icon = ui.marketplaceIcon;
  }
 
  if (feature === "voice") {
    title = ui.voiceTitle;
    description =
      ui.voiceDescription;
    badge = ui.voiceBadge;
    icon = ui.voiceIcon;
  }
 
  return (
    <section className="feature-coming-soon-page">
 
      <button
        type="button"
        className="pricing-back-button"
        onClick={() =>
          onNavigate("home")
        }
      >
        ← {ui.backHome}
      </button>
 
      <div className="feature-coming-soon-card">
 
        <div className="feature-coming-soon-icon">
          {icon}
        </div>
 
        <span className="feature-coming-soon-badge">
          {badge}
        </span>
 
        <h1>
          {title}
        </h1>
 
        <p className="feature-coming-soon-description">
          {description}
        </p>
 
        <div className="feature-coming-soon-divider"></div>
 
        <h2>
          {ui.comingSoonTitle}
        </h2>
 
        <p>
          {
            ui.comingSoonDescription
          }
        </p>
 
        <button
          type="button"
          className="primary-button feature-coming-soon-home"
          onClick={() =>
            onNavigate("home")
          }
        >
          {ui.backHome}
        </button>
 
      </div>
 
    </section>
  );
}
 
/*
=====================================================
APP
=====================================================
*/
 
function App() {
  const { user, signOut } = useAuth();
  const {
    language,
    setLanguage,
    t,
    translationLoading,
  } = useLanguage();
 
  const [activePage, setActivePage] =
    useState("home");
 
  const [selectedProduct, setSelectedProduct] =
    useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 
  useEffect(() => {
    const captureInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    window.addEventListener("beforeinstallprompt", captureInstall);
    return () => window.removeEventListener("beforeinstallprompt", captureInstall);
  }, []);
 
  // Keep the dropdown from staying open if the screen grows past the
  // mobile breakpoint (e.g. rotating a tablet, resizing a browser window).
  useEffect(() => {
    const closeOnDesktopWidth = () => {
      if (window.innerWidth > 650) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", closeOnDesktopWidth);
    return () => window.removeEventListener("resize", closeOnDesktopWidth);
  }, []);
 
  const installApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };
 
  /*
  =====================================================
  CURRENT FEATURE LANGUAGE
  =====================================================
  */
 
  const featureLanguage =
    FEATURE_PAGE_TRANSLATIONS[
      language
    ]
      ? language
      : "en";
 
  const featureUi =
    FEATURE_PAGE_TRANSLATIONS[
      featureLanguage
    ];
 
  /*
  =====================================================
  NAVIGATION
  =====================================================
  */
 
  const navigate = (
    page,
    product = null
  ) => {
    setActivePage(page);
 
    if (product) {
      setSelectedProduct(product);
    }
 
    if (
      page !== "products" &&
      page !== "photoshoot"
    ) {
      setSelectedProduct(null);
    }
  };
 
  // Same as navigate(), but also closes the mobile dropdown —
  // used by every link inside the navbar itself.
  const goTo = (page, product = null) => {
    navigate(page, product);
    setMobileMenuOpen(false);
  };
 
  /*
  =====================================================
  RENDER
  =====================================================
  */
 
  if (!user) return <Auth />;
  return (
    <div className="app">
 
      {/* =================================================
          NAVBAR
      ================================================= */}
 
      <header className="navbar">
 
        {/* BRAND */}
 
        <div className="brand">
 
          <div className="brand-icon">
            K
          </div>
 
          <div>
 
            <h2>
              KarigarConnect
            </h2>
 
            <p>
              {t.tagline}
            </p>
 
          </div>
 
        </div>
 
        {/* MOBILE MENU TOGGLE */}
 
        <button
          type="button"
          className={`nav-toggle ${mobileMenuOpen ? "open" : ""}`}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
 
        {/* NAVIGATION */}
 
        <div className={`nav-actions ${mobileMenuOpen ? "open" : ""}`}>
 
          {/* HOME */}
 
          <button
            type="button"
            className={`nav-link ${
              activePage === "home"
                ? "active"
                : ""
            }`}
            onClick={() =>
              goTo("home")
            }
          >
            🏠 {t.home}
          </button>
 
          {/* PHOTOSHOOT */}
 
          <button
            type="button"
            className={`nav-link ${
              activePage ===
              "photoshoot"
                ? "active"
                : ""
            }`}
            onClick={() =>
              goTo(
                "photoshoot"
              )
            }
          >
            ✨ {t.photoshoot}
          </button>
 
          {/* PRODUCTS */}
 
          <button
            type="button"
            className={`nav-link ${
              activePage ===
              "products"
                ? "active"
                : ""
            }`}
            onClick={() =>
              goTo(
                "products"
              )
            }
          >
            📦 {t.products}
          </button>
 
          <button type="button" className="nav-link" onClick={() => goTo("insights")}>
            📊 Insights
          </button>
 
          {installPrompt && (
            <button
              type="button"
              className="install-button"
              onClick={() => {
                installApp();
                setMobileMenuOpen(false);
              }}
            >
              ⬇ Install app
            </button>
          )}
 
          {/* LANGUAGE */}
 
          <div className="language-switcher">
 
            <select
              value={
                language
              }
              disabled={
                translationLoading
              }
              onChange={(e) =>
                setLanguage(
                  e.target.value
                )
              }
              className="language-select"
              title="Select language"
            >
 
              <option value="en">
                English
              </option>
 
              <option value="hi">
                हिंदी
              </option>
 
              <option value="bn">
                বাংলা
              </option>
 
              <option value="ta">
                தமிழ்
              </option>
 
              <option value="te">
                తెలుగు
              </option>
 
              <option value="mr">
                मराठी
              </option>
 
              <option value="gu">
                ગુજરાતી
              </option>
 
              <option value="kn">
                ಕನ್ನಡ
              </option>
 
              <option value="ml">
                മലയാളം
              </option>
 
              <option value="pa">
                ਪੰਜਾਬੀ
              </option>
 
            </select>
 
            {translationLoading && (
              <span className="language-loading">
                ...
              </span>
            )}
 
          </div>
 
          {/* PROFILE */}
 
          <button
            type="button"
            className="profile-button"
            onClick={() =>
              goTo(
                "profile"
              )
            }
          >
            <span>
              👤
            </span>
 
            {t.profile}
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => {
              signOut();
              setMobileMenuOpen(false);
            }}
          >
            Sign out
          </button>
 
        </div>
 
        {/* Tapping outside the open dropdown closes it */}
        {mobileMenuOpen && (
          <div
            className="nav-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
 
      </header>
 
      {/* =================================================
          MAIN CONTENT
      ================================================= */}
 
      <main className="main-container">
 
        {/* HOME */}
 
        {activePage ===
          "home" && (
          <Home
            onNavigate={
              navigate
            }
          />
        )}
 
        {/* PHOTOSHOOT */}
 
        {activePage ===
          "photoshoot" && (
          <Photoshoot
            selectedProduct={
              selectedProduct
            }
            onNavigate={navigate}
          />
        )}
 
        {/* PRODUCTS */}
 
        {activePage ===
          "products" && (
          <Products
            onNavigate={
              navigate
            }
          />
        )}
 
        {/* ADD PRODUCT */}
 
        {activePage ===
          "add-product" && (
          <AddProduct
            onNavigate={
              navigate
            }
          />
        )}
 
        {/* PRICING */}
 
        {activePage ===
          "pricing" && (
          <Pricing
            onNavigate={
              navigate
            }
          />
        )}
 
        {/* PROFILE */}
 
        {activePage ===
          "profile" && (
          <Profile />
        )}
 
        {/* INSIGHTS */}
 
        {activePage === "insights" && (
  <Insights
    onNavigate={navigate}
  />
)}
 
 
        {/* MARKETPLACE */}
        {activePage === "marketplace" && (
  <Marketplace onNavigate={navigate} />
)}
 
      
 
        {/* VOICE */}
        {activePage === "voice" && (
  <VoiceInput onNavigate={navigate} />
)}
 
        
 
      </main>
 
    </div>
  );
}
 
export default App;
 