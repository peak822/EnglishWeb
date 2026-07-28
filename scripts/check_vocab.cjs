const fs = require('fs');
const vocab = JSON.parse(fs.readFileSync('src/data/vocabulary.json', 'utf8'));
let errors = [];
vocab.forEach((item, index) => {
  if (!item.word) errors.push('Missing word at index ' + index + ' (ID: ' + item.id + ')');
  if (!item.meaning || item.meaning.trim() === '') errors.push('Missing meaning for word ' + item.word + ' (ID: ' + item.id + ')');
  if (item.meaning && item.meaning.includes('?')) errors.push('Question mark in meaning for word ' + item.word + ' (ID: ' + item.id + ')');
});
console.log('Total words:', vocab.length);
console.log('Total errors found:', errors.length);
if (errors.length > 0) {
  console.log('Sample errors:', errors.slice(0, 10));
}
