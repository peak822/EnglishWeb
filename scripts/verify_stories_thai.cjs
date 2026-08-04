const fs = require('fs');
const path = require('path');

const storiesPath = path.join(__dirname, '../src/data/stories.json');
const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));

console.log(`Checking ${stories.length} stories...`);

let hasError = false;
stories.forEach((story, idx) => {
  if (!story.titleThai || typeof story.titleThai !== 'string' || story.titleThai.trim() === '') {
    console.error(`Error: Story #${idx + 1} (${story.id}) missing titleThai`);
    hasError = true;
  }
  if (!story.contentThai || typeof story.contentThai !== 'string' || story.contentThai.trim() === '') {
    console.error(`Error: Story #${idx + 1} (${story.id}) missing contentThai`);
    hasError = true;
  }
});

if (hasError) {
  console.error('❌ Validation failed.');
  process.exit(1);
} else {
  console.log('✅ All stories have valid titleThai and contentThai translations.');
}
