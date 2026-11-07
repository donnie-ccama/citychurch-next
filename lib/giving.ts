/**
 * Christmas 2026 giving. Shared by the giving form and the checkout route.
 * The Stripe ids are not secrets. They point at live objects in the
 * citykid.online Stripe account.
 */

export const GIVING_PRODUCT_ID = 'prod_Va7nhJFpCkfekk';

export const GIVING_PRICE_IDS = {
  once: 'price_1UYxYDITt6ZyhWMLxGOG8r61',
  monthly: 'price_1UYxYEITt6ZyhWMLPw9Nh3qs',
} as const;

export type GivingFrequency = keyof typeof GIVING_PRICE_IDS;

export const GIVING_FREQUENCIES: GivingFrequency[] = ['once', 'monthly'];

/** Dollars that give one child Christmas. */
export const DOLLARS_PER_CHILD = 25;

/** The preset choices on the giving form. */
export const GIVING_LEVELS = [
  { children: 1, label: 'One child' },
  { children: 2, label: 'Two children' },
  { children: 4, label: 'Four children' },
  { children: 10, label: 'Ten children' },
] as const;

export const MAX_CHILDREN = 400;
export const MIN_CUSTOM_DOLLARS = 5;
export const MAX_CUSTOM_DOLLARS = 25_000;

export type GivingChoice =
  | { frequency: GivingFrequency; children: number }
  | { frequency: GivingFrequency; amountCents: number };

export function formatDollars(cents: number) {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(dollars) ? 0 : 2,
  }).format(dollars);
}

/** Children covered by a custom amount, rounded down. */
export function childrenForCents(cents: number) {
  return Math.floor(cents / (DOLLARS_PER_CHILD * 100));
}

/** Reads an untrusted request body into a GivingChoice, or returns null. */
export function parseGivingChoice(body: unknown): GivingChoice | null {
  if (!body || typeof body !== 'object') return null;
  const { frequency, children, amountCents } = body as Record<string, unknown>;
  if (frequency !== 'once' && frequency !== 'monthly') return null;

  if (typeof children === 'number') {
    if (!Number.isInteger(children) || children < 1 || children > MAX_CHILDREN) return null;
    return { frequency, children };
  }

  if (typeof amountCents === 'number') {
    if (!Number.isInteger(amountCents)) return null;
    if (amountCents < MIN_CUSTOM_DOLLARS * 100 || amountCents > MAX_CUSTOM_DOLLARS * 100) return null;
    return { frequency, amountCents };
  }

  return null;
}
