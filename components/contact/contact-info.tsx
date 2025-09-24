import { ReactNode } from 'react';
import { LucideIcon, Phone, Mail, MapPin, Clock } from 'lucide-react';

interface ContactInfoItemProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  className?: string;
  href?: string;
}

export const ContactInfoItem = ({
  icon: Icon,
  label,
  value,
  className = '',
  href,
}: ContactInfoItemProps) => {
  if (!value) return null;

  const content = (
    <div
      className={`flex items-center text-sm text-gray-600 dark:text-gray-400 ${className}`}
    >
      <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
      <span className={href ? '' : 'font-mono'}>{value}</span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
      >
        {content}
      </a>
    );
  }

  return content;
};

interface ContactInfoProps {
  phone?: string;
  email?: string;
  address?: string;
  availability?: string;
  hours?: string;
  location?: string;
  className?: string;
  showLabels?: boolean;
}

export const ContactInfo = ({
  phone,
  email,
  address,
  availability,
  hours,
  location,
  className = '',
  showLabels = false,
}: ContactInfoProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <ContactInfoItem
        icon={Phone}
        label={showLabels ? 'Teléfono' : 'phone'}
        value={phone}
        href={phone ? `tel:${phone}` : undefined}
      />
      <ContactInfoItem
        icon={Mail}
        label={showLabels ? 'Email' : 'email'}
        value={email}
        href={email ? `mailto:${email}` : undefined}
      />
      <ContactInfoItem
        icon={MapPin}
        label={showLabels ? 'Dirección' : 'address'}
        value={address || location}
      />
      <ContactInfoItem
        icon={Clock}
        label={showLabels ? 'Disponibilidad' : 'availability'}
        value={availability || hours}
      />
    </div>
  );
};
