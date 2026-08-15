const fs = require('fs');
const path = require('path');
const report = JSON.parse(fs.readFileSync(path.join(__dirname, 'audit_report.json'), 'utf8'));

console.log('=== (1) SAMPLES OF ENGLISH/IPA LEAKS IN THAI PRONUNCIATION (Total: ' + report.englishOrIpaInThaiPronunciation.length + ') ===');
report.englishOrIpaInThaiPronunciation.slice(0, 40).forEach(x => {
  console.log(`[ID ${String(x.id).padStart(4)}] ${x.word.padEnd(16)} | IPA: ${x.ipa.padEnd(18)} | Thai: ${x.thai_pronunciation.padEnd(20)} | Meaning: ${x.meaning}`);
});

console.log('\n=== (2) SHORT OR NONSENSE THAI PRONUNCIATIONS (Total: ' + report.shortOrNonsenseThaiPronunciation.length + ') ===');
report.shortOrNonsenseThaiPronunciation.forEach(x => {
  console.log(`[ID ${String(x.id).padStart(4)}] ${x.word.padEnd(16)} | IPA: ${x.ipa.padEnd(18)} | Thai: ${x.thai_pronunciation.padEnd(20)} | Meaning: ${x.meaning}`);
});

console.log('\n=== (3) SUSPICIOUS / NULL IPAs (Total: ' + report.ipaIssues.length + ') ===');
report.ipaIssues.forEach(x => {
  console.log(`[ID ${String(x.id).padStart(4)}] ${x.word.padEnd(16)} | IPA: ${x.ipa.padEnd(18)} | Thai: ${x.thai_pronunciation.padEnd(20)} | Meaning: ${x.meaning}`);
});
