import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateDtkRequest } from './request.ts';

test('valid request is trimmed and email lowercased', () => {
  const result = validateDtkRequest({ name: ' Jane ', email: ' Jane@Example.com ', note: ' hi ' });
  assert.deepEqual(result, { ok: true, spam: false, value: { name: 'Jane', email: 'jane@example.com', note: 'hi' } });
});

test('empty note becomes null', () => {
  const result = validateDtkRequest({ name: 'Jane', email: 'jane@example.com', note: '   ' });
  assert.equal(result.ok && result.value.note, null);
});

test('missing name or bad email is rejected', () => {
  assert.deepEqual(validateDtkRequest({ name: '', email: 'jane@example.com' }), { ok: false, error: 'Please enter your name.' });
  assert.deepEqual(validateDtkRequest({ name: 'Jane', email: 'jane' }), { ok: false, error: 'Please enter a valid email address.' });
  assert.deepEqual(validateDtkRequest(null), { ok: false, error: 'Please enter your name.' });
});

test('overly long fields are rejected', () => {
  const result = validateDtkRequest({ name: 'J', email: 'j@x.com', note: 'x'.repeat(2001) });
  assert.deepEqual(result, { ok: false, error: 'Your name or note is too long.' });
});

test('filled honeypot is flagged as spam', () => {
  const result = validateDtkRequest({ name: 'Bot', email: 'bot@x.com', website: 'http://spam' });
  assert.equal(result.ok && result.spam, true);
});
