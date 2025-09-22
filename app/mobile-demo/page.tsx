import { MobileFeaturesDemo } from '@/components/demo/mobile-features-demo';

export default function MobileDemoPage() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto py-8'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold mb-4'>📱 Mobile-First Features</h1>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Experience native mobile interactions with performance monitoring,
            haptic feedback, and offline capabilities.
          </p>
        </div>

        <MobileFeaturesDemo />
      </div>
    </div>
  );
}