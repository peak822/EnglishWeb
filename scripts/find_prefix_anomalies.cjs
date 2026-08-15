const fs = require('fs');
const path = require('path');
const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

const unInAnomalies = vocab.filter(v => {
  const w = v.word.toLowerCase();
  const th = v.thai_pronunciation || '';
  if (w.startsWith('un') && th.startsWith('นั-')) return true;
  if (w.startsWith('in') && th.startsWith('นิ-')) return true;
  if (w.startsWith('im') && th.startsWith('มิ-')) return true;
  if (w.startsWith('dis') && th.includes('-แอก-อีร')) return true;
  return false;
});

console.log(`Found ${unInAnomalies.length} prefix corruption anomalies (un->นั, in->นิ, im->มิ):`);
unInAnomalies.forEach(x => {
  console.log(`[ID ${String(x.id).padStart(4)}] ${x.word.padEnd(18)} | Thai: ${x.thai_pronunciation.padEnd(24)} | IPA: ${x.ipa}`);
});
