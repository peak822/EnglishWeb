const fs = require('fs');
const path = require('path');
const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

console.log('=== CHECKING SILENT LETTERS & PHONETIC ACCURACY ===');

const silentLetterChecks = [
  { prefix: 'kn', expectStart: ['น'], sample: 'knee, know, knife' },
  { prefix: 'wr', expectStart: ['ร', 'เร', 'แร', 'โร', 'ไร'], sample: 'write, wrong, wrap' },
  { prefix: 'ps', expectStart: ['ซ', 'ไซ'], sample: 'psychology' },
  { prefix: 'pn', expectStart: ['น'], sample: 'pneumonia' },
  { prefix: 'gn', expectStart: ['น'], sample: 'gnome' },
  { words: ['hour', 'honest', 'honesty', 'honour', 'honor', 'honorable', 'heir', 'heiress'], expectStart: ['อ', 'เอา', 'อา'], label: 'silent h' },
  { words: ['doubt', 'debt', 'subtle', 'comb', 'bomb', 'climb', 'thumb', 'tomb', 'limb', 'lamb', 'numb', 'crumb'], label: 'silent b' },
  { words: ['salmon', 'calm', 'palm', 'half', 'calf', 'walk', 'talk', 'could', 'should', 'would'], label: 'silent l' },
  { words: ['listen', 'castle', 'fasten', 'whistle', 'often', 'ballet', 'gourmet', 'buffet'], label: 'silent t' },
  { words: ['sign', 'design', 'foreign', 'campaign', 'champagne', 'assign', 'align', 'reign'], label: 'silent g' },
  { words: ['island', 'aisle', 'debris'], label: 'silent s' },
  { words: ['receipt', 'cupboard'], label: 'silent p' }
];

let phoneticIssues = [];

vocab.forEach(v => {
  const w = v.word.toLowerCase().trim();
  const thai = (v.thai_pronunciation || '').trim();
  const ipa = (v.ipa || '').trim();

  // 1. Silent kn-
  if (w.startsWith('kn') && w.length > 2) {
    if (thai.startsWith('ค') || thai.startsWith('เค') || thai.startsWith('แค') || thai.startsWith('โค')) {
      phoneticIssues.push({ id: v.id, word: v.word, thai, ipa, issue: 'silent kn- sounded as k' });
    }
  }

  // 2. Silent wr-
  if (w.startsWith('wr') && w.length > 2) {
    if (thai.startsWith('ว') || thai.startsWith('เว') || thai.startsWith('แว') || thai.startsWith('โว')) {
      phoneticIssues.push({ id: v.id, word: v.word, thai, ipa, issue: 'silent wr- sounded as w' });
    }
  }

  // 3. Silent ps-
  if (w.startsWith('ps') && w.length > 2) {
    if (thai.startsWith('พ') || thai.startsWith('เพ') || thai.startsWith('แพ')) {
      phoneticIssues.push({ id: v.id, word: v.word, thai, ipa, issue: 'silent ps- sounded as p' });
    }
  }

  // 4. Specific silent letter words
  if (['doubt', 'debt', 'subtle', 'comb', 'bomb', 'climb', 'thumb', 'tomb', 'limb', 'lamb', 'numb', 'crumb'].includes(w)) {
    if (thai.includes('บ์') || thai.includes('บ') && (w === 'doubt' || w === 'debt' || w === 'subtle')) {
      phoneticIssues.push({ id: v.id, word: v.word, thai, ipa, issue: 'silent b sounded out' });
    }
  }

  if (w === 'salmon' && (thai.includes('มอน') && thai.includes('แซล'))) {
    phoneticIssues.push({ id: v.id, word: v.word, thai, ipa, issue: 'salmon pronounced with l' });
  }

  if (w === 'island' && thai.includes('แลนด์') && thai.startsWith('ไอส')) {
    phoneticIssues.push({ id: v.id, word: v.word, thai, ipa, issue: 'island pronounced with s' });
  }

  if (w === 'aisle' && thai.startsWith('ไอส')) {
    phoneticIssues.push({ id: v.id, word: v.word, thai, ipa, issue: 'aisle pronounced with s' });
  }

  if (w === 'receipt' && (thai.includes('ซีป') || thai.includes('เซป'))) {
    phoneticIssues.push({ id: v.id, word: v.word, thai, ipa, issue: 'receipt pronounced with p' });
  }

  if (w === 'listen' && (thai.includes('เติน') || thai.includes('เทิน') || thai.includes('เท่น'))) {
    phoneticIssues.push({ id: v.id, word: v.word, thai, ipa, issue: 'listen pronounced with t' });
  }
});

console.log(`Found ${phoneticIssues.length} silent letter / phonetic rule issues:`);
phoneticIssues.forEach(p => {
  console.log(`[ID ${p.id}] ${p.word.padEnd(16)} | Thai: ${p.thai.padEnd(20)} | IPA: ${p.ipa.padEnd(18)} | Issue: ${p.issue}`);
});
