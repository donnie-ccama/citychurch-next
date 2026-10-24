import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DTK_COPY } from './i18n.ts';

test('English and Spanish copy have the same keys', () => {
  assert.deepEqual(Object.keys(DTK_COPY.es).sort(), Object.keys(DTK_COPY.en).sort());
  assert.deepEqual(Object.keys(DTK_COPY.es.heroAlt).sort(), Object.keys(DTK_COPY.en.heroAlt).sort());
});

test('signed-in messages include the email', () => {
  for (const lang of ['en', 'es'] as const) {
    assert.match(DTK_COPY[lang].gatePending('a@x.com'), /a@x\.com/);
    assert.match(DTK_COPY[lang].gateNoAccess('a@x.com'), /a@x\.com/);
  }
});
