import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dtkPath, extractBody, resolveDtkRoute } from './pages.ts';

test('resolveDtkRoute maps English addresses', () => {
  assert.deepEqual(resolveDtkRoute(undefined), { lang: 'en', page: 'index' });
  assert.deepEqual(resolveDtkRoute([]), { lang: 'en', page: 'index' });
  for (const page of ['index', 'pitfalls', 'training', 'toolkit', 'sources']) {
    assert.deepEqual(resolveDtkRoute([page]), { lang: 'en', page });
  }
});

test('resolveDtkRoute maps Spanish addresses', () => {
  assert.deepEqual(resolveDtkRoute(['es']), { lang: 'es', page: 'index' });
  for (const page of ['index', 'pitfalls', 'training', 'toolkit', 'sources']) {
    assert.deepEqual(resolveDtkRoute(['es', page]), { lang: 'es', page });
  }
});

test('resolveDtkRoute rejects unknown, nested, cased, and traversal paths', () => {
  for (const segments of [
    ['secret'],
    ['pitfalls', 'extra'],
    ['Pitfalls'],
    ['../package'],
    ['..%2Fpackage'],
    ['pitfalls.html'],
    ['es', 'es'],
    ['ES'],
    ['es', 'secret'],
    ['es', 'pitfalls', 'extra'],
    ['en'],
  ]) {
    assert.equal(resolveDtkRoute(segments), null, segments.join('/'));
  }
});

test('dtkPath builds addresses for both languages', () => {
  assert.equal(dtkPath('en', 'index'), '/discipleship');
  assert.equal(dtkPath('en', 'pitfalls'), '/discipleship/pitfalls');
  assert.equal(dtkPath('en', 'login'), '/discipleship/login');
  assert.equal(dtkPath('es', 'index'), '/discipleship/es');
  assert.equal(dtkPath('es', 'toolkit'), '/discipleship/es/toolkit');
  assert.equal(dtkPath('es', 'set-password'), '/discipleship/es/set-password');
});

test('extractBody returns the markup inside body', () => {
  const html = '<html><head><title>x</title></head><body class="a">\n<main><p>Hi</p></main>\n</body></html>';
  assert.equal(extractBody(html), '<main><p>Hi</p></main>');
});

test('extractBody throws when there is no body', () => {
  assert.throws(() => extractBody('<p>no body</p>'), /no <body>/);
});
