import Image from 'next/image';
import { WebGLShader } from '@/components/ui/web-gl-shader';

interface BackgroundSectionProps {
  /** Path to the background image */
  imageSrc: string;
  /** Alt text for the background image */
  alt?: string;
  /** Whether to include WebGL shader overlay */
  useWebGL?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Image priority for Next.js Image optimization */
  priority?: boolean;
  /** Image quality for Next.js Image optimization */
  quality?: number;
}

/**
 * Standardized background section component with optional WebGL shader overlay.
 * Provides consistent background styling across all pages.
 */
export const BackgroundSection = ({
  imageSrc,
  alt = 'Background',
  useWebGL = false,
  className = '',
  priority = true,
  quality = 90,
}: BackgroundSectionProps) => {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover object-center"
        priority={priority}
        quality={quality}
      />
      {useWebGL && <WebGLShader />}
    </div>
  );
};
