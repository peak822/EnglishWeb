const fs = require('fs');
const vocab = require('../src/data/vocabulary.json');

const anomalies = [];

vocab.forEach((item, index) => {
  const word = (item.word || '').trim().toLowerCase();
  const thai = (item.thai_pronunciation || '').trim();
  const ipa = (item.ipa || '').trim();
  const firstLetter = word[0];

  let reason = [];

  // Check 1: Thai starts with 'อ' when English word starts with a consonant (except vowels a, e, i, o, u)
  if (!['a', 'e', 'i', 'o', 'u', 'y'].includes(firstLetter)) {
    // If first syllable in Thai starts with 'อ' and doesn't have an authentic reason like 'h' silent (e.g. honest, hour)
    if (thai.startsWith('อ') && !['hour', 'honest', 'honor', 'heir'].includes(word)) {
      reason.push(`starts with 'อ' for consonant word`);
    }
  }

  // Check 2: Check for weird vowel-only strings like 'อะ-อา-เอะ', 'เอะ-อะ', etc.
  if (thai.includes('อะ-อา-เอะ') || thai === 'อะ-อา-เอะ' || thai === 'อะ-เอะ' || thai === 'อา-เอะ') {
    reason.push(`vowel placeholder sequence`);
  }

  // Check 3: Check for 'อี' followed by consonant (like 'อีวก')
  if (/^อี[ก-ฮ]/.test(thai) && !['a', 'e', 'i'].includes(firstLetter)) {
    reason.push(`inverted 'อี' pattern`);
  }

  // Check 4: Check for 'อู' followed by consonant (like 'อูท')
  if (/^อู[ก-ฮ]/.test(thai) && !['a', 'e', 'i', 'o', 'u'].includes(firstLetter)) {
    reason.push(`inverted 'อู' pattern`);
  }

  // Check 5: Check for 'อิว' followed by consonant (like 'อิทน')
  if (/^อิ[ก-ฮ]/.test(thai) && !['a', 'e', 'i'].includes(firstLetter)) {
    reason.push(`inverted 'อิ' pattern`);
  }

  // Check 6: Check for 'ออย' followed by consonant (like 'ออยท')
  if (/^ออย[ก-ฮ]/.test(thai) && !['a', 'e', 'o'].includes(firstLetter)) {
    reason.push(`inverted 'ออย' pattern`);
  }

  // Check 7: Check for 'เอา' followed by consonant (like 'เอาว')
  if (/^เอา[ก-ฮ]/.test(thai) && !['a', 'e', 'o', 'u'].includes(firstLetter)) {
    reason.push(`inverted 'เอา' pattern`);
  }

  // Check 8: Check for 'แอ' followed by consonant (like 'แอกท')
  if (/^แอ[ก-ฮ][ก-ฮ]/.test(thai) && !['a', 'e'].includes(firstLetter)) {
    reason.push(`inverted 'แอ' pattern`);
  }

  // Check 9: Check for 'เอ' followed by consonant (like 'เอ็ดก')
  if (/^เอ[ก-ฮ]/.test(thai) && !['a', 'e'].includes(firstLetter) && !thai.startsWith('เอ-')) {
    reason.push(`inverted 'เอ' pattern`);
  }

  // Check 10: Check for 'อ็อ' followed by consonant (like 'อ็อดท')
  if (/^อ็อ[ก-ฮ]/.test(thai) && !['a', 'o'].includes(firstLetter)) {
    reason.push(`inverted 'อ็อ' pattern`);
  }

  // Check 11: Check for 'อั' followed by consonant (like 'อับก')
  if (/^อั[ก-ฮ]/.test(thai) && !['a', 'u'].includes(firstLetter)) {
    reason.push(`inverted 'อั' pattern`);
  }

  if (reason.length > 0) {
    anomalies.push({ id: item.id, word, ipa, thai, meaning: item.meaning, reasons: reason.join(', ') });
  }
});

console.log(`Found ${anomalies.length} anomalous Thai pronunciations out of ${vocab.length} words.\n`);
console.log('--- SAMPLE OF FIRST 50 ANOMALIES ---');
anomalies.slice(0, 50).forEach(a => {
  console.log(`${a.word.padEnd(16)} | ${a.ipa.padEnd(16)} | ${a.thai.padEnd(18)} | ${a.reasons}`);
});

fs.writeFileSync('./scripts/anomalies.json', JSON.stringify(anomalies, null, 2), 'utf-8');
