import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveDtkPage, extractBody } from './pages.ts';

test('resolveDtkPage maps no segments to index', () => {
  assert.equal(resolveDtkPage(undefined), 'index');
  assert.equal(resolveDtkPage([]), 'index');
});

test('resolveDtkPage accepts every known page', () => {
  for (const name of ['index', 'pitfalls', 'training', 'toolkit', 'sources']) {
    assert.equal(resolveDtkPage([name]), name);
  }
});

test('resolveDtkPage rejects unknown, nested, cased, and traversal paths', () => {
  assert.equal(resolveDtkPage(['secret']), null);
  assert.equal(resolveDtkPage(['pitfalls', 'extra']), null);
  assert.equal(resolveDtkPage(['Pitfalls']), null);
  assert.equal(resolveDtkPage(['../package']), null);
  assert.equal(resolveDtkPage(['..%2Fpackage']), null);
  assert.equal(resolveDtkPage(['pitfalls.html']), null);
});

test('extractBody returns the markup inside body', () => {
  const html = '<html><head><title>x</title></head><body class="a">\n<main><p>Hi</p></main>\n</body></html>';
  assert.equal(extractBody(html), '<main><p>Hi</p></main>');
});

test('extractBody throws when there is no body', () => {
  assert.throws(() => extractBody('<p>no body</p>'), /no <body>/);
});
