import test from 'node:test';
import assert from 'node:assert/strict';
import { readCefr, readLevelFilter, withCefr, hasContent } from '../src/utils/levelSelection.js';
import vocabulary from '../src/data/vocabulary.json' with { type: 'json' };
import sentences from '../src/data/sentences.json' with { type: 'json' };
import stories from '../src/data/stories.json' with { type: 'json' };

test('CEFR links preserve supported levels and reject unsupported values', () => {
  assert.equal(withCefr('/typing', 'A1'), '/typing?level=A1');
  assert.equal(withCefr('/typing', 'ALL'), '/typing');
  assert.equal(readCefr('?level=A1', ['A1', 'A2']), 'A1');
  assert.equal(readCefr('?level=INVALID'), 'all');
  assert.equal(readCefr('?level=C2'), 'all');
  assert.equal(readLevelFilter('?theme=theme_food'), 'theme_food');
});

test('content availability is based on each dataset', () => {
  const counts = data => Object.fromEntries(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => [level, data.filter(item => item.level === level).length]));
  const vocabularyCounts = counts(vocabulary);
  const sentenceCounts = counts(sentences);
  const storyCounts = counts(stories);
  assert.equal(hasContent('C2', vocabularyCounts), false);
  assert.equal(hasContent('B2', sentenceCounts), false);
  assert.equal(hasContent('C1', sentenceCounts), false);
  assert.equal(hasContent('A1', vocabularyCounts), true);
  assert.equal(hasContent('A1', storyCounts), true);
});
