interface SectionHeaderProps {
  label: string;
  title: string;
}

export default function SectionHeader({ label, title }: SectionHeaderProps) {
  return (
    <div
      style={{
        textAlign: 'center',
        marginBottom: '3rem',
      }}
    >
      <p
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: `var(--accent)`,
          marginBottom: '0.5rem',
        }}
      >
        {label}
      </p>
      <h2
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: `var(--text-primary)`,
        }}
      >
        {title}
      </h2>
    </div>
  );
}
