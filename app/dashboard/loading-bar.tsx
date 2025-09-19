"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function LoadingBar() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500">
        <div className="h-full bg-white animate-pulse" />
      </div>
    </div>
  );
}