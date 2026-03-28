'use client';

import { useState, useEffect, useCallback } from 'react';

interface Submission {
  id: string;
  photo_url: string;
  description: string | null;
  status: string;
  created_at: string;
}

type FilterTab = 'all' | 'pending' | 'approved';

export default function AdminProofOfLife() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch('/api/proof-of-life/list');
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch {
      console.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch('/api/proof-of-life/approve-by-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: 'approved' } : s))
        );
      }
    } catch {
      console.error('Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch('/api/proof-of-life/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      console.error('Failed to delete');
    } finally {
      setActionLoading(null);
      setConfirmDelete(null);
    }
  };

  const filtered = submissions.filter((s) => {
    if (activeTab === 'pending') return s.status === 'pending';
    if (activeTab === 'approved') return s.status === 'approved';
    return true;
  });

  const counts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
  };

  const tabStyle = (tab: FilterTab) => ({
    padding: '0.5rem 1.25rem',
    fontSize: '0.875rem',
    fontWeight: activeTab === tab ? 600 : 400,
    color: activeTab === tab ? 'white' : 'var(--text-secondary)',
    backgroundColor: activeTab === tab ? 'var(--accent)' : 'transparent',
    border: activeTab === tab ? 'none' : '1px solid var(--border-color)',
    borderRadius: '999px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  if (loading) {
    return (
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>
          Proof of Life
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Loading submissions...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          Proof of Life
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setActiveTab('all')} style={tabStyle('all')}>
            All ({counts.all})
          </button>
          <button onClick={() => setActiveTab('pending')} style={tabStyle('pending')}>
            Pending ({counts.pending})
          </button>
          <button onClick={() => setActiveTab('approved')} style={tabStyle('approved')}>
            Approved ({counts.approved})
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
          }}
        >
          <p style={{ color: 'var(--text-secondary)' }}>
            {activeTab === 'pending' ? 'No pending submissions.' : activeTab === 'approved' ? 'No approved photos yet.' : 'No submissions yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((s) => (
            <div
              key={s.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {/* Photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.photo_url}
                alt={s.description || 'Submission'}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  display: 'block',
                  backgroundColor: 'var(--bg-muted)',
                }}
              />

              {/* Info */}
              <div style={{ padding: '1rem 1.25rem' }}>
                {/* Status Badge */}
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.75rem',
                    color: s.status === 'approved' ? '#16a34a' : s.status === 'pending' ? '#d97706' : '#dc2626',
                    backgroundColor: s.status === 'approved' ? '#f0fdf4' : s.status === 'pending' ? '#fffbeb' : '#fef2f2',
                  }}
                >
                  {s.status}
                </span>

                {s.description && (
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)',
                      lineHeight: 1.5,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {s.description}
                  </p>
                )}

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {new Date(s.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {s.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(s.id)}
                      disabled={actionLoading === s.id}
                      style={{
                        flex: 1,
                        padding: '0.5rem 1rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'white',
                        backgroundColor: '#16a34a',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: actionLoading === s.id ? 'not-allowed' : 'pointer',
                        opacity: actionLoading === s.id ? 0.6 : 1,
                      }}
                    >
                      {actionLoading === s.id ? 'Approving...' : 'Approve'}
                    </button>
                  )}

                  {confirmDelete === s.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={actionLoading === s.id}
                        style={{
                          flex: 1,
                          padding: '0.5rem 1rem',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: 'white',
                          backgroundColor: '#dc2626',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: actionLoading === s.id ? 'not-allowed' : 'pointer',
                          opacity: actionLoading === s.id ? 0.6 : 1,
                        }}
                      >
                        {actionLoading === s.id ? 'Deleting...' : 'Confirm Delete'}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          color: 'var(--text-secondary)',
                          backgroundColor: 'var(--bg-muted)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(s.id)}
                      style={{
                        flex: s.status === 'pending' ? undefined : 1,
                        padding: '0.5rem 1rem',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: '#dc2626',
                        backgroundColor: 'transparent',
                        border: '1px solid #dc2626',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
