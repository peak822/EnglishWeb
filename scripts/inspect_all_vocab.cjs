const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

const strangeWords = [];
vocab.forEach((v, index) => {
  if (!v.word) {
    strangeWords.push({ index, id: v.id, issue: 'empty word', item: v });
  } else {
    if (/[0-9]/.test(v.word)) {
      strangeWords.push({ index, id: v.id, issue: 'has numbers', word: v.word, item: v });
    }
    if (/[,/]/.test(v.word)) {
      strangeWords.push({ index, id: v.id, issue: 'has comma or slash', word: v.word, item: v });
    }
    if (v.word.includes(' ') && !['have to', 'ice cream', 'next to', 'no one', 'according to', 'all right', 'any more', 'per cent', 'used to'].includes(v.word)) {
      strangeWords.push({ index, id: v.id, issue: 'unexpected spaces', word: v.word, item: v });
    }
  }
});

console.log('Strange words count:', strangeWords.length);
console.log(JSON.stringify(strangeWords, null, 2));
