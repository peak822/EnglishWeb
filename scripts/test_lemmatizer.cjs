const fs = require('fs');
const path = require('path');

const stories = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/stories.json'), 'utf8'));
const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

// Build vocab map
const vocabMap = new Map();
vocab.forEach(v => {
  if (v.word) vocabMap.set(v.word.toLowerCase().trim(), v);
});

// Irregular verbs mapping (past, participle -> base)
const irregulars = {
  'was': 'be', 'were': 'be', 'is': 'be', 'am': 'be', 'are': 'be', 'been': 'be', 'being': 'be',
  'had': 'have', 'has': 'have', 'having': 'have',
  'did': 'do', 'does': 'do', 'done': 'do', 'doing': 'do',
  'went': 'go', 'gone': 'go', 'goes': 'go', 'going': 'go',
  'felt': 'feel', 'feeling': 'feel',
  'got': 'get', 'gotten': 'get', 'getting': 'get',
  'made': 'make', 'making': 'make',
  'took': 'take', 'taken': 'take', 'taking': 'take',
  'saw': 'see', 'seen': 'see', 'seeing': 'see',
  'knew': 'know', 'known': 'know', 'knowing': 'know',
  'gave': 'give', 'given': 'give', 'giving': 'give',
  'found': 'find', 'finding': 'find',
  'told': 'tell', 'telling': 'tell',
  'thought': 'think', 'thinking': 'think',
  'came': 'come', 'coming': 'come', 'comes': 'come',
  'ran': 'run', 'running': 'run', 'runs': 'run',
  'drank': 'drink', 'drunk': 'drink', 'drinking': 'drink',
  'ate': 'eat', 'eaten': 'eat', 'eating': 'eat', 'eats': 'eat',
  'sat': 'sit', 'sitting': 'sit',
  'woke': 'wake', 'woken': 'wake', 'waking': 'wake',
  'broke': 'break', 'broken': 'break', 'breaking': 'break',
  'heard': 'hear', 'hearing': 'hear',
  'drove': 'drive', 'driven': 'drive', 'driving': 'drive',
  'spoke': 'speak', 'spoken': 'speak', 'speaking': 'speak',
  'bought': 'buy', 'buying': 'buy',
  'brought': 'bring', 'bringing': 'bring',
  'caught': 'catch', 'catching': 'catch',
  'slept': 'sleep', 'sleeping': 'sleep', 'sleeps': 'sleep',
  'read': 'read', 'reading': 'read',
  'paid': 'pay', 'paying': 'pay',
  'sent': 'send', 'sending': 'send',
  'swept': 'sweep', 'sweeping': 'sweep',
  'met': 'meet', 'meeting': 'meet',
  'left': 'leave', 'leaving': 'leave',
  'put': 'put', 'putting': 'put',
  'cut': 'cut', 'cutting': 'cut',
  'set': 'set', 'setting': 'set',
  'kept': 'keep', 'keeping': 'keep',
  'shook': 'shake', 'shaking': 'shake',
  'taught': 'teach', 'teaching': 'teach',
  'wrote': 'write', 'written': 'write', 'writing': 'write',
  'wore': 'wear', 'worn': 'wear', 'wearing': 'wear',
  'lost': 'lose', 'losing': 'lose',
  'fell': 'fall', 'fallen': 'fall', 'falling': 'fall',
  'shone': 'shine', 'shining': 'shine',
  'hid': 'hide', 'hidden': 'hide', 'hiding': 'hide',
  'stood': 'stand', 'standing': 'stand',
  'understood': 'understand', 'understanding': 'understand',
  'became': 'become', 'becoming': 'become',
  'began': 'begin', 'begun': 'begin', 'beginning': 'begin',
  'chose': 'choose', 'chosen': 'choose', 'choosing': 'choose',
  'drew': 'draw', 'drawn': 'draw', 'drawing': 'draw',
  'flew': 'fly', 'flown': 'fly', 'flying': 'fly',
  'forgot': 'forget', 'forgotten': 'forget', 'forgetting': 'forget',
  'grew': 'grow', 'grown': 'grow', 'growing': 'grow',
  'hung': 'hang', 'hanging': 'hang',
  'hurt': 'hurt', 'hurting': 'hurt',
  'laid': 'lay', 'laying': 'lay',
  'led': 'lead', 'leading': 'lead',
  'lent': 'lend', 'lending': 'lend',
  'let': 'let', 'letting': 'let',
  'lit': 'light', 'lighting': 'light',
  'rode': 'ride', 'ridden': 'ride', 'riding': 'ride',
  'rang': 'ring', 'rung': 'ring', 'ringing': 'ring',
  'rose': 'rise', 'risen': 'rise', 'rising': 'rise',
  'sold': 'sell', 'selling': 'sell',
  'shot': 'shoot', 'shooting': 'shoot',
  'shut': 'shut', 'shutting': 'shut',
  'sang': 'sing', 'sung': 'sing', 'singing': 'sing',
  'sank': 'sink', 'sunken': 'sink', 'sinking': 'sink',
  'spent': 'spend', 'spending': 'spend',
  'swam': 'swim', 'swum': 'swim', 'swimming': 'swim',
  'threw': 'throw', 'thrown': 'throw', 'throwing': 'throw',
  'wished': 'wish', 'wishing': 'wish',
  'teeth': 'tooth', 'feet': 'foot', 'men': 'man', 'women': 'woman', 'children': 'child', 'people': 'person', 'mice': 'mouse'
};

// Contraction map
const contractions = {
  "i'm": { base: "be", extra: "(I am)", word: "I'm" },
  "im": { base: "be", extra: "(I am)", word: "I'm" },
  "it's": { base: "be", extra: "(It is / It has)", word: "It's" },
  "its": { base: "its", extra: "(ของมัน)", word: "its" },
  "that's": { base: "be", extra: "(That is)", word: "That's" },
  "thats": { base: "be", extra: "(That is)", word: "That's" },
  "can't": { base: "can", extra: "(cannot)", word: "can't" },
  "cant": { base: "can", extra: "(cannot)", word: "can't" },
  "couldn't": { base: "could", extra: "(could not)", word: "couldn't" },
  "couldnt": { base: "could", extra: "(could not)", word: "couldn't" },
  "wasn't": { base: "be", extra: "(was not)", word: "wasn't" },
  "wasnt": { base: "be", extra: "(was not)", word: "wasn't" },
  "they'd": { base: "would", extra: "(they would/had)", word: "they'd" },
  "theyd": { base: "would", extra: "(they would/had)", word: "they'd" },
  "i'd": { base: "would", extra: "(I would/had)", word: "I'd" },
  "id": { base: "would", extra: "(I would/had)", word: "I'd" },
  "i've": { base: "have", extra: "(I have)", word: "I've" },
  "ive": { base: "have", extra: "(I have)", word: "I've" },
  "don't": { base: "do", extra: "(do not)", word: "don't" },
  "dont": { base: "do", extra: "(do not)", word: "don't" },
  "doesn't": { base: "do", extra: "(does not)", word: "doesn't" },
  "doesnt": { base: "do", extra: "(does not)", word: "doesn't" },
  "didn't": { base: "do", extra: "(did not)", word: "didn't" },
  "didnt": { base: "do", extra: "(did not)", word: "didn't" },
  "won't": { base: "will", extra: "(will not)", word: "won't" },
  "wont": { base: "will", extra: "(will not)", word: "won't" },
  "you're": { base: "be", extra: "(you are)", word: "you're" },
  "youre": { base: "be", extra: "(you are)", word: "you're" },
  "we're": { base: "be", extra: "(we are)", word: "we're" },
  "were": { base: "be", extra: "(we are / were)", word: "were" },
  "they're": { base: "be", extra: "(they are)", word: "they're" },
  "theyre": { base: "be", extra: "(they are)", word: "they're" },
  "he's": { base: "be", extra: "(he is / he has)", word: "he's" },
  "hes": { base: "be", extra: "(he is / he has)", word: "he's" },
  "she's": { base: "be", extra: "(she is / she has)", word: "she's" },
  "shes": { base: "be", extra: "(she is / she has)", word: "she's" },
  "o'clock": { base: "o'clock", extra: "นาฬิกา (บอกเวลา)", word: "o'clock" },
  "oclock": { base: "o'clock", extra: "นาฬิกา (บอกเวลา)", word: "o'clock" }
};

function lemmatize(word) {
  const w = word.toLowerCase().trim();
  if (vocabMap.has(w)) return { found: true, entry: vocabMap.get(w), original: word };
  
  if (contractions[w]) {
    const c = contractions[w];
    if (vocabMap.has(c.base)) {
      return { found: true, entry: vocabMap.get(c.base), original: word, note: c.extra };
    }
  }
  
  if (irregulars[w]) {
    const base = irregulars[w];
    if (vocabMap.has(base)) {
      return { found: true, entry: vocabMap.get(base), original: word, note: `(รูปของ ${base})` };
    }
  }
  
  // Rule based stemming:
  // -ies -> -y (e.g. berries -> berry)
  if (w.endsWith('ies') && w.length > 4) {
    const candidate = w.slice(0, -3) + 'y';
    if (vocabMap.has(candidate)) return { found: true, entry: vocabMap.get(candidate), original: word, note: '(พหูพจน์)' };
  }
  
  // -ves -> -f or -fe (e.g. shelves -> shelf, knives -> knife)
  if (w.endsWith('ves') && w.length > 4) {
    const c1 = w.slice(0, -3) + 'f';
    const c2 = w.slice(0, -3) + 'fe';
    if (vocabMap.has(c1)) return { found: true, entry: vocabMap.get(c1), original: word, note: '(พหูพจน์)' };
    if (vocabMap.has(c2)) return { found: true, entry: vocabMap.get(c2), original: word, note: '(พหูพจน์)' };
  }
  
  // -es (e.g. watches -> watch, boxes -> box, dresses -> dress)
  if (w.endsWith('es') && w.length > 3) {
    const candidate = w.slice(0, -2);
    if (vocabMap.has(candidate)) return { found: true, entry: vocabMap.get(candidate), original: word };
  }
  
  // -s (e.g. dogs -> dog, loves -> love)
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 2) {
    const candidate = w.slice(0, -1);
    if (vocabMap.has(candidate)) return { found: true, entry: vocabMap.get(candidate), original: word };
  }
  
  // -ed (e.g. walked -> walk, decided -> decide, stopped -> stop)
  if (w.endsWith('ed') && w.length > 3) {
    const c1 = w.slice(0, -2); // walked -> walk
    const c2 = w.slice(0, -1); // decided -> decide (drop d)
    const c3 = w.slice(0, -3); // stopped -> stop (double consonant)
    if (vocabMap.has(c1)) return { found: true, entry: vocabMap.get(c1), original: word, note: '(รูปอดีต -ed)' };
    if (vocabMap.has(c2)) return { found: true, entry: vocabMap.get(c2), original: word, note: '(รูปอดีต -ed)' };
    if (w.length > 4 && w[w.length - 3] === w[w.length - 4] && vocabMap.has(c3)) {
      return { found: true, entry: vocabMap.get(c3), original: word, note: '(รูปอดีต -ed)' };
    }
  }
  
  // -ing (e.g. playing -> play, making -> make, stopping -> stop)
  if (w.endsWith('ing') && w.length > 4) {
    const c1 = w.slice(0, -3); // playing -> play
    const c2 = w.slice(0, -3) + 'e'; // making -> make
    const c3 = w.slice(0, -4); // running -> run
    if (vocabMap.has(c1)) return { found: true, entry: vocabMap.get(c1), original: word, note: '(รูป -ing)' };
    if (vocabMap.has(c2)) return { found: true, entry: vocabMap.get(c2), original: word, note: '(รูป -ing)' };
    if (w.length > 5 && w[w.length - 4] === w[w.length - 5] && vocabMap.has(c3)) {
      return { found: true, entry: vocabMap.get(c3), original: word, note: '(รูป -ing)' };
    }
  }
  
  // -ly (e.g. slowly -> slow)
  if (w.endsWith('ly') && w.length > 3) {
    const candidate = w.slice(0, -2);
    if (vocabMap.has(candidate)) return { found: true, entry: vocabMap.get(candidate), original: word, note: '(กริยาวิเศษณ์ -ly)' };
  }
  
  // -est, -er (e.g. hardest -> hard, closer -> close)
  if (w.endsWith('est') && w.length > 4) {
    const c1 = w.slice(0, -3);
    const c2 = w.slice(0, -2); // closest -> close
    if (vocabMap.has(c1)) return { found: true, entry: vocabMap.get(c1), original: word, note: '(ขั้นสุด -est)' };
    if (vocabMap.has(c2)) return { found: true, entry: vocabMap.get(c2), original: word, note: '(ขั้นสุด -est)' };
  }
  if (w.endsWith('er') && w.length > 3) {
    const c1 = w.slice(0, -2);
    const c2 = w.slice(0, -1);
    if (vocabMap.has(c1)) return { found: true, entry: vocabMap.get(c1), original: word, note: '(ขั้นกว่า -er)' };
    if (vocabMap.has(c2)) return { found: true, entry: vocabMap.get(c2), original: word, note: '(ขั้นกว่า -er)' };
  }

  return { found: false, word };
}

// Test against all tokens in stories
const allTokens = new Map();
stories.forEach(story => {
  const words = story.content.split(/\s+/);
  words.forEach(rawWord => {
    const cleanWord = rawWord.replace(/[.,!?;:'"“”‘’()\[\]]/g, '').toLowerCase().trim();
    if (cleanWord) {
      allTokens.set(cleanWord, (allTokens.get(cleanWord) || 0) + 1);
    }
  });
});

let foundCount = 0;
let missingList = [];

allTokens.forEach((count, word) => {
  const res = lemmatize(word);
  if (res.found) {
    foundCount++;
  } else {
    missingList.push({ word, count });
  }
});

console.log(`With Lemmatizer & Rule matching:`);
console.log(`Resolved: ${foundCount} / ${allTokens.size} (${(foundCount / allTokens.size * 100).toFixed(1)}%)`);
console.log(`Still missing: ${missingList.length}`);
console.log('\nRemaining missing words:');
missingList.forEach(m => console.log(`${m.word} (${m.count}x)`));
