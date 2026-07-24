const fs = require('fs');
const path = require('path');

const wordsFile = path.join(__dirname, 'words.txt');
const rawText = fs.readFileSync(wordsFile, 'utf8');

function parseVocabulary(text) {
  const lines = text.trim().split('\n');
  const vocab = [];
  
  lines.forEach((line, index) => {
    line = line.trim();
    if (!line) return;
    
    const tokens = line.split(' ');
    const level = tokens.pop();
    
    if (['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level)) {
      let wordTokens = [];
      let posTokens = [];
      let foundPos = false;
      
      for (const token of tokens) {
        if (!foundPos && (token.includes('.') || token === 'v' || token === 'n' || token === 'adj' || token === 'adv' || token === 'prep' || token === 'conj' || token === 'exclam' || token === 'det' || token === 'pron' || token === 'modal' || token === 'auxiliary' || token === 'article' || token === 'indefinite' || token === 'definite')) {
          foundPos = true;
        }
        
        if (foundPos) {
          posTokens.push(token);
        } else {
          wordTokens.push(token);
        }
      }
      
      const word = wordTokens.join(' ').replace(/[,]/g, '').trim();
      const pos = posTokens.join(' ').replace(/[,]/g, '').trim();
      
      if (word) {
        vocab.push({
          word: word,
          type: pos || 'unknown',
          level: level
        });
      }
    }
  });
  
  // Sort vocabulary by CEFR level
  const levelOrder = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
  vocab.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
  
  // Re-assign IDs based on sorted order
  vocab.forEach((v, index) => {
    v.id = index + 1;
  });
  
  return vocab;
}

const vocabulary = parseVocabulary(rawText);

const outputDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'vocabulary.json'), JSON.stringify(vocabulary, null, 2));
console.log(`Successfully parsed and sorted ${vocabulary.length} words and saved to src/data/vocabulary.json`);
