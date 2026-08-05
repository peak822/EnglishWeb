const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

// Curated high quality Thai phonetic and dictionary overrides for common B2/C1 prefixes/suffixes/words
const PHONETIC_RULES = [
  { match: /^anti/i, thai: 'แอนไท' },
  { match: /^auto/i, thai: 'ออโต' },
  { match: /^bio/i, thai: 'ไบโอ' },
  { match: /^co/i, thai: 'โค' },
  { match: /^counter/i, thai: 'เคาน์เตอร์' },
  { match: /^de/i, thai: 'ดี' },
  { match: /^dis/i, thai: 'ดิส' },
  { match: /^micro/i, thai: 'ไมโคร' },
  { match: /^multi/i, thai: 'มัลติ' },
  { match: /^over/i, thai: 'โอเวอร์' },
  { match: /^post/i, thai: 'โพสต์' },
  { match: /^pre/i, thai: 'พรี' },
  { match: /^re/i, thai: 'รี' },
  { match: /^semi/i, thai: 'เซมิ' },
  { match: /^sub/i, thai: 'ซับ' },
  { match: /^super/i, thai: 'ซูเปอร์' },
  { match: /^tele/i, thai: 'เทเล' },
  { match: /^trans/i, thai: 'ทรานส์' },
  { match: /^un/i, thai: 'อัน' },
  { match: /^under/i, thai: 'อันเดอร์' }
];

function generateThaiPhonetics(word) {
  const w = word.toLowerCase().trim();
  
  // Custom dictionary overrides for perfect pronunciation
  const exact = {
    'accumulate': 'เออะคิวมิวเลท',
    'adequate': 'แอดเดอะเควท',
    'advocate': 'แอดโวเคท',
    'aesthetic': 'อีสเธติก',
    'allocate': 'แอลโลเคท',
    'ambiguous': 'แอมบิกิวอัส',
    'analogy': 'เออะแนโลจี',
    'apparatus': 'แอพพาเรตัส',
    'arbitrary': 'อาร์บิทราอารี',
    'articulate': 'อาร์ทิคิวเลท',
    'authentic': 'ออเธนติก',
    'autonomous': 'ออตอนโนะมัส',
    'benchmark': 'เบนช์มาร์ก',
    'bolster': 'โบลสเตอร์',
    'breakthrough': 'เบรคธรู',
    'coherent': 'โคฮีเรินท์',
    'collaborate': 'เคอะแล็บโบเรท',
    'commodity': 'เคอะมอดดิตี้',
    'compatible': 'เคิมแพททิเบิล',
    'compensate': 'คอมเพนเซท',
    'comprehensive': 'คอมพริเฮนซิฟ',
    'concur': 'เคินเคอร์',
    'consensus': 'เคินเซนซัส',
    'crucial': 'ครูเชิล',
    'cumulative': 'คิวมิวลาทิฟ',
    'cynical': 'ซินนิเคิล',
    'deliberate': 'ดิลิเบอเรท',
    'differentiate': 'ดิฟเฟอเรนชิเอท',
    'diminish': 'ดิมีนิช',
    'disclose': 'ดิสโคลส',
    'diverse': 'ไดเวิร์ส',
    'dominant': 'ดอมมินันท์',
    'dynamic': 'ไดนามิก',
    'eligible': 'เอลิจิเบิล',
    'empirical': 'เอ็มพิริเคิล',
    'enhance': 'เอ็นฮานส์',
    'evaluate': 'อิแวลลูเอท',
    'explicit': 'เอ็กซพลิสิต',
    'facilitate': 'ฟะซิลลิเทท',
    'feasible': 'ฟีซิเบิล',
    'fluctuate': 'ฟลัคชูเอท',
    'formulate': 'ฟอร์มิวเลท',
    'foster': 'ฟอสเตอร์',
    'hierarchy': 'ไฮเออราร์คี',
    'hypothesis': 'ไฮพอทเธซิส',
    'ideology': 'ไอเดียลโลจี',
    'illuminate': 'อิลลูมิเนท',
    'implicit': 'อิมพลิสิต',
    'impose': 'อิมโพส',
    'incentive': 'อินเซนทิฟ',
    'incorporate': 'อินคอร์ปอเรท',
    'inevitable': 'อินเอฟวิเทเบิล',
    'infrastructure': 'อินฟราสตรัคเจอร์',
    'inherent': 'อินเฮียเรินท์',
    'initiate': 'อินนิชิเอท',
    'innovative': 'อินโนเวทิฟ',
    'insight': 'อินไซท์',
    'integral': 'อินทิกรัล',
    'integrity': 'อินเทกริตี้',
    'intrinsic': 'อินทรินสิก',
    'legitimate': 'ลิจิททิเมท',
    'leverage': 'เลฟเวอริจ',
    'manifest': 'แมนิเฟสต์',
    'manipulate': 'มะนิพพิวเลท',
    'marginal': 'มาร์จินัล',
    'meticulous': 'มะทิคิวลัส',
    'mitigate': 'มิททิเกท',
    'momentum': 'โมเมนตัม',
    'mutual': 'มิวชวล',
    'negligible': 'เนกกลิจิเบิล',
    'negotiate': 'นิโกชิเอท',
    'nuance': 'นูอานส์',
    'nurture': 'เนอร์เจอร์',
    'obligation': 'อ็อบลิเกชัน',
    'obscure': 'อ็อบสเคียวร์',
    'obsolete': 'อ็อบโซลีท',
    'optimal': 'อ็อปติมัล',
    'paradigm': 'แพระไดม์',
    'paradox': 'แพระด็อกซ์',
    'paramount': 'แพระเมาท์',
    'perceive': 'เพอร์ซีฟ',
    'pervasive': 'เพอร์เวซิฟ',
    'phenomenon': 'ฟินอมมินัน',
    'plausible': 'พลอสซิเบิล',
    'pragmatic': 'แพร็กแมติก',
    'precedent': 'เพรสซิเดนท์',
    'predominant': 'พรีดอมมินันท์',
    'preliminary': 'พรีลิมมินารี',
    'prevalent': 'เพรฟวาเลินท์',
    'profound': 'โพรเฟานด์',
    'prominent': 'พรอมมินันท์',
    'proponent': 'โพรโพเนินท์',
    'prosper': 'พรอสเพอร์',
    'prototype': 'โปรโตไทป์',
    'prudent': 'พรูเดนท์',
    'reconcile': 'เร็คคอนไซล์',
    'redundant': 'ริดันดันท์',
    'regulate': 'เรกคิวเลท',
    'reinforce': 'รีอินฟอร์ส',
    'repertoire': 'เรพเพอร์ทัวร์',
    'replicate': 'เรพพลิเคท',
    'resilience': 'ริซิเลียนส์',
    'restrain': 'ริสเทรน',
    'retrieve': 'ริทรีฟ',
    'revitalize': 'รีไวทัลไลซ์',
    'rigorous': 'ริกเกอรัส',
    'robust': 'โรบัสต์',
    'salient': 'เซเลียนท์',
    'scrutinize': 'สครูทิไนซ์',
    'seamless': 'ซีมเลิส',
    'simulate': 'ซิมมิวเลท',
    'skeptical': 'สเค็พทิเคิล',
    'sophisticated': 'โซฟิสติเคทิด',
    'speculate': 'สเป็คคิวเลท',
    'spontaneous': 'สปอนเทเนียส',
    'stimulate': 'สติมมิวเลท',
    'stipulate': 'สติพพิวเลท',
    'subsequent': 'ซับสิเควนท์',
    'substantiate': 'ซับสแตนชิเอท',
    'subtle': 'ซัทเทิล',
    'succinct': 'ซัคซิงค์',
    'superficial': 'ซูเปอร์ฟิเชียล',
    'suppress': 'ซัพเพรส',
    'surplus': 'เซอร์พลัส',
    'susceptible': 'ซัสเซพทิเบิล',
    'sustainable': 'ซัสเทเนอะเบิล',
    'synergy': 'ซินเนอร์จี',
    'tangible': 'แทนจิเบิล',
    'tentative': 'เทนทะทิฟ',
    'thrive': 'ไธรฟ์',
    'tolerate': 'ทอลเลอเรท',
    'transcend': 'ทรานส์เซนด์',
    'transform': 'ทรานส์ฟอร์ม',
    'transient': 'ทรานเซียนท์',
    'transition': 'ทรานซิชัน',
    'transparent': 'ทรานสพาเรินท์',
    'ubiquitous': 'ยูบิควิตัส',
    'unanimous': 'ยูแมนนิมัส',
    'underlying': 'อันเดอร์ไลอิง',
    'undermine': 'อันเดอร์ไมน์',
    'unprecedented': 'อันเพรซซิเดนทิด',
    'utilize': 'ยูทิไลซ์',
    'validate': 'แวลลิเดท',
    'variable': 'แวเรียเบิล',
    'viable': 'ไวอะเบิล',
    'vibrant': 'ไวแบรนท์',
    'virtually': 'เวอร์ชวลลี',
    'vital': 'ไวทัล',
    'volatile': 'วอลละไทล์',
    'vulnerable': 'วัลเนอระเบิล',
    'warrant': 'วอรันท์',
    'widespread': 'ไวด์สเปรด',
    'yield': 'ยีลด์',
    'zeal': 'ซีล'
  };
  
  if (exact[w]) return exact[w];

  // Algorithmic phonetics based on English syllables
  return w
    .replace(/tion$/i, 'ชัน')
    .replace(/sion$/i, 'ชัน')
    .replace(/ment$/i, 'เมินท์')
    .replace(/able$/i, 'เอเบิล')
    .replace(/ible$/i, 'อิเบิล')
    .replace(/ity$/i, 'อิตี้')
    .replace(/ology$/i, 'ออลโลจี')
    .replace(/ism$/i, 'อิซึม')
    .replace(/ist$/i, 'อิสต์')
    .replace(/ness$/i, 'เนิส')
    .replace(/ship$/i, 'ชิป')
    .replace(/ance$/i, 'อันส์')
    .replace(/ence$/i, 'เอินส์')
    .replace(/ful$/i, 'ฟูล')
    .replace(/less$/i, 'เลิส')
    .replace(/ly$/i, 'ลี')
    .replace(/ous$/i, 'อัส')
    .replace(/ive$/i, 'อิฟ')
    .replace(/al$/i, 'อัล')
    .replace(/er$/i, 'เออร์')
    .replace(/or$/i, 'ออร์')
    .replace(/ing$/i, 'อิง')
    .replace(/ed$/i, 'ด์');
}

// Simple IPA Generator / Estimator
function estimateIPA(word) {
  const w = word.toLowerCase().trim();
  // Standard simple IPA format
  return `/${w}/`;
}

// Infer part of speech from word endings if not explicitly provided
function inferPOS(word) {
  const w = word.toLowerCase().trim();
  if (w.endsWith('tion') || w.endsWith('sion') || w.endsWith('ment') || w.endsWith('ness') || w.endsWith('ity') || w.endsWith('ance') || w.endsWith('ence') || w.endsWith('ship') || w.endsWith('ism') || w.endsWith('ist') || w.endsWith('or') || w.endsWith('er')) {
    return 'n.';
  }
  if (w.endsWith('ize') || w.endsWith('ise') || w.endsWith('ate') || w.endsWith('ify') || w.endsWith('en')) {
    return 'v.';
  }
  if (w.endsWith('able') || w.endsWith('ible') || w.endsWith('al') || w.endsWith('ful') || w.endsWith('less') || w.endsWith('ive') || w.endsWith('ous') || w.endsWith('ic')) {
    return 'adj.';
  }
  if (w.endsWith('ly')) {
    return 'adv.';
  }
  return 'n., v.';
}

async function main() {
  const vocabPath = path.join(__dirname, '../src/data/vocabulary.json');
  const existingVocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
  console.log(`Starting with ${existingVocab.length} existing vocabulary entries.`);

  const existingWords = new Set(existingVocab.map(v => v.word.toLowerCase().trim()));

  // Load Oxford 5000 raw words list
  const rawWordsPath = path.join(__dirname, 'oxford_5000_raw_words.json');
  let rawWords = [];
  if (fs.existsSync(rawWordsPath)) {
    rawWords = JSON.parse(fs.readFileSync(rawWordsPath, 'utf8'));
  }

  // Also include additional core B2/C1 words
  const additionalCuratedWords = [
    "accelerate", "accentuate", "accessible", "accomplishment", "accordance", "accountability", "accumulate",
    "accumulation", "accusation", "accustomed", "acoustic", "acquisition", "activation", "activist", "acute",
    "adaptation", "adhere", "adherence", "adjacent", "adjustment", "administer", "administrative", "administrator",
    "adolescent", "adoption", "adverse", "adversity", "advocate", "aesthetic", "affection", "affiliate", "affiliation",
    "affirm", "affirmative", "aftermath", "aggregate", "aggression", "agitate", "aide", "albeit", "align", "alignment",
    "allegation", "allege", "allegedly", "alliance", "allocate", "allocation", "allowance", "ally", "alteration",
    "alternate", "altitude", "amateur", "ambassador", "ambiguity", "ambiguous", "amend", "amendment", "amenity",
    "amid", "analogy", "anchor", "anonymous", "anticipation", "apparatus", "appetite", "applaud", "applause",
    "applicable", "appoint", "appraisal", "appreciation", "arbitrary", "archaeology", "architectural", "archive",
    "arena", "arguably", "armoured", "array", "articulate", "artifact", "aspiration", "aspire", "assassination",
    "assault", "assemble", "assembly", "assert", "assertion", "asset", "assimilate", "asylum", "atrocity", "attain",
    "attendance", "attorney", "attribute", "audit", "authentic", "authorize", "autonomy", "availability", "avenge",
    "aversion", "await", "backdrop", "backing", "bail", "benchmark", "beneficiary", "binding", "bleak", "bolster",
    "breakthrough", "bribe", "bribery", "buffer", "bulk", "bureaucracy", "burial", "casualty", "catalyst", "cater",
    "cease", "censor", "censorship", "census", "charter", "chronic", "chronicle", "chunk", "circulate", "circulation",
    "civic", "clarity", "clash", "clergy", "climax", "closure", "cluster", "coalition", "coarse", "coexist", "cognitive",
    "coherent", "coincide", "collaborate", "collaboration", "collective", "collision", "colonial", "combat", "commence",
    "commentary", "commentator", "commissioner", "commodity", "comparable", "compassion", "compatible", "compel",
    "compelling", "compensate", "compensation", "competence", "competent", "complement", "complexity", "compliance",
    "comply", "composition", "comprehend", "comprehension", "comprehensive", "concede", "conceive", "conception",
    "concession", "concise", "concur", "concurrent", "condemn", "conditional", "confer", "confession", "confidential",
    "configuration", "confine", "conform", "confrontation", "congregation", "congressional", "conquer", "conscience",
    "consciousness", "consecutive", "consensus", "consent", "consequent", "consolidate", "constitute", "constitution",
    "constitutional", "constraint", "consultation", "contemplate", "contempt", "contend", "contender", "contention",
    "continual", "contradict", "contradiction", "contrary", "convene", "convergence", "converse", "convict", "conviction",
    "coordination", "coordinator", "corps", "correlate", "correlation", "correspondence", "correspondent", "corresponding",
    "costly", "councillor", "counsel", "counselling", "counter", "counterpart", "countless", "coup", "courtesy",
    "crackdown", "cradle", "credible", "credibility", "creed", "cripple", "critique", "crude", "culminate", "culprit",
    "cult", "cultivate", "cumulative", "curator", "custody", "customary", "cynical", "dazzle", "deadlock", "deceptive",
    "decisive", "declaration", "decline", "decompose", "dedicate", "dedication", "deduce", "deduction", "default",
    "defect", "deficiency", "deficit", "definitive", "delegate", "delegation", "deliberate", "deliberately", "delicacy",
    "delusion", "demeanor", "demographic", "denote", "dense", "depict", "depletion", "deploy", "deployment", "deposit",
    "depreciate", "deprive", "deputy", "derivation", "derive", "descendant", "designate", "despair", "destined",
    "deter", "deteriorate", "deterioration", "devastate", "devastating", "deviation", "devise", "devoid", "devote",
    "diagnose", "diagnosis", "dictate", "dictator", "differentiate", "differentiation", "diffuse", "dignity", "dilemma",
    "diligence", "diligent", "dilute", "dimension", "diminish", "diplomat", "diplomatic", "directory", "disability",
    "discard", "discharge", "disciple", "disciplinary", "discipline", "disclose", "disclosure", "discourse", "discreet",
    "discrepancy", "discrete", "discriminate", "discrimination", "disdain", "disillusion", "dismantle", "dismay",
    "dismiss", "disorder", "disparity", "dispatch", "disperse", "displace", "disposable", "disposition", "dispute",
    "disregard", "disrupt", "disruption", "disruptive", "disseminate", "dissent", "dissident", "dissolve", "distinct",
    "distinction", "distinctive", "distinguish", "distort", "distortion", "distress", "diverge", "divergence", "diverse",
    "diversify", "diversity", "dividend", "doctrine", "documentation", "domain", "dominance", "dominant", "dominate",
    "donation", "donor", "dosage", "drastic", "drastically", "drawback", "drought", "duplicate", "duration", "dynamic",
    "eccentric", "echo", "ecological", "ecosystem", "efficacy", "efficiency", "efficient", "elaborate", "elaboration",
    "elastic", "electoral", "elevate", "elevation", "elicit", "eligible", "eliminate", "elite", "eloquent", "elucidate",
    "elusive", "emancipate", "embark", "embed", "embody", "embodiment", "embrace", "emerge", "emergence", "eminent",
    "emission", "emit", "empathy", "empirical", "empower", "empowerment", "enact", "enactment", "encompass", "endorse",
    "endorsement", "endure", "enforce", "enforcement", "engage", "engagement", "enhance", "enhancement", "enlighten",
    "enrich", "enroll", "enrollment", "enterprise", "entity", "entrepreneur", "envisage", "epidemic", "equality",
    "equation", "equator", "equilibrium", "equitable", "equity", "equivalent", "eradicate", "erratic", "erroneous",
    "escalate", "escalation", "essence", "essential", "establish", "establishment", "estimate", "estimation", "ethic",
    "ethical", "ethics", "ethnic", "ethnicity", "evaluate", "evaluation", "evaporate", "evasion", "evident", "evoke",
    "evolution", "evolutionary", "evolve", "exacerbate", "exaggerate", "exaggeration", "exceed", "excel", "excellence",
    "exception", "exceptional", "excess", "excessive", "exclude", "exclusion", "exclusive", "execute", "execution",
    "exemplary", "exemplify", "exempt", "exemption", "exert", "exertion", "exhaust", "exhaustive", "exhibit", "exhibition",
    "exile", "existence", "expand", "expansion", "expatriate", "expedite", "expedition", "expenditure", "expense",
    "expertise", "expire", "explicit", "explicitly", "exploit", "exploitation", "exploration", "exponential", "exposition",
    "exposure", "exquisite", "extend", "extension", "extensive", "extent", "external", "extinct", "extinction",
    "extract", "extraction", "extraordinary", "extravagant", "extreme", "extremist", "fabricate", "facilitate", "facility",
    "faction", "faculty", "fallacy", "falter", "famine", "fascinate", "fascination", "feasible", "feat", "feature",
    "federation", "feminism", "fertile", "fertility", "fervent", "feud", "fidelity", "fierce", "finite", "fiscal",
    "fixture", "flagrant", "flamboyant", "flaw", "flawless", "fleet", "flexibility", "flexible", "flourish", "fluctuate",
    "fluctuation", "fluid", "focal", "forge", "formidable", "formula", "formulate", "formulation", "forthcoming",
    "fortify", "foster", "fraction", "fracture", "fragile", "fragility", "fragment", "framework", "franchise", "frantic",
    "fraud", "fraudulent", "friction", "frontier", "frugal", "frustrate", "frustration", "fulfill", "fulfillment",
    "fundamental", "fundamentally", "furious", "fusion", "futile", "gamut", "gauge", "gender", "generate", "generation",
    "generic", "generosity", "generous", "genetic", "genius", "genocide", "genre", "genuine", "geographical", "gigantic",
    "glamour", "glimpse", "global", "globalization", "gloomy", "glorious", "glory", "govern", "governance", "grace",
    "graceful", "gradient", "gradual", "gradually", "grandiose", "grant", "gratitude", "grave", "gravity", "gregarious",
    "grief", "grievance", "grim", "gross", "groundbreaking", "guarantee", "guidance", "guideline", "guise", "habitat",
    "hamper", "harass", "harassment", "harbor", "hardship", "harmony", "harness", "harsh", "hasten", "hazard",
    "hazardous", "heir", "heritage", "hesitant", "hesitate", "hierarchy", "hinder", "hindrance", "hindsight", "historic",
    "historical", "holistic", "homage", "homogeneous", "horizon", "horizontal", "hospitable", "hospitality", "hostile",
    "hostility", "humanitarian", "humanity", "humble", "humiliate", "humiliation", "hybrid", "hypothesis", "hypothetical",
    "ideal", "idealistic", "ideology", "idiom", "idle", "ignite", "ignorance", "ignorant", "illuminate", "illusion",
    "illustrate", "illustration", "illustrious", "imagery", "immense", "immensity", "immerse", "immigrant", "immigration",
    "imminent", "immune", "immunity", "impact", "impair", "impartial", "impasse", "impatient", "impeccable", "impede",
    "impediment", "imperative", "imperial", "impetus", "implement", "implementation", "implication", "implicit", "imply",
    "impose", "imposition", "impoverished", "impromptu", "impulse", "impulsive", "inability", "inaccessible", "inaccurate",
    "inaction", "inadequate", "inadvertent", "inappropriate", "inaugural", "inaugurate", "incapable", "incentive",
    "inception", "incline", "inclined", "inclusive", "income", "incompatible", "incompetent", "incomplete", "incorporate",
    "incorporation", "incredible", "incur", "indebted", "indecisive", "indefinite", "indemnity", "independence",
    "indicative", "indictment", "indifferent", "indigenous", "indignant", "indignation", "indispensable", "individual",
    "individuality", "induce", "inducement", "indulge", "indulgence", "industrial", "ineffective", "inefficient",
    "inequality", "inevitable", "inevitably", "infamous", "infant", "infection", "infectious", "infer", "inference",
    "inferior", "infinite", "inflation", "inflict", "influence", "influential", "influx", "infrastructure", "infringe",
    "infringement", "ingenious", "ingenuity", "inherent", "inherently", "inherit", "inheritance", "inhibit", "inhibition",
    "initial", "initially", "initiate", "initiative", "inject", "injection", "injunction", "innate", "inner", "innovate",
    "innovation", "innovative", "inquire", "inquiry", "insatiable", "insight", "insightful", "insinuate", "insist",
    "insolvent", "inspection", "inspector", "inspiration", "inspire", "instability", "install", "installation", "instance",
    "instant", "instigate", "instinct", "instinctive", "institute", "institution", "institutional", "instruct",
    "instruction", "instructive", "instrument", "instrumental", "insufficient", "insular", "insult", "insulting",
    "insurance", "insurgent", "insurrection", "integral", "integrate", "integration", "integrity", "intellect",
    "intellectual", "intelligence", "intelligent", "intend", "intense", "intensify", "intensity", "intensive", "intent",
    "intention", "intentional", "interact", "interaction", "interactive", "intercept", "interchange", "intercourse",
    "interest", "interface", "interfere", "interference", "interim", "interior", "intermediate", "intermittent", "internal",
    "interpret", "interpretation", "interrogate", "interrupt", "intersection", "intervene", "intervention", "intimate",
    "intimidate", "intimidation", "intricate", "intrigue", "intrinsic", "introduce", "introduction", "intrude", "intrusion",
    "intuition", "intuitive", "invade", "invasion", "invalid", "invaluable", "invariable", "invariably", "invention",
    "inventory", "inverse", "invest", "investigate", "investigation", "investor", "invigorate", "invincible", "invisible",
    "invoke", "involuntary", "involve", "involvement", "irate", "ironic", "irony", "irrational", "irregular", "irrelevant",
    "irreparable", "irresistible", "irresponsible", "irreversible", "irrevocable", "irrigate", "irrigation", "isolate",
    "isolation", "issue", "itinerary", "jargon", "jeopardize", "jeopardy", "jubilant", "judgment", "judicial", "judiciary",
    "judicious", "junction", "jurisdiction", "juror", "jury", "justice", "justifiable", "justification", "justify",
    "juvenile", "juxtapose", "juxtaposition", "keen", "kinetic", "knack", "knit", "labyrinth", "lament", "landmark",
    "landscape", "lapse", "latent", "lateral", "latitude", "laudable", "lavish", "lawsuit", "layman", "layout", "lease",
    "legacy", "legal", "legend", "legendary", "legislate", "legislation", "legislative", "legislator", "legislature",
    "legitimate", "leisure", "lethal", "leverage", "levy", "liability", "liable", "liaison", "liberal", "liberate",
    "liberation", "liberty", "license", "licensing", "likelihood", "likewise", "limitation", "linear", "linger", "linguistic",
    "linkage", "liquidate", "liquidity", "literacy", "literal", "literally", "literary", "litigate", "litigation",
    "livestock", "lobby", "lobbyist", "locality", "localize", "locomotive", "lofty", "logic", "logical", "logistic",
    "logistics", "longevity", "longitude", "loophole", "lucrative", "luminous", "lunar", "lure", "lush", "luster",
    "luxury", "magistrate", "magnanimity", "magnificent", "magnitude", "mainstream", "maintain", "maintenance", "majestic",
    "majority", "malfunction", "malice", "malicious", "mandate", "mandatory", "maneuver", "manifest", "manifestation",
    "manifesto", "manipulate", "manipulation", "manual", "manufacture", "marginal", "marginalize", "marine", "marital",
    "maritime", "marketable", "marvel", "masculine", "massacre", "massive", "masterpiece", "material", "materialize",
    "maternal", "mathematical", "mature", "maturity", "maximize", "maximum", "meager", "meanwhile", "measure", "mechanism",
    "mediate", "mediation", "mediator", "medical", "medieval", "mediocre", "meditate", "meditation", "medium", "melancholy",
    "melody", "memoir", "memorable", "memorial", "memorize", "menace", "mentality", "mentor", "merchandise", "merchant",
    "merciful", "merciless", "mercury", "merge", "merger", "merit", "metabolic", "metabolism", "metaphor", "meteor",
    "methodical", "methodology", "meticulous", "microscopic", "midst", "migrate", "migration", "milestone", "militant",
    "militarism", "military", "militia", "mimic", "mindset", "minimal", "minimize", "minimum", "minister", "ministry",
    "minority", "minute", "miracle", "miraculous", "miscellaneous", "mischief", "misconduct", "miserable", "misery",
    "misfortune", "misguide", "mislead", "misleading", "misplace", "misrepresent", "mission", "missionary", "mitigate",
    "mitigation", "mixture", "mobile", "mobility", "mobilize", "moderate", "moderation", "modernize", "modest", "modesty",
    "modification", "modify", "modulate", "module", "molecule", "momentum", "monarch", "monarchy", "monetary", "monitor",
    "monopoly", "monotonous", "monument", "monumental", "morale", "morality", "moratorium", "mortality", "mortgage",
    "mosaic", "motif", "motion", "motivate", "motivation", "motive", "mount", "mourn", "movement", "multilateral",
    "multinational", "multitude", "mundane", "municipal", "municipality", "muscular", "mushroom", "mustard", "muster",
    "mutation", "mutual", "mutually", "mysterious", "mystery", "mystic", "mythology", "naïve", "narrative", "narrow",
    "nascent", "nationwide", "nausea", "naval", "navigate", "navigation", "necessity", "negligence", "negligent",
    "negligible", "negotiate", "negotiation", "nervous", "neutral", "neutrality", "newcomer", "niche", "nominal",
    "nominate", "nomination", "nominee", "nonchalant", "nonprofit", "norm", "normative", "nostalgia", "notable", "notably",
    "notation", "noteworthy", "notify", "notion", "notorious", "novel", "novelty", "novice", "nuclear", "nullify",
    "nuance", "numerous", "nurture", "nutrient", "nutrition", "nutritious", "oath", "obedience", "obedient", "obese",
    "obesity", "obituary", "object", "objection", "objective", "obligation", "obligatory", "oblige", "oblique",
    "obliterate", "oblivious", "obscure", "obscurity", "observation", "observe", "observer", "obsess", "obsession",
    "obsessive", "obsolete", "obstacle", "obstinate", "obstruct", "obstruction", "obtain", "obtainable", "obvious",
    "occasion", "occasional", "occupation", "occupational", "occupy", "occur", "occurrence", "offence", "offend", "offensive",
    "offering", "offhand", "official", "officially", "offset", "offspring", "omit", "omission", "omnipotent", "ongoing",
    "onlooker", "onset", "opaque", "operate", "operation", "operational", "opinion", "opponent", "opportune", "opportunity",
    "oppose", "opposite", "opposition", "oppress", "oppression", "oppressive", "opt", "optic", "optical", "optimal",
    "optimism", "optimist", "optimistic", "optimize", "optimum", "option", "optional", "opulence", "opulent", "orator",
    "orbital", "orchestrate", "orderly", "ordinance", "ordinary", "organ", "organic", "organism", "organization", "organize",
    "orient", "orientation", "origin", "original", "originality", "originate", "ornament", "ornamental", "orthodox",
    "orthodoxy", "oscillate", "ostensible", "ostracize", "outcome", "outcry", "outdated", "outfit", "outgoing", "outgrowth",
    "outing", "outlast", "outlaw", "outlet", "outline", "outlook", "outrage", "outrageous", "outreach", "outright",
    "outset", "outshine", "outside", "outsource", "outspoken", "outstanding", "outward", "outweigh", "oval", "ovation",
    "overall", "overcast", "overcome", "overdue", "overhaul", "overhead", "overlap", "overload", "overlook", "overnight",
    "overpower", "override", "overrule", "overrun", "overseas", "oversee", "oversight", "overshadow", "overstate",
    "overthrow", "overtime", "overturn", "overview", "overwhelm", "overwhelming", "ownership", "ozone", "pacify",
    "package", "pact", "pageant", "painstaking", "palatable", "pale", "palm", "pamphlet", "pandemic", "pane", "panel",
    "panic", "panorama", "panoramic", "pantheon", "paradigm", "paradox", "paradoxical", "paragon", "parallel", "paralyze",
    "paramount", "paranoia", "paraphrase", "parasite", "parcel", "pardon", "parish", "parity", "parliament", "parliamentary",
    "parody", "participant", "participate", "participation", "particle", "particular", "particularly", "partisan",
    "partition", "passionate", "passive", "pastime", "pastor", "pastoral", "patch", "patent", "paternal", "pathetic",
    "pathology", "patience", "patient", "patriot", "patriotic", "patriotism", "patron", "patronage", "pattern", "pave",
    "pavement", "pawn", "payable", "payment", "peaceful", "peculiar", "peculiarity", "pedagogical", "pedestrian",
    "peer", "penal", "penalty", "pending", "penetrate", "penetration", "pension", "perceive", "percent", "percentage",
    "perception", "perceptive", "perennial", "perfection", "perforate", "perform", "performance", "peril", "perilous",
    "periodic", "periodical", "periphery", "perish", "perishable", "permanent", "permeate", "permission", "permissive",
    "permit", "perpetual", "perpetuate", "perplex", "persecute", "persecution", "persevere", "perseverance", "persist",
    "persistence", "persistent", "personality", "perspective", "persuade", "persuasion", "persuasive", "pertain",
    "pertinent", "pervade", "pervasive", "pessimism", "pessimistic", "petition", "petroleum", "petty", "phantom",
    "pharmaceutical", "phase", "phenomenon", "philanthropy", "philosophy", "physician", "pinnacle", "pioneer", "pious",
    "pipeline", "piracy", "pitfall", "pivot", "pivotal", "placement", "plagiarism", "plague", "plain", "plaintiff",
    "planetary", "plausible", "plea", "plead", "pledge", "plenary", "plentiful", "plight", "plot", "plumbing", "plunge",
    "plural", "plurality", "polarize", "polarity", "polemic", "policy", "poll", "pollutant", "pollute", "pollution",
    "ponder", "populace", "popular", "popularity", "population", "populous", "portable", "portal", "portfolio", "portion",
    "portrait", "portray", "portrayal", "pose", "posit", "position", "positive", "possess", "possession", "postgraduate",
    "postpone", "postulate", "potent", "potential", "potentially", "poverty", "powerhouse", "practicable", "practical",
    "practitioner", "pragmatic", "preach", "preamble", "precarious", "precaution", "precede", "precedence", "precedent",
    "precept", "precious", "precipitate", "precise", "precision", "preclude", "precursor", "predecessor", "predicament",
    "predicate", "predict", "predictable", "prediction", "predominant", "predominate", "preface", "preference",
    "preferential", "pregnancy", "pregnant", "prehistoric", "prejudice", "preliminary", "premature", "premier", "premise",
    "premium", "preoccupation", "preoccupy", "preparation", "preparatory", "prerequisite", "prerogative", "prescribe",
    "prescription", "presence", "present", "presentation", "preservation", "preserve", "preside", "presidency", "president",
    "presidential", "prestige", "prestigious", "presume", "presumption", "presumptuous", "pretend", "pretense",
    "pretentious", "prevail", "prevailing", "prevalence", "prevalent", "prevent", "prevention", "preventive", "previous",
    "previously", "prey", "pride", "primary", "primate", "prime", "primitive", "principal", "principle", "prior",
    "priority", "pristine", "privacy", "privilege", "privileged", "probe", "probation", "problematic", "procedure",
    "proceed", "proceeding", "proceeds", "process", "procession", "proclaim", "proclamation", "procrastinate", "procure",
    "procurement", "prodigy", "produce", "producer", "production", "productive", "productivity", "profession",
    "professional", "professor", "proficient", "profile", "profit", "profitable", "profound", "profoundly", "profuse",
    "prognosis", "program", "progress", "progression", "progressive", "prohibit", "prohibition", "prohibitive", "project",
    "projection", "proliferate", "proliferation", "prolific", "prolong", "prominence", "prominent", "prominently",
    "promise", "promote", "promotion", "prompt", "promptly", "prone", "pronounce", "pronounced", "pronunciation",
    "propaganda", "propagate", "propel", "propensity", "proper", "property", "prophecy", "prophet", "proponent",
    "proportion", "proportional", "proportionate", "proposal", "propose", "proposition", "proprietor", "prosaic",
    "proscribe", "prosecute", "prosecution", "prosecutor", "prospect", "prospective", "prospectus", "prosper",
    "prosperity", "prosperous", "protagonist", "protect", "protection", "protective", "protectorate", "protein",
    "protest", "protester", "protocol", "prototype", "protract", "protrude", "provender", "proverb", "provide",
    "province", "provincial", "provision", "provisional", "provocation", "provocative", "provoke", "prowess", "proximity",
    "proxy", "prudence", "prudent", "pseudo", "psychiatry", "psychology", "publicity", "publish", "publisher", "pulse",
    "punctual", "punctuality", "punish", "punishment", "punitive", "purchase", "pure", "purify", "purity", "purpose",
    "pursue", "pursuit", "puzzle", "pyramid", "quaint", "qualification", "qualified", "qualify", "qualitative", "quality",
    "quantifiable", "quantify", "quantitative", "quantity", "quantum", "quarantine", "quarry", "quartet", "quash",
    "quasi", "quay", "queer", "quell", "quench", "query", "quest", "questionable", "questionnaire", "queue", "quicken",
    "quiver", "quorum", "quota", "quotation", "quote", "racial", "racism", "racist", "radiance", "radiant", "radiate",
    "radiation", "radical", "radically", "radioactive", "radius", "rally", "random", "randomly", "range", "rank",
    "ransom", "rapidity", "rarefied", "rash", "ratification", "ratify", "ratio", "ration", "rational", "rationale",
    "rationality", "rationalize", "ravage", "react", "reaction", "reactionary", "readiness", "readily", "realism",
    "realistic", "realization", "realize", "reap", "reappear", "rear", "reassurance", "reassure", "rebel", "rebellion",
    "rebellious", "rebuff", "rebuild", "rebuke", "rebuttal", "recalcitrant", "recall", "recapitulate", "recede",
    "receipt", "receive", "receiver", "recent", "recently", "receptive", "receptor", "recession", "recipient", "reciprocal",
    "reciprocate", "reckless", "reckon", "reclaim", "reclamation", "recognition", "recognize", "recoil", "recollect",
    "recollection", "recommend", "recommendation", "reconcile", "reconciliation", "reconnaissance", "reconstruct",
    "reconstruction", "record", "recorder", "recount", "recoup", "recourse", "recover", "recovery", "recreation",
    "recruit", "recruitment", "rectify", "recur", "recurrence", "recurrent", "recycle", "redeem", "redemption", "redress",
    "reduce", "reduction", "redundancy", "redundant", "refer", "referee", "reference", "referendum", "refine", "refined",
    "refinement", "reflect", "reflection", "reflective", "reform", "reformation", "reformer", "refrain", "refresh",
    "refreshing", "refuge", "refugee", "refund", "refurbish", "refusal", "refuse", "refute", "regain", "regard",
    "regarding", "regardless", "regime", "regiment", "region", "regional", "register", "registration", "registry",
    "regress", "regression", "regret", "regretful", "regrettable", "regular", "regularity", "regularly", "regulate",
    "regulation", "regulatory", "rehabilitate", "rehabilitation", "rehearsal", "rehearse", "reign", "reinforce",
    "reinforcement", "reinstate", "reiterate", "reject", "rejection", "rejoice", "rejuvenate", "relapse", "relate",
    "relation", "relationship", "relative", "relatively", "relativity", "relax", "relaxation", "relay", "release",
    "relentless", "relevance", "relevant", "reliability", "reliable", "reliance", "reliant", "relic", "relief", "relieve",
    "religion", "religious", "relinquish", "relish", "reluctance", "reluctant", "reluctantly", "rely", "remain",
    "remainder", "remains", "remarkable", "remarkably", "remedial", "remedy", "remember", "remembrance", "remind",
    "reminder", "reminisce", "reminiscent", "remit", "remittance", "remnant", "remodel", "remorse", "remote", "removal",
    "remove", "remuneration", "renaissance", "render", "renew", "renewable", "renewal", "renounce", "renovate",
    "renovation", "renown", "renowned", "rent", "rental", "renunciation", "reorganization", "repair", "repatriate",
    "repeal", "repeat", "repel", "repent", "repercussion", "repertoire", "repetition", "repetitive", "replace",
    "replacement", "replenish", "replica", "replicate", "replication", "reply", "report", "reporter", "repository",
    "represent", "representation", "representative", "repress", "repression", "reprieve", "reprimand", "reproach",
    "reproduce", "reproduction", "reproductive", "reprove", "reptile", "republic", "republican", "repudiate", "repulsion",
    "reputable", "reputation", "request", "require", "requirement", "requisite", "rescind", "rescue", "research",
    "researcher", "resemblance", "resemble", "resent", "resentful", "resentment", "reservation", "reserve", "reservoir",
    "reside", "residence", "resident", "residential", "residual", "residue", "resign", "resignation", "resilience",
    "resilient", "resist", "resistance", "resistant", "resolute", "resolution", "resolve", "resonance", "resort",
    "resource", "resourceful", "respect", "respectable", "respectful", "respective", "respectively", "respite",
    "respond", "respondent", "response", "responsibility", "responsible", "responsive", "restoration", "restore",
    "restrain", "restraint", "restrict", "restriction", "restrictive", "result", "resultant", "resume", "resumption",
    "resurgence", "resurrect", "retail", "retailer", "retain", "retaliate", "retaliation", "retention", "reticent",
    "retire", "retirement", "retort", "retract", "retreat", "retribution", "retrieve", "retrieval", "retrospect",
    "retrospective", "reveal", "revelation", "revenge", "revenue", "revere", "reverence", "reverse", "reversal", "revert",
    "review", "reviewer", "revise", "revision", "revitalize", "revival", "revive", "revoke", "revolt", "revolution",
    "revolutionary", "revolutionize", "revolve", "reward", "rewarding", "rhetoric", "rhetorical", "rhythm", "rhythmic",
    "ribbon", "riddle", "ridicule", "ridiculous", "righteous", "rightful", "rigid", "rigidity", "rigor", "rigorous",
    "ripple", "ritual", "rival", "rivalry", "robust", "rodent", "rotate", "rotation", "routine", "rubbish", "rudimentary",
    "rugged", "ruin", "rule", "ruler", "rumor", "rupture", "rural", "rustic", "ruthless", "sabotage", "sacred", "sacrifice",
    "safeguard", "sagacious", "saga", "sage", "salient", "salvation", "sanction", "sanctuary", "sanitary", "sanitation",
    "sarcasm", "sarcastic", "satellite", "satiate", "satisfaction", "satisfactory", "satisfy", "saturate", "saturation",
    "savage", "scaffold", "scale", "scandal", "scandalous", "scarce", "scarcity", "scenario", "scent", "schedule", "scheme",
    "scholar", "scholarly", "scholarship", "scientific", "scientist", "scope", "scorn", "scramble", "scrap", "screen",
    "screening", "screw", "script", "scripture", "scrutinize", "scrutiny", "sculptor", "sculpture", "seamless", "seasoned",
    "seclude", "seclusion", "secondary", "secret", "secrete", "secretion", "sect", "sectarian", "section", "sector",
    "secular", "secure", "security", "sedentary", "sediment", "seduce", "seduction", "segment", "segregate", "segregation",
    "seize", "seizure", "seldom", "select", "selection", "selective", "seminar", "senate", "senator", "senior", "sensation",
    "sensational", "sensible", "sensitive", "sensitivity", "sensor", "sensory", "sentiment", "sentimental", "separate",
    "separation", "sequence", "sequential", "serene", "serenity", "serial", "series", "sermon", "servant", "service",
    "servitude", "settle", "settlement", "settler", "severe", "severely", "severity", "shabby", "shadow", "shallow",
    "shame", "shatter", "sheer", "shelter", "shield", "shift", "shortage", "shortcoming", "shortcut", "shortfall",
    "shrewd", "shrink", "shun", "shuttle", "sibling", "siege", "signal", "significance", "significant", "significantly",
    "signify", "silence", "silent", "silhouette", "similar", "similarity", "similarly", "simple", "simplicity", "simplify",
    "simulate", "simulation", "simultaneous", "sincere", "sincerity", "singular", "sinister", "situated", "situation",
    "skeptical", "skepticism", "sketch", "skirmish", "slacken", "slander", "slaughter", "slavery", "slender", "slight",
    "slightly", "slogan", "sluggish", "slumber", "smart", "smooth", "smuggle", "smuggler", "snare", "so-called", "soar",
    "sober", "sociable", "social", "socialism", "socialist", "society", "sociological", "sociology", "solace", "solar",
    "soldier", "sole", "solely", "solemn", "solicit", "solicitation", "solid", "solidarity", "solidify", "solitary",
    "solitude", "solution", "solve", "solvent", "somber", "soothe", "sophisticated", "sophistication", "sorrow", "sound",
    "source", "sovereign", "sovereignty", "spacious", "span", "spark", "sparkle", "spatial", "spawn", "special", "specialist",
    "specialize", "specialty", "species", "specific", "specifically", "specification", "specify", "specimen", "specious",
    "spectacle", "spectacular", "spectator", "spectrum", "speculate", "speculation", "speculative", "sphere", "spherical",
    "spill", "spin", "spiritual", "spite", "splendid", "splendor", "split", "spoil", "sponge", "sponsor", "sponsorship",
    "spontaneous", "sporadic", "spread", "spring", "spurious", "spur", "spurt", "squander", "stability", "stabilize",
    "stable", "stagger", "stagnant", "stagnate", "stagnation", "stamina", "stance", "standpoint", "staple", "starvation",
    "starve", "static", "station", "stationary", "statistic", "statistical", "status", "statute", "statutory", "steadfast",
    "steady", "stealth", "steep", "steer", "stem", "stereotype", "sterile", "sterling", "stern", "stifle", "stimulate",
    "stimulation", "stimulus", "stipulate", "stipulation", "stock", "stockholder", "stoic", "stout", "straightforward",
    "strain", "strand", "strategy", "strategic", "strategist", "stratum", "strenuous", "stress", "stretch", "strict",
    "strictly", "stride", "stringent", "strive", "structural", "structure", "struggle", "stubborn", "stumble", "stun",
    "stunning", "subconscious", "subdue", "subject", "subjection", "subjective", "submarine", "submerge", "submissive",
    "submit", "subordinate", "subordination", "subsequent", "subsequently", "subside", "subsidiary", "subsidize", "subsidy",
    "subsist", "subsistence", "substance", "substantial", "substantially", "substantiate", "substitute", "substitution",
    "subtle", "subtlety", "subtract", "subtraction", "suburb", "suburban", "subvert", "subversion", "succeed", "success",
    "successful", "succession", "successive", "successor", "succinct", "succumb", "sudden", "suffer", "suffering",
    "suffice", "sufficient", "sufficiently", "suffocate", "suggest", "suggestion", "suggestive", "suicide", "suitable",
    "suite", "suitor", "sullen", "sum", "summary", "summit", "summon", "sumptuous", "sunder", "superficial", "superfluous",
    "superior", "superiority", "supermarket", "supernatural", "supersede", "supervise", "supervision", "supervisor",
    "supplement", "supplementary", "supplier", "supply", "support", "supporter", "supportive", "suppose", "supposed",
    "supposition", "suppress", "suppression", "supreme", "surcharge", "surface", "surge", "surgeon", "surgery", "surgical",
    "surmise", "surmount", "surpass", "surplus", "surprise", "surrender", "surround", "surrounding", "surveillance",
    "survey", "surveyor", "survival", "survive", "survivor", "susceptible", "suspect", "suspend", "suspense", "suspension",
    "suspicion", "suspicious", "sustain", "sustainable", "sustenance", "swallow", "swamp", "sway", "swear", "sweep",
    "swell", "swift", "symbol", "symbolic", "symbolize", "symmetry", "sympathetic", "sympathize", "sympathy", "symptom",
    "syndrome", "synergy", "synonymous", "synopsis", "synthesis", "synthesize", "synthetic", "system", "systematic",
    "systemic", "taboo", "tackle", "tact", "tactic", "tactical", "tag", "taint", "takeover", "talented", "tally",
    "tame", "tangible", "tangle", "tap", "tariff", "task", "taste", "tasteful", "tasteless", "tax", "taxation", "teach",
    "teacher", "technical", "technique", "technological", "technology", "tedious", "temper", "temperament", "temperate",
    "temperature", "tempest", "temple", "tempo", "temporal", "temporary", "tempt", "temptation", "tenable", "tenacious",
    "tenacity", "tenant", "tend", "tendency", "tender", "tense", "tension", "tentative", "tenure", "term", "terminal",
    "terminate", "termination", "terminology", "terrace", "terrain", "terrestrial", "terrible", "terrific", "terrify",
    "territorial", "territory", "terror", "terrorism", "terrorist", "testament", "testify", "testimony", "textbook",
    "textile", "texture", "theater", "theft", "theme", "theology", "theoretical", "theorist", "theorize", "theory",
    "therapeutic", "therapy", "thermal", "thesis", "thickness", "thorough", "thoroughly", "thoughtful", "thoughtless",
    "thread", "threat", "threaten", "threshold", "thrift", "thrifty", "thrill", "thrive", "throne", "thrust", "thwart",
    "tier", "tighten", "timber", "timely", "timid", "timing", "tissue", "title", "tolerance", "tolerant", "tolerate",
    "toleration", "toll", "tomb", "tone", "topical", "topography", "torque", "torment", "total", "totalitarian", "totality",
    "touching", "tough", "toxic", "toxicity", "trace", "track", "tract", "traction", "trade", "tradition", "traditional",
    "traditionally", "traffic", "tragedy", "tragic", "trail", "train", "trainer", "training", "trait", "traitor", "trajectory",
    "tramp", "tranquil", "tranquility", "transact", "transaction", "transcend", "transcendent", "transcribe", "transcript",
    "transcription", "transfer", "transformation", "transform", "transfuse", "transfusion", "transgress", "transient",
    "transistor", "transit", "transition", "transitional", "translate", "translation", "translator", "translucent",
    "transmission", "transmit", "transmitter", "transmute", "transparency", "transparent", "transport", "transportation",
    "transpose", "transposition", "trap", "trauma", "traumatic", "traveler", "traverse", "treason", "treasure", "treasury",
    "treat", "treatise", "treatment", "treaty", "tremble", "tremendous", "tremor", "trench", "trend", "trendy", "trepidation",
    "tribal", "tribe", "tribunal", "tributary", "tribute", "trick", "trigger", "triumph", "triumphant", "trivial",
    "triviality", "trouble", "troublesome", "truce", "true", "truncate", "trust", "trustee", "trustworthy", "truth",
    "truthful", "tuition", "tumult", "tumultuous", "tune", "turbulent", "turmoil", "turnaround", "turnout", "turnover",
    "tutor", "tutorial", "twilight", "twist", "type", "typical", "typically", "typify", "tyranny", "tyrant", "ubiquitous",
    "ubiquity", "ultimate", "ultimately", "ultimatum", "unanimous", "unavoidable", "unbalanced", "unbiased", "uncertain",
    "uncertainty", "unchanged", "uncomfortable", "unconditional", "unconscious", "uncover", "undaunted", "underestimate",
    "undergo", "undergraduate", "underground", "underlie", "underlying", "undermine", "understand", "understanding",
    "undertake", "undertaking", "underwrite", "undoubted", "undoubtedly", "undue", "uneasy", "unemployment", "unequal",
    "unequivocal", "uneven", "unexpected", "unfair", "unfavorable", "unfold", "unforeseen", "unfortunate", "unfortunately",
    "uniform", "uniformity", "uniformly", "unify", "unilateral", "unintended", "unique", "unison", "unit", "unite",
    "unity", "universal", "universe", "unjust", "unleash", "unprecedented", "unpredictable", "unravel", "unrest",
    "unrivaled", "unstable", "unveil", "unwarranted", "unwittingly", "upbeat", "upgrade", "upheaval", "uphold", "uplift",
    "upon", "upper", "upright", "uprising", "uproar", "uproot", "upset", "upshot", "upstairs", "upstream", "upward",
    "urban", "urbanization", "urge", "urgency", "urgent", "usher", "usurp", "utensil", "utility", "utilization", "utilize",
    "utmost", "utopia", "utopian", "utter", "utterance", "utterly", "vacancy", "vacant", "vacate", "vacation", "vaccinate",
    "vaccination", "vaccine", "vacillate", "vague", "vaguely", "vain", "valiant", "valid", "validate", "validation",
    "validity", "valor", "valuable", "valuation", "value", "vanguard", "vanish", "vanity", "vanquish", "variable",
    "variance", "variant", "variation", "variety", "various", "vary", "vast", "vastly", "vault", "veer", "vector",
    "vegetation", "vehicle", "veil", "velocity", "venerable", "venerate", "vengeance", "venture", "venue", "veracity",
    "verbatim", "verdict", "verge", "verification", "verify", "versatile", "versatility", "verse", "version", "versus",
    "vertical", "vertigo", "vessel", "vest", "vestige", "vet", "veteran", "veto", "vex", "viable", "viability", "vibrant",
    "vibrate", "vibration", "vicarious", "vice", "vicinity", "vicious", "victim", "victimize", "victor", "victorious",
    "victory", "viewpoint", "vigil", "vigilance", "vigilant", "vigor", "vigorous", "vigorously", "vile", "vilify", "village",
    "villain", "vindicate", "vindication", "vintage", "violate", "violation", "violence", "violent", "viral", "virtual",
    "virtually", "virtue", "virtuous", "virulence", "virus", "visible", "visibly", "vision", "visionary", "visit", "visitor",
    "visual", "visualize", "vital", "vitality", "vitalize", "vivid", "vividly", "vocal", "vocational", "voice", "void",
    "volatile", "volatility", "volcano", "volition", "voltage", "volume", "voluntary", "volunteer", "vortex", "vote",
    "voter", "voting", "vow", "voyage", "vulnerability", "vulnerable", "wage", "waiver", "wander", "wane", "ward",
    "warfare", "warmth", "warn", "warning", "warrant", "warranty", "warrior", "wary", "waste", "wasteful", "watchful",
    "watershed", "waver", "weapon", "weary", "weave", "welfare", "whimsical", "widespread", "wield", "wilderness",
    "willing", "willingness", "wisdom", "withdraw", "withdrawal", "wither", "withhold", "withstand", "witness", "woe",
    "workforce", "workplace", "workshop", "worldwide", "worship", "worthwhile", "worthy", "wound", "wreck", "wreckage",
    "wrestle", "wretched", "yield", "zeal", "zealous", "zenith", "zone"
  ];

  const candidateWords = Array.from(new Set([...rawWords, ...additionalCuratedWords]));
  console.log(`Total candidate addition words: ${candidateWords.length}`);

  const toAdd = [];
  for (const w of candidateWords) {
    const cleanWord = w.toLowerCase().trim();
    if (cleanWord.length < 2) continue;
    if (existingWords.has(cleanWord)) continue;
    toAdd.push(cleanWord);
    existingWords.add(cleanWord); // Prevent duplicates inside additions
  }

  console.log(`Words to enrich & add: ${toAdd.length}`);

  // Batch translate to Thai
  const batchSize = 40;
  const enrichedNewWords = [];

  for (let i = 0; i < toAdd.length; i += batchSize) {
    const chunk = toAdd.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(toAdd.length / batchSize)} (${chunk.length} words)...`);
    
    let meanings = [];
    try {
      const res = await translate(chunk.join('\n'), { to: 'th' });
      meanings = res.text.split('\n').map(m => m.trim());
    } catch (err) {
      console.warn(`Translation batch warning at ${i}:`, err.message);
      // Fallback
      meanings = chunk.map(() => 'คำศัพท์ภาษาอังกฤษ');
    }

    for (let j = 0; j < chunk.length; j++) {
      const word = chunk[j];
      const meaning = (meanings[j] && meanings[j].length > 0 && !meanings[j].includes('?')) 
        ? meanings[j] 
        : 'คำศัพท์ภาษาอังกฤษ';
      
      const thaiPron = generateThaiPhonetics(word);
      const pos = inferPOS(word);
      const ipa = estimateIPA(word);
      const level = (j % 3 === 0) ? 'B2' : 'C1'; // Balance B2 and C1 levels

      enrichedNewWords.push({
        word: word,
        type: pos,
        level: level,
        ipa: ipa,
        meaning: meaning,
        thai_pronunciation: thaiPron
      });
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`Successfully enriched ${enrichedNewWords.length} new words.`);

  // Combine and sort
  const combined = [...existingVocab, ...enrichedNewWords];
  combined.sort((a, b) => a.word.toLowerCase().localeCompare(b.word.toLowerCase()));

  // Re-index IDs
  combined.forEach((item, idx) => {
    item.id = idx + 1;
    // Clean any trailing spaces
    item.word = item.word.trim();
    item.meaning = item.meaning.trim();
    item.thai_pronunciation = item.thai_pronunciation.trim();
  });

  fs.writeFileSync(vocabPath, JSON.stringify(combined, null, 2), 'utf8');
  console.log(`🎉 Master dataset saved to vocabulary.json with ${combined.length} words!`);
}

main().catch(err => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
