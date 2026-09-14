/**
 * PAIMANA PREDICT — Indic Full-DOM Dynamic Text Translation Engine
 * Translates all headers, cards, metrics, descriptions, badges, and table contents
 * across the entire DOM reactively into Hindi (राजभाषा) and other Eighth Schedule languages.
 */

import { LanguageCode } from '../../types/language';

// Comprehensive Phrase & Sentence Translation Dictionary
export const DOM_INDIC_DICTIONARY: Record<string, Partial<Record<LanguageCode, string>>> = {
  // Provenance & Top Banners
  'AUTHORITATIVE PAIMANA DATASET • FLASH REPORT APRIL 2026': {
    hi: 'प्राधिकृत पैमाना डेटासेट • फ्लैश रिपोर्ट अप्रैल 2026',
    ta: 'அங்கீகரிக்கப்பட்ட பைமானா தரவுத்தொகுப்பு • ஏப்ரல் 2026 அறிக்கை',
    te: 'అధికారిక పైమానా డేటాసెట్ • ఫ్లాష్ నివేదిక ఏప్రిల్ 2026',
    bn: 'প্রামাণ্য পৈমানা ডেটাসেট • ফ্ল্যাশ রিপোর্ট এপ্রিল ২০২৬',
    mr: 'प्राधिकृत पैमाना डेटासेट • फ्लॅश अहवाल एप्रिल २०२६',
  },
  'Table 6 Ongoing Projects': {
    hi: 'तालिका 6 चालू परियोजनाएं',
    ta: 'அட்டவணை 6 தற்போதைய திட்டங்கள்',
    te: 'పట్టిక 6 కొనసాగుతున్న ప్రాజెక్టులు',
    bn: 'সারণী ৬ চলমান প্রকল্পসমূহ',
    mr: 'तक्ता ६ सुरू असलेले प्रकल्प',
  },
  'Source: Ministry of Statistics & Programme Implementation (MoSPI) • Government of India.': {
    hi: 'स्रोत: सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI) • भारत सरकार।',
    ta: 'ஆதாரம்: புள்ளியியல் மற்றும் திட்ட அமலாக்க அமைச்சகம் (MoSPI) • இந்திய அரசு.',
    te: 'మూలం: గణాంకాలు మరియు కార్యక్రమ అమలు మంత్రిత్వ శాఖ (MoSPI) • భారత ప్రభుత్వం.',
    bn: 'উৎস: পরিসংখ্যান ও কর্মসূচি বাস্তবায়ন মন্ত্রক (MoSPI) • ভারত সরকার।',
    mr: 'स्रोत: सांख्यिकी आणि कार्यक्रम अंमलबजावणी मंत्रालय (MoSPI) • भारत सरकार.',
  },
  'Portfolio: 1,981 Projects': {
    hi: 'पोर्टफोलियो: 1,981 परियोजनाएं',
    ta: 'திட்டங்கள்: 1,981 திட்டங்கள்',
    te: 'పోర్ట్‌ఫోలియో: 1,981 ప్రాజెక్టులు',
    bn: 'পোর্টফোলিও: ১,৯৮১টি প্রকল্প',
    mr: 'पोर्टफोलिओ: १,९८१ प्रकल्प',
  },
  'Reconciliation: 100.0% PASS': {
    hi: 'समाधान: 100.0% उत्तीर्ण',
    ta: 'சரிபார்ப்பு: 100.0% வெற்றி',
    te: 'సయోధ్య: 100.0% ఉత్తీర్ణత',
    bn: 'পুনর্মিলন: ১০০.০% সফল',
    mr: 'ताळमेळ: १००.०% उत्तीर्ण',
  },
  'Audit Lineage': {
    hi: 'लेखापरीक्षा वंशावली',
    ta: 'தணிக்கை வம்சாவளி',
    te: 'ఆడిట్ వంశావళి',
    bn: 'অডিট বংশগতি',
    mr: 'ऑडिट वंशपरंपरा',
  },

  // Command Center Workload Banner
  'Live Operational System of Record': {
    hi: 'लाइव परिचालन प्रणाली रिकॉर्ड',
    ta: 'நேரலை செயல்பாட்டு பதிவு முறைமை',
    te: 'ప్రత్యక్ష కార్యాచరణ రికార్డు వ్యవస్థ',
    bn: 'লাইভ অপারেশনাল রেকর্ড সিস্টেম',
    mr: 'थेट कार्यप्रणाली नोंदणी प्रणाली',
  },
  'Cycle: July 2026 Active': {
    hi: 'चक्र: जुलाई 2026 सक्रिय',
    ta: 'சுழற்சி: ஜூலை 2026 செயலில் உள்ளது',
    te: 'చక్రం: జూలై 2026 సక్రియం',
    bn: 'চক্র: জুলাই ২০২৬ সক্রিয়',
    mr: 'चक्र: जुलै २०२६ सक्रिय',
  },
  'Government Infrastructure Workflow & Workload Command Center': {
    hi: 'सरकारी अवसंरचना कार्यप्रवाह एवं कार्यभार कमान केंद्र',
    ta: 'அரசாங்க உள்கட்டமைப்பு பணிப்பாய்வு மற்றும் பணிச்சுமை கட்டளை மையம்',
    te: 'ప్రభుత్వ మౌలిక సదుపాయాల వర్క్‌ఫ్లో & వర్క్‌లోడ్ కమాండ్ సెంటర్',
    bn: 'সরকারি পরিকাঠামো কর্মপ্রবাহ ও কাজের চাপ কমান্ড সেন্টার',
    mr: 'शासकीय पायाभूत सुविधा कार्यप्रवाह आणि कार्यभार नियंत्रण केंद्र',
  },
  'Real-world multi-tiered project governance: Dispatch monthly telemetry updates, conduct 11-factor root-cause investigations, manage SLA breaches, and execute binding executive directives.': {
    hi: 'वास्तविक बहुस्तरीय परियोजना अभिशासन: मासिक टेलीमेट्री अपडेट भेजें, 11-कारक मूल-कारण जांच करें, एसएलए उल्लंघनों का प्रबंधन करें, और बाध्यकारी कार्यकारी निर्देश जारी करें।',
    ta: 'உண்மையான பல அடுக்கு திட்ட நிர்வாகம்: மாதாந்திர தொலை அளவியல் புதுப்பிப்புகளை அனுப்புங்கள், 11-காரணி மூல காரண விசாரணைகளை நடத்துங்கள், சேவை நிலை ஒப்பந்த மீறல்களை நிர்வகியுங்கள் மற்றும் கட்டாய நிர்வாக உத்தரவுகளை நிறைவேற்றுங்கள்.',
    te: 'నిజ-ప్రపంచ బహుళ-స్థాయి ప్రాజెక్ట్ పాలన: నెలవారీ టెలిమెట్రీ నవీకరణలను పంపండి, 11-కారకాల మూల-కారణ దర్యాప్తులను నిర్వహించండి, ఎస్ఎల్ఏ ఉల్లంఘనలను నిర్వహించండి మరియు బైండింగ్ ఎగ్జిక్యూటివ్ ఆదేశాలను అమలు చేయండి.',
    bn: 'বাস্তব বহুস্তরীয় প্রকল্প পরিচালনা: মাসিক টেলিমেট্রি আপডেট পাঠান, ১১-গুণনীয়ক মূল-কারণ অনুসন্ধান চালান, এসএলএ লঙ্ঘন পরিচালনা করুন এবং নির্বাহী নির্দেশ কার্যকর করুন।',
    mr: 'वास्तविक बहुस्तरीय प्रकल्प प्रशासन: मासिक टेलिमेट्री अद्यतने पाठवा, ११-घटक मूळ-कारण तपासण्या करा, एसएलए उल्लंघने व्यवस्थापित करा आणि बंधनकारक कार्यकारी निर्देश जारी करा.',
  },
  'Open Workload Inbox': {
    hi: 'कार्यभार इनबॉक्स खोलें',
    ta: 'பணிச்சுமை இன்பாக்ஸைத் திறக்கவும்',
    te: 'వర్క్‌లోడ్ ఇన్‌బాక్స్ తెరవండి',
    bn: 'কাজের ইনবক্স খুলুন',
    mr: 'कार्यभार इनबॉक्स उघडा',
  },
  'Active Interventions': {
    hi: 'सक्रिय हस्तक्षेप',
    ta: 'செயலில் உள்ள தலையீடுகள்',
    te: 'క్రియాశీల జోక్యాలు',
    bn: 'সক্রিয় হস্তক্ষেপ',
    mr: 'सक्रिय हस्तक्षेप',
  },
  '2 Assigned': {
    hi: '2 सौंपे गए',
    ta: '2 ஒதுக்கப்பட்டது',
    te: '2 కేటాయించబడ్డాయి',
    bn: '২টি বরাদ্দ',
    mr: '२ नियुक्त',
  },
  'Unacknowledged Signals': {
    hi: 'स्वीकृति-प्रतीक्षित संकेत',
    ta: 'ஏற்கப்படாத சமிக்ஞைகள்',
    te: 'అంగీకరించని సంకేతాలు',
    bn: 'অস্বীকৃত সংকেত',
    mr: 'प्रलंबित संकेत',
  },
  '18 Pending': {
    hi: '18 लंबित',
    ta: '18 நிலுவையில்',
    te: '18 పెండింగ్‌లో ఉన్నాయి',
    bn: '১৮টি মুলতুবি',
    mr: '१८ प्रलंबित',
  },
  'Monthly Submissions': {
    hi: 'मासिक प्रस्तुतियां',
    ta: 'மாதாந்திர சமர்ப்பிப்புகள்',
    te: 'నెలవారీ సమర్పణలు',
    bn: 'মাসিক জমা',
    mr: 'मासिक सादरीकरणे',
  },
  '1 For Review': {
    hi: '1 समीक्षाधीन',
    ta: '1 மதிப்பாய்விற்கு',
    te: '1 సమీక్ష కోసం',
    bn: '১টি পর্যালোচনাধীন',
    mr: '१ पुनरावलोकनासाठी',
  },
  'Automated Escalations': {
    hi: 'स्वचालित अग्रेषण',
    ta: 'தானியங்கி தீவிரப்படுத்தல்',
    te: 'స్వయంచాలక తీవ్రతరం',
    bn: 'স্বয়ংক্রিয় বৃদ্ধি',
    mr: 'स्वयंचलित पाठपुरावा',
  },
  'Daemon Active (60s)': {
    hi: 'डेमन सक्रिय (60 से.)',
    ta: 'டெமான் செயலில் உள்ளது (60 வினாடி)',
    te: 'డీమన్ సక్రియం (60సె)',
    bn: 'ডেমন সক্রিয় (৬০ সে.)',
    mr: 'डेमन सक्रिय (६० से.)',
  },

  // Problem statement & Subheading
  '“Transforming infrastructure monitoring from descriptive reporting into predictive decision support.”': {
    hi: '“अवसंरचना निगरानी को विवरणात्मक रिपोर्टिंग से भविष्यसूचक निर्णय समर्थन में बदलना।”',
    ta: '“உள்கட்டமைப்பு கண்காணிப்பை விளக்க அறிக்கையிடலில் இருந்து முன்கணிப்பு முடிவு ஆதரவாக மாற்றுதல்.”',
    te: '“మౌలిక సదుపాయాల పర్యవేక్షణను వివరణాత్మక నివేదికల నుండి ముందస్తు నిర్ణయ మద్దతుగా మార్చడం.”',
    bn: '“পরিকাঠামো নজরদারিকে বর্ণনামূলক প্রতিবেদন থেকে ভবিষ্যদ্বাণীমূলক সিদ্ধান্ত সমর্থনে রূপান্তর।”',
    mr: '“पायाभूत सुविधा देखरेखीचे वर्णनात्मक अहवालातून भविष्यसूचक निर्णय समर्थनात रूपांतर.”',
  },
  'NATIONAL INFRASTRUCTURE SURVEILLANCE • PAIMANA Table 6 Telemetry': {
    hi: 'राष्ट्रीय अवसंरचना निगरानी • पैमाना तालिका 6 टेलीमेट्री',
    ta: 'தேசிய உள்கட்டமைப்பு கண்காணிப்பு • பைமானா அட்டவணை 6 தொலை அளவியல்',
    te: 'జాతీయ మౌలిక సదుపాయాల నిఘా • పైమానా పట్టిక 6 టెలిమెట్రీ',
    bn: 'জাতীয় পরিকাঠামো নজরদারি • পৈমানা সারণী ৬ টেলিমেট্রি',
    mr: 'राष्ट्रीय पायाभूत सुविधा देखरेख • पैमाना तक्ता ६ टेलिमेट्री',
  },
  'Central Sector Infrastructure Portfolio (April 2026 Snapshot)': {
    hi: 'केंद्रीय क्षेत्र अवसंरचना पोर्टफोलियो (अप्रैल 2026 स्नैपशॉट)',
    ta: 'மத்திய துறை உள்கட்டமைப்பு தொகுப்பு (ஏப்ரல் 2026 பார்வை)',
    te: 'కేంద్ర రంగ మౌలిక సదుపాయాల పోర్ట్‌ఫోలియో (ఏప్రిల్ 2026 స్నాప్‌షాట్)',
    bn: 'কেন্দ্রীয় খাত পরিকাঠামো পোর্টফোলিও (এপ্রিল ২০২৬ চিত্র)',
    mr: 'केंद्रीय क्षेत्र पायाभूत सुविधा पोर्टफोलिओ (एप्रिल २०२६ स्नॅपशॉट)',
  },
  'Authoritative surveillance across 1,981 ongoing major and mega infrastructure projects costing ₹150 Cr and above.': {
    hi: '₹150 करोड़ और उससे अधिक लागत वाली 1,981 चालू प्रमुख एवं मेगा अवसंरचना परियोजनाओं की आधिकारिक निगरानी।',
    ta: '₹150 கோடி மற்றும் அதற்கு மேற்பட்ட மதிப்புள்ள 1,981 நடப்பு முக்கிய மற்றும் மெகா உள்கட்டமைப்பு திட்டங்களின் அங்கீகரிக்கப்பட்ட கண்காணிப்பு.',
    te: '₹150 కోట్లు మరియు అంతకంటే ఎక్కువ వ్యయంతో కొనసాగుతున్న 1,981 ప్రధాన మరియు మెగా మౌలిక సదుపాయాల ప్రాజెక్టుల అధికారిక నిఘా.',
    bn: '₹১৫০ কোটি ও তদূর্ধ্ব ব্যয়ের ১,৯৮১টি চলমান প্রধান ও মেগা পরিকাঠামো প্রকল্পের প্রামাণ্য নজরদারি।',
    mr: '₹१५० कोटी व त्याहून अधिक खर्चाच्या १,९८१ सुरू असलेल्या प्रमुख आणि भव्य पायाभूत सुविधा प्रकल्पांची अधिकृत देखरेख.',
  },

  // KPI Growth Box
  'OBSERVED COST GROWTH': {
    hi: 'देखी गई लागत वृद्धि',
    ta: 'கண்டறியப்பட்ட செலவு வளர்ச்சி',
    te: 'గమనించిన ఖర్చు పెరుగుదల',
    bn: 'পর্যবেক্ষিত ব্যয় বৃদ্ধি',
    mr: 'नोंदवलेली खर्च वाढ',
  },
  'Cost-Revised': {
    hi: 'लागत-संशोधित',
    ta: 'செலவு திருத்தப்பட்டது',
    te: 'వ్యయం సవరించబడింది',
    bn: 'ব্যয় সংশোধিত',
    mr: 'खर्च सुधारित',
  },
  'Schedule-Extended': {
    hi: 'समय-विस्तारित',
    ta: 'காலம் நீட்டிக்கப்பட்டது',
    te: 'గడువు పొడిగించబడింది',
    bn: 'সময়সীমা বর্ধিত',
    mr: 'वेळ वाढवला',
  },
  'Avg Progress:': {
    hi: 'औसत प्रगति:',
    ta: 'சராசரி முன்னேற்றம்:',
    te: 'సగటు పురోగతి:',
    bn: 'গড় অগ্রগতি:',
    mr: 'सरासरी प्रगती:',
  },
  'Total Revision': {
    hi: 'कुल संशोधन',
    ta: 'மொத்த திருத்தம்',
    te: 'మొత్తం సవరణ',
    bn: 'মোট সংশোধন',
    mr: 'एकूण सुधारणा',
  },

  // 4 Primary Metric Stat Cards
  'TOTAL MONITORED PROJECTS': {
    hi: 'कुल निगरानी की गई परियोजनाएं',
    ta: 'மொத்த கண்காணிக்கப்படும் திட்டங்கள்',
    te: 'మొత్తం పర్యవేక్షించబడుతున్న ప్రాజెక్టులు',
    bn: 'মোট নজরদারিকৃত প্রকল্প',
    mr: 'एकूण देखरेख केलेले प्रकल्प',
  },
  'All projects ₹150 Cr and above': {
    hi: '₹150 करोड़ और उससे अधिक की सभी परियोजनाएं',
    ta: '₹150 கோடி மற்றும் அதற்கு மேற்பட்ட அனைத்து திட்டங்களும்',
    te: '₹150 కోట్లు మరియు అంతకంటే ఎక్కువ ఉన్న అన్ని ప్రాజెక్టులు',
    bn: '₹১৫০ কোটি ও তদূর্ধ্ব সমস্ত প্রকল্প',
    mr: '₹१५० कोटी व त्याहून अधिक खर्चाचे सर्व प्रकल्प',
  },
  'TOTAL SANCTIONED COST': {
    hi: 'कुल स्वीकृत लागत',
    ta: 'மொத்த அங்கீகரிக்கப்பட்ட செலவு',
    te: 'మొత్తం మంజూరైన వ్యయం',
    bn: 'মোট অনুমোদিত ব্যয়',
    mr: 'एकूण मंजूर खर्च',
  },
  'Original Approved Envelope': {
    hi: 'मूल स्वीकृत बजट दायरा',
    ta: 'அசல் அங்கீகரிக்கப்பட்ட வரம்பு',
    te: 'అసలు ఆమోదించబడిన బడ్జెట్',
    bn: 'মূল অনুমোদিত বাজেট',
    mr: 'मूळ मंजूर अर्थसंकल्प',
  },
  'ANTICIPATED REVISED COST': {
    hi: 'प्रत्याशित संशोधित लागत',
    ta: 'எதிர்பார்க்கப்படும் திருத்தப்பட்ட செலவு',
    te: 'ఊహించిన సవరించిన వ్యయం',
    bn: 'প্রত্যাশিত সংশোধित ব্যয়',
    mr: 'अपेक्षित सुधारित खर्च',
  },
  'CUMULATIVE EXPENDITURE': {
    hi: 'संचयी वास्तविक व्यय',
    ta: 'ஒட்டுமொத்த செலவு',
    te: 'సంచిత వ్యయం',
    bn: 'ক্রমপুঞ্জিত ব্যয়',
    mr: 'एकत्रित खर्च',
  },
  'of Anticipated Outlay': {
    hi: 'प्रत्याशित परिव्यय का',
    ta: 'எதிர்பார்க்கப்படும் ஒதுக்கீட்டில்',
    te: 'ఊహించిన కేటాయింపులో',
    bn: 'প্রত্যাশিত বরাদ্দের',
    mr: 'अपेक्षित खर्चाच्या',
  },

  // Sidebar Links and Modules
  'Quality Telemetry': {
    hi: 'गुणवत्ता टेलीमेट्री',
    ta: 'தரத் தொலை அளவியல்',
    te: 'నాణ్యత టెలిమెట్రీ',
    bn: 'গুণমান টেলিমেট্রি',
    mr: 'गुणवत्ता टेलिमेट्री',
  },
  'Data Ingestion': {
    hi: 'डेटा अंतर्ग्रहण एवं अखंडता',
    ta: 'தரவு உட்செலுத்துதல்',
    te: 'డేటా సేకరణ',
    bn: 'ডেটা ইনজেশন',
    mr: 'डेटा एकत्रीकरण',
  },
  'Authorized Modules': {
    hi: 'अधिकृत मॉड्यूल',
    ta: 'அங்கீகரிக்கப்பட்ட தொகுதிகள்',
    te: 'అధీకృత మాడ్యూల్స్',
    bn: 'অনুমোদিত মডিউল',
    mr: 'अधिकृत मॉड्यूल्स',
  },
  'Account & Portal': {
    hi: 'खाता एवं पोर्टल',
    ta: 'கணக்கு மற்றும் தளம்',
    te: 'ఖాతా & పోర్టల్',
    bn: 'অ্যাকাউন্ট ও পোর্টাল',
    mr: 'खाते आणि पोर्टल',
  },
  'IPMD Monitoring & Surveillance Officer': {
    hi: 'आईपीएमडी निगरानी एवं सतर्कता अधिकारी',
    ta: 'ஐபிஎம்டி கண்காணிப்பு மற்றும் மேற்பார்வை அதிகாரி',
    te: 'ఐపీఎండీ పర్యవేక్షణ & నిఘా అధికారి',
    bn: 'আইপিএমডি পর্যবেক্ষণ ও নজরদারি কর্মকর্তা',
    mr: 'आयपीएमडी देखरेख आणि दक्षता अधिकारी',
  },
  'Portfolio Scope': {
    hi: 'पोर्टफोलियो दायरा',
    ta: 'திட்ட எல்லை',
    te: 'పోర్ట్‌ఫోలియో పరిధి',
    bn: 'পোর্টফোলিও পরিধি',
    mr: 'पोर्टफोलिओ कक्षा',
  },
  'RBAC Active': {
    hi: 'आरबीएसी सक्रिय',
    ta: 'அணுகல் கட்டுப்பாடு செயலில் உள்ளது',
    te: 'ఆర్బీఏసీ సక్రియం',
    bn: 'আরবিএসি সক্রিয়',
    mr: 'आरबीएसी सक्रिय',
  },

  // Project Risk Section & Top Priority
  'Top Priority Risk Projects': {
    hi: 'सर्वोच्च प्राथमिकता वाले जोखिमपूर्ण प्रोजेक्ट',
    ta: 'முன்னுரிமை இடர் திட்டங்கள்',
    te: 'అత్యధిక ప్రాధాన్యత కలిగిన రిస్క్ ప్రాజెక్టులు',
    bn: 'শীর্ষ অগ্রাধিকার ঝুঁকিপূর্ণ প্রকল্প',
    mr: 'सर्वोच्च प्राधान्य जोखीम प्रकल्प',
  },
  'Ranked by AI Multi-Factor Risk Score (0-100)': {
    hi: 'एआई बहु-कारक जोखिम स्कोर (0-100) द्वारा रैंक किया गया',
    ta: 'செயற்கை நுண்ணறிவு இடர் மதிப்பெண் (0-100) அடிப்படையில் வரிசைப்படுத்தப்பட்டது',
    te: 'ఏఐ మల్టీ-ఫాక్టర్ రిస్క్ స్కోర్ (0-100) ఆధారంగా ర్యాంక్ చేయబడింది',
    bn: 'এআই বহু-গুণনীয়ক ঝুঁকি স্কোর (০-১০০) দ্বারা নির্ধারিত',
    mr: 'एआय बहु-घटक जोखीम गुणांकन (०-१००) द्वारे क्रमवारी',
  },
  'View All 1,981 Projects': {
    hi: 'सभी 1,981 परियोजनाएं देखें',
    ta: 'அனைத்து 1,981 திட்டங்களையும் காண்க',
    te: 'అన్ని 1,981 ప్రాజెక్టులను చూడండి',
    bn: 'সমস্ত ১,৯৮১টি প্রকল্প দেখুন',
    mr: 'सर्व १,९८१ प्रकल्प पहा',
  },
  'Original Cost': {
    hi: 'मूल लागत',
    ta: 'அசல் செலவு',
    te: 'అసలు ఖర్చు',
    bn: 'মূল ব্যয়',
    mr: 'मूळ खर्च',
  },
  'Anticipated Cost': {
    hi: 'प्रत्याशित लागत',
    ta: 'எதிர்பார்க்கப்படும் செலவு',
    te: 'ఊహించిన ఖర్చు',
    bn: 'প্রত্যাশিত ব্যয়',
    mr: 'अपेक्षित खर्च',
  },
  'Delay': {
    hi: 'विलंब',
    ta: 'தாமதம்',
    te: 'ఆలస్యం',
    bn: 'বিলম্ব',
    mr: 'विलंब',
  },
  'Risk Drivers': {
    hi: 'जोखिम कारक',
    ta: 'இடர் காரணிகள்',
    te: 'రిస్క్ డ్రైవర్లు',
    bn: 'ঝুঁকির কারণসমূহ',
    mr: 'जोखीम घटक',
  },
  'Action Required': {
    hi: 'कार्रवाई आवश्यक',
    ta: 'நடவடிக்கை தேவை',
    te: 'చర్య అవసరం',
    bn: 'পদক্ষেপ প্রয়োজন',
    mr: 'कारवाई आवश्यक',
  },
  'Critical Projects': {
    hi: 'महत्वपूर्ण परियोजनाएं',
    ta: 'முக்கிய திட்டங்கள்',
    te: 'కీలక ప్రాజెక్టులు',
    bn: 'গুরুত্বপূর্ণ প্রকল্পসমূহ',
    mr: 'महत्त्वाचे प्रकल्प',
  },
  'All Projects Directory': {
    hi: 'समस्त परियोजना निर्देशिका',
    ta: 'அனைத்து திட்டங்கள் பட்டியல்',
    te: 'అన్ని ప్రాజెక్టుల జాబితా',
    bn: 'সমস্ত প্রকল্পের তালিকা',
    mr: 'सर्व प्रकल्प सूची',
  },
  'TOP PRIORITY PROJECTS (PRIORITIZATION ENGINE QUEUE)': {
    hi: 'सर्वोच्च प्राथमिकता वाली परियोजनाएं (प्राथमिकता इंजन कतार)',
    ta: 'முன்னுரிமை திட்டங்கள் (முன்னுரிமை வரிசை)',
    te: 'అత్యధిక ప్రాధాన్యత కలిగిన ప్రాజెక్టులు (ప్రాధాన్యత ఇంజిన్ క్యూ)',
    bn: 'শীর্ষ অগ্রাধিকার প্রকল্প (অগ্রাধিকার ইঞ্জিন সারি)',
    mr: 'सर्वोच्च प्राधान्य प्रकल्प (प्राधान्य इंजिन रांग)',
  },
  'Rank': {
    hi: 'रैंक',
    ta: 'வரிசை',
    te: 'ర్యాంక్',
    bn: 'র‌্যাংক',
    mr: 'क्रमांक',
  },
  'Risk Score (0–100)': {
    hi: 'जोखिम स्कोर (0–100)',
    ta: 'இடர் மதிப்பெண் (0–100)',
    te: 'రిస్క్ స్కోర్ (0–100)',
    bn: 'ঝুঁকি স্কোর (০–১০০)',
    mr: 'जोखीम गुणांकन (०–१००)',
  },
  'Project Identity': {
    hi: 'परियोजना पहचान',
    ta: 'திட்ட அடையாளம்',
    te: 'ప్రాజెక్ట్ గుర్తింపు',
    bn: 'প্রকল্পের পরিচয়',
    mr: 'प्रकल्प ओळख',
  },
  'Sector & Ministry': {
    hi: 'क्षेत्र एवं मंत्रालय',
    ta: 'துறை மற்றும் அமைச்சகம்',
    te: 'రంగం & మంత్రిత్వ శాఖ',
    bn: 'খাত ও মন্ত্রক',
    mr: 'क्षेत्र आणि मंत्रालय',
  },
  'Cost Exposure': {
    hi: 'लागत जोखिम',
    ta: 'செலவு வெளிப்பாடு',
    te: 'వ్యయం ఎక్స్‌పోజర్',
    bn: 'ব্যয় ঝুঁকি',
    mr: 'खर्च जोखीम',
  },
  'Delay Exposure': {
    hi: 'विलंब जोखिम',
    ta: 'தாமத வெளிப்பாடு',
    te: 'ఆలస్య ఎక్స్‌పోజర్',
    bn: 'বিলম্ব ঝুঁকি',
    mr: 'विलंब जोखीम',
  },
  'Primary Risk Driver': {
    hi: 'प्राथमिक जोखिम कारक',
    ta: 'முதன்மை இடர் காரணி',
    te: 'ప్రాథమిక ప్రమాద కారకం',
    bn: 'প্রধান ঝুঁকির কারণ',
    mr: 'प्राथमिक जोखीम घटक',
  },
  'Action': {
    hi: 'कार्रवाई',
    ta: 'நடவடிக்கை',
    te: 'చర్య',
    bn: 'পদক্ষেপ',
    mr: 'कृती',
  },
  'Inspect': {
    hi: 'निरीक्षण करें',
    ta: 'ஆய்வு செய்',
    te: 'తనిఖీ చేయండి',
    bn: 'পরিদর্শন করুন',
    mr: 'तपासा',
  },
  'On Time': {
    hi: 'समय पर',
    ta: 'சரியான நேரத்தில்',
    te: 'సకాలంలో',
    bn: 'সঠিক সময়ে',
    mr: 'वेळेवर',
  },
  'Open Full Priority Queue (1,981 Projects)': {
    hi: 'पूरी प्राथमिकता कतार खोलें (1,981 परियोजनाएं)',
    ta: 'முழு முன்னுரிமை வரிசையைத் திறக்கவும் (1,981 திட்டங்கள்)',
    te: 'పూర్తి ప్రాధాన్యత క్యూ తెరవండి (1,981 ప్రాజెక్టులు)',
    bn: 'সম্পূর্ণ অগ্রাধিকার সারি খুলুন (১,৯৮১টি প্রকল্প)',
    mr: 'पूर्ण प्राधान्य रांग उघडा (१,९८१ प्रकल्प)',
  },
  'REAL HERO PROJECT DOSSIER': {
    hi: 'वास्तविक प्रमुख परियोजना डोजियर',
    ta: 'முக்கிய திட்ட ஆவணம்',
    te: 'రియల్ హీరో ప్రాజెక్ట్ డాక్యుమెంట్',
    bn: 'আসল হিরো প্রকল্প ডসিয়ার',
    mr: 'प्रमुख प्रकल्प अहवाल',
  },
  'CRITICAL RISK': {
    hi: 'अति-गंभीर जोखिम',
    ta: 'அபாயகரமான இடர்',
    te: 'తీవ్రమైన ప్రమాదం',
    bn: 'সংকটাপন্ন ঝুঁকি',
    mr: 'अति-गंभीर जोखीम',
  },
  'Inspect BharatNet Trajectory': {
    hi: 'भारतनेट प्रक्षेपवक्र का निरीक्षण करें',
    ta: 'பாரத்நெட் பாதையை ஆய்வு செய்க',
    te: 'భారత్‌నెట్ పథాన్ని తనిఖీ చేయండి',
    bn: 'ভারতনেট গতিপথ পরিদর্শন করুন',
    mr: 'भारतनेट मार्गाची पाहणी करा',
  },
  'Original Sanctioned': {
    hi: 'मूल स्वीकृत',
    ta: 'அசல் அங்கீகரிக்கப்பட்டது',
    te: 'అసలు మంజూరు',
    bn: 'মূল অনুমোদিত',
    mr: 'मूळ मंजूर',
  },
  'Revised Cost Baseline': {
    hi: 'संशोधित लागत आधार रेखा',
    ta: 'திருத்தப்பட்ட செலவு அடிப்படை',
    te: 'సవరించిన వ్యయ బేస్‌లైన్',
    bn: 'সংশোধিত ব্যয় ভিত্তি',
    mr: 'सुधारित खर्च आधाररेखा',
  },
  'Observed Cost Revision': {
    hi: 'देखी गई लागत संशोधन',
    ta: 'கண்டறியப்பட்ட செலவு திருத்தம்',
    te: 'గమనించిన వ్యయ సవరణ',
    bn: 'পর্যবেক্ষিত ব্যয় সংশোধন',
    mr: 'नोंदवलेली खर्च सुधारणा',
  },
  'Cumulative Expended': {
    hi: 'संचयी वास्तविक व्यय',
    ta: 'ஒட்டுமொத்த செலவு',
    te: 'సంచిత వ్యయం',
    bn: 'ক্রমপুঞ্জিত ব্যয়',
    mr: 'एकत्रित खर्च',
  },
  'Reported Progress': {
    hi: 'सूचित प्रगति',
    ta: 'அறிவிக்கப்பட்ட முன்னேற்றம்',
    te: 'నివేదించబడిన పురోగతి',
    bn: 'রিপোর্টকৃত অগ্রগতি',
    mr: 'नोंदवलेली प्रगती',
  },
  'Total Monitored Projects': {
    hi: 'कुल निगरानी की गई परियोजनाएं',
    ta: 'மொத்த கண்காணிக்கப்படும் திட்டங்கள்',
    te: 'మొత్తం పర్యవేక్షించబడుతున్న ప్రాజెక్టులు',
    bn: 'মোট নজরদারিকৃত প্রকল্প',
    mr: 'एकूण देखरेख केलेले प्रकल्प',
  },
  'Total Sanctioned Cost': {
    hi: 'कुल स्वीकृत लागत',
    ta: 'மொத்த அங்கீகரிக்கப்பட்ட செலவு',
    te: 'మొత్తం మంజూరైన వ్యయం',
    bn: 'মোট অনুমোদিত ব্যয়',
    mr: 'एकूण मंजूर खर्च',
  },
  'Anticipated Revised Cost': {
    hi: 'प्रत्याशित संशोधित लागत',
    ta: 'எதிர்பார்க்கப்படும் திருத்தப்பட்ட செலவு',
    te: 'ఊహించిన సవరించిన వ్యయం',
    bn: 'প্রত্যাশিত সংশোধিত ব্যয়',
    mr: 'अपेक्षित सुधारित खर्च',
  },
  'Cumulative Expenditure': {
    hi: 'संचयी वास्तविक व्यय',
    ta: 'ஒட்டுமொத்த செலவு',
    te: 'సంచిత వ్యయం',
    bn: 'ক্রমপুঞ্জিত ব্যয়',
    mr: 'एकत्रित खर्च',
  },
  'Observed Cost Growth': {
    hi: 'देखी गई लागत वृद्धि',
    ta: 'கண்டறியப்பட்ட செலவு வளர்ச்சி',
    te: 'గమనించిన ఖర్చు పెరుగుదల',
    bn: 'পর্যবেক্ষিত ব্যয় বৃদ্ধি',
    mr: 'नोंदवलेली खर्च वाढ',
  },

  // 22 Infrastructure Sectors
  'Aviation & Aviation Infrastructure': { hi: 'विमानन एवं विमानन अवसंरचना', ta: 'விமான போக்குவரத்து மற்றும் கட்டமைப்பு', te: 'విమానయాన మరియు మౌలిక సదుపాయాలు', bn: 'বিমান চলাচল ও অবকাঠামো' },
  'Coal': { hi: 'कोयला', ta: 'நிலக்கரி', te: 'బొగ్గు', bn: 'কয়লা' },
  'Construction': { hi: 'निर्माण', ta: 'கட்டுமானம்', te: 'నిర్మాణం', bn: 'নির্মাণ' },
  'Education': { hi: 'शिक्षा', ta: 'கல்வி', te: 'విద్య', bn: 'শিক্ষা' },
  'Electricity Generation': { hi: 'विद्युत उत्पादन', ta: 'மின் உற்பத்தி', te: 'విద్యుత్ ఉత్పత్తి', bn: 'বিদ্যুৎ উৎপাদন' },
  'Energy Storage': { hi: 'ऊर्जा भंडारण', ta: 'ஆற்றல் சேமிப்பு', te: 'శక్తి నిల్వ', bn: 'শক্তি সঞ্চয়' },
  'Healthcare': { hi: 'स्वास्थ्य सेवा', ta: 'சுகாதாரம்', te: 'ఆరోగ్య సంరక్షణ', bn: 'স্বাস্থ্যসেবা' },
  'Inland Waterways': { hi: 'अंतर्देशीय जलमार्ग', ta: 'உள்நாட்டு நீர்வழிப்பாதைகள்', te: 'అంతర్గత జలమార్గాలు', bn: 'অভ্যন্তরীণ জলপথ' },
  'Logistics Infrastructure': { hi: 'लॉजिस्टिक्स अवसंरचना', ta: 'தளவாட கட்டமைப்பு', te: 'లాజిస్టిక్స్ మౌలిక సదుపాయాలు', bn: 'লজিস্টিক পরিকাঠামো' },
  'Metals & Mining': { hi: 'धातु एवं खनन', ta: 'உலோகங்கள் மற்றும் சுரங்கம்', te: 'లోహాలు & మైనింగ్', bn: 'ধাতু ও খনির' },
  'Oil & Gas': { hi: 'तेल एवं प्राकृतिक गैस', ta: 'எண்ணெய் மற்றும் இயற்கை எரிவாயு', te: 'చమురు మరియు గ్యాస్', bn: 'তেল ও গ্যাস' },
  'Railways': { hi: 'रेलवे', ta: 'ரயில்வே', te: 'రైల్వేలు', bn: 'রেলওয়ে', mr: 'रेल्वे' },
  'Real Estate': { hi: 'रियल एस्टेट', ta: 'ரியல் எஸ்டேட்', te: 'రియల్ ఎస్టేట్', bn: 'রিয়েল এস্টেট' },
  'Roads & Highways': { hi: 'सड़क एवं राजमार्ग', ta: 'சாலைகள் மற்றும் நெடுஞ்சாலைகள்', te: 'రహదారులు', bn: 'সড়ক ও মহাসড়ক' },
  'Shipping': { hi: 'पोत परिवहन एवं जलमार्ग', ta: 'கப்பல் போக்குவரத்து', te: 'షిప్పింగ్', bn: 'জাহাজ চলাচল' },
  'Steel': { hi: 'इस्पात', ta: 'எஃகு', te: 'ఉక్కు', bn: 'ইস্পাত' },
  'Telecommunication': { hi: 'दूरसंचार', ta: 'தொலைத்தொடர்பு', te: 'టెలికమ్యూనికేషన్స్', bn: 'টেলিযোগাযোগ' },
  'Tourism, Hospitality & Wellness': { hi: 'पर्यटन, आतिथ्य एवं कल्याण', ta: 'சுற்றுலா மற்றும் விருந்தோம்பல்', te: 'పర్యాటక రంగం', bn: 'পর্যটন ও আতিথেয়তা' },
  'Transmission & Distribution': { hi: 'पारेषण एवं वितरण', ta: 'மின்பரிமாற்றம் மற்றும் விநியோகம்', te: 'విద్యుత్ ప్రసారం మరియు పంపిణీ', bn: 'বিদ্যুৎ সঞ্চালন ও বিতরণ' },
  'Urban Public Transport': { hi: 'शहरी सार्वजनिक परिवहन', ta: 'நகர்ப்புற பொது போக்குவரத்து', te: 'పట్టణ ప్రజా రవాణా', bn: 'শহুরে গণপরিবহন' },
  'Waste & Water': { hi: 'अपशिष्ट एवं जल प्रबंधन', ta: 'கழிவு மற்றும் நீர் மேலாண்மை', te: 'వ్యర్థాలు & నీటి శుద్ధి', bn: 'বর্জ্য ও জল ব্যবস্থাপনা' },
  'Water Resources': { hi: 'जल संसाधन', ta: 'நீர்வளம்', te: 'జలవనరులు', bn: 'जलসম্পদ' },

  // 16 Infrastructure Ministries
  'Department of Higher Education': { hi: 'उच्च शिक्षा विभाग', ta: 'உயர் கல்வித்துறை', bn: 'উচ্চশিক্ষা বিভাগ' },
  'Department of Sports': { hi: 'खेल विभाग', ta: 'விளையாட்டுத்துறை', bn: 'ক্রীড়া বিভাগ' },
  'Department of Telecommunications': { hi: 'दूरसंचार विभाग', ta: 'தொலைத்தொடர்புத் துறை', bn: 'টেলিযোগাযোগ বিভাগ' },
  'Department of Water Resources, River Development & GR': { hi: 'जल संसाधन, नदी विकास एवं गंगा संरक्षण विभाग', ta: 'நீர்வளத்துறை, நதி மேம்பாடு & கங்கை புனரமைப்பு', bn: 'জলসম্পদ বিভাগ' },
  'Ministry of Civil Aviation': { hi: 'नागर विमानन मंत्रालय', ta: 'சிவில் விமானப் போக்குவரத்து அமைச்சகம்', bn: 'বেসামরিক বিমান চলাচল মন্ত্রক' },
  'Ministry of Coal': { hi: 'कोयला मंत्रालय', ta: 'நிலக்கரி அமைச்சகம்', bn: 'কয়লা মন্ত্রক' },
  'Ministry of Health & Family Welfare': { hi: 'स्वास्थ्य एवं परिवार कल्याण मंत्रालय', ta: 'சுகாதாரம் மற்றும் குடும்ப நல அமைச்சகம்', bn: 'স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রক' },
  'Ministry of Housing & Urban Affairs': { hi: 'आवासन एवं शहरी कार्य मंत्रालय', ta: 'வீட்டுவசதி மற்றும் நகர்ப்புற விவகாரங்கள் அமைச்சகம்', bn: 'আবাসন ও নগর বিষয়ক মন্ত্রক' },
  'Ministry of Labour and Employment': { hi: 'श्रम एवं रोजगार मंत्रालय', ta: 'தொழிலாளர் மற்றும் வேலைவாய்ப்பு அமைச்சகம்', bn: 'শ্রম ও কর্মসংস্থান মন্ত্রক' },
  'Ministry of Mines': { hi: 'खान मंत्रालय', ta: 'சுரங்க அமைச்சகம்', bn: 'খনি মন্ত্রক' },
  'Ministry of Petroleum & Natural Gas': { hi: 'पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय', ta: 'பெட்ரோலியம் மற்றும் இயற்கை எரிவாயு அமைச்சகம்', bn: 'পেট্রোলিয়াম ও প্রাকৃতিক গ্যাস মন্ত্রক' },
  'Ministry of Ports, Shipping and Waterways': { hi: 'पत्तन, पोत परिवहन एवं जलमार्ग मंत्रालय', ta: 'துறைமுகங்கள், கப்பல் போக்குவரத்து மற்றும் நீர்வழிப்பாதைகள் அமைச்சகம்', bn: 'জাহাজ চলাচল মন্ত্রক' },
  'Ministry of Power': { hi: 'विद्युत मंत्रालय', ta: 'மின்சார அமைச்சகம்', bn: 'বিদ্যুৎ মন্ত্রক' },
  'Ministry of Railways': { hi: 'रेल मंत्रालय', ta: 'ரயில்வே அமைச்சகம்', bn: 'রেল মন্ত্রক' },
  'Ministry of Road Transport & Highways': { hi: 'सड़क परिवहन एवं राजमार्ग मंत्रालय', ta: 'சாலை போக்குவரத்து மற்றும் நெடுஞ்சாலைகள் அமைச்சகம்', bn: 'সড়ক পরিবহন ও মহাসড়ক মন্ত্রক' },
  'Ministry of Steel': { hi: 'इस्पात मंत्रालय', ta: 'எஃகு அமைச்சகம்', bn: 'ইস্পাত মন্ত্রক' },

  // Surveillance & Risk Driver terms
  'Operational Surveillance': { hi: 'परिचालन निगरानी', ta: 'செயல்பாட்டு கண்காணிப்பு', bn: 'কার্যক্ষম নজরদারি' },
  'Normal Surveillance': { hi: 'सामान्य निगरानी', ta: 'வழக்கமான கண்காணிப்பு', bn: 'স্বাভাবিক নজরদারি' },
  'Cost Escalation': { hi: 'लागत वृद्धि', ta: 'செலவு அதிகரிப்பு', bn: 'ব্যয় বৃদ্ধি' },
  'Schedule Extension': { hi: 'समय सीमा विस्तार', ta: 'கால நீட்டிப்பு', bn: 'সময়সীমা বৃদ্ধি' },
  'Progress Velocity Lag': { hi: 'प्रगति वेग अंतराल', ta: 'முன்னேற்ற வேக தாமதம்', bn: 'অগ্রগতি বেগ ঘাটতি' },
  'Capital Burn Asymmetry': { hi: 'पूंजी व्यय विषमता', ta: 'மூலதன செலவு முரண்பாடு', bn: 'মূলধন ব্যয় অসামঞ্জস্য' },
  'Predictive Horizon Risk': { hi: 'भविष्यसूचक क्षितिज जोखिम', ta: 'முன்கணிப்பு வரம்பு இடர்', bn: 'ভবিষ্যদ্বাণীমূলক ঝুঁকি' }
};

// Pre-built case-insensitive normalized index
const normalizedDOMMap = new Map<string, Partial<Record<LanguageCode, string>>>();
for (const [k, v] of Object.entries(DOM_INDIC_DICTIONARY)) {
  const norm = k.toLowerCase().trim().replace(/[\s\n\r]+/g, ' ');
  normalizedDOMMap.set(norm, v);
}

class IndicDOMTranslator {
  private currentLang: LanguageCode = 'en';
  private observer: MutationObserver | null = null;
  private isProcessing = false;

  constructor() {
    // Initialized
  }

  public setLanguage(lang: LanguageCode) {
    this.currentLang = lang;
    this.translateDOM();
    this.startObserving();

    // Re-trigger on subsequent animation frames to catch React post-mount nodes
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => this.translateDOM());
      setTimeout(() => this.translateDOM(), 150);
      setTimeout(() => this.translateDOM(), 500);
    }
  }

  public startObserving() {
    if (typeof window === 'undefined') return;

    if (!this.observer) {
      this.observer = new MutationObserver(() => {
        if (!this.isProcessing && this.currentLang !== 'en') {
          this.translateDOM();
        }
      });
    }

    const root = document.getElementById('root') || document.body;
    if (root) {
      this.observer.disconnect();
      this.observer.observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  }

  public translateDOM() {
    if (typeof document === 'undefined') return;
    this.isProcessing = true;

    try {
      const root = document.getElementById('root') || document.body;
      if (!root) return;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node: Node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          const tag = parent.tagName.toUpperCase();
          if (
            tag === 'SCRIPT' ||
            tag === 'STYLE' ||
            tag === 'NOSCRIPT' ||
            tag === 'INPUT' ||
            tag === 'TEXTAREA' ||
            tag === 'CODE' ||
            tag === 'PRE'
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          const val = (node.nodeValue || '').trim();
          if (!val) return NodeFilter.FILTER_REJECT;

          return NodeFilter.FILTER_ACCEPT;
        },
      });

      const nodesToUpdate: { node: Node; newText: string }[] = [];
      let currentNode: Node | null = walker.nextNode();

      while (currentNode) {
        const textNode = currentNode as Text;
        const rawText = textNode.nodeValue || '';

        // Stash original English text on the node if not already stashed
        const anyNode = textNode as unknown as { __paimana_orig?: string };
        if (anyNode.__paimana_orig === undefined) {
          anyNode.__paimana_orig = rawText;
        }

        const original = anyNode.__paimana_orig;
        const originalTrimmed = original.trim();

        if (this.currentLang === 'en') {
          // Restore English
          if (rawText !== original) {
            nodesToUpdate.push({ node: textNode, newText: original });
          }
        } else {
          // Target Indian Language Translation
          let translated = '';

          // 1. Exact phrase match (case-sensitive)
          if (DOM_INDIC_DICTIONARY[originalTrimmed]) {
            const entry = DOM_INDIC_DICTIONARY[originalTrimmed];
            translated = entry[this.currentLang] || entry['hi'] || '';
          } else {
            // Case-insensitive normalized match
            const norm = originalTrimmed.toLowerCase().replace(/[\s\n\r]+/g, ' ');
            const entry = normalizedDOMMap.get(norm);
            if (entry) {
              translated = entry[this.currentLang] || entry['hi'] || '';
            }
          }

          // 2. Partial substring / phrase matching if no exact match
          if (!translated) {
            let replacedText = original;
            let hasReplacement = false;

            for (const [phrase, transMap] of Object.entries(DOM_INDIC_DICTIONARY)) {
              if (phrase.length > 5 && replacedText.includes(phrase)) {
                const targetPhrase = transMap[this.currentLang] || transMap['hi'];
                if (targetPhrase) {
                  replacedText = replacedText.replace(new RegExp(this.escapeRegExp(phrase), 'g'), targetPhrase);
                  hasReplacement = true;
                }
              }
            }

            if (hasReplacement) {
              translated = replacedText;
            }
          }

          // 3. Dynamic patterns for Risk Drivers
          if (!translated) {
            if (/Cost growth of/i.test(originalTrimmed)) {
              translated = originalTrimmed
                .replace(/Cost growth of/i, this.currentLang === 'hi' ? 'लागत में वृद्धि' : 'செலவு வளர்ச்சி')
                .replace(/revision/i, this.currentLang === 'hi' ? 'संशोधन' : 'திருத்தம்');
            } else if (/Target completion delayed by/i.test(originalTrimmed)) {
              translated = originalTrimmed
                .replace(/Target completion delayed by/i, this.currentLang === 'hi' ? 'लक्ष्य पूर्णता में विलंब' : 'இலக்கு நிறைவு தாமதம்')
                .replace(/months/i, this.currentLang === 'hi' ? 'महीने' : 'மாதங்கள்');
            } else if (/Physical progress at/i.test(originalTrimmed)) {
              translated = originalTrimmed
                .replace(/Physical progress at/i, this.currentLang === 'hi' ? 'भौतिक प्रगति' : 'உடல் முன்னேற்றம்')
                .replace(/lagging schedule requirements/i, this.currentLang === 'hi' ? 'समय सारिणी से पीछे' : 'அட்டவணை தேவைகளை விட பின்தங்கியுள்ளது');
            } else if (/Expenditure ratio/i.test(originalTrimmed)) {
              translated = originalTrimmed
                .replace(/Expenditure ratio/i, this.currentLang === 'hi' ? 'व्यय अनुपात' : 'செலவு விகிதம்')
                .replace(/disconnected from physical delivery/i, this.currentLang === 'hi' ? 'भौतिक प्रगति से असंबद्ध' : 'உடல் விநியோகத்திலிருந்து துண்டிக்கப்பட்டது');
            } else if (/probability of 90-day adverse deterioration event/i.test(originalTrimmed)) {
              translated = originalTrimmed
                .replace(/probability of 90-day adverse deterioration event/i, this.currentLang === 'hi' ? '90-दिवसीय प्रतिकूल गिरावट की संभावना' : '90 நாள் பாதகமான சரிவு நிகழ்வின் நிகழ்தகவு');
            }
          }

          if (translated) {
            // Preserve leading and trailing whitespace of the original node
            const leadingSpaces = original.match(/^\s*/)?.[0] || '';
            const trailingSpaces = original.match(/\s*$/)?.[0] || '';
            const finalText = leadingSpaces + translated.trim() + trailingSpaces;

            if (rawText !== finalText) {
              nodesToUpdate.push({ node: textNode, newText: finalText });
            }
          }
        }

        currentNode = walker.nextNode();
      }

      // Batch apply updates without triggering observer loop
      for (const item of nodesToUpdate) {
        item.node.nodeValue = item.newText;
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

export const indicDOMTranslator = new IndicDOMTranslator();
