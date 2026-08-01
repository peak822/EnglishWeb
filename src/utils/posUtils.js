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

export function extractPrimaryPOS(rawType) {
  if (!rawType) return null;
  // Match one of the supported POS tags, ensuring it's not part of another word
  const match = rawType.match(/(?:^|\s|\b)(n\.|v\.|adj\.|adv\.|prep\.|pron\.|conj\.)/);
  return match ? POS_MAP[match[1]] : null;
}

export function generateQuestion(vocabList) {
  const validVocab = vocabList.filter(v => extractPrimaryPOS(v.type));
  if (validVocab.length === 0) return null;

  // Pick a random word
  const wordObj = validVocab[Math.floor(Math.random() * validVocab.length)];
  const correctPOS = extractPrimaryPOS(wordObj.type);
  
  const allPos = Object.values(POS_MAP);
  let options = new Set([correctPOS]);
  
  // Fill options with random incorrect POS until we have 4 choices
  while(options.size < 4) {
    const randomPos = allPos[Math.floor(Math.random() * allPos.length)];
    options.add(randomPos);
  }
  
  return {
    currentWord: wordObj,
    correctPOS: correctPOS,
    // Shuffle the 4 options
    options: Array.from(options).sort(() => Math.random() - 0.5)
  };
}
