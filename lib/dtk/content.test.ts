import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'content', 'discipleship');
const PAGES = ['index', 'pitfalls', 'training', 'toolkit', 'sources'];

// Tag names plus class attributes, in order. Text and href values are ignored.
function shape(html: string): string[] {
  return [...html.matchAll(/<([a-z0-9]+)(?:[^>]*?class="([^"]*)")?[^>]*>/gi)].map(
    (m) => `${m[1].toLowerCase()}${m[2] ? '.' + m[2] : ''}`
  );
}

for (const page of PAGES) {
  test(`Spanish ${page} matches the English structure`, () => {
    const en = readFileSync(path.join(DIR, `${page}.html`), 'utf8');
    const es = readFileSync(path.join(DIR, 'es', `${page}.html`), 'utf8');
    assert.deepEqual(shape(es), shape(en));
  });

  test(`Spanish ${page} is marked Spanish and links to Spanish pages`, () => {
    const es = readFileSync(path.join(DIR, 'es', `${page}.html`), 'utf8');
    assert.match(es, /<html lang="es">/);
    const kitLinks = [...es.matchAll(/href="(\/discipleship[^"]*)"/g)].map((m) => m[1]);
    assert.ok(kitLinks.length >= 5, 'menu links present');
    for (const href of kitLinks) assert.match(href, /^\/discipleship\/es(\/|$)/, href);
  });
}
