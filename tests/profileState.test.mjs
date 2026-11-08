import test from 'node:test';
import assert from 'node:assert/strict';
import { parseStoredProfile } from '../src/utils/profileState.js';
import { loadProfile, persistProfile } from '../src/utils/profileStorage.js';

const today = '2026-11-08';

test('malformed stored profile does not prevent loading and retains raw data', () => {
  const result = parseStoredProfile('{', today);
  assert.equal(result.profile.exp, 0);
  assert.equal(result.profile.level, 1);
  assert.equal(result.invalidRaw, '{');
});

test('valid stored progress survives loading without dropping badges', () => {
  const raw = JSON.stringify({
    exp: 310,
    level: 3,
    badges: ['first_blood', 'novice'],
    streakDays: 4,
    lastActiveDate: '2026-11-07',
  });
  const result = parseStoredProfile(raw, today);
  assert.deepEqual(result.profile, {
    exp: 310,
    level: 3,
    badges: ['first_blood', 'novice'],
    streakDays: 4,
    lastActiveDate: '2026-11-07',
  });
  assert.equal(result.invalidRaw, null);
});

test('wrong profile field types are backed up rather than accepted', () => {
  const raw = JSON.stringify({ exp: '310', badges: {} });
  const result = parseStoredProfile(raw, today);
  assert.equal(result.profile.exp, 0);
  assert.equal(result.invalidRaw, raw);
});

test('unreadable storage stays in memory and is never overwritten', () => {
  const storage = {
    getItem() { throw new Error('denied'); },
    setItem() { throw new Error('unexpected write'); },
  };
  const loaded = loadProfile(() => storage, today);
  assert.equal(loaded.profile.exp, 0);
  assert.equal(loaded.readFailed, true);
  assert.equal(persistProfile(() => storage, loaded.profile, loaded), false);
});

test('corrupt raw value is backed up before replacing primary key', () => {
  const calls = [];
  const values = new Map([['english_study_profile', '{']]);
  const storage = {
    getItem(key) { calls.push(['get', key]); return values.get(key) ?? null; },
    setItem(key, value) { calls.push(['set', key]); values.set(key, value); },
  };
  const loaded = loadProfile(() => storage, today);
  assert.equal(persistProfile(() => storage, loaded.profile, loaded), true);
  assert.equal(values.get('english_study_profile_invalid_backup'), '{');
  assert.equal(JSON.parse(values.get('english_study_profile')).exp, 0);
  assert.ok(calls.findIndex(([op, key]) => op === 'set' && key === 'english_study_profile_invalid_backup') <
    calls.findIndex(([op, key]) => op === 'set' && key === 'english_study_profile'));
});

test('failed backup leaves corrupt primary value untouched', () => {
  const values = new Map([['english_study_profile', '{']]);
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) {
      if (key.includes('invalid_backup')) throw new Error('quota');
      values.set(key, value);
    },
  };
  const loaded = loadProfile(() => storage, today);
  assert.equal(persistProfile(() => storage, loaded.profile, loaded), false);
  assert.equal(values.get('english_study_profile'), '{');
});
