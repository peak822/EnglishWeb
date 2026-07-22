const fs = require('fs');
const path = require('path');

const oldVocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));
const newVocab = JSON.parse(fs.readFileSync(path.join(__dirname, './memmoread_data.json'), 'utf8'));

const wordMap = new Map();
oldVocab.forEach(item => {
    wordMap.set(item.word.toLowerCase(), item);
});

const merged = [];

newVocab.forEach((item, index) => {
    const oldItem = wordMap.get(item.word.toLowerCase());
    merged.push({
        id: index + 1,
        word: item.word,
        type: item.type,
        meaning: item.meaning,
        thai_pronunciation: item.thai_pronunciation,
        ipa: item.ipa,
        level: oldItem ? oldItem.level : 'A1'
    });
});

fs.writeFileSync(path.join(__dirname, '../src/data/vocabulary.json'), JSON.stringify(merged, null, 2));
console.log('Merged vocabulary saved! Total words: ' + merged.length);
