const fs = require('fs');
const path = require('path');

const stories = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/stories.json'), 'utf8'));
const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

console.log('Stories count:', stories.length);
