import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import GivingForm from '@/components/GivingForm';
import { LOGO_SRC } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Give a Child Christmas — Citychurch Amarillo',
  description:
    'More than 5,000 children in Amarillo would wake up to no gifts this year. $25 gives one child gifts their parent chooses, a seat at the Christmas Banquet, and a year of care.',
};

const whatItGives = [
  {
    title: 'Gifts their parent chooses',
    copy: 'Parents shop and pick the gifts for their own children. Every gift is given with dignity.',
  },
  {
    title: 'A seat at the Christmas Banquet',
    copy: 'December 15 and 16. The family eats together, and the gifts go home with them.',
  },
  {
    title: 'A year of care',
    copy: 'Every gift comes with a commitment to the child, body and soul, twelve months out of the year.',
  },
];

export default function DonatePage() {
  return (
    <div className="giving-page">
      <section className="giving-layout">
        <div className="giving-copy">
          <Image src={LOGO_SRC} alt="" width={56} height={56} className="giving-mark" priority />
          <h1 className="giving-title">
            Give a child <span className="giving-title-accent">Christ</span> for Christmas.
          </h1>
          <p className="giving-lede">
            More than 5,000 children in Amarillo would wake up to no gifts this year. $25 gives one
            child Christmas.
          </p>

          <ol className="giving-what">
            {whatItGives.map((item) => (
              <li key={item.title}>
                <h2>{item.title}</h2>
                <p>{item.copy}</p>
              </li>
            ))}
          </ol>

          <p className="giving-aside">
            Want to see it for yourself?{' '}
            <Link href="/christmas">Reserve a table at the banquet</Link> or{' '}
            <Link href="/contact">ask us about giving</Link>.
          </p>
        </div>

        <div className="giving-form-column">
          <GivingForm />
        </div>
      </section>
    </div>
  );
}
