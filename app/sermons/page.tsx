import { Metadata } from 'next';
import SectionHeader from '@/components/SectionHeader';
import SermonListRow from '@/components/SermonListRow';
import { createServerClient } from '@/lib/supabase-server';
import { Sermon } from '@/lib/types';

export const revalidate = 3600; // ISR: refresh hourly

export const metadata: Metadata = {
  title: 'Sermons — Citychurch',
  description:
    'Listen to messages from Citychurch Amarillo. Weekly sermons about authentic presence, service, and transformation.',
};

export default async function Sermons() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('sermons')
    .select('*')
    .eq('published', true)
    .order('sermon_date', { ascending: false });

  if (error) {
    console.error('Failed to load sermons:', error);
  }

  const sermons = (data ?? []) as Sermon[];
  const [featured, ...rest] = sermons;

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* HERO */}
      <section
        style={{
          padding: '6rem 1.5rem',
          background:
            'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-muted) 100%)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }} className="reveal">
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '1rem',
            }}
          >
            Sermons
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}
          >
            Weekly messages about authentic presence, serving our neighbors, and
            the transformation that happens when we simply show up.
          </p>
        </div>
      </section>

      {sermons.length === 0 ? (
        <section style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
          <div
            style={{ maxWidth: '500px', margin: '0 auto' }}
            className="reveal"
          >
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '1.0625rem',
                lineHeight: 1.6,
              }}
            >
              No sermons published yet. Check back Sunday.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* FEATURED / LATEST */}
          {featured && (
            <section
              style={{
                padding: '6rem 1.5rem 4rem',
                backgroundColor: 'var(--bg-secondary)',
              }}
            >
              <div
                style={{ maxWidth: '1000px', margin: '0 auto' }}
                className="reveal"
              >
                <SectionHeader label="Latest" title="The most recent message" />
                <SermonListRow
                  variant="featured"
                  slug={featured.slug}
                  title={featured.title}
                  speaker={featured.speaker}
                  series={featured.series}
                  sermon_date={featured.sermon_date}
                  description={featured.description}
                  thumbnail_url={featured.thumbnail_url}
                />
              </div>
            </section>
          )}

          {/* ARCHIVE (STACKED LIST) */}
          {rest.length > 0 && (
            <section style={{ padding: '6rem 1.5rem' }}>
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div className="reveal">
                  <SectionHeader label="Archive" title="All Sermons" />
                </div>
                <div role="list">
                  {rest.map((sermon, idx) => (
                    <div
                      key={sermon.id}
                      role="listitem"
                      className="reveal"
                      style={{
                        borderBottom:
                          idx === rest.length - 1
                            ? 'none'
                            : '1px solid var(--border-color)',
                      }}
                    >
                      <SermonListRow
                        slug={sermon.slug}
                        title={sermon.title}
                        speaker={sermon.speaker}
                        series={sermon.series}
                        sermon_date={sermon.sermon_date}
                        description={sermon.description}
                        thumbnail_url={sermon.thumbnail_url}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
