import test from 'node:test';
import assert from 'node:assert/strict';
import vocabulary from '../src/data/vocabulary.json' with { type: 'json' };
import sentences from '../src/data/sentences.json' with { type: 'json' };

test('sentence references are valid except the three documented missing target words', () => {
  const vocabularyById = new Map(vocabulary.map(entry => [entry.id, entry]));
  assert.equal(vocabularyById.size, vocabulary.length, 'duplicate vocabulary ID');
  assert.equal(new Set(sentences.map(entry => entry.id)).size, sentences.length, 'duplicate sentence ID');
  const mismatches = sentences.filter(sentence =>
    vocabularyById.get(sentence.wordId)?.word.toLowerCase() !== sentence.word.toLowerCase()
  );
  assert.deepEqual(mismatches.map(sentence => sentence.id), [38, 81, 97]);
  for (const sentence of mismatches) {
    assert.equal(vocabulary.some(entry => entry.word.toLowerCase() === sentence.word.toLowerCase()), false);
  }
});

test.todo('resolve sentence IDs 38, 81, and 97 after article, center, and color have valid vocabulary entries');
