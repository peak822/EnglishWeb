// scripts/audit_story_word_lookup.cjs
const stories = require('../src/data/stories.json');
const { lookupWord } = require('../src/utils/wordLookup');

const unmapped = new Map();
let totalTokens = 0;
let resolvedTokens = 0;

for (const story of stories) {
  const words = story.content.split(/\s+/);
  for (const raw of words) {
    totalTokens++;
    const res = lookupWord(raw);
    if (res) {
      resolvedTokens++;
    } else {
      const clean = raw.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
      if (clean && !/^\d+$/.test(clean)) {
        unmapped.set(clean, (unmapped.get(clean) || 0) + 1);
      }
    }
  }
}

console.log(`Total Story Tokens: ${totalTokens}`);
console.log(`Resolved: ${resolvedTokens} (${((resolvedTokens / totalTokens) * 100).toFixed(2)}%)`);
console.log(`Unique Unresolved Words: ${unmapped.size}`);

const sortedUnmapped = [...unmapped.entries()].sort((a, b) => b[1] - a[1]);
console.log('Top unmapped words:', sortedUnmapped.slice(0, 50));
