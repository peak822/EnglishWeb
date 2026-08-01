const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

console.log('Total vocab entries:', vocab.length);

const commaWords = vocab.filter(v => v.word && (v.word.includes(',') || v.word.includes('/') || v.word.includes(' ')));
console.log('Words with comma, slash, or space:', commaWords.length);
console.log('Examples:', commaWords.slice(0, 20).map(v => v.word));

// Search for 'the'
const theMatch = vocab.filter(v => v.word && v.word.toLowerCase().includes('the'));
console.log('\nMatches for "the":', theMatch.map(v => v.word));

// Search for 'be'
const beMatch = vocab.filter(v => v.word && (v.word.toLowerCase() === 'be' || v.word.toLowerCase().startsWith('be')));
console.log('\nMatches for "be":', beMatch.slice(0, 10).map(v => v.word));
