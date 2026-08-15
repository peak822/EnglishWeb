const fs = require('fs');
const path = require('path');
const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

console.log('=== CHECKING UNUSUAL PHONETIC PATTERNS ===');

const unusual = [];
vocab.forEach(v => {
  const w = v.word.toLowerCase();
  const th = v.thai_pronunciation || '';
  const ipa = v.ipa || '';

  // 1. Double vowels or strange combos like 'ะ-' in the middle of standard syllables
  if (th.includes('เค็-') || th.includes('ลัร์ด') || th.includes('ละ-ฟัล') || th.includes('า-อู')) {
    unusual.push({ id: v.id, word: v.word, th, ipa, reason: 'unusual syllable combo' });
  }

  // 2. Initial 'เค็' for 'eco-' or 'ec-'
  if (w.startsWith('eco') && th.startsWith('เค็')) {
    unusual.push({ id: v.id, word: v.word, th, ipa, reason: 'eco pronounced as เค็' });
  }

  // 3. Words where 'ful' is transliterated as 'ฟัล' instead of 'ฟูล'
  if (w.endsWith('ful') && th.endsWith('ฟัล')) {
    unusual.push({ id: v.id, word: v.word, th, ipa, reason: '-ful as ฟัล instead of ฟูล' });
  }
});

console.log(`Found ${unusual.length} unusual patterns:`);
unusual.forEach(u => {
  console.log(`[ID ${String(u.id).padStart(4)}] ${u.word.padEnd(18)} | ${u.th.padEnd(20)} | ${u.ipa.padEnd(18)} | ${u.reason}`);
});
