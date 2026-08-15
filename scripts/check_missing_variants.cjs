const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));
const vocabWords = new Set(vocab.map(v => v.word.toLowerCase().trim()));

const commonWords = [
  'color', 'colour', 'favorite', 'favourite', 'theater', 'theatre', 'center', 'centre',
  'meter', 'metre', 'neighbor', 'neighbour', 'practice', 'practise', 'gray', 'grey',
  'hello', 'hi', 'yes', 'no', 'please', 'thank', 'thanks', 'sorry', 'goodbye', 'bye'
];

const missing = commonWords.filter(w => !vocabWords.has(w));
console.log('Missing common words:', missing);
