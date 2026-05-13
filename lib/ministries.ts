export interface Ministry {
  slug: string;
  title: string;
  icon: string;
  description: string;
}

export const ministries: Ministry[] = [
  {
    slug: 'sunday-worship',
    title: 'Sunday Worship',
    icon: '✶',
    description:
      'Two services every Sunday — English at 11:00 AM, Spanish at 12:30 PM — preceded by breakfast and Bible study. Worship that gathers the whole family.',
  },
  {
    slug: 'family-night',
    title: 'Mid-Week Family Night',
    icon: '◇',
    description:
      'A great way to enjoy dinner and worship as a family. Later, the youth and children enjoy age-graded Bible study and fun in our private park, while adults join small prayer groups in the Cafe. Dinner kicks everything off at 5:30 PM on Wednesday nights.',
  },
  {
    slug: 'local-missions',
    title: 'Local Mission Opportunities',
    icon: '➶',
    description:
      'Short-term mission teams partner with churches at home and abroad. Each trip equips ordinary people to live the gospel in unfamiliar places.',
  },
  {
    slug: 'music-academy',
    title: 'Music Academy',
    icon: '♪',
    description:
      'Private lessons in vocals, piano, wind and stringed instruments help develop life-long skills. Children, youth, and adults grow in their gifts and participate in weekly worship, choirs, and concerts.',
  },
  {
    slug: 'biblical-counseling',
    title: 'Biblical Counseling',
    icon: '◐',
    description:
      'Citychurch offers regular counseling for individuals and families navigating trauma, depression, or the everyday challenges of life — rooted in Scripture and offered with care.',
  },
  {
    slug: 'mercy-ministries',
    title: 'Mercy Ministries',
    icon: '✦',
    description:
      'Emergency needs — groceries, clothing, or a visit from a caring friend — are offered to anyone in need. Citychurch cares for those in crisis and equips others who want to help.',
  },
  {
    slug: 'spanish-ministry',
    title: 'Spanish-Language Ministry',
    icon: '⊕',
    description:
      'A full Spanish-speaking congregation worships, studies, and serves alongside our English congregation — one church, two languages, one mission.',
  },
];

export function getMinistry(slug: string): Ministry | undefined {
  return ministries.find((m) => m.slug === slug);
}
