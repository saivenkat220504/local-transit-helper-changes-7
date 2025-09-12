import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "English" | "Hindi" | "Telugu";

type I18nContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = "app.language";

const translations: Record<Language, Record<string, string>> = {
  English: {
    "nav.home": "Home",
    "nav.search": "Search",
    "nav.ecoRewards": "Eco Rewards",
    "nav.chat": "Chat",
    "nav.settings": "Settings",

    "home.title": "Transit Tracker",
    "home.subtitle": "Find routes and stops",
    "home.searchPlaceholder": "Search routes, stops, or destinations...",
    "home.searchRequired": "Search Required",
    "home.searchDescription": "Please enter a search term",
    "home.paymentPortal": "Payment Portal",
    "home.paymentDescription": "Opening mobile payment options...",
    "home.catchBus": "Catch This Bus?",
    "home.catchDescription": "Calculating walking time vs bus arrival...",
    "home.reportIssue": "Report Issue",
    "home.reportDescription": "Community reporting feature activated",
    "home.routesTitle": "Routes",
    "home.stopsTitle": "Stops",
    "home.trackingRoute": "Tracking Route",
    "home.nowTracking": "Now tracking",

    "routes.downtown": "Bachupally Express",
    "routes.university": "VJIET Campus Line",
    "routes.airport": "Miyapur Connection",
    "routes.cityCenter": "Secunderabad Junction",
    "routes.universityDistrict": "JNTU Hyderabad",
    "routes.metroStation": "Miyapur Metro",
    "routes.campusNorth": "VNR Campus",
    "routes.terminal1": "Hi-Tech City",
    "routes.downtownDest": "Kondapur",
    "routes.frequency": "frequency",
    "routes.capacity": "capacity",
    "routes.light": "Light",
    "routes.high": "High",
    "routes.track": "Track",
    "routes.cancel": "Cancel",
    "routes.tracking": "Tracking",
    "routes.delayPredicted": "delay predicted by AI",

    "chat.title": "Journey Chat",
    "chat.subtitle": "Share your bus journey experiences",
    "chat.formTitle": "Share Your Bus Journey Experience",
    "chat.nameLabel": "Your Name",
    "chat.namePlaceholder": "Enter your name",
    "chat.nameRequired": "Name is required",
    "chat.routeLabel": "Bus Route",
    "chat.routePlaceholder": "e.g., 12A, B15",
    "chat.routeRequired": "Route is required",
    "chat.opinionLabel": "Your Opinion",
    "chat.opinionPlaceholder": "Share your experience about the bus journey, service quality, cleanliness, punctuality, etc...",
    "chat.opinionRequired": "Please share your opinion",
    "chat.opinionMinLength": "Please write at least 10 characters",
    "chat.postButton": "Post Opinion",
    "chat.recentOpinions": "Recent Opinions",
    "chat.opinionPosted": "Opinion Posted!",
    "chat.opinionDescription": "Your bus journey experience has been shared.",

    "settings.title": "Settings",
    "settings.subtitle": "Customize your experience",
    "settings.languageTitle": "Language & Region",
    "settings.updated": "Settings Updated",
    "settings.languageChanged": "Language Changed",
    "settings.switchedTo": "Switched to",
    "settings.dataSaving": "Data Saving Mode",
    "settings.offlineMode": "Offline Timetables",
    "settings.routeAlerts": "Route Alerts",
    "settings.pushNotifications": "Push Notifications",
    "settings.highContrast": "High Contrast Mode",
    "settings.largeFonts": "Large Text",
  },
  Hindi: {
    "nav.home": "होम",
    "nav.search": "खोज",
    "nav.ecoRewards": "ईको रिवॉर्ड्स",
    "nav.chat": "चैट",
    "nav.settings": "सेटिंग्स",

    "home.title": "ट्रांजिट ट्रैकर",
    "home.subtitle": "रूट और स्टॉप खोजें",
    "home.searchPlaceholder": "रूट, स्टॉप या गंतव्य खोजें...",
    "home.searchRequired": "खोज आवश्यक",
    "home.searchDescription": "कृपया एक खोज शब्द दर्ज करें",
    "home.paymentPortal": "भुगतान पोर्टल",
    "home.paymentDescription": "मोबाइल भुगतान विकल्प खोल रहे हैं...",
    "home.catchBus": "यह बस पकड़ें?",
    "home.catchDescription": "पैदल चलने का समय बनाम बस आगमन की गणना...",
    "home.reportIssue": "समस्या रिपोर्ट करें",
    "home.reportDescription": "सामुदायिक रिपोर्टिंग फीचर सक्रिय",
    "home.routesTitle": "रूट",
    "home.stopsTitle": "स्टॉप",
    "home.trackingRoute": "रूट ट्रैकिंग",
    "home.nowTracking": "अब ट्रैकिंग",

    "routes.downtown": "बचुपल्ली एक्सप्रेस",
    "routes.university": "वीजीआईईटी कैंपस लाइन",
    "routes.airport": "मियापुर कनेक्शन",
    "routes.cityCenter": "सिकंदराबाद जंक्शन",
    "routes.universityDistrict": "जेएनटीयू हैदराबाद",
    "routes.metroStation": "मियापुर मेट्रो",
    "routes.campusNorth": "वीएनआर कैंपस",
    "routes.terminal1": "हाई-टेक सिटी",
    "routes.downtownDest": "कोंडापुर",
    "routes.frequency": "आवृत्ति",
    "routes.capacity": "क्षमता",
    "routes.light": "हल्का",
    "routes.high": "उच्च",
    "routes.track": "ट्रैक",
    "routes.cancel": "रद्द",
    "routes.tracking": "ट्रैकिंग",
    "routes.delayPredicted": "AI द्वारा देरी की भविष्यवाणी",

    "chat.title": "यात्रा चैट",
    "chat.subtitle": "अपने बस यात्रा अनुभव साझा करें",
    "chat.formTitle": "अपना बस यात्रा अनुभव साझा करें",
    "chat.nameLabel": "आपका नाम",
    "chat.namePlaceholder": "अपना नाम दर्ज करें",
    "chat.nameRequired": "नाम आवश्यक है",
    "chat.routeLabel": "बस रूट",
    "chat.routePlaceholder": "जैसे, 12A, B15",
    "chat.routeRequired": "रूट आवश्यक है",
    "chat.opinionLabel": "आपकी राय",
    "chat.opinionPlaceholder": "बस यात्रा, सेवा गुणवत्ता, स्वच्छता, समयबद्धता आदि के बारे में अपना अनुभव साझा करें...",
    "chat.opinionRequired": "कृपया अपनी राय साझा करें",
    "chat.opinionMinLength": "कृपया कम से कम 10 अक्षर लिखें",
    "chat.postButton": "राय पोस्ट करें",
    "chat.recentOpinions": "हाल की राय",
    "chat.opinionPosted": "राय पोस्ट की गई!",
    "chat.opinionDescription": "आपका बस यात्रा अनुभव साझा किया गया है।",

    "settings.title": "सेटिंग्स",
    "settings.subtitle": "अपने अनुभव को अनुकूलित करें",
    "settings.languageTitle": "भाषा और क्षेत्र",
    "settings.updated": "सेटिंग्स अपडेट किए गए",
    "settings.languageChanged": "भाषा बदली गई",
    "settings.switchedTo": "में बदल गए",
    "settings.dataSaving": "डेटा सेविंग मोड",
    "settings.offlineMode": "ऑफलाइन टाइमटेबल",
    "settings.routeAlerts": "रूट अलर्ट",
    "settings.pushNotifications": "पुश नोटिफिकेशन",
    "settings.highContrast": "हाई कंट्रास्ट मोड",
    "settings.largeFonts": "बड़ा टेक्स्ट",
  },
  Telugu: {
    "nav.home": "హోమ్",
    "nav.search": "శోధన",
    "nav.ecoRewards": "ఈకో రివార్డ్స్",
    "nav.chat": "చాట్",
    "nav.settings": "సెట్టింగ్స్",

    "home.title": "ట్రాన్సిట్ ట్రాకర్",
    "home.subtitle": "రూట్లు మరియు స్టాప్లను కనుగొనండి",
    "home.searchPlaceholder": "రూట్లు, స్టాప్లు లేదా గమ్యస్థానాలను వెతకండి...",
    "home.searchRequired": "శోధన అవసరం",
    "home.searchDescription": "దయచేసి ఒక శోధన పదాన్ని నమోదు చేయండి",
    "home.paymentPortal": "చెల్లింపు పోర్టల్",
    "home.paymentDescription": "మొబైల్ చెల్లింపు ఎంపికలను తెరుస్తోంది...",
    "home.catchBus": "ఈ బస్సును పట్టుకోవాలా?",
    "home.catchDescription": "నడక సమయం vs బస్ రాక లెక్కింపు...",
    "home.reportIssue": "సమస్య నివేదిక",
    "home.reportDescription": "కమ్యూనిటీ రిపోర్టింగ్ ఫీచర్ సక్రియం",
    "home.routesTitle": "రూట్లు",
    "home.stopsTitle": "స్టాప్లు",
    "home.trackingRoute": "రూట్ ట్రాకింగ్",
    "home.nowTracking": "ఇప్పుడు ట్రాకింగ్",

    "routes.downtown": "బచుపల్లి ఎక్స్ప్రెస్",
    "routes.university": "వీజెఐఈటీ క్యాంపస్ లైన్",
    "routes.airport": "మియాపూర్ కనెక్షన్",
    "routes.cityCenter": "సికింద్రాబాద్ జంక్షన్",
    "routes.universityDistrict": "జెఎన్టీయు హైదరాబాద్",
    "routes.metroStation": "మియాపూర్ మెట్రో",
    "routes.campusNorth": "వీఎన్ఆర్ క్యాంపస్",
    "routes.terminal1": "హై-టెక్ సిటీ",
    "routes.downtownDest": "కొండాపూర్",
    "routes.frequency": "ఫ్రీక్వెన్సీ",
    "routes.capacity": "కెపాసిటీ",
    "routes.light": "లైట్",
    "routes.high": "హై",
    "routes.track": "ట్రాక్",
    "routes.cancel": "రద్దు",
    "routes.tracking": "ట్రాకింగ్",
    "routes.delayPredicted": "AI ద్వారా ఆలస్యం అంచనా",

    "chat.title": "యాత్రా చాట్",
    "chat.subtitle": "మీ బస్ యాత్రా అనుభవాలను పంచుకోండి",
    "chat.formTitle": "మీ బస్ యాత్రా అనుభవాన్ని పంచుకోండి",
    "chat.nameLabel": "మీ పేరు",
    "chat.namePlaceholder": "మీ పేరును నమోదు చేయండి",
    "chat.nameRequired": "పేరు అవసరం",
    "chat.routeLabel": "బస్ రూట్",
    "chat.routePlaceholder": "ఉదా., 12A, B15",
    "chat.routeRequired": "రూట్ అవసరం",
    "chat.opinionLabel": "మీ అభిప్రాయం",
    "chat.opinionPlaceholder": "బస్ యాత్రా, సేవా నాణ్యత, శుభ్రత, సమయపాలన మొదలైన వాటి గురించి మీ అనుభవాన్ని పంచుకోండి...",
    "chat.opinionRequired": "దయచేసి మీ అభిప్రాయాన్ని పంచుకోండి",
    "chat.opinionMinLength": "దయచేసి కనీసం 10 అక్షరాలు రాయండి",
    "chat.postButton": "అభిప్రాయం పోస్ట్ చేయండి",
    "chat.recentOpinions": "ఇటీవలి అభిప్రాయాలు",
    "chat.opinionPosted": "అభిప్రాయం పోస్ట్ చేయబడింది!",
    "chat.opinionDescription": "మీ బస్ యాత్రా అనుభవం పంచుకోబడింది.",

    "settings.title": "సెట్టింగ్స్",
    "settings.subtitle": "మీ అనుభవాన్ని అనుకూలీకరించండి",
    "settings.languageTitle": "భాష మరియు ప్రాంతం",
    "settings.updated": "సెట్టింగ్స్ అప్డేట్ చేయబడింది",
    "settings.languageChanged": "భాష మార్చబడింది",
    "settings.switchedTo": "కు మార్చబడింది",
    "settings.dataSaving": "డేటా సేవింగ్ మోడ్",
    "settings.offlineMode": "ఆఫ్లైన్ టైమ్టేబల్స్",
    "settings.routeAlerts": "రూట్ అలర్ట్స్",
    "settings.pushNotifications": "పుష్ నోటిఫికేషన్స్",
    "settings.highContrast": "హై కాంట్రాస్ట్ మోడ్",
    "settings.largeFonts": "పెద్ద టెక్స్ట్",
  },
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as Language | null) : null;
    return saved || "English";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {}
  }, [language]);

  const t = useMemo(() => {
    return (key: string) => {
      const dict = translations[language] || translations.English;
      return dict[key] ?? translations.English[key] ?? key;
    };
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const value = useMemo<I18nContextValue>(() => ({ language, setLanguage, t }), [language, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
