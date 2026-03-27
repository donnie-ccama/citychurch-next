import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client — used in Server Components and API routes
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseKey);
}

// --- Demo data for local development (before Supabase is connected) ---

export const demoBlogPosts = [
  {
    id: '1',
    title: 'What We Saw at the Downtown Meal Service',
    slug: 'downtown-meal-service',
    content: `It started the way most Saturday mornings do around here — quietly. A few of us arrived early to set up tables on the sidewalk outside the community center, the March wind picking up dust from the street.\n\nBy 10:30, the line stretched around the corner.\n\n## More Than a Meal\n\nWe've learned that showing up consistently matters more than showing up perfectly. The food was simple — rice, beans, grilled chicken, fresh tortillas — but the conversations that happened over those plates were anything but.\n\nOne man told us he'd been sleeping in his truck for three weeks. He didn't ask for money or a place to stay. He asked if he could help serve. So we handed him a ladle.\n\n> "I don't need someone to fix my life. I just need someone to see me."\n\nThat line has stayed with us all week.\n\n## What the Camera Saw\n\nOur documentary team was there, as always, not to produce content but to bear witness. The photos from Saturday tell a story that words struggle to capture: hands breaking bread, children laughing while adults wiped tears, strangers becoming neighbors.\n\nWe don't stage these moments. We don't direct them. We simply point the camera at what's happening and trust that the truth is compelling enough on its own.\n\n## The Numbers (Because People Ask)\n\nWe served 214 meals. Twenty-three volunteers showed up — some from Citychurch, some from other churches, some from no church at all. Four local businesses donated supplies. Zero dollars were charged.\n\nBut the numbers don't tell you about the woman who sat alone at the end of a table and was joined by a volunteer who simply sat with her in silence for twenty minutes. They don't tell you about the teenager who came to eat and stayed to help clean up.`,
    excerpt: 'A quiet Saturday morning turned into something none of us expected. Here\'s what happened when 200 people showed up.',
    category: 'Outreach' as const,
    author: 'Citychurch Team',
    featured_image: null,
    published: true,
    reading_time: 4,
    created_at: '2026-03-05T10:00:00Z',
    updated_at: '2026-03-05T10:00:00Z',
  },
  {
    id: '2',
    title: 'Why We Don\'t Sell Anything',
    slug: 'why-we-dont-sell-anything',
    content: `Our approach is different. We believe the most powerful witness is simply showing up and doing the work — no strings attached.\n\n## The Problem with Transactions\n\nSomewhere along the way, service became a marketing strategy. Give someone a meal, hand them a flyer. Offer help, but only if they sit through a pitch first. We reject that model entirely.\n\n## What We Do Instead\n\nWe show up. We serve. We document what we see. That's it. If someone asks why we're here, we tell them the truth: because we believe every person in Amarillo matters, and we wanted to prove it with our hands, not our words.\n\n> "The most radical thing a church can do in 2026 is simply be present without an agenda."\n\nThis isn't a strategy. It's a conviction.`,
    excerpt: 'Our approach is different. We believe the most powerful witness is simply showing up and doing the work — no strings attached.',
    category: 'Leadership' as const,
    author: 'Citychurch Team',
    featured_image: null,
    published: true,
    reading_time: 3,
    created_at: '2026-02-28T10:00:00Z',
    updated_at: '2026-02-28T10:00:00Z',
  },
  {
    id: '3',
    title: 'Faces of Amarillo: A Photo Essay',
    slug: 'faces-of-amarillo',
    content: `Portraits and stories from the people we've had the privilege to serve and walk alongside this season.\n\n## Every Face Tells a Story\n\nWe started this documentary project with a simple camera and a simpler question: "Can we sit with you for a moment?"\n\nWhat we found was extraordinary. Not because the stories were dramatic — though some were — but because they were real. Unvarnished. Human.\n\n## The Grandmother on 6th Street\n\nShe told us she'd lived in the same house for 47 years. Her neighborhood had changed around her, but she stayed. "This is my home," she said. "Where else would I go?"\n\n## The Veteran at the Park\n\nHe comes to the meal service every Saturday. Not because he needs the food — he has a pension — but because he needs the company. "Loneliness will kill you faster than hunger," he told us.`,
    excerpt: 'Portraits and stories from the people we\'ve had the privilege to serve and walk alongside this season.',
    category: 'Documentary' as const,
    author: 'Citychurch Team',
    featured_image: null,
    published: true,
    reading_time: 5,
    created_at: '2026-02-20T10:00:00Z',
    updated_at: '2026-02-20T10:00:00Z',
  },
];

export const demoSermons = [
  {
    id: '1',
    title: 'The Protection and Purity of Marriage',
    speaker: 'Pastor Sarah Mitchell',
    series: 'Present',
    sermon_date: '2026-03-09',
    video_url: 'https://player.vimeo.com/video/1172206088?badge=0&autopause=0&player_id=0&app_id=58479',
    description: 'What does it mean to truly be present in a world that rewards distraction? This week we explore the radical act of simply showing up.',
    featured: true,
    created_at: '2026-03-09T10:00:00Z',
  },
  {
    id: '2',
    title: 'Hands and Feet',
    speaker: 'Pastor Sarah Mitchell',
    series: 'Present',
    sermon_date: '2026-03-02',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Service isn\'t a program — it\'s a posture. How do we move from talking about compassion to living it out every day?',
    featured: false,
    created_at: '2026-03-02T10:00:00Z',
  },
  {
    id: '3',
    title: 'Seeing the Invisible',
    speaker: 'David Chen',
    series: 'Present',
    sermon_date: '2026-02-23',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'In a city of 200,000, some people are invisible. What happens when we choose to truly see them?',
    featured: false,
    created_at: '2026-02-23T10:00:00Z',
  },
  {
    id: '4',
    title: 'No Strings Attached',
    speaker: 'Pastor Sarah Mitchell',
    series: 'Unconditional',
    sermon_date: '2026-02-16',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Love without conditions, service without expectations. The counter-cultural heart of our mission.',
    featured: false,
    created_at: '2026-02-16T10:00:00Z',
  },
];

export const demoEvents = [
  {
    id: '1',
    title: 'Sunday Mornings @ Citychurch',
    event_date: '2026-03-29',
    event_time: 'Every Sunday',
    description: 'Breakfast @ 9:30 AM\nBible Study @ 10:00 AM\nWorship in English @ 11:00 AM\nWorship in Spanish @ 12:30 PM',
    location: 'Citychurch Downtown, 205 S. Polk St, Amarillo, TX 79101',
    google_maps_url: 'https://maps.google.com/?q=205+S+Polk+St+Amarillo+TX+79101',
    apple_maps_url: 'https://maps.apple.com/?address=205+S+Polk+St,+Amarillo,+TX+79101',
    registration_url: '/contact',
    image_url: null,
    featured: true,
    active: true,
    created_at: '2026-03-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Family Night',
    event_date: '2026-04-02',
    event_time: 'Every Wednesday',
    description: 'Dinner in the Caf\u00e9 @ 5:30 PM\nYouth & Children in the Park @ 6:15 PM\nAdult Small Groups in the Caf\u00e9 @ 6:15 PM\n\nFamily Night @ Citychurch is the best way to learn more about the ministry of Citychurch and meet new people. It\u2019s super casual and convenient. Families eat dinner and worship together, and the children and youth enjoy the park. It\u2019s a great opportunity to get a mid-week boost and hang out with friends.',
    location: 'Citychurch Downtown, 205 S. Polk St, Amarillo, TX 79101',
    google_maps_url: 'https://maps.google.com/?q=205+S+Polk+St+Amarillo+TX+79101',
    apple_maps_url: 'https://maps.apple.com/?address=205+S+Polk+St,+Amarillo,+TX+79101',
    registration_url: '/contact',
    image_url: null,
    featured: false,
    active: true,
    created_at: '2026-03-01T10:00:00Z',
  },
  {
    id: '3',
    title: 'Prayer Walk Downtown',
    event_date: '2026-03-29',
    event_time: '7:00 AM',
    description: 'Walk with us through the heart of downtown Amarillo as we pray for our city, our neighbors, and the work ahead.',
    location: 'Starting at Ellwood Park',
    registration_url: 'https://docs.google.com/forms',
    image_url: null,
    featured: false,
    active: true,
    created_at: '2026-03-01T10:00:00Z',
  },
];

export const demoMediaItems = [
  {
    id: '1',
    title: 'Saturday Meal Service — March 2026',
    media_type: 'photo' as const,
    url: '',
    thumbnail_url: null,
    description: 'Documentary photos from our weekly meal service downtown.',
    created_at: '2026-03-05T10:00:00Z',
  },
  {
    id: '2',
    title: 'Volunteer Training: Compassionate Listening',
    media_type: 'training_video' as const,
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: null,
    description: 'Learn the fundamentals of compassionate listening — the foundation of all our outreach work.',
    created_at: '2026-02-15T10:00:00Z',
  },
  {
    id: '3',
    title: 'Heart of the City Podcast — Ep. 12',
    media_type: 'podcast' as const,
    url: 'https://open.spotify.com/embed/episode/placeholder',
    thumbnail_url: null,
    description: 'Conversations with the people doing the work. This week: a volunteer shares why she keeps coming back.',
    created_at: '2026-03-01T10:00:00Z',
  },
];
