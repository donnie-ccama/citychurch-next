interface VideoEmbedProps {
  url: string;
  title: string;
}

export default function VideoEmbed({ url, title }: VideoEmbedProps) {
  return (
    <div
      className="video-embed"
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: `var(--bg-muted)`,
        marginBottom: '1.5rem',
        aspectRatio: '16/9',
      }}
    >
      <iframe
        src={url}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        allowFullScreen
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  );
}
