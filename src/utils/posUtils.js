export const POS_MAP = {
  'n.': 'Noun',
  'v.': 'Verb',
  'adj.': 'Adjective',
  'adv.': 'Adverb',
  'prep.': 'Preposition',
  'pron.': 'Pronoun',
  'conj.': 'Conjunction'
};

export function extractPrimaryPOS(rawType) {
  if (!rawType) return null;
  // Match the first distinct POS tag from our supported map
  const match = rawType.match(/\b(n\.|v\.|adj\.|adv\.|prep\.|pron\.|conj\.)\b/);
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
