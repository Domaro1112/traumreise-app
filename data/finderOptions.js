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
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    Icon: Waves,
  },
  {
    id: 'mountains',
    label: 'Natur & Berge',
    subtitle: 'Wandern & Frische Luft',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    Icon: Mountain,
  },
  {
    id: 'adventure',
    label: 'Abenteuer',
    subtitle: 'Action & Thrill',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
    Icon: Compass,
  },
  {
    id: 'wellness',
    label: 'Wellness',
    subtitle: 'Entspannung & Erholung',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
    Icon: Heart,
  },
  {
    id: 'city',
    label: 'Städtereise',
    subtitle: 'Kultur, Essen & Nightlife',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80',
    Icon: Building2,
  },
  {
    id: 'food',
    label: 'Kulinarik',
    subtitle: 'Genuss & lokale Küche',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    Icon: UtensilsCrossed,
  },
];

export const seasonOptions = [
  {
    id: 'spring',
    label: 'Frühling',
    imageUrl: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=600&q=80',
    Icon: Flower2,
  },
  {
    id: 'summer',
    label: 'Sommer',
    imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80',
    Icon: Sun,
  },
  {
    id: 'autumn',
    label: 'Herbst',
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80',
    Icon: Leaf,
  },
  {
    id: 'winter',
    label: 'Winter',
    imageUrl: 'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=600&q=80',
    Icon: Snowflake,
  },
];

export const durationOptions = [
  {
    id: 'weekend',
    label: 'Wochenende',
    subtitle: '2–3 Tage',
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80',
    Icon: CalendarDays,
  },
  {
    id: 'week',
    label: '1 Woche',
    subtitle: '7–8 Tage',
    imageUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&q=80',
    Icon: Calendar,
  },
  {
    id: 'twoweeks',
    label: '2 Wochen',
    subtitle: '14–15 Tage',
    imageUrl: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=600&q=80',
    Icon: Globe,
  },
  {
    id: 'long',
    label: 'Länger',
    subtitle: '3+ Wochen',
    imageUrl: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&q=80',
    Icon: Briefcase,
  },
];

export const budgetOptions = [
  {
    id: 'low',
    label: 'Budget',
    subtitle: 'bis 500 € pro Person',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80',
    Icon: Wallet,
  },
  {
    id: 'mid',
    label: 'Mittelklasse',
    subtitle: '500 € – 1.500 € pro Person',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
    Icon: Plane,
  },
  {
    id: 'high',
    label: 'Premium',
    subtitle: '1.500 €+ pro Person',
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
    Icon: Crown,
  },
];
