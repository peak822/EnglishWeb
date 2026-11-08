import test from 'node:test';
import assert from 'node:assert/strict';
import { activateOnKey } from '../src/utils/keyboard.js';

test('keyboard activation accepts Enter and Space once, but ignores unrelated keys', () => {
  let calls = 0;
  let prevented = 0;
  const action = () => { calls += 1; };
  const event = key => ({ key, preventDefault: () => { prevented += 1; } });
  activateOnKey(event('Enter'), action);
  activateOnKey(event(' '), action);
  activateOnKey(event('ArrowDown'), action);
  assert.equal(calls, 2);
  assert.equal(prevented, 2);
});
