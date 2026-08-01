const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, '../src/data/vocabulary.json');
const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));

let maxId = 0;
vocab.forEach(v => {
  if (v.id && typeof v.id === 'number' && v.id > maxId) maxId = v.id;
});

const updated = vocab.map(v => {
  if (v.word === 'the definite') {
    return {
      ...v,
      word: 'the',
      type: 'article',
      meaning: 'คำนำหน้านามชี้เฉพาะ (เดอะ)',
      thai_pronunciation: 'เดอะ / ดิ',
      ipa: 'ðə, ðiː'
    };
  }
  if (v.word === 'a, an') {
    return {
      ...v,
      word: 'a',
      type: 'indefinite article',
      meaning: 'คำนำหน้านามไม่ชี้เฉพาะ (หนึ่ง/คนหนึ่ง/สิ่งหนึ่ง)',
      thai_pronunciation: 'เอ / เออะ',
      ipa: 'ə, eɪ'
    };
  }
  if (v.word === 'third number A1') {
    return {
      ...v,
      word: 'third',
      type: 'num. ordinal',
      level: 'A1',
      meaning: 'ที่สาม, ลำดับที่สาม',
      thai_pronunciation: 'เธิร์ด',
      ipa: 'θɜːrd'
    };
  }
  return v;
});

if (!updated.find(v => v.word === 'an')) {
  updated.push({
    id: maxId + 1,
    word: 'an',
    type: 'indefinite article',
    level: 'A1',
    meaning: 'คำนำหน้านามไม่ชี้เฉพาะ (นำหน้าคำที่ขึ้นต้นด้วยเสียงสระ)',
    thai_pronunciation: 'แอน / เออะน',
    ipa: 'ən, æn'
  });
}

// Sort alphabetically by word
updated.sort((a, b) => a.word.localeCompare(b.word));

// Reassign sequential IDs
updated.forEach((item, index) => {
  item.id = index + 1;
});

fs.writeFileSync(vocabPath, JSON.stringify(updated, null, 2), 'utf8');
console.log(`Cleaned vocabulary saved! Total words: ${updated.length}`);
