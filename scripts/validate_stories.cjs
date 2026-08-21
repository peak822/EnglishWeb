const fs = require('fs');
const path = require('path');

const storiesPath = path.join(__dirname, '../src/data/stories.json');
const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));

console.log(`Loaded ${stories.length} stories.`);

const expectedDurations = {
  A1: '7 mins',
  A2: '8 mins',
  B1: '9 mins',
  B2: '10 mins'
};

let errors = [];
const idSet = new Set();

stories.forEach((story, idx) => {
  if (!story.id || !story.title || !story.titleThai || !story.content || !story.contentThai) {
    errors.push(`Story #${idx} (${story.id || 'NO_ID'}) is missing required fields.`);
  }
  if (idSet.has(story.id)) {
    errors.push(`Duplicate story ID: "${story.id}"`);
  }
  idSet.add(story.id);

  const levelPrefix = story.level.substring(0, 2);
  const expectedTime = expectedDurations[levelPrefix];
  if (expectedTime && story.readTime !== expectedTime) {
    errors.push(`Story ${story.id} (${story.level}) has readTime "${story.readTime}", expected "${expectedTime}".`);
  }
});

const counts = {};
stories.forEach(s => {
  counts[s.level] = (counts[s.level] || 0) + 1;
});
console.log('Story counts by level:', counts);

if (errors.length > 0) {
  console.error(`Validation failed with ${errors.length} errors:\n` + errors.slice(0, 15).join('\n'));
  if (errors.length > 15) {
    console.error(`...and ${errors.length - 15} more errors.`);
  }
  process.exit(1);
} else {
  console.log('✅ All stories passed duration and structure validation!');
  process.exit(0);
}
