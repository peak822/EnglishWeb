const fs = require('fs');
const vocab = require('../src/data/vocabulary.json');

const shortWords = vocab.filter(v => (v.word || '').length <= 3);
console.log('Short words (<= 3 chars) count:', shortWords.length);

const issues = [];
shortWords.forEach(w => {
  const ipa = w.ipa || '';
  const thai = w.thai_pronunciation || '';
  const word = w.word || '';

  // Check if IPA or Thai looks weird
  if (!ipa || ipa.length < 2 || !thai || thai.includes('อ็อ') || thai.includes('เอพ') || thai.includes('อั') && !['us', 'up', 'sun', 'run', 'cut', 'nut', 'hut', 'but', 'bus', 'cup', 'mud', 'rub', 'tub', 'gun', 'fun', 'pun', 'nun', 'bun'].includes(word.toLowerCase())) {
    issues.push(w);
  }
  console.log(word.padEnd(6) + ' | ' + (w.level || '').padEnd(3) + ' | ' + ipa.padEnd(14) + ' | ' + thai.padEnd(18) + ' | ' + w.meaning);
});

console.log('\n--- POTENTIAL ISSUES IN SHORT WORDS (' + issues.length + ') ---');
issues.forEach(i => console.log(i));
