'use client';

interface ProofOfLifeCardProps {
  id: string;
  photo_url: string;
  description: string | null;
  created_at: string;
  onClick: () => void;
}

export default function ProofOfLifeCard({
  photo_url,
  description,
  created_at,
  onClick,
}: ProofOfLifeCardProps) {
  const date = new Date(created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="card-hover"
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Photo */}
      <div
        style={{
          aspectRatio: '4/3',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-muted)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo_url}
          alt={description || 'Community photo'}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '1rem 1.25rem' }}>
        {description && (
          <p
            style={{
              fontSize: '0.9375rem',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              marginBottom: '0.5rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </p>
        )}
        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
          }}
        >
          {date}
        </p>
      </div>
    </div>
  );
}
