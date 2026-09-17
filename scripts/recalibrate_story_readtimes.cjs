const fs = require('fs');
const path = require('path');

const storiesPath = path.join(__dirname, '../src/data/stories.json');
const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));

console.log('=== RECALIBRATING STORY READ TIMES ===');
console.log('Total stories:', stories.length);

stories.forEach(s => {
  const wordCount = s.content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 85));
  s.readTime = minutes === 1 ? '1 min' : `${minutes} mins`;
});

fs.writeFileSync(storiesPath, JSON.stringify(stories, null, 2), 'utf8');
console.log('Sample updated stories:');
console.log(stories.slice(0, 5).map(s => ({ id: s.id, title: s.title, words: s.content.trim().split(/\s+/).length, readTime: s.readTime })));
console.log('Saved src/data/stories.json successfully.');
