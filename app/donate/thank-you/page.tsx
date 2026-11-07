import { Metadata } from 'next';
import Link from 'next/link';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { formatDollars } from '@/lib/giving';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Thank you — Citychurch Amarillo',
  robots: { index: false },
};

type Summary = {
  status: 'complete' | 'open' | 'unknown';
  amountCents: number | null;
  monthly: boolean;
  children: number | null;
  email: string | null;
};

async function loadSummary(sessionId: string | undefined): Promise<Summary> {
  const empty: Summary = { status: 'unknown', amountCents: null, monthly: false, children: null, email: null };
  if (!sessionId || !isStripeConfigured()) return empty;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const children = Number(session.metadata?.children);
    return {
      status: session.status === 'complete' ? 'complete' : session.status === 'open' ? 'open' : 'unknown',
      amountCents: session.amount_total,
      monthly: session.mode === 'subscription',
      children: Number.isFinite(children) && children > 0 ? children : null,
      email: session.customer_details?.email ?? null,
    };
  } catch (error) {
    console.error('Could not load checkout session', error);
    return empty;
  }
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const summary = await loadSummary(sessionId);

  if (summary.status === 'open') {
    return (
      <div className="giving-page">
        <section className="giving-result">
          <h1 className="giving-title">Your gift did not go through.</h1>
          <p className="giving-lede">Nothing was charged. You can try again with another card.</p>
          <Link href="/donate" className="giving-submit giving-result-cta">
            Back to giving
          </Link>
        </section>
      </div>
    );
  }

  const amount = summary.amountCents != null ? formatDollars(summary.amountCents) : null;
  const childrenText =
    summary.children === 1 ? 'one child' : summary.children ? `${summary.children} children` : null;

  return (
    <div className="giving-page">
      <section className="giving-result">
        <h1 className="giving-title">Thank you.</h1>
        <p className="giving-lede">
          {amount ? `Your ${summary.monthly ? 'monthly ' : ''}gift of ${amount}` : 'Your gift'}
          {childrenText ? ` gives ${childrenText} Christmas` : ' gives a child Christmas'}: gifts their
          parent chooses, a seat at the Christmas Banquet, and a year of care.
        </p>
        {summary.email ? (
          <p className="giving-aside">A receipt is on its way to {summary.email}.</p>
        ) : null}
        <p className="giving-aside">
          See the whole season on the <Link href="/events">events calendar</Link>, or{' '}
          <Link href="/christmas">reserve a table at the banquet</Link>.
        </p>
      </section>
    </div>
  );
}
