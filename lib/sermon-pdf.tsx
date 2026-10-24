import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { Sermon } from './types';

// --- Markdown parsing -------------------------------------------------------

type Block =
  | { kind: 'paragraph'; text: string }
  | { kind: 'heading'; level: 1 | 2 | 3; text: string }
  | { kind: 'blockquote'; text: string }
  | { kind: 'list'; items: string[] };

function parseBlocks(markdown: string): Block[] {
  const blocks: Block[] = [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');

  let paragraph: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push({ kind: 'paragraph', text: paragraph.join(' ').trim() });
    paragraph = [];
  };
  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push({ kind: 'list', items: listItems });
    listItems = [];
  };
  const flushAll = () => {
    flushParagraph();
    flushList();
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim() === '') {
      flushAll();
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      flushAll();
      blocks.push({
        kind: 'heading',
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2].trim(),
      });
      continue;
    }

    if (line.startsWith('> ')) {
      flushAll();
      blocks.push({ kind: 'blockquote', text: line.slice(2).trim() });
      continue;
    }

    const listMatch = /^(?:[-*]|\d+\.)\s+(.+)$/.exec(line);
    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1].trim());
      continue;
    }

    flushList();
    paragraph.push(line.trim());
  }
  flushAll();

  return blocks;
}

// Inline parsing: **bold**, *italic* / _italic_. Returns react-pdf <Text> spans.
type Span = { text: string; bold?: boolean; italic?: boolean };

function parseInline(text: string): Span[] {
  const spans: Span[] = [];
  let i = 0;
  let buffer = '';

  const pushBuffer = () => {
    if (buffer.length > 0) {
      spans.push({ text: buffer });
      buffer = '';
    }
  };

  while (i < text.length) {
    if (text.startsWith('**', i)) {
      const end = text.indexOf('**', i + 2);
      if (end !== -1) {
        pushBuffer();
        spans.push({ text: text.slice(i + 2, end), bold: true });
        i = end + 2;
        continue;
      }
    }
    const ch = text[i];
    if (ch === '*' || ch === '_') {
      const end = text.indexOf(ch, i + 1);
      if (end !== -1 && end > i + 1) {
        pushBuffer();
        spans.push({ text: text.slice(i + 1, end), italic: true });
        i = end + 1;
        continue;
      }
    }
    buffer += ch;
    i++;
  }
  pushBuffer();
  return spans;
}

// --- Styles -----------------------------------------------------------------

const styles = StyleSheet.create({
  page: {
    paddingTop: 64,
    paddingBottom: 72,
    paddingHorizontal: 64,
    fontFamily: 'Times-Roman',
    fontSize: 11,
    lineHeight: 1.6,
    color: '#1a1a1a',
  },
  brand: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    letterSpacing: 3,
    color: '#888888',
    marginBottom: 24,
  },
  series: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    letterSpacing: 2,
    color: '#c2410c',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Times-Bold',
    marginBottom: 12,
    lineHeight: 1.2,
  },
  meta: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#555555',
    marginBottom: 4,
  },
  description: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#444444',
    marginTop: 14,
    marginBottom: 8,
    lineHeight: 1.6,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    borderBottomStyle: 'solid',
    marginTop: 24,
    marginBottom: 32,
  },
  paragraph: { marginBottom: 12 },
  h1: {
    fontFamily: 'Times-Bold',
    fontSize: 18,
    marginTop: 24,
    marginBottom: 12,
  },
  h2: {
    fontFamily: 'Times-Bold',
    fontSize: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  h3: {
    fontFamily: 'Times-Bold',
    fontSize: 13,
    marginTop: 16,
    marginBottom: 8,
  },
  blockquote: {
    marginVertical: 14,
    paddingLeft: 14,
    borderLeftWidth: 2,
    borderLeftColor: '#c2410c',
    borderLeftStyle: 'solid',
    fontStyle: 'italic',
    color: '#444444',
  },
  listRow: { flexDirection: 'row', marginBottom: 6 },
  listBullet: { width: 14 },
  listText: { flex: 1 },
  bold: { fontFamily: 'Times-Bold' },
  italic: { fontStyle: 'italic' },
  footer: {
    position: 'absolute',
    bottom: 36,
    left: 64,
    right: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontFamily: 'Helvetica',
    fontSize: 8,
    color: '#999999',
  },
});

// --- Components -------------------------------------------------------------

function InlineText({ spans }: { spans: Span[] }) {
  return (
    <>
      {spans.map((s, i) => (
        <Text
          key={i}
          style={s.bold ? styles.bold : s.italic ? styles.italic : undefined}
        >
          {s.text}
        </Text>
      ))}
    </>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.kind) {
    case 'heading': {
      const style =
        block.level === 1
          ? styles.h1
          : block.level === 2
            ? styles.h2
            : styles.h3;
      return (
        <Text style={style}>
          <InlineText spans={parseInline(block.text)} />
        </Text>
      );
    }
    case 'blockquote':
      return (
        <View style={styles.blockquote}>
          <Text>
            <InlineText spans={parseInline(block.text)} />
          </Text>
        </View>
      );
    case 'list':
      return (
        <View style={{ marginBottom: 12 }}>
          {block.items.map((item, idx) => (
            <View key={idx} style={styles.listRow}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>
                <InlineText spans={parseInline(item)} />
              </Text>
            </View>
          ))}
        </View>
      );
    case 'paragraph':
    default:
      return (
        <Text style={styles.paragraph}>
          <InlineText spans={parseInline(block.text)} />
        </Text>
      );
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface SermonPdfProps {
  sermon: Pick<
    Sermon,
    | 'title'
    | 'speaker'
    | 'series'
    | 'sermon_date'
    | 'scripture_reference'
    | 'description'
    | 'transcript_markdown'
    | 'slug'
  >;
  baseUrl?: string;
}

export function SermonPdfDocument({ sermon, baseUrl }: SermonPdfProps) {
  const blocks = parseBlocks(sermon.transcript_markdown ?? '');
  const sermonUrl =
    baseUrl && sermon.slug ? `${baseUrl}/sermons/${sermon.slug}` : null;

  return (
    <Document
      title={`${sermon.title} — Citychurch`}
      author={sermon.speaker}
      subject={sermon.series ?? undefined}
    >
      <Page size="LETTER" style={styles.page} wrap>
        <Text style={styles.brand}>CITYCHURCH</Text>
        {sermon.series && <Text style={styles.series}>{sermon.series.toUpperCase()}</Text>}
        <Text style={styles.title}>{sermon.title}</Text>
        <Text style={styles.meta}>
          {sermon.speaker} · {formatDate(sermon.sermon_date)}
        </Text>
        {sermon.scripture_reference && (
          <Text style={styles.meta}>{sermon.scripture_reference}</Text>
        )}
        {sermon.description && (
          <Text style={styles.description}>{sermon.description}</Text>
        )}

        <View style={styles.divider} />

        {blocks.map((block, idx) => (
          <BlockRenderer key={idx} block={block} />
        ))}

        <View fixed style={styles.footer}>
          <Text>{sermonUrl ?? 'citychurch.com'} · Citychurch Amarillo</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
