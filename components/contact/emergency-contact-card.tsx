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

export interface EmergencyContactData {
  id: number;
  name: string;
  number: string;
  description: string;
  type: string;
  available: string;
}

export interface EmergencyContactCardProps {
  contact: EmergencyContactData;
  index?: number;
  className?: string;
  showAvailability?: boolean;
  customActions?: ReactNode;
}

export const EmergencyContactCard = ({
  contact,
  index = 0,
  className = '',
  showAvailability = true,
  customActions,
}: EmergencyContactCardProps) => {
  const animation = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { delay: index * 0.1, duration: 0.6 },
  };

  const defaultActions = (
    <div className="mt-6 pt-4 border-t">
      <Button className="w-full bg-red-600 hover:bg-red-700">
        📞 Llamar Ahora
      </Button>
    </div>
  );

  return (
    <motion.div {...animation}>
      <Card className={`h-full hover:shadow-lg transition-shadow ${className}`}>
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <Badge className={`${getContactTypeColor(contact.type)} border`}>
              {getContactTypeLabel(contact.type)}
            </Badge>
            {showAvailability && (
              <span className="text-sm text-gray-500">{contact.available}</span>
            )}
          </div>
          <CardTitle className="text-xl mb-2">{contact.name}</CardTitle>
          <CardDescription className="text-base">
            {contact.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="w-4 h-4 mr-2 text-gray-400">📞</span>
              <span className="font-mono text-lg">{contact.number}</span>
            </div>
            {showAvailability && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-4 h-4 mr-2 text-gray-400">🕒</span>
                <span>Disponible: {contact.available}</span>
              </div>
            )}
          </div>
          {customActions || defaultActions}
        </CardContent>
      </Card>
    </motion.div>
  );
};
