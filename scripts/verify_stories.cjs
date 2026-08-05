const fs = require('fs');
const path = require('path');

const storiesPath = path.join(__dirname, '../src/data/stories.json');
const rawData = fs.readFileSync(storiesPath, 'utf8');
let stories;

try {
  stories = JSON.parse(rawData);
} catch (err) {
  console.error('❌ JSON Parsing Error:', err.message);
  process.exit(1);
}

console.log(`=== Stories Verification Report ===`);
console.log(`Total stories: ${stories.length}`);

const requiredFields = ['id', 'title', 'titleThai', 'genre', 'level', 'readTime', 'content', 'contentThai'];
const levels = { A1: 0, A2: 0, B1: 0, B2: 0 };
let errors = 0;
const ids = new Set();

stories.forEach((story, idx) => {
  for (const field of requiredFields) {
    if (!story[field] || typeof story[field] !== 'string' || story[field].trim() === '') {
      console.error(`❌ Story #${idx + 1} (${story.id || 'NO_ID'}) missing or empty field: ${field}`);
      errors++;
    }
  }
  if (ids.has(story.id)) {
    console.error(`❌ Duplicate ID: ${story.id}`);
    errors++;
  }
  ids.add(story.id);

  if (levels[story.level] !== undefined) {
    levels[story.level]++;
  } else {
    console.error(`❌ Unknown level "${story.level}" in story ${story.id}`);
    errors++;
  }
});

console.log('Distribution by Level:', levels);

if (errors > 0) {
  console.error(`❌ Verification failed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log(`🎉 All ${stories.length} stories are valid and well-formed!`);
  process.exit(0);
}
