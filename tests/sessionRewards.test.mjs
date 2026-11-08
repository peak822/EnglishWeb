import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateReward } from '../src/utils/sessionRewards.js';

test('typing rewards actual correct answers, including the third-answer bonus', () => {
  assert.equal(calculateReward({ mode: 'typing', nextStreak: 1, revealed: false }), 10);
  assert.equal(calculateReward({ mode: 'typing', nextStreak: 2, revealed: false }), 10);
  assert.equal(calculateReward({ mode: 'typing', nextStreak: 3, revealed: false }), 15);
  assert.equal(calculateReward({ mode: 'typing', nextStreak: 3, revealed: true }), 0);
});

test('guess rewards reflect both streak and hint use', () => {
  assert.equal(calculateReward({ mode: 'guess', nextStreak: 1, hintLevel: 0 }), 10);
  assert.equal(calculateReward({ mode: 'guess', nextStreak: 3, hintLevel: 0 }), 15);
  assert.equal(calculateReward({ mode: 'guess', nextStreak: 3, hintLevel: 1 }), 5);
  assert.equal(calculateReward({ mode: 'guess', nextStreak: 3, hintLevel: 2 }), 2);
});
