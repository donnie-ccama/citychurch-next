import Image from 'next/image';
import Link from 'next/link';
import DonateButton from '@/components/DonateButton';

/**
 * HolidayGivingHero — the Christmas 2026 giving hero for the homepage.
 * $25 gives one child Christmas: gifts a parent chooses, a seat at the
 * Christmas Banquet, and a year of care after.
 */
export default function HolidayGivingHero() {
  return (
    <section className="holiday-hero" aria-labelledby="holiday-hero-title">
      <Image
        className="holiday-hero-background"
        src="/images/web-hero-3-27-26.png"
        alt="A smiling child at Citychurch Amarillo"
        fill
        priority
        sizes="100vw"
      />
      <div className="holiday-hero-scrim" aria-hidden="true" />

      <div className="holiday-hero-layout">
        <div className="holiday-hero-copy">
          <h1 id="holiday-hero-title">
            Give a child <span className="holiday-hero-accent">Christ</span> for Christmas.
          </h1>
          <p className="holiday-hero-lede">
            More than 5,000 children in Amarillo would wake up to no gifts this year. $25 gives one child Christmas.
          </p>
          <p>
            Parents shop and choose the gifts for their own children. Every gift comes with a seat for the family at our Christmas Banquet and a year of care for the child, body and soul.
          </p>
          <div className="holiday-hero-actions">
            <DonateButton label="Give $25 for one child" icon={false} className="holiday-hero-cta" />
            <Link href="/events" className="holiday-hero-secondary">
              See the whole season <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
