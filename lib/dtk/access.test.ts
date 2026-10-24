import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canViewDtk, normalizeEmail, parseAdminEmails } from './access.ts';

test('normalizeEmail trims and lowercases', () => {
  assert.equal(normalizeEmail('  Jane@Example.COM '), 'jane@example.com');
});

test('parseAdminEmails splits, trims, lowercases, drops blanks', () => {
  assert.deepEqual(parseAdminEmails(' A@x.com, ,b@X.com '), ['a@x.com', 'b@x.com']);
  assert.deepEqual(parseAdminEmails(undefined), []);
  assert.deepEqual(parseAdminEmails(''), []);
});

test('admins can view regardless of request status', () => {
  assert.equal(canViewDtk('Admin@x.com', ['admin@x.com'], null), true);
});

test('only approved requests grant access', () => {
  assert.equal(canViewDtk('u@x.com', [], 'approved'), true);
  assert.equal(canViewDtk('u@x.com', [], 'pending'), false);
  assert.equal(canViewDtk('u@x.com', [], 'denied'), false);
  assert.equal(canViewDtk('u@x.com', [], null), false);
});

test('no email means no access, even with an empty admin list', () => {
  assert.equal(canViewDtk(null, [], null), false);
  assert.equal(canViewDtk('', [], null), false);
  assert.equal(canViewDtk(undefined, [], 'approved'), false);
});
