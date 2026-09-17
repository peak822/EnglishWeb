export const POS_MAP = {
  'n.': 'Noun',
  'v.': 'Verb',
  'adj.': 'Adjective',
  'adv.': 'Adverb',
  'prep.': 'Preposition',
  'pron.': 'Pronoun',
  'conj.': 'Conjunction'
};

export const POS_DETAILS = {
  'Noun': {
    nameEn: 'Noun',
    nameTh: 'คำนาม',
    descTh: 'คน สัตว์ สิ่งของ สถานที่',
    icon: '🏷️',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(56, 189, 248, 0.4)',
    glow: '0 0 15px rgba(56, 189, 248, 0.3)'
  },
  'Verb': {
    nameEn: 'Verb',
    nameTh: 'คำกริยา',
    descTh: 'การกระทำ สภาพ เหตุการณ์',
    icon: '⚡',
    color: '#4ade80',
    bg: 'rgba(74, 222, 128, 0.12)',
    border: 'rgba(74, 222, 128, 0.4)',
    glow: '0 0 15px rgba(74, 222, 128, 0.3)'
  },
  'Adjective': {
    nameEn: 'Adjective',
    nameTh: 'คำคุณศัพท์',
    descTh: 'ขยายนาม บอกลักษณะ สี ขนาด',
    icon: '✨',
    color: '#facc15',
    bg: 'rgba(250, 204, 21, 0.12)',
    border: 'rgba(250, 204, 21, 0.4)',
    glow: '0 0 15px rgba(250, 204, 21, 0.3)'
  },
  'Adverb': {
    nameEn: 'Adverb',
    nameTh: 'คำกริยาวิเศษณ์',
    descTh: 'ขยายกริยา/คุณศัพท์ อย่างไร ที่ไหน',
    icon: '🚀',
    color: '#c084fc',
    bg: 'rgba(192, 132, 252, 0.12)',
    border: 'rgba(192, 132, 252, 0.4)',
    glow: '0 0 15px rgba(192, 132, 252, 0.3)'
  },
  'Pronoun': {
    nameEn: 'Pronoun',
    nameTh: 'คำสรรพนาม',
    descTh: 'ใช้แทนคำนาม (I, you, he, they)',
    icon: '👤',
    color: '#f472b6',
    bg: 'rgba(244, 114, 182, 0.12)',
    border: 'rgba(244, 114, 182, 0.4)',
    glow: '0 0 15px rgba(244, 114, 182, 0.3)'
  },
  'Preposition': {
    nameEn: 'Preposition',
    nameTh: 'คำบุพบท',
    descTh: 'บอกตำแหน่ง เวลา ทิศทาง (in, on, at)',
    icon: '📍',
    color: '#fb923c',
    bg: 'rgba(251, 146, 60, 0.12)',
    border: 'rgba(251, 146, 60, 0.4)',
    glow: '0 0 15px rgba(251, 146, 60, 0.3)'
  },
  'Conjunction': {
    nameEn: 'Conjunction',
    nameTh: 'คำสันธาน',
    descTh: 'คำเชื่อมประโยค (and, but, because)',
    icon: '🔗',
    color: '#22d3ee',
    bg: 'rgba(34, 211, 238, 0.12)',
    border: 'rgba(34, 211, 238, 0.4)',
    glow: '0 0 15px rgba(34, 211, 238, 0.3)'
  }
};

export function extractAllPOS(rawType) {
  if (!rawType) return [];
  const matches = rawType.match(/(?:^|\s|\b|,)(n\.|v\.|adj\.|adv\.|prep\.|pron\.|conj\.)/g);
  if (!matches) return [];
  const posSet = new Set();
  matches.forEach(m => {
    const clean = m.replace(/^[,\s]+/, '');
    if (POS_MAP[clean]) {
      posSet.add(POS_MAP[clean]);
    }
  });
  return Array.from(posSet);
}

export function extractPrimaryPOS(rawType) {
  const all = extractAllPOS(rawType);
  return all.length > 0 ? all[0] : null;
}

export function generateQuestion(vocabList) {
  const validVocab = vocabList.filter(v => extractAllPOS(v.type).length > 0);
  if (validVocab.length === 0) return null;

  // Pick a random word
  const wordObj = validVocab[Math.floor(Math.random() * validVocab.length)];
  const validPOSList = extractAllPOS(wordObj.type);
  const primaryPOS = validPOSList[Math.floor(Math.random() * validPOSList.length)];
  
  const allPos = Object.values(POS_MAP);
  // Incorrect POS pool: all POS not belonging to this word
  const incorrectPool = allPos.filter(pos => !validPOSList.includes(pos));
  
  // Shuffle incorrect pool and pick 3
  const shuffledIncorrect = [...incorrectPool].sort(() => 0.5 - Math.random());
  const selectedIncorrect = shuffledIncorrect.slice(0, 3);
  
  // Combine primary valid POS + 3 incorrect choices
  const options = [primaryPOS, ...selectedIncorrect].sort(() => 0.5 - Math.random());
  
  return {
    currentWord: wordObj,
    correctPOS: primaryPOS,
    validPOSList: validPOSList,
    options: options
  };
}
