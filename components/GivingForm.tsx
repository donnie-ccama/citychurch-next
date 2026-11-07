'use client';

import { useId, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import {
  DOLLARS_PER_CHILD,
  GIVING_LEVELS,
  MAX_CUSTOM_DOLLARS,
  MIN_CUSTOM_DOLLARS,
  formatDollars,
  type GivingChoice,
  type GivingFrequency,
} from '@/lib/giving';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

type Selection = { kind: 'level'; children: number } | { kind: 'custom' };

function choiceFromState(frequency: GivingFrequency, selection: Selection, customDollars: string): GivingChoice | null {
  if (selection.kind === 'level') {
    return { frequency, children: selection.children };
  }
  const dollars = Number(customDollars);
  if (!Number.isFinite(dollars) || dollars < MIN_CUSTOM_DOLLARS || dollars > MAX_CUSTOM_DOLLARS) {
    return null;
  }
  return { frequency, amountCents: Math.round(dollars * 100) };
}

function amountCents(choice: GivingChoice) {
  return 'children' in choice ? choice.children * DOLLARS_PER_CHILD * 100 : choice.amountCents;
}

export default function GivingForm() {
  const headingId = useId();
  const customId = useId();
  const [frequency, setFrequency] = useState<GivingFrequency>('once');
  const [selection, setSelection] = useState<Selection>({ kind: 'level', children: 1 });
  const [customDollars, setCustomDollars] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [checkout, setCheckout] = useState<{ choice: GivingChoice; clientSecret: string } | null>(null);

  const choice = useMemo(
    () => choiceFromState(frequency, selection, customDollars),
    [frequency, selection, customDollars]
  );

  const submitLabel = choice
    ? `Give ${formatDollars(amountCents(choice))}${frequency === 'monthly' ? ' a month' : ''}`
    : 'Give';

  async function startCheckout(event: React.FormEvent) {
    event.preventDefault();
    if (!choice) {
      setError(`Enter an amount between $${MIN_CUSTOM_DOLLARS} and $${MAX_CUSTOM_DOLLARS.toLocaleString('en-US')}.`);
      return;
    }
    if (!stripePromise) {
      setError('Online giving is not set up yet. Check back soon.');
      return;
    }
    setError(null);
    setPending(true);
    try {
      const response = await fetch('/api/donate/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(choice),
      });
      const data = (await response.json()) as { clientSecret?: string; error?: string };
      if (!response.ok || !data.clientSecret) {
        throw new Error(data.error || 'We could not start your gift. Try again.');
      }
      setCheckout({ choice, clientSecret: data.clientSecret });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not start your gift. Try again.');
    } finally {
      setPending(false);
    }
  }

  if (checkout && stripePromise) {
    const childCount = 'children' in checkout.choice ? checkout.choice.children : null;
    return (
      <section className="giving-card giving-card-checkout" aria-labelledby={headingId}>
        <div className="giving-checkout-head">
          <h2 id={headingId} className="giving-card-title">
            {formatDollars(amountCents(checkout.choice))}
            {checkout.choice.frequency === 'monthly' ? ' a month' : ''}
            {childCount ? ` for ${childCount === 1 ? 'one child' : `${childCount} children`}` : ''}
          </h2>
          <button type="button" className="giving-change" onClick={() => setCheckout(null)}>
            Change amount
          </button>
        </div>
        <div className="giving-checkout-frame">
          <EmbeddedCheckoutProvider
            key={checkout.clientSecret}
            stripe={stripePromise}
            options={{ clientSecret: checkout.clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </section>
    );
  }

  return (
    <form className="giving-card" aria-labelledby={headingId} onSubmit={startCheckout} noValidate>
      <h2 id={headingId} className="giving-card-title">
        Choose your gift
      </h2>

      <div className="giving-frequency" role="radiogroup" aria-label="How often">
        {(
          [
            ['once', 'One time'],
            ['monthly', 'Every month'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={frequency === value}
            className="giving-frequency-option"
            onClick={() => setFrequency(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="giving-levels" role="radiogroup" aria-label="How many children">
        {GIVING_LEVELS.map((level) => {
          const selected = selection.kind === 'level' && selection.children === level.children;
          return (
            <button
              key={level.children}
              type="button"
              role="radio"
              aria-checked={selected}
              className="giving-level"
              onClick={() => {
                setSelection({ kind: 'level', children: level.children });
                setError(null);
              }}
            >
              <span className="giving-level-amount">
                {formatDollars(level.children * DOLLARS_PER_CHILD * 100)}
              </span>
              <span className="giving-level-label">{level.label}</span>
            </button>
          );
        })}
        <label
          className="giving-level giving-level-custom"
          data-selected={selection.kind === 'custom' ? 'true' : undefined}
          htmlFor={customId}
        >
          <span className="giving-level-label">Another amount</span>
          <span className="giving-custom-input">
            <span aria-hidden="true">$</span>
            <input
              id={customId}
              type="number"
              inputMode="decimal"
              min={MIN_CUSTOM_DOLLARS}
              max={MAX_CUSTOM_DOLLARS}
              step="1"
              placeholder="50"
              value={customDollars}
              onFocus={() => setSelection({ kind: 'custom' })}
              onChange={(event) => {
                setSelection({ kind: 'custom' });
                setCustomDollars(event.target.value);
                setError(null);
              }}
            />
          </span>
        </label>
      </div>

      {error ? (
        <p className="giving-error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="giving-submit" disabled={pending}>
        {pending ? 'One moment…' : submitLabel}
      </button>

      <p className="giving-fine-print">
        Secure payment by Stripe. Cards, Apple Pay, Google Pay, and bank transfer.
        {frequency === 'monthly' ? ' Cancel any time.' : ''}
      </p>
    </form>
  );
}
