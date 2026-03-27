// Citychurch — TypeScript types for all database tables

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: 'Outreach' | 'Documentary' | 'Leadership' | 'Community';
  author: string;
  featured_image: string | null;
  published: boolean;
  reading_time: number;
  created_at: string;
  updated_at: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  series: string;
  sermon_date: string;
  video_url: string;
  description: string;
  featured: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  event_date: string;
  event_time: string;
  description: string;
  location: string;
  google_maps_url?: string;
  apple_maps_url?: string;
  registration_url: string;
  image_url: string | null;
  featured: boolean;
  active: boolean;
  created_at: string;
}

export interface MediaItem {
  id: string;
  title: string;
  media_type: 'photo' | 'training_video' | 'podcast';
  url: string;
  thumbnail_url: string | null;
  description: string;
  created_at: string;
}

export interface Visitor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  visit_type: 'general' | 'volunteer' | 'family' | 'online';
  source: string;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  source: string;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  tag: string;
  source: string;
  created_at: string;
}
