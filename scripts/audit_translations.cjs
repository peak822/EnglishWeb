const fs = require('fs');
const path = require('path');
const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

console.log('=== AUDITING MEANINGS & TRANSLATIONS ===');

let translationIssues = [];

vocab.forEach(v => {
  const w = v.word.trim();
  const m = (v.meaning || '').trim();
  const type = (v.type || '').trim();

  // Check 1: Empty or extremely short
  if (m.length === 0) {
    translationIssues.push({ id: v.id, word: w, type, meaning: m, issue: 'empty_meaning' });
  }

  // Check 2: Strange formatting or duplicate delimiters
  if (m.includes(',,') || m.includes('//') || m.startsWith('/') || m.endsWith('/') || m.startsWith(',') || m.endsWith(',')) {
    translationIssues.push({ id: v.id, word: w, type, meaning: m, issue: 'delimiter_formatting' });
  }

  // Check 3: Raw question marks or unknown symbols
  if (m.includes('???') || m.includes('TODO') || m.includes('undefined') || m.includes('null')) {
    translationIssues.push({ id: v.id, word: w, type, meaning: m, issue: 'placeholder_or_null' });
  }

  // Check 4: POS vs Meaning pattern checks
  // If type is purely 'v.' (verb), but meaning starts with 'การ' or 'ความ' and doesn't offer a verb alternative
  if (type === 'v.' && (m.startsWith('ความ') || (m.startsWith('การ') && !m.includes(',') && !m.includes('/')))) {
    translationIssues.push({ id: v.id, word: w, type, meaning: m, issue: 'verb_has_pure_noun_meaning' });
  }
  // If type is purely 'adj.' but meaning starts with 'การ'
  if (type === 'adj.' && m.startsWith('การ') && !m.includes('ที่') && !m.includes('ซึ่ง') && !m.includes(',')) {
    translationIssues.push({ id: v.id, word: w, type, meaning: m, issue: 'adj_has_noun_meaning' });
  }
});

console.log(`Found ${translationIssues.length} translation formatting/POS issues:`);
const grouped = {};
translationIssues.forEach(t => {
  if (!grouped[t.issue]) grouped[t.issue] = [];
  grouped[t.issue].push(t);
});

for (const [k, list] of Object.entries(grouped)) {
  console.log(`\n- [${k}]: ${list.length} occurrences`);
  list.slice(0, 10).forEach(x => {
    console.log(`  [ID ${x.id}] ${x.word} (${x.type}) -> "${x.meaning}"`);
  });
}
