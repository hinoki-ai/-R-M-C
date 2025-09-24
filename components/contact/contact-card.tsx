import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ContactInfo } from './contact-info';
import { getContactTypeColor, getContactTypeLabel } from './contact-types';

export interface ContactData {
  _id: string;
  name: string;
  type: string;
  position?: string;
  department?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  availability?: string;
  hours?: string;
  location?: string;
}

// Support for emergency contacts with different field names
export interface EmergencyContactData {
  id: number;
  name: string;
  number: string;
  description: string;
  type: string;
  available: string;
}

export interface ContactCardProps {
  contact: ContactData | EmergencyContactData;
  variant?: 'community' | 'municipal' | 'service' | 'emergency';
  index?: number;
  className?: string;
  showTypeBadge?: boolean;
  customActions?: ReactNode;
}

// Type guard to check if contact is emergency contact
const isEmergencyContact = (
  contact: ContactData | EmergencyContactData
): contact is EmergencyContactData => {
  return 'number' in contact && 'available' in contact && !('_id' in contact);
};

export const ContactCard = ({
  contact,
  variant = 'community',
  index = 0,
  className = '',
  showTypeBadge = true,
  customActions,
}: ContactCardProps) => {
  // Adapt contact fields based on type
  const contactId = isEmergencyContact(contact)
    ? contact.id.toString()
    : contact._id;
  const contactPhone = isEmergencyContact(contact)
    ? contact.number
    : contact.phone;
  const contactAvailability = isEmergencyContact(contact)
    ? contact.available
    : contact.availability;

  const getAnimationVariant = () => {
    switch (variant) {
      case 'community':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: index * 0.1, duration: 0.6 },
        };
      case 'municipal':
        return {
          initial: { opacity: 0, x: index % 2 === 0 ? -20 : 20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.6 + index * 0.1, duration: 0.6 },
        };
      case 'service':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.8 + index * 0.1, duration: 0.6 },
        };
      case 'emergency':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: index * 0.1, duration: 0.6 },
        };
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: index * 0.1, duration: 0.6 },
        };
    }
  };

  const getDefaultActions = () => {
    const hasContact =
      contactPhone || (isEmergencyContact(contact) ? false : contact.email);

    if (!hasContact) return null;

    switch (variant) {
      case 'community':
        return (
          <div className="mt-6 pt-4 border-t flex gap-2">
            {contactPhone && (
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                📞 Llamar
              </Button>
            )}
            {!isEmergencyContact(contact) && contact.email && (
              <Button size="sm" variant="outline" className="flex-1">
                ✉️ Email
              </Button>
            )}
          </div>
        );
      case 'municipal':
        return hasContact ? (
          <div className="mt-6 pt-4 border-t">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              📞 Contactar Servicio
            </Button>
          </div>
        ) : null;
      case 'emergency':
        return (
          <div className="mt-6 pt-4 border-t">
            <Button className="w-full bg-red-600 hover:bg-red-700">
              📞 Llamar Ahora
            </Button>
          </div>
        );
      case 'service':
        return null; // Services don't have default actions
      default:
        return null;
    }
  };

  return (
    <motion.div {...getAnimationVariant()}>
      <Card className={`h-full hover:shadow-lg transition-shadow ${className}`}>
        <CardHeader>
          {showTypeBadge && (
            <div className="flex items-start justify-between mb-4">
              <Badge className={`${getContactTypeColor(contact.type)} border`}>
                {getContactTypeLabel(contact.type)}
              </Badge>
              {variant === 'emergency' && contactAvailability && (
                <span className="text-sm text-gray-500">
                  {contactAvailability}
                </span>
              )}
            </div>
          )}
          <CardTitle className="text-xl mb-2">{contact.name}</CardTitle>
          <CardDescription className="text-base font-medium text-gray-700 dark:text-gray-300">
            {isEmergencyContact(contact)
              ? contact.description
              : contact.position || contact.department || contact.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {variant === 'emergency' ? (
            // Emergency contact specific display
            <div className="space-y-3">
              {contactPhone && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-4 h-4 mr-2 text-gray-400">📞</span>
                  <span className="font-mono text-lg">{contactPhone}</span>
                </div>
              )}
              {variant === 'emergency' && contactAvailability && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-4 h-4 mr-2 text-gray-400">🕒</span>
                  <span>Disponible: {contactAvailability}</span>
                </div>
              )}
            </div>
          ) : (
            // Regular contact info display
            <ContactInfo
              phone={
                isEmergencyContact(contact) ? contact.number : contact.phone
              }
              email={isEmergencyContact(contact) ? undefined : contact.email}
              address={
                isEmergencyContact(contact) ? undefined : contact.address
              }
              availability={
                isEmergencyContact(contact)
                  ? contact.available
                  : contact.availability
              }
              hours={isEmergencyContact(contact) ? undefined : contact.hours}
              location={
                isEmergencyContact(contact) ? undefined : contact.location
              }
            />
          )}
          {customActions || getDefaultActions()}
        </CardContent>
      </Card>
    </motion.div>
  );
};
