import Stripe from 'stripe';

let client: Stripe | null = null;

/** True when the server has a Stripe secret key. */
export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** The server-side Stripe client. Throws when STRIPE_SECRET_KEY is missing. */
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  if (!client) {
    client = new Stripe(key);
  }
  return client;
}

/** The public site origin used for Stripe return URLs. */
export function getSiteUrl(requestOrigin?: string | null) {
  return (process.env.NEXT_PUBLIC_SITE_URL || requestOrigin || 'https://www.citykid.me').replace(/\/$/, '');
}
