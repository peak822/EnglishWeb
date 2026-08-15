const fs = require('fs');
const path = require('path');

const stories = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/stories.json'), 'utf8'));
const sentences = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/sentences.json'), 'utf8'));

console.log('=== STORIES INSPECTION ===');
stories.forEach((s, idx) => {
  console.log(`\n[Story ${idx + 1}] ID: ${s.id} | Level: ${s.level} | Genre: ${s.genre}`);
  console.log(`EN Title: ${s.title}`);
  console.log(`TH Title: ${s.titleThai}`);
  console.log(`EN Preview: ${s.content.slice(0, 100)}...`);
  console.log(`TH Preview: ${s.contentThai.slice(0, 100)}...`);
});

console.log('\n=== SENTENCES INSPECTION ===');
sentences.forEach((sn, idx) => {
  console.log(`[#${idx + 1}] Word: "${sn.word}" (wordId: ${sn.wordId}) -> ${sn.sentence}`);
});
