'use client';

/**
 * DonateButton — Links to CityKid donation portal.
 *
 * Usage:
 *   <DonateButton />                              — default "Donate" button
 *   <DonateButton label="Feed a Child Today" />   — custom label
 *   <DonateButton variant="nav" />                — compact nav style
 *   <DonateButton href="...?utm_source=ig" />     — campaign-tracked URL
 *
 * Opens https://www.citykid.online/?form=FUNAFYBLTAV in a new tab by default.
 * The portal redirects donors back to the main site upon completion.
 */

const DONATE_URL = 'https://www.citykid.online/?form=FUNAFYBLTAV';

interface DonateButtonProps {
  label?: string;
  variant?: 'primary' | 'outline' | 'nav';
  icon?: boolean;
  fullWidth?: boolean;
  className?: string;
  /** Optional override URL (e.g. with UTM params). Defaults to the main donate URL. */
  href?: string;
}

export default function DonateButton({
  label = 'Donate',
  variant = 'primary',
  icon = true,
  fullWidth = false,
  className,
  href,
}: DonateButtonProps) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isNav = variant === 'nav';

  return (
    <a
      href={href || DONATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: isNav ? '0.5rem 1.25rem' : '0.875rem 2rem',
        backgroundColor: isPrimary || isNav ? 'var(--accent)' : 'transparent',
        color: isPrimary || isNav ? 'white' : 'var(--text-primary)',
        border: isOutline ? '1px solid var(--border-color)' : 'none',
        fontWeight: 600,
        fontSize: isNav ? '0.8125rem' : '0.9375rem',
        borderRadius: isNav ? '6px' : '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        letterSpacing: '-0.01em',
        fontFamily: "'Inter', system-ui, sans-serif",
        width: fullWidth ? '100%' : 'auto',
        textDecoration: 'none',
        boxSizing: 'border-box',
      }}
    >
      {icon && (
        <svg xmlns="http://www.w3.org/2000/svg" width={isNav ? 14 : 16} height={isNav ? 14 : 16} viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )}
      {label}
    </a>
  );
}
