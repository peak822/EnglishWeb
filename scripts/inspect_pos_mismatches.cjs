const fs = require('fs');
const path = require('path');
const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

const posMismatches = [];

vocab.forEach(v => {
  const w = v.word.trim().toLowerCase();
  const m = (v.meaning || '').trim();
  const t = (v.type || '').trim();

  // Words ending in -al, -ion, -ment, -ity, -ness, -ance, -ence that are nouns but tagged adj
  if (t === 'adj.' && (w.endsWith('al') || w.endsWith('ion') || w.endsWith('ment') || w.endsWith('ance') || w.endsWith('ence') || w.endsWith('ity'))) {
    if (['denial', 'appraisal', 'dismissal', 'disposal', 'proposal', 'refusal', 'survival', 'trial', 'withdrawal', 'arrival', 'approval'].includes(w)) {
      posMismatches.push({ id: v.id, word: v.word, type: t, correctType: 'n.', meaning: m, reason: 'nominal -al suffix tagged as adj' });
    }
  }

  // Words with 'การ' as meaning for pure adj
  if (t === 'adj.' && m.startsWith('การ') && !m.includes('ที่') && !m.includes('ซึ่ง') && !m.includes('เกี่ยวกับ')) {
    posMismatches.push({ id: v.id, word: v.word, type: t, meaning: m, reason: 'adj defined with noun prefix การ' });
  }

  // Verbs defined with ความ or การ
  if (t === 'v.' && (m.startsWith('ความ') || (m.startsWith('การ') && !m.includes(',')))) {
    posMismatches.push({ id: v.id, word: v.word, type: t, meaning: m, reason: 'verb defined with noun prefix' });
  }
});

console.log(`Total POS/Meaning issues found: ${posMismatches.length}`);
posMismatches.forEach(p => {
  console.log(`[ID ${String(p.id).padStart(4)}] ${p.word.padEnd(16)} | (${p.type}) -> "${p.meaning}" | Reason: ${p.reason}`);
});
