// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

import FooterSection from './footer'
import HeroSection from './hero-section'

export default function Home() {
  return (
    <div className='relative min-h-screen'>
      {/* Content */}
      <HeroSection />
      <FooterSection />
    </div>
  );
}