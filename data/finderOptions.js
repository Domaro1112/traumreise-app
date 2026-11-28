import {
  Waves, Mountain, Compass, Heart, Building2, UtensilsCrossed,
  Flower2, Sun, Leaf, Snowflake,
  CalendarDays, Calendar, Globe, Briefcase,
  Wallet, Plane, Crown,
} from 'lucide-react';

export const moodOptions = [
  {
    id: 'beach',
    label: 'Traumstrand',
    subtitle: 'Sonne, Sand & Meer',
    imageUrl: '/images/reisearten/strand.jpg',
    Icon: Waves,
  },
  {
    id: 'mountains',
    label: 'Natur & Berge',
    subtitle: 'Wandern & Frische Luft',
    imageUrl: '/images/reisearten/natur.jpg',
    Icon: Mountain,
  },
  {
    id: 'adventure',
    label: 'Abenteuer',
    subtitle: 'Action & Thrill',
    imageUrl: '/images/reisearten/abenteuer.jpg',
    Icon: Compass,
  },
  {
    id: 'wellness',
    label: 'Wellness',
    subtitle: 'Entspannung & Erholung',
    imageUrl: '/images/reisearten/luxus.jpg',
    Icon: Heart,
  },
  {
    id: 'city',
    label: 'Städtereise',
    subtitle: 'Kultur, Essen & Nightlife',
    imageUrl: '/images/reisearten/staedte.jpg',
    Icon: Building2,
  },
  {
    id: 'food',
    label: 'Kulinarik',
    subtitle: 'Genuss & lokale Küche',
    imageUrl: '/images/jahreszeiten/herbst.jpg',
    Icon: UtensilsCrossed,
  },
];

export const seasonOptions = [
  {
    id: 'spring',
    label: 'Frühling',
    imageUrl: '/images/jahreszeiten/fruehling.jpg',
    Icon: Flower2,
  },
  {
    id: 'summer',
    label: 'Sommer',
    imageUrl: '/images/jahreszeiten/sommer.jpg',
    Icon: Sun,
  },
  {
    id: 'autumn',
    label: 'Herbst',
    imageUrl: '/images/jahreszeiten/herbst.jpg',
    Icon: Leaf,
  },
  {
    id: 'winter',
    label: 'Winter',
    imageUrl: '/images/jahreszeiten/winter.jpg',
    Icon: Snowflake,
  },
];

export const durationOptions = [
  {
    id: 'weekend',
    label: 'Kurztrip',
    subtitle: '2–4 Tage',
    imageUrl: '/images/reisearten/staedte.jpg',
    Icon: CalendarDays,
  },
  {
    id: 'week',
    label: 'Urlaubswoche',
    subtitle: '5–8 Tage',
    imageUrl: '/images/reisearten/strand.jpg',
    Icon: Calendar,
  },
  {
    id: 'twoweeks',
    label: 'Zwei Wochen',
    subtitle: '9–16 Tage',
    imageUrl: '/images/reisearten/luxus.jpg',
    Icon: Globe,
  },
  {
    id: 'long',
    label: 'Langzeitreise',
    subtitle: '17+ Tage',
    imageUrl: '/images/reisearten/abenteuer.jpg',
    Icon: Briefcase,
  },
];

export const budgetOptions = [
  {
    id: 'low',
    label: 'Budget',
    subtitle: 'bis 500 € pro Person',
    imageUrl: '/images/reisearten/abenteuer.jpg',
    Icon: Wallet,
  },
  {
    id: 'mid',
    label: 'Mittelklasse',
    subtitle: '500 € – 1.500 € pro Person',
    imageUrl: '/images/reisearten/familie.jpg',
    Icon: Plane,
  },
  {
    id: 'high',
    label: 'Premium',
    subtitle: '1.500 €+ pro Person',
    imageUrl: '/images/reisearten/luxus.jpg',
    Icon: Crown,
  },
];
