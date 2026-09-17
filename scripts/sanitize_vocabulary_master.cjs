const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, '../src/data/vocabulary.json');
const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));

console.log('=== STARTING VOCABULARY SANITIZATION & NORMALIZATION ===');
console.log('Initial vocab entries count:', vocab.length);

const cardinalNumbers = new Set([
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
  'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
  'hundred', 'thousand', 'million', 'billion'
]);

const ordinalNumbers = new Set([
  'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
  'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth'
]);

let cefrRestoredCount = 0;
let posCleanedCount = 0;
let numbersUpdatedCount = 0;
let ipaNormalizedCount = 0;

vocab.forEach(v => {
  const lowerWord = v.word.toLowerCase().trim();

  // 1. Task 5: Numbers & Ordinals Classification
  if (cardinalNumbers.has(lowerWord)) {
    if (v.type === 'unknown' || !v.type.includes('number')) {
      v.type = 'number, det., n.';
      numbersUpdatedCount++;
    }
  } else if (ordinalNumbers.has(lowerWord)) {
    if (v.type === 'unknown' || !v.type.includes('number')) {
      v.type = 'number, adj., adv.';
      numbersUpdatedCount++;
    }
  }

  // 2. Task 4: CEFR Level Restoration & POS String Cleaning
  if (/[A-C][1-2]/.test(v.type)) {
    // Find the first/lowest CEFR level in the type string
    const cefrMatches = v.type.match(/[A-C][1-2]/g);
    if (cefrMatches && cefrMatches.length > 0) {
      const firstCefr = cefrMatches[0];
      const levelRank = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
      if (levelRank[firstCefr] && levelRank[firstCefr] < levelRank[v.level]) {
        v.level = firstCefr;
        cefrRestoredCount++;
      }
    }
  }

  // Clean and standardize POS string
  if (v.type) {
    let cleanType = v.type;
    // Remove CEFR tokens
    cleanType = cleanType.replace(/\b[A-C][1-2]\b/g, '');
    // Standardize delimiters
    cleanType = cleanType.replace(/[/\\|]/g, ', ');
    
    // Extract standard tokens
    const tokens = [];
    const knownTags = [
      { pattern: /\bmodal\s+v\.?/gi, tag: 'modal v.' },
      { pattern: /\bauxiliary\s+v\.?/gi, tag: 'auxiliary v.' },
      { pattern: /\bindefinite\s+article\b/gi, tag: 'indefinite article' },
      { pattern: /\borderly\b/gi, tag: 'adj.' },
      { pattern: /\bnumber\b/gi, tag: 'number' },
      { pattern: /\bdet\.?/gi, tag: 'det.' },
      { pattern: /\bpron\.?/gi, tag: 'pron.' },
      { pattern: /\bprep\.?/gi, tag: 'prep.' },
      { pattern: /\bconj\.?/gi, tag: 'conj.' },
      { pattern: /\badj\.?/gi, tag: 'adj.' },
      { pattern: /\badv\.?/gi, tag: 'adv.' },
      { pattern: /\bexclam\.?/gi, tag: 'exclam.' },
      { pattern: /\bn\.?/gi, tag: 'n.' },
      { pattern: /\bv\.?/gi, tag: 'v.' }
    ];

    let working = cleanType;
    knownTags.forEach(({ pattern, tag }) => {
      if (pattern.test(working)) {
        tokens.push(tag);
        working = working.replace(pattern, ' ');
      }
    });

    if (tokens.length > 0) {
      const uniqueTokens = [...new Set(tokens)];
      const formatted = uniqueTokens.join(', ');
      if (formatted !== v.type) {
        v.type = formatted;
        posCleanedCount++;
      }
    } else if (v.type === 'unknown') {
      // Fallback
      v.type = 'n.';
      posCleanedCount++;
    }
  }

  // 3. Task 6: Broad Phonemic IPA Normalization
  if (v.ipa && (v.ipa.includes('ɫ') || v.ipa.includes('ɹ'))) {
    v.ipa = v.ipa.replace(/ɫ/g, 'l').replace(/ɹ/g, 'r');
    ipaNormalizedCount++;
  }
});

console.log(`CEFR levels restored to primary base level: ${cefrRestoredCount}`);
console.log(`POS strings sanitized and cleaned: ${posCleanedCount}`);
console.log(`Numbers and ordinals classified: ${numbersUpdatedCount}`);
console.log(`IPA broad phonemics normalized (ɫ->l, ɹ->r): ${ipaNormalizedCount}`);

fs.writeFileSync(vocabPath, JSON.stringify(vocab, null, 2), 'utf8');
console.log('Saved sanitized src/data/vocabulary.json successfully.');
