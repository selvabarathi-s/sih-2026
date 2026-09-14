/**
 * PAIMANA PREDICT — Backend Translation & Indic Localization Service
 * Full Eighth Schedule (22 Languages + English) Registry and Dynamic Translation Engine.
 */

export const OFFICIAL_INDIAN_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', region: 'Pan-India', isUnionOfficial: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', region: 'Pan-India / North & Central', isUnionOfficial: true, isRajbhasha: true },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali-Assamese', region: 'Assam & North East' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', region: 'West Bengal, Tripura, Assam', isClassical: true },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', script: 'Devanagari', region: 'Bodoland / Assam' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', script: 'Devanagari', region: 'Jammu & Kashmir' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', region: 'Gujarat' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', region: 'Karnataka', isClassical: true },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर / كٲشُر', script: 'Devanagari / Perso-Arabic', region: 'Jammu & Kashmir' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', script: 'Devanagari', region: 'Goa, Maharashtra, Karnataka' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari', region: 'Bihar & Jharkhand' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', region: 'Kerala & Lakshadweep', isClassical: true },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', script: 'Bengali / Meitei Mayek', region: 'Manipur' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', region: 'Maharashtra & Goa', isClassical: true },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', script: 'Devanagari', region: 'Sikkim, West Bengal' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia', region: 'Odisha', isClassical: true },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', region: 'Punjab, Haryana, Delhi' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', script: 'Devanagari', region: 'Pan-India', isClassical: true },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki', region: 'Jharkhand, Odisha' },
  { code: 'sd', name: 'Sindhi', nativeName: 'सिंधी / سنڌي', script: 'Devanagari / Perso-Arabic', region: 'Pan-India' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', region: 'Tamil Nadu & Puducherry', isClassical: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', region: 'Andhra Pradesh & Telangana', isClassical: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'Perso-Arabic', region: 'Pan-India', isRTL: true }
];

// Core bilingual / multilingual terms dictionary
export const INDIC_TERMS_DICTIONARY = {
  // Statuses
  'Completed': { hi: 'पूर्ण', bn: 'সম্পন্ন', te: 'పూర్తయింది', ta: 'முடிந்தது', mr: 'पूर्ण' },
  'In Progress': { hi: 'प्रगति पर', bn: 'চলমান', te: 'పురోగతిలో ఉంది', ta: 'செயல்பாட்டில் உள்ளது', mr: 'प्रगतीपथावर' },
  'Delayed': { hi: 'विलंबित', bn: 'বিলম্বিত', te: 'ఆలస్యమైంది', ta: 'தாமதமானது', mr: 'विलंबित' },
  'Critical': { hi: 'अति-गंभीर', bn: 'সংকটাপন্ন', te: 'తీవ్రమైన', ta: 'அபாயகரமான', mr: 'गंभीर' },
  'On Track': { hi: 'समय पर (संतोषजनक)', bn: 'সঠিক পথে', te: 'సకాలంలో', ta: 'சரியான பாதையில்', mr: 'वेळेवर' },
  'Resolved': { hi: 'निस्तारित', bn: 'মীমাংসিত', te: 'పరిష్కరించబడింది', ta: 'தீர்க்கப்பட்டது', mr: 'निकाली काढले' },

  // Risk levels
  'CRITICAL': { hi: 'अति-गंभीर जोखिम', bn: 'সংকটাপন্ন ঝুঁকি', te: 'తీవ్రమైన ప్రమాదం', ta: 'அபாயகரமான இடர்', mr: 'गंभीर जोखीम' },
  'HIGH': { hi: 'उच्च जोखिम', bn: 'উচ্চ ঝুঁকি', te: 'అధిక ప్రమాదం', ta: 'அதிக இடர்', mr: 'उच्च जोखीम' },
  'MEDIUM': { hi: 'मध्यम जोखिम', bn: 'মাঝারি ঝুঁকি', te: 'మధ్యస్థ ప్రమాదం', ta: 'நடுத்தர இடர்', mr: 'मध्यम जोखीम' },
  'LOW': { hi: 'कम जोखिम', bn: 'কম ঝুঁকি', te: 'తక్కువ ప్రమాదం', ta: 'குறைந்த இடர்', mr: 'कमी जोखीम' },

  // Sectors
  'Road Transport and Highways': { hi: 'सड़क परिवहन एवं राजमार्ग', bn: 'সড়ক পরিবহন ও মহাসড়ক', te: 'రహదారి రవాణా మరియు రహదారులు', mr: 'रस्ते वाहतूक आणि महामार्ग' },
  'Railways': { hi: 'रेलवे', bn: 'রেলওয়ে', te: 'రైల్వేలు', mr: 'रेल्वे' },
  'Petroleum': { hi: 'पेट्रोलियम एवं प्राकृतिक गैस', bn: 'পেট্রোলিয়াম', te: 'పెట్రోలియం', mr: 'पेट्रोलियम' },
  'Power': { hi: 'विद्युत एवं ऊर्जा', bn: 'বিদ্যুৎ', te: 'విద్యుత్', mr: 'ऊर्जा' },
  'Coal': { hi: 'कोयला', bn: 'কয়লা', te: 'బొగ్గు', mr: 'कोळसा' },
  'Telecommunications': { hi: 'दूरसंचार', bn: 'টেলিযোগাযোগ', te: 'టెలికమ్యూనికేషన్స్', mr: 'दूरसंचार' },
  'Civil Aviation': { hi: 'नागर विमानन', bn: 'বেসামরিক বিমান চলাচল', te: 'పౌర విమానయానం', mr: 'नागरी विमान वाहतूक' },
  'Shipping': { hi: 'पत्तन, पोत परिवहन एवं जलमार्ग', bn: 'জাহাজ চলাচল', te: 'షిప్పింగ్', mr: 'शिपिंग' },
  'Atomic Energy': { hi: 'परमाणु ऊर्जा', bn: 'পারমাণবিক শক্তি', te: 'అణుశక్తి', mr: 'अणुऊर्जा' },
  'Urban Development': { hi: 'आवासन एवं शहरी कार्य', bn: 'নগর উন্নয়ন', te: 'పట్టణాభివృద్ధి', mr: 'नगर विकास' },
  'Water Resources': { hi: 'जल संसाधन एवं जल शक्ति', bn: 'জলসম্পদ', te: 'జలవనరులు', mr: 'जलसंपदा' }
};

export class TranslationService {
  getSupportedLanguages() {
    return OFFICIAL_INDIAN_LANGUAGES;
  }

  isLanguageSupported(code) {
    if (!code || typeof code !== 'string') return false;
    return OFFICIAL_INDIAN_LANGUAGES.some(l => l.code.toLowerCase() === code.toLowerCase());
  }

  translateText(text, targetLang = 'hi') {
    if (!text || typeof text !== 'string') return { translatedText: '', targetLang };
    const lang = targetLang.toLowerCase();

    // English source doesn't need translation if target is 'en'
    if (lang === 'en') {
      return { translatedText: text, targetLang: 'en', sourceLang: 'en' };
    }

    // Direct dictionary match
    const trimmed = text.trim();
    if (INDIC_TERMS_DICTIONARY[trimmed]) {
      const entry = INDIC_TERMS_DICTIONARY[trimmed];
      if (entry[lang]) {
        return { translatedText: entry[lang], targetLang: lang, sourceLang: 'en' };
      }
      if (entry['hi']) {
        return { translatedText: entry['hi'], targetLang: lang, sourceLang: 'en', fallback: 'hi' };
      }
    }

    // Keyword / phrase-based translation for complex strings
    let translated = text;
    for (const [enTerm, translations] of Object.entries(INDIC_TERMS_DICTIONARY)) {
      if (translated.includes(enTerm)) {
        const replacement = translations[lang] || translations['hi'] || enTerm;
        translated = translated.replace(new RegExp(enTerm, 'g'), replacement);
      }
    }

    return {
      translatedText: translated,
      targetLang: lang,
      sourceLang: 'en'
    };
  }

  translateProjectFields(project, targetLang = 'hi') {
    if (!project || typeof project !== 'object') return project;
    const lang = targetLang.toLowerCase();
    if (lang === 'en') return project;

    const translatedSector = this.translateText(project.sector_name || '', lang).translatedText;
    const translatedStatus = this.translateText(project.status || '', lang).translatedText;
    const translatedRisk = this.translateText(project.risk_level || '', lang).translatedText;

    return {
      ...project,
      sector_name_translated: translatedSector || project.sector_name,
      status_translated: translatedStatus || project.status,
      risk_level_translated: translatedRisk || project.risk_level,
      translation_meta: {
        targetLang: lang,
        timestamp: new Date().toISOString()
      }
    };
  }
}

export const translationService = new TranslationService();
export default translationService;
