import { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import SectionHeader from '@/components/SectionHeader';
import ProofOfLifeGrid from '@/components/ProofOfLifeGrid';
import QRCode from 'qrcode';

export const metadata: Metadata = {
  title: 'Proof of Life — Citychurch',
  description: 'Moments from our community, shared by our volunteers. View and contribute to the Citychurch photo bulletin board.',
};

export const dynamic = 'force-dynamic';

async function getApprovedSubmissions() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('proof_of_life')
      .select('id, photo_url, description, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Proof of Life Fetch Error]', error);
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

async function generateQRCodeSVG() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.citykid.online';
  const url = `${baseUrl}/proof-of-life/submit`;

  try {
    const svg = await QRCode.toString(url, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff', // white background for contrast
      },
    });
    return svg;
  } catch {
    return null;
  }
}

export default async function ProofOfLifePage() {
  const [submissions, qrSvg] = await Promise.all([
    getApprovedSubmissions(),
    generateQRCodeSVG(),
  ]);

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        minHeight: '100vh',
      }}
    >
      {/* Header Section */}
      <section style={{ padding: '4rem 1.5rem 3rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal">
            <SectionHeader label="Community" title="Proof of Life" />
          </div>

          <div
            className="reveal"
            style={{
              textAlign: 'center',
              maxWidth: '560px',
              margin: '-1.5rem auto 2.5rem',
            }}
          >
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.65,
              }}
            >
              Moments from our community, shared by our volunteers.
            </p>
          </div>

          {/* QR Code */}
          {qrSvg && (
            <div
              className="reveal"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '3rem',
              }}
            >
              <div
                style={{
                  width: '140px',
                  height: '140px',
                  padding: '12px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                }}
                className="qr-container"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.75rem',
                  fontWeight: 500,
                }}
              >
                Scan to share a photo
              </p>

              <Link
                href="/proof-of-life/submit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  marginTop: '1rem',
                  padding: '0.625rem 1.25rem',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease',
                }}
              >
                Share a Photo &rarr;
              </Link>

              <style>{`
                .qr-container svg {
                  width: 100%;
                  height: 100%;
                }
              `}</style>
            </div>
          )}
        </div>
      </section>

      {/* Photo Grid Section */}
      <section style={{ padding: '0 1.5rem 6rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <ProofOfLifeGrid initialSubmissions={submissions} />
        </div>
      </section>
    </div>
  );
}
