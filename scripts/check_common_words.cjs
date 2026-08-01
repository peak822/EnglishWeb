const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));
const map = new Map(vocab.map(v => [v.word.toLowerCase(), v]));

const checkList = [
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs',
  'be', 'am', 'is', 'are', 'was', 'were', 'been', 'being',
  'have', 'has', 'had', 'having',
  'do', 'does', 'did', 'done', 'doing',
  'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
  'the', 'a', 'an', 'this', 'that', 'these', 'those',
  'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how',
  'not', 'no', 'yes', 'and', 'or', 'but', 'so', 'because', 'if', 'when', 'while', 'although',
  'in', 'on', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'off', 'over', 'under',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'first', 'second', 'third'
];

const missing = checkList.filter(w => !map.has(w));
console.log('Missing common words:', missing);
