import test from 'node:test';
import assert from 'node:assert/strict';
import { trapDialogTab } from '../src/utils/dialogFocus.js';

test('Tab and Shift+Tab wrap at dialog boundaries', () => {
  const first = { focus() { active = first; } };
  const last = { focus() { active = last; } };
  let active = last;
  let prevented = 0;
  const root = { querySelectorAll: () => [first, last] };
  const event = shiftKey => ({ key: 'Tab', shiftKey, preventDefault() { prevented += 1; } });
  trapDialogTab(event(false), root, active);
  assert.equal(active, first);
  trapDialogTab(event(true), root, active);
  assert.equal(active, last);
  assert.equal(prevented, 2);
  assert.equal(trapDialogTab({ key: 'Escape' }, root, active), false);
});
