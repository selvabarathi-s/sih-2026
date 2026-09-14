/**
 * PAIMANA PREDICT — Multilingual & Indic Localization Specification
 * Supports English (Default / Union Official) and all 22 Official Languages
 * of the Republic of India under the Eighth Schedule to the Constitution.
 */

export type LanguageCode =
  | 'en'   // English (Default / Union Official)
  | 'hi'   // Hindi (हिन्दी - Union Official / Rajbhasha)
  | 'bn'   // Bengali (বাংলা)
  | 'te'   // Telugu (తెలుగు)
  | 'mr'   // Marathi (मराठी)
  | 'ta'   // Tamil (தமிழ்)
  | 'ur'   // Urdu (اردو)
  | 'gu'   // Gujarati (ગુજરાતી)
  | 'kn'   // Kannada (ಕನ್ನಡ)
  | 'ml'   // Malayalam (മലയാളം)
  | 'or'   // Odia (ଓଡ଼ିଆ)
  | 'pa'   // Punjabi (ਪੰਜਾਬੀ)
  | 'as'   // Assamese (অসমীয়া)
  | 'mai'  // Maithili (मैथिली)
  | 'sat'  // Santali (ᱥᱟᱱᱛᱟᱲᱤ)
  | 'ks'   // Kashmiri (कॉशुर / كٲشُر)
  | 'ne'   // Nepali (नेपाली)
  | 'kok'  // Konkani (कोंकणी)
  | 'sd'   // Sindhi (सिंधी / سنڌي)
  | 'doi'  // Dogri (डोगरी)
  | 'mni'  // Manipuri / Meitei (মৈতৈলোন্ / ꯃꯤꯇꯩꯂꯣꯟ)
  | 'brx'  // Bodo (बड़ो)
  | 'sa';  // Sanskrit (संस्कृतम्)

export interface LanguageMetadata {
  code: LanguageCode;
  name: string;
  nativeName: string;
  script: string;
  region: string;
  isUnionOfficial: boolean;
  isClassical?: boolean;
  isRTL?: boolean;
  badge?: string;
}

export const OFFICIAL_INDIAN_LANGUAGES: LanguageMetadata[] = [
  // 1. Primary Union Languages
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    region: 'National / Pan-India',
    isUnionOfficial: true,
    badge: 'Default',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    region: 'North & Central India / Pan-India',
    isUnionOfficial: true,
    badge: 'राजभाषा (Rajbhasha)',
  },

  // 2. Eighth Schedule Official Languages (Alphabetical / Regional)
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali-Assamese',
    region: 'Assam & North East',
    isUnionOfficial: false,
    isClassical: true,
    badge: 'Eighth Schedule',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    region: 'West Bengal, Tripura, Assam',
    isUnionOfficial: false,
    isClassical: true,
    badge: 'Eighth Schedule',
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बड़ो',
    script: 'Devanagari',
    region: 'Bodoland / Assam',
    isUnionOfficial: false,
    badge: 'Eighth Schedule',
  },
  {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    script: 'Devanagari',
    region: 'Jammu & Kashmir, Himachal Pradesh',
    isUnionOfficial: false,
    badge: 'Eighth Schedule',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    region: 'Gujarat, Daman & Diu',
    isUnionOfficial: false,
    badge: 'Eighth Schedule',
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    region: 'Karnataka',
    isUnionOfficial: false,
    isClassical: true,
    badge: 'Classical Language',
  },
  {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'कॉशुर / كٲشُر',
    script: 'Devanagari / Perso-Arabic',
    region: 'Jammu & Kashmir',
    isUnionOfficial: false,
    badge: 'Eighth Schedule',
  },
  {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    script: 'Devanagari',
    region: 'Goa, Maharashtra, Karnataka',
    isUnionOfficial: false,
    badge: 'Eighth Schedule',
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    script: 'Devanagari / Tirhuta',
    region: 'Bihar & Jharkhand',
    isUnionOfficial: false,
    badge: 'Eighth Schedule',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    region: 'Kerala & Lakshadweep',
    isUnionOfficial: false,
    isClassical: true,
    badge: 'Classical Language',
  },
  {
    code: 'mni',
    name: 'Manipuri (Meitei)',
    nativeName: 'মৈতৈলোন্ / ꯃꯤꯇꯩꯂꯣꯟ',
    script: 'Bengali / Meitei Mayek',
    region: 'Manipur',
    isUnionOfficial: false,
    badge: 'Eighth Schedule',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    region: 'Maharashtra & Goa',
    isUnionOfficial: false,
    isClassical: true,
    badge: 'Classical Language',
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    script: 'Devanagari',
    region: 'Sikkim, West Bengal, Assam',
    isUnionOfficial: false,
    badge: 'Eighth Schedule',
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    region: 'Odisha',
    isUnionOfficial: false,
    isClassical: true,
    badge: 'Classical Language',
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    region: 'Punjab, Haryana, Delhi',
    isUnionOfficial: false,
    badge: 'Eighth Schedule',
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    script: 'Devanagari',
    region: 'National / Pan-India',
    isUnionOfficial: false,
    isClassical: true,
    badge: 'Classical Language',
  },
  {
    code: 'sat',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    script: 'Ol Chiki',
    region: 'Jharkhand, Odisha, West Bengal',
    isUnionOfficial: false,
    badge: 'Eighth Schedule',
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'सिंधी / سنڌي',
    script: 'Devanagari / Perso-Arabic',
    region: 'National / Gujarat, Maharashtra, Rajasthan',
    isUnionOfficial: false,
    badge: 'Eighth Schedule',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    region: 'Tamil Nadu & Puducherry',
    isUnionOfficial: false,
    isClassical: true,
    badge: 'Classical Language',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    region: 'Andhra Pradesh & Telangana',
    isUnionOfficial: false,
    isClassical: true,
    badge: 'Classical Language',
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Perso-Arabic',
    region: 'National / Telangana, UP, Bihar, J&K',
    isUnionOfficial: false,
    isRTL: true,
    badge: 'Eighth Schedule',
  },
];
