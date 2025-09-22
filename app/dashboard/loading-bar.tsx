'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function LoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className='fixed top-0 left-0 right-0 z-50'>
      <div className='h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse' />
    </div>
  );
}