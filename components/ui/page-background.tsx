import Image from 'next/image';

interface PageBackgroundProps {
  /** Background image source path */
  src: string;
  /** Alt text for the image */
  alt: string;
  /** Optional priority loading */
  priority?: boolean;
  /** Image quality (default: 90) */
  quality?: number;
  /** Custom CSS classes for the image */
  className?: string;
  /** Additional overlay elements to render on top of the image */
  overlays?: React.ReactNode;
}

export function PageBackground({
  src,
  alt,
  priority = true,
  quality = 90,
  className = 'object-cover object-center',
  overlays,
}: PageBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        quality={quality}
      />
      {overlays}
    </div>
  );
}
