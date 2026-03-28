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
    title: 'Feeding the Greatest Hunger',
    slug: 'feeding-the-greatest-hunger',
    content: `> "If you pour yourself out for the hungry and satisfy the desire of the afflicted, then shall your light rise in the darkness." — Isaiah 58:10

Most of us already know that hungry children matter. We feel it when we picture a child struggling to focus in class on an empty stomach, or a little boy acting out because he is tired, worried, and hungry—not rebellious. Real change starts with awareness, but it takes compassion that leads to action.

In Amarillo, hunger often goes unnoticed. It can be hidden by a school backpack, a quiet smile, or a family doing their best to get by. Children still go to class, parents still work, and grandparents do all they can to make groceries last. But behind these efforts, there is often a real need and worry.

This is why we need more empathy and compassion for Amarillo's children facing hunger. Not distant pity or brief concern, but real compassion that notices, responds, and remains present.

## A Story from the Beginning

When we started Citychurch in 1997, I didn't realize how serious the problem was. I remember driving to a run-down apartment complex with some donated toys and groceries, hoping to invite children to Citychurch. As soon as I took out the food, the children rushed over and grabbed it before I reached the first door. Their hunger surprised me. I was a stranger, but they didn't care—they were desperate.

I quickly went back to Citychurch, filled my truck with all the food we had, and returned to the complex. The food was gone right away. Later that week, we came back to offer the children a ride to our weekly Bible club. That night, we picked up 80 children from that one place and started a new van route.

## Why It Matters for Our City

When Scripture tells us to help the hungry, it is not asking for mere feelings. It calls us to live differently. God does not ignore those in need, and neither should we. For the Church, feeding children is not just about food. It is about dignity and showing each child, through our actions, that "You matter to God, and you matter to us."

This is very important for our city.

According to The Texas Tribune, 71.6% of students in Amarillo ISD are considered economically disadvantaged. This means most children in the district already live with financial stress. When rent goes up, work hours are cut, a car breaks down, or a parent gets sick, food is often the first thing families struggle to afford.

Hunger data shows us how big the problem is. Feeding America's estimates reveal that child food insecurity exists in every county in the country. Earlier data showed that Potter County had a food insecurity rate of 15.5% and Randall County had a rate of 11.3%. These numbers remind us that hunger is not rare in Amarillo—it is present in the neighborhoods where children live and grow.

And children really feel it.

They feel it in class when it's hard to focus. They feel it emotionally when worry sets in. They feel it physically when their bodies don't get enough food. They feel it socially when they start to think they are different or left behind. Hunger is never just about food—it affects confidence, energy, family peace, and hope.

## How Citychurch Responds

This is why Citychurch believes children are the key to reaching families. If we can find, feed, and teach children with love and consistency, we do more than meet a single need. We break cycles, open doors for families to heal, and introduce children and caregivers to Jesus while meeting their needs with dignity.

This work is not just a dream for us. It is making a real difference in families' lives.

Citychurch's mission is to find, feed, and teach Amarillo's most vulnerable children. Last year, we served over 150,000 meals and welcomed more than 1,400 children into our ministries. These numbers matter because they stand for real children, real neighborhoods, and real stories. They show the doors we've knocked on, the meals we've delivered, and the conversations that lead to prayer and long-term care.

Just as important, Citychurch believes that help without hope is no help at all. We do not want to treat children and families like projects. We want to welcome them with love, consistency, and the hope of Christ. Every meal served, every resource shared, is meant to show that the Shepherd has not forgotten His sheep.

## The Need for Partnership

This kind of ministry needs compassion, but it also needs partnership.

Some people in Amarillo might think hunger is someone else's problem. Others may believe that with all our churches, schools, and charities, every child who needs a meal is already helped. But that's not the case. Hunger is still there on weekends, during school breaks, and when a family is just one paycheck or bill away from empty shelves.

This is where more empathy can make all the difference.

Empathy helps us stop asking, "Why don't they just fix it?" and start asking, "What burden are they carrying that I've never had to carry?" Compassion helps us see hunger not as a number, but as a child made in God's image. It reminds us that families under stress are not problems—they are neighbors to love.

For parents and grandparents in Amarillo, this hits close to home. If it were your child, grandchild, niece, or the kid next door, you'd want someone to notice and act. For young professionals, this is part of faithful stewardship and Christian discipleship. God put us here not just to build our own lives, but to share His grace with others. If God's grace stops with us, it hasn't reached its full purpose.

## How You Can Help

The good news is Amarillo doesn't have to respond with apathy. We can choose to respond with love and obedience.

**We can pray.** We can ask God for wisdom, provision, open doors, protection for the children, and spiritual renewal in the homes Citychurch serves. We can pray for strong volunteers, more resources, and for every act of service to help introduce children and families to Jesus. Prayer is not the least we can do—it is one of the most important things, because this ministry depends on more than just human effort.

**We can give.** Citychurch relies on private donors and partner churches, not government funding. This means your support has lasting value and goes straight to helping children and families now. Your giving helps provide resources, prepare meals, stock supplies, support outreach, and strengthen the daily work of restoring families in Amarillo. If God has given you resources, this is a meaningful way to use them.

**We can serve.** There are real opportunities right now for individuals, families, groups, businesses, and churches to volunteer. Some can help us get organized for ministry. Some can prepare meals that nourish children with care and dignity. Some can deliver meals to neighborhoods, building trust through practical help. Others can serve in the Citychurch Cafe, turning a meal into a moment of welcome. Every role matters. Every act of service adds to our story.

This kind of work can change a child's whole future. Isn't this at the heart of our mission as followers of Christ?

## A Final Word

Amarillo's children don't need our judgment—they need our compassion. They shouldn't have to prove their worth to be valued. God gave them value long before we saw their need. Christ died for them. The real question is whether we will live as if that's true.

So let's not look away.

Let's ask God to give us more empathy for the children in Amarillo who are hungry. Let's move toward them with Christ's love. Let's support Citychurch as a lifeboat for the city's poorest children and families.

Because the Good Shepherd gave His life for us,

Donnie Lane Jr.`,
    excerpt: 'A pastoral call for Amarillo to see child hunger with greater empathy and respond with prayer, generosity, and service through Citychurch.',
    category: 'Outreach' as const,
    author: 'Donnie Lane Jr.',
    featured_image: '/images/blog-01-feeding-the-greatest-hunger.jpg',
    published: true,
    reading_time: 7,
    created_at: '2026-03-27T10:00:00Z',
    updated_at: '2026-03-27T10:00:00Z',
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
