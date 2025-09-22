import { MobileFeaturesDemo } from '@/components/demo/mobile-features-demo';
import { MobileWeatherWidgetIntegration } from '@/components/weather/mobile-weather-widget-integration';
import { EnhancedMobileWeatherWidget } from '@/components/weather/enhanced-mobile-weather-widget';

// Disable prerendering for this page since it uses real-time weather data
export const dynamic = 'force-dynamic'

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

        {/* Weather Widgets Demo */}
        <div className='mb-12'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold mb-4'>🌤️ Weather Widgets</h2>
            <p className='text-muted-foreground max-w-xl mx-auto'>
              Modern mobile weather widgets with swipe gestures, compact views, and 7-day forecasts
              optimized for home screen placement.
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8 max-w-6xl mx-auto'>
            {/* Compact Widget */}
            <div>
              <h3 className='text-lg font-semibold mb-4 text-center'>Compact Widget</h3>
              <div className='flex justify-center'>
                <MobileWeatherWidgetIntegration compact={true} />
              </div>
            </div>

            {/* Full Widget */}
            <div>
              <h3 className='text-lg font-semibold mb-4 text-center'>Full Widget</h3>
              <div className='flex justify-center'>
                <MobileWeatherWidgetIntegration compact={false} />
              </div>
            </div>
          </div>

          {/* Enhanced Interactive Widget */}
          <div className='mt-12'>
            <h3 className='text-lg font-semibold mb-4 text-center'>Enhanced Interactive Widget</h3>
            <p className='text-sm text-muted-foreground text-center mb-6 max-w-2xl mx-auto'>
              Swipe left/right to navigate between current weather, hourly forecast, 7-day forecast, and alerts.
              Features smooth animations and touch-optimized interactions.
            </p>
            <div className='flex justify-center'>
              <EnhancedMobileWeatherWidget />
            </div>
          </div>
        </div>

        {/* Other Mobile Features */}
        <div className='border-t pt-12'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold mb-4'>🚀 Other Mobile Features</h2>
          </div>
          <MobileFeaturesDemo />
        </div>
      </div>
    </div>
  );
}