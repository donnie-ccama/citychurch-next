import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client — used in Server Components and API routes
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseKey);
}

// --- Demo data for local development (before Supabase is connected) ---

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
    registration_url: '/register/sunday-mornings',
    image_url: '/images/event-sunday-mornings.jpg',
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
    registration_url: '/register/family-night',
    image_url: '/images/event-family-night.jpg',
    featured: false,
    active: true,
    created_at: '2026-03-01T10:00:00Z',
  },
  {
    id: '3',
    title: 'Volunteer Opportunities',
    event_date: '2026-03-31',
    event_time: 'Mon–Thu, 9:00 AM – 5:00 PM',
    description: 'We have dozens of opportunities to serve the city at Citychurch. From delivering emergency groceries to ministry preparation, Citychurch is at work daily and flexible to accommodate your busy schedule.\n\nFriends, families, and co-workers enjoy volunteering together, and your children can work alongside you in the mission. You don\u2019t have to be a member of Citychurch to help; just have a generous heart and a desire to make a difference in the community.',
    location: 'Citychurch Downtown, 205 S. Polk St, Amarillo, TX 79101',
    google_maps_url: 'https://maps.google.com/?q=205+S+Polk+St+Amarillo+TX+79101',
    apple_maps_url: 'https://maps.apple.com/?address=205+S+Polk+St,+Amarillo,+TX+79101',
    registration_url: '/register/volunteer',
    image_url: '/images/event-volunteer.jpg',
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
