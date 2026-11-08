import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceStreak, currentStreak, awardExp } from '../src/utils/profileState.js';

const profile = {
  exp: 310,
  level: 3,
  badges: ['first_blood', 'novice'],
  streakDays: 4,
  lastActiveDate: '2026-11-08',
};

test('first learning activity on the next local calendar day increments streak once', () => {
  const next = advanceStreak(profile, '2026-11-09');
  assert.equal(next.streakDays, 5);
  assert.equal(next.lastActiveDate, '2026-11-09');
  assert.equal(advanceStreak(next, '2026-11-09').streakDays, 5);
});

test('a gap of two days or a future stored date starts a new streak', () => {
  assert.equal(advanceStreak(profile, '2026-11-10').streakDays, 1);
  assert.equal(advanceStreak({ ...profile, lastActiveDate: '2026-11-10' }, '2026-11-09').streakDays, 1);
});

test('opening across midnight does not count as learning until EXP is earned', () => {
  assert.equal(currentStreak(profile, '2026-11-09'), 4);
  assert.equal(profile.lastActiveDate, '2026-11-08');
  const earned = awardExp(profile, 10, '2026-11-09');
  assert.equal(earned.profile.exp, 320);
  assert.equal(earned.profile.streakDays, 5);
});

test('invalid stored date resets the next activity safely', () => {
  assert.equal(advanceStreak({ ...profile, lastActiveDate: 'not-a-date' }, '2026-11-09').streakDays, 1);
  assert.equal(currentStreak({ ...profile, lastActiveDate: '2026-13-01' }, '2026-11-09'), 1);
});

test('invalid rewards never make EXP nonnumeric or negative', () => {
  for (const amount of [Number.NaN, Infinity, -10]) {
    const result = awardExp(profile, amount, '2026-11-09');
    assert.deepEqual(result.profile, profile);
  }
});
