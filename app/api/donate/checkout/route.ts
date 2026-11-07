import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getSiteUrl, getStripe, isStripeConfigured } from '@/lib/stripe';
import {
  GIVING_PRICE_IDS,
  GIVING_PRODUCT_ID,
  childrenForCents,
  parseGivingChoice,
} from '@/lib/giving';

export const dynamic = 'force-dynamic';

/**
 * POST /api/donate/checkout
 * Body: { frequency: 'once' | 'monthly', children: number } or
 *       { frequency: 'once' | 'monthly', amountCents: number }
 * Returns the client secret for an embedded Stripe Checkout session.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Online giving is not set up yet.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const choice = parseGivingChoice(body);
  if (!choice) {
    return NextResponse.json({ error: 'Choose an amount to give.' }, { status: 400 });
  }

  const monthly = choice.frequency === 'monthly';
  const siteUrl = getSiteUrl(request.headers.get('origin'));

  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem =
    'children' in choice
      ? { price: GIVING_PRICE_IDS[choice.frequency], quantity: choice.children }
      : {
          quantity: 1,
          price_data: {
            currency: 'usd',
            product: GIVING_PRODUCT_ID,
            unit_amount: choice.amountCents,
            ...(monthly ? { recurring: { interval: 'month' } } : {}),
          },
        };

  const children = 'children' in choice ? choice.children : childrenForCents(choice.amountCents);
  const metadata = {
    campaign: 'christmas-2026',
    frequency: choice.frequency,
    children: String(children),
  };

  try {
    const session = await getStripe().checkout.sessions.create({
      ui_mode: 'embedded_page',
      mode: monthly ? 'subscription' : 'payment',
      line_items: [lineItem],
      return_url: `${siteUrl}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      billing_address_collection: 'auto',
      metadata,
      ...(monthly
        ? { subscription_data: { metadata } }
        : {
            submit_type: 'donate',
            customer_creation: 'always',
            payment_intent_data: { metadata, description: 'Christmas gift for a child, Citychurch Amarillo' },
          }),
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Stripe checkout session failed', error);
    return NextResponse.json({ error: 'We could not start your gift. Try again.' }, { status: 502 });
  }
}
