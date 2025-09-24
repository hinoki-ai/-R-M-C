import {
  LucideIcon,
  Building,
  Shield,
  Users,
  Building2,
  Heart,
  Siren,
  Flame,
  Wrench,
} from 'lucide-react';

export interface ContactType {
  color: string;
  label: string;
  icon: LucideIcon;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export const CONTACT_TYPES: Record<string, ContactType> = {
  directiva: {
    color: 'purple',
    label: '🏛️ Directiva',
    icon: Building,
    bgClass: 'bg-purple-100 text-purple-800 border-purple-200',
    textClass: 'text-purple-800',
    borderClass: 'border-purple-200',
  },
  seguridad: {
    color: 'red',
    label: '🛡️ Seguridad',
    icon: Shield,
    bgClass: 'bg-red-100 text-red-800 border-red-200',
    textClass: 'text-red-800',
    borderClass: 'border-red-200',
  },
  social: {
    color: 'green',
    label: '🤝 Social',
    icon: Users,
    bgClass: 'bg-green-100 text-green-800 border-green-200',
    textClass: 'text-green-800',
    borderClass: 'border-green-200',
  },
  municipal: {
    color: 'blue',
    label: '🏛️ Municipal',
    icon: Building2,
    bgClass: 'bg-blue-100 text-blue-800 border-blue-200',
    textClass: 'text-blue-800',
    borderClass: 'border-blue-200',
  },
  health: {
    color: 'teal',
    label: '🏥 Salud',
    icon: Heart,
    bgClass: 'bg-teal-100 text-teal-800 border-teal-200',
    textClass: 'text-teal-800',
    borderClass: 'border-teal-200',
  },
  police: {
    color: 'blue',
    label: '🚔 Policía',
    icon: Siren,
    bgClass: 'bg-blue-100 text-blue-800 border-blue-200',
    textClass: 'text-blue-800',
    borderClass: 'border-blue-200',
  },
  fire: {
    color: 'orange',
    label: '🔥 Bomberos',
    icon: Flame,
    bgClass: 'bg-orange-100 text-orange-800 border-orange-200',
    textClass: 'text-orange-800',
    borderClass: 'border-orange-200',
  },
  service: {
    color: 'gray',
    label: '🏘️ Servicio',
    icon: Wrench,
    bgClass: 'bg-gray-100 text-gray-800 border-gray-200',
    textClass: 'text-gray-800',
    borderClass: 'border-gray-200',
  },
  medical: {
    color: 'red',
    label: '🚑 Médico',
    icon: Heart,
    bgClass: 'bg-red-100 text-red-800 border-red-200',
    textClass: 'text-red-800',
    borderClass: 'border-red-200',
  },
  security: {
    color: 'purple',
    label: '🛡️ Seguridad',
    icon: Shield,
    bgClass: 'bg-purple-100 text-purple-800 border-purple-200',
    textClass: 'text-purple-800',
    borderClass: 'border-purple-200',
  },
  community: {
    color: 'green',
    label: '🏘️ Comunidad',
    icon: Users,
    bgClass: 'bg-green-100 text-green-800 border-green-200',
    textClass: 'text-green-800',
    borderClass: 'border-green-200',
  },
};

export const getContactTypeColor = (type: string): string => {
  return CONTACT_TYPES[type]?.bgClass || CONTACT_TYPES.service.bgClass;
};

export const getContactTypeLabel = (type: string): string => {
  return CONTACT_TYPES[type]?.label || CONTACT_TYPES.service.label;
};

export const getContactTypeIcon = (type: string): LucideIcon => {
  return CONTACT_TYPES[type]?.icon || CONTACT_TYPES.service.icon;
};

// Contact filtering utilities
export const CONTACT_CATEGORIES = {
  community: ['directiva', 'seguridad', 'social'],
  municipal: ['municipal', 'health', 'police', 'fire'],
  service: ['service'],
} as const;

export const filterContactsByCategory = <T extends { type: string }>(
  contacts: T[],
  category: keyof typeof CONTACT_CATEGORIES
): T[] => {
  return contacts.filter(contact =>
    (CONTACT_CATEGORIES[category] as readonly string[]).includes(contact.type)
  );
};
