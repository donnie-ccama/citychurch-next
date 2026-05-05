import { Metadata } from 'next';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import HeroImage from '@/components/HeroImage';
import EventCard from '@/components/EventCard';
import BlogCard from '@/components/BlogCard';
import DonateButton from '@/components/DonateButton';
import ImpactStats from '@/components/ImpactStats';
import EmailSignup from '@/components/EmailSignup';
import ProofOfLifeHomepagePreview from '@/components/ProofOfLifeHomepagePreview';
import PhotoCarousel from '@/components/PhotoCarousel';
import { demoEvents } from '@/lib/supabase-server';
import { createServerClient } from '@/lib/supabase-server';
import { BlogPost } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Citychurch — ...for the heart of the city.',
  description: 'Citychurch Amarillo — Finding, feeding, and teaching children and families who are most vulnerable. $2.50 feeds a child a hot meal, fresh fruit, and popcorn.',
};

export default async function Home() {
  const upcomingEvents = demoEvents.slice(0, 3);

  const supabase = createServerClient();
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3);
  const recentPosts: BlogPost[] = blogPosts ?? [];

  return (
    <div className="home-shell">

      {/* HERO SECTION — Static Image */}
      <HeroImage src="/images/web-hero-3-27-26.png">
        <div className="reveal hero-actions">
          <DonateButton label="Feed a Child Today" />
          <Link href="/donate" className="hero-secondary-link">
            See How $2.50 Changes a Life
          </Link>
        </div>
      </HeroImage>

      {/* FIRST-TIME VISITOR BANNER */}
      <section className="home-section-card">
        <div className="reveal visitor-banner">
          <div>
            <p className="visitor-banner-copy-title">
              First time here?
            </p>
            <p className="visitor-banner-copy-text">
              Learn what to expect and let us know you&apos;re coming.
            </p>
          </div>
          <Link href="/visit" className="pill-button pill-button-accent visitor-cta">
            Plan Your Visit →
          </Link>
        </div>
      </section>

      {/* PHOTO CAROUSEL — pulled live from Google Drive */}
      <section className="home-section home-section-primary">
        <div className="home-container">
          <div className="reveal">
            <div className="divider-ornament">
              <span>Our Community</span>
            </div>
          </div>
          <div className="reveal">
            <PhotoCarousel />
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="home-section home-section-secondary">
        <div className="home-container">
          <div className="reveal">
            <SectionHeader label="Get Involved" title="Upcoming Ministry Opportunities" />
          </div>

          <div className="home-grid">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="reveal">
                <EventCard {...event} />
              </div>
            ))}
          </div>

          <div className="home-view-all reveal">
            <Link href="/ministries" className="home-text-link">
              View All Ministries & Register →
            </Link>
          </div>
        </div>
      </section>

      {/* MISSION STATEMENT */}
      <section className="home-section home-section-mission">
        <div className="home-container-narrow reveal">
          <div className="divider-ornament">
            <span>Our Mission</span>
          </div>

          <p className="home-serif-statement">
            Citychurch exists to find, feed, and teach children and families in Amarillo who are most vulnerable, introducing them to Jesus Christ while meeting practical needs with dignity, consistency, and long-term discipleship.
          </p>

          <p className="home-supporting-copy">
            Every meal — a freshly prepared hot item, fresh fruit, and popcorn — costs just $2.50. But we don&apos;t just feed children. We sit with families, walk alongside them, and point them to lasting hope.
          </p>

          <div className="home-view-all">
            <Link href="/about" className="home-text-link">
              Learn More About Our Mission →
            </Link>
          </div>
        </div>
      </section>

      {/* FREE RESOURCES */}
      <section className="home-section home-section-secondary">
        <div className="home-container">
          <div className="reveal">
            <SectionHeader label="Free Resources" title="A New Resource App You Can Open Today" />
          </div>

          <div className="reveal free-resource-card">
            <div>
              <p className="free-resource-eyebrow">
                CityBooks
              </p>
              <h3 className="free-resource-title">
                Free reading and growth resources for everyday discipleship.
              </h3>
              <p className="free-resource-copy">
                CityBooks gathers simple, practical resources for families, volunteers, and anyone
                growing in faith alongside the people of Amarillo.
              </p>
              <p className="free-resource-copy">
                Browse short reads and helpful tools you can use at home, in ministry, or in
                conversation with someone who needs hope today.
              </p>
            </div>

            <div className="free-resource-panel">
              <div>
                <p className="free-resource-panel-label">
                  Quick Access
                </p>
                <p className="free-resource-panel-title">citybooks.me</p>
                <p className="free-resource-panel-copy">
                  Start with the resource page for context, or open CityBooks directly when you
                  already know what you need.
                </p>
              </div>

              <div className="free-resource-actions">
                <Link href="/resources" className="pill-button pill-button-quiet">
                  View Free Resources
                </Link>
                <a
                  href="https://citybooks.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-button pill-button-accent"
                >
                  Open CityBooks
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERMONS */}
      <section className="home-section home-section-primary">
        <div className="home-container-narrow reveal">
          <div className="divider-ornament">
            <span>Our Message</span>
          </div>

          <p className="home-serif-statement">
            Weekly messages about authentic presence, serving our neighbors, and the transformation that happens when we simply show up.
          </p>

          <p className="home-supporting-copy">
            Listen to the latest teaching from Citychurch and explore our full sermon archive.
          </p>

          <div className="home-view-all">
            <Link href="/sermons" className="home-text-link">
              Watch & Listen to Sermons →
            </Link>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="home-section-compact home-section-secondary">
        <div className="home-container-impact reveal">
          <ImpactStats />
        </div>
      </section>

      {/* $2.50 FEEDS A CHILD CALLOUT */}
      <section className="meal-callout">
        <div className="meal-callout-inner reveal">
          <p className="meal-callout-kicker">This week matters</p>
          <h2 className="meal-callout-title">
            This week, 47 kids got a hot meal. Next week, we need your help.
          </h2>
          <p className="meal-callout-copy">
            $2.50 is all it takes. Each meal includes a freshly prepared hot item, fresh fruit, and popcorn — served with dignity to children and families who need it most.
          </p>
          <DonateButton
            label="Feed a Child Today"
            variant="outline"
            icon={true}
            className="donate-callout-btn"
          />
        </div>
      </section>

      {/* RECENT BLOG / STORIES */}
      <section className="home-section home-section-primary">
        <div className="home-container">
          <div className="reveal">
            <SectionHeader label="Impact" title="Stories From the Field" />
          </div>

          <div className="home-grid">
            {recentPosts.map((post) => (
              <div key={post.id} className="reveal">
                <BlogCard {...post} />
              </div>
            ))}
          </div>

          <div className="home-view-all reveal">
            <Link href="/blog" className="home-text-link">
              Read More Stories →
            </Link>
          </div>
        </div>
      </section>

      {/* PROOF OF LIFE — Community Photos */}
      <section className="home-section home-section-secondary">
        <div className="home-container">
          <div className="reveal">
            <SectionHeader label="Community" title="Proof of Life" />
          </div>

          <div className="reveal">
            <ProofOfLifeHomepagePreview />
          </div>

          <div className="home-view-all reveal">
            <Link href="/proof-of-life" className="home-text-link">
              View the Bulletin Board &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* EMAIL SIGNUP */}
      <section className="home-section home-section-primary">
        <div className="home-container-form reveal">
          <div className="signup-intro">
            <h2 className="signup-intro-title">Stories & updates, once a month</h2>
            <p className="signup-intro-copy">
              Get a short note with field stories, prayer needs, and practical ways to serve Amarillo families.
            </p>
          </div>
          <EmailSignup />
        </div>
      </section>

    </div>
  );
}
