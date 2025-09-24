import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ContactSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  delay?: number;
  className?: string;
  gridCols?: 1 | 2 | 3;
  id?: string;
}

export const ContactSection = ({
  title,
  subtitle,
  children,
  delay = 0,
  className = '',
  gridCols = 3,
  id,
}: ContactSectionProps) => {
  const getGridClasses = () => {
    switch (gridCols) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={`mb-12 ${className}`}
    >
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
        {title}
      </h2>
      {subtitle && (
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className={`grid ${getGridClasses()} gap-6`}>{children}</div>
    </motion.div>
  );
};
