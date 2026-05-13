'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  saveSermon,
  deleteSermon,
  previewVimeo,
  type SaveSermonInput,
  type VimeoPreview,
} from './actions';
import { Sermon } from '@/lib/types';

interface Props {
  sermons: Sermon[];
}

type FormState = SaveSermonInput;

const blankForm: FormState = {
  title: '',
  speaker: '',
  series: '',
  sermon_date: '',
  video_url: '',
  description: '',
  scripture_reference: '',
  transcript_markdown: '',
  featured: false,
  published: true,
};

function fromSermon(s: Sermon): FormState {
  return {
    id: s.id,
    title: s.title,
    speaker: s.speaker,
    series: s.series ?? '',
    sermon_date: s.sermon_date,
    video_url: s.video_url ?? '',
    description: s.description ?? '',
    scripture_reference: s.scripture_reference ?? '',
    transcript_markdown: s.transcript_markdown ?? '',
    featured: s.featured,
    published: s.published,
  };
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.9375rem',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.375rem',
  fontWeight: 500,
  fontSize: '0.875rem',
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function SermonsAdminClient({ sermons }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(blankForm);
  const [vimeoPreview, setVimeoPreview] = useState<VimeoPreview | null>(null);
  const [vimeoError, setVimeoError] = useState<string | null>(null);
  const [vimeoLoading, setVimeoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const isEdit = Boolean(form.id);

  const openCreate = () => {
    setForm(blankForm);
    setVimeoPreview(null);
    setVimeoError(null);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (s: Sermon) => {
    setForm(fromSermon(s));
    setVimeoPreview(
      s.vimeo_id && s.thumbnail_url
        ? {
            vimeo_id: s.vimeo_id,
            title: s.title,
            duration: s.duration_seconds ?? 0,
            thumbnail_url: s.thumbnail_url,
            author_name: s.speaker,
          }
        : null
    );
    setVimeoError(null);
    setError(null);
    setShowForm(true);
  };

  const close = () => {
    setShowForm(false);
    setForm(blankForm);
    setVimeoPreview(null);
    setVimeoError(null);
    setError(null);
  };

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleVimeoBlur = async () => {
    if (!form.video_url.trim()) {
      setVimeoPreview(null);
      setVimeoError(null);
      return;
    }
    setVimeoLoading(true);
    setVimeoError(null);
    const result = await previewVimeo(form.video_url);
    setVimeoLoading(false);
    if (result.ok) {
      setVimeoPreview(result.preview);
    } else {
      setVimeoPreview(null);
      setVimeoError(result.error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await saveSermon(form);
        close();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  };

  const handleDelete = (sermon: Sermon) => {
    if (
      !window.confirm(
        `Delete "${sermon.title}"? This permanently removes it from the site.`
      )
    ) {
      return;
    }
    startTransition(async () => {
      try {
        await deleteSermon(sermon.id);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Sermons</h1>
        {!showForm && (
          <button
            type="button"
            onClick={openCreate}
            style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            + New Sermon
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: '1.5rem',
              fontSize: '1.25rem',
              fontWeight: 600,
            }}
          >
            {isEdit ? 'Edit sermon' : 'New sermon'}
          </h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <label style={labelStyle}>Speaker *</label>
              <input
                type="text"
                required
                value={form.speaker}
                onChange={(e) => updateField('speaker', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Series</label>
              <input
                type="text"
                value={form.series}
                onChange={(e) => updateField('series', e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <label style={labelStyle}>Sermon date *</label>
              <input
                type="date"
                required
                value={form.sermon_date}
                onChange={(e) => updateField('sermon_date', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Scripture reference</label>
              <input
                type="text"
                placeholder="e.g. Ephesians 5:21–33"
                value={form.scripture_reference}
                onChange={(e) =>
                  updateField('scripture_reference', e.target.value)
                }
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Vimeo URL</label>
            <input
              type="url"
              placeholder="https://vimeo.com/1172206088 or https://player.vimeo.com/video/…"
              value={form.video_url}
              onChange={(e) => updateField('video_url', e.target.value)}
              onBlur={handleVimeoBlur}
              style={inputStyle}
            />
            {vimeoLoading && (
              <p
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                }}
              >
                Looking up Vimeo metadata…
              </p>
            )}
            {vimeoError && !vimeoLoading && (
              <p
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8125rem',
                  color: '#dc2626',
                }}
              >
                {vimeoError}
              </p>
            )}
            {vimeoPreview && !vimeoLoading && (
              <div
                style={{
                  marginTop: '0.75rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vimeoPreview.thumbnail_url}
                  alt={vimeoPreview.title}
                  style={{
                    width: '120px',
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    flexShrink: 0,
                  }}
                />
                <div style={{ minWidth: 0, fontSize: '0.875rem' }}>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {vimeoPreview.title}
                  </p>
                  <p
                    style={{
                      margin: '0.25rem 0 0',
                      color: 'var(--text-muted)',
                      fontSize: '0.8125rem',
                    }}
                  >
                    {vimeoPreview.author_name} ·{' '}
                    {formatDuration(vimeoPreview.duration)} · ID{' '}
                    {vimeoPreview.vimeo_id}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Transcript (markdown)</label>
            <textarea
              value={form.transcript_markdown}
              onChange={(e) =>
                updateField('transcript_markdown', e.target.value)
              }
              placeholder="Use # for headings, > for quotes, **bold**, *italic*, - for lists."
              style={{
                ...inputStyle,
                minHeight: '300px',
                resize: 'vertical',
                fontFamily:
                  "'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace",
                fontSize: '0.875rem',
                lineHeight: 1.5,
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem' }}>Featured</span>
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => updateField('published', e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem' }}>Published</span>
            </label>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                color: '#b91c1c',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="submit"
              disabled={pending}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: pending
                  ? 'var(--text-muted)'
                  : 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: pending ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {pending ? 'Saving…' : isEdit ? 'Save changes' : 'Create sermon'}
            </button>
            <button
              type="button"
              onClick={close}
              disabled={pending}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                cursor: pending ? 'not-allowed' : 'pointer',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!showForm && error && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#b91c1c',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              {['Title', 'Speaker', 'Series', 'Date', 'Status', 'Actions'].map(
                (h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: '0.875rem 1rem',
                      textAlign: i === 5 ? 'right' : 'left',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {sermons.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.9375rem',
                  }}
                >
                  No sermons yet — click &ldquo;+ New Sermon&rdquo; to add one.
                </td>
              </tr>
            ) : (
              sermons.map((s, idx) => (
                <tr
                  key={s.id}
                  style={{
                    borderBottom:
                      idx === sermons.length - 1
                        ? 'none'
                        : '1px solid var(--border-color)',
                  }}
                >
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 500 }}>
                    {s.title}
                    {!s.vimeo_id && s.video_url && (
                      <span
                        style={{
                          display: 'inline-block',
                          marginLeft: '0.5rem',
                          fontSize: '0.6875rem',
                          color: 'var(--text-muted)',
                          fontWeight: 400,
                        }}
                      >
                        (non-Vimeo URL)
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: '0.875rem 1rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {s.speaker}
                  </td>
                  <td
                    style={{
                      padding: '0.875rem 1rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {s.series || '—'}
                  </td>
                  <td
                    style={{
                      padding: '0.875rem 1rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {s.sermon_date}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span
                      style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        backgroundColor: s.published
                          ? 'rgba(34, 197, 94, 0.1)'
                          : 'rgba(107, 114, 128, 0.1)',
                        color: s.published ? '#16a34a' : '#6b7280',
                      }}
                    >
                      {s.published ? 'Published' : 'Draft'}
                    </span>
                    {s.featured && (
                      <span
                        style={{
                          marginLeft: '0.375rem',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          backgroundColor: 'rgba(194, 65, 12, 0.1)',
                          color: '#c2410c',
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: '0.875rem 1rem',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => openEdit(s)}
                      disabled={pending}
                      style={{
                        padding: '0.375rem 0.875rem',
                        backgroundColor: 'transparent',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent)',
                        borderRadius: '6px',
                        cursor: pending ? 'not-allowed' : 'pointer',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        marginRight: '0.375rem',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s)}
                      disabled={pending}
                      style={{
                        padding: '0.375rem 0.875rem',
                        backgroundColor: 'transparent',
                        color: '#dc2626',
                        border: '1px solid #dc2626',
                        borderRadius: '6px',
                        cursor: pending ? 'not-allowed' : 'pointer',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
