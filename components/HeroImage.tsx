import Image from 'next/image';

interface HeroImageProps {
  src: string;
  children: React.ReactNode;
}

export default function HeroImage({ src, children }: HeroImageProps) {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '65vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#000',
        width: '100%',
        maxWidth: '100vw',
      }}
    >
      {/* Hero image */}
      <Image
        src={src}
        alt="A child smiling at Citychurch Amarillo"
        fill
        priority
        style={{
          objectFit: 'cover',
          objectPosition: 'center 30%',
        }}
      />

      {/* Subtle bottom gradient for button readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content overlay */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '800px',
          padding: '2rem 1.5rem 4rem',
          color: '#fff',
          alignSelf: 'flex-end',
        }}
      >
        {children}
      </div>
    </section>
  );
}
