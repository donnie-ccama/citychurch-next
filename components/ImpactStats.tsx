'use client';

/**
 * ImpactStats — Reusable impact metrics bar.
 * Shows key ministry numbers with optional accent styling.
 * Pass real numbers when available; defaults shown are placeholders.
 */

interface Stat {
  value: string;
  label: string;
}

interface ImpactStatsProps {
  stats?: Stat[];
  variant?: 'default' | 'compact' | 'hero';
}

const defaultStats: Stat[] = [
  { value: '150,000', label: 'Meals Served Each Year' },
  { value: '1,400+', label: 'Children' },
  { value: '600', label: 'Volunteers' },
  { value: '29', label: 'Years Serving' },
];

export default function ImpactStats({ stats = defaultStats, variant = 'default' }: ImpactStatsProps) {
  const isHero = variant === 'hero';
  const isCompact = variant === 'compact';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${isCompact ? '120px' : '150px'}, 1fr))`,
        gap: isCompact ? '1rem' : '2rem',
        textAlign: 'center',
        padding: isHero ? '3rem 1.5rem' : isCompact ? '1.5rem 0' : '2.5rem 1.5rem',
        backgroundColor: isHero ? 'var(--accent)' : 'transparent',
        borderRadius: isHero ? '12px' : '0',
      }}
    >
      {stats.map((stat, idx) => (
        <div key={idx}>
          <p
            style={{
              fontWeight: 800,
              fontSize: isCompact ? '1.5rem' : '2.25rem',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: isHero ? 'white' : 'var(--accent)',
              marginBottom: '0.5rem',
            }}
          >
            {stat.value}
          </p>
          <p
            style={{
              fontSize: isCompact ? '0.75rem' : '0.8125rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: isHero ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)',
            }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
