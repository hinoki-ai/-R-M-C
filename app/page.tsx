'use client';

import CustomClerkPricing from '@/components/forms/custom-clerk-pricing';

import CallToAction from './(landing)/call-to-action';
import FAQs from './(landing)/faqs';
import FeaturesOne from './(landing)/features-one';
import Footer from './(landing)/footer';
import HeroSection from './(landing)/hero-section';


export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesOne />
      <section className='bg-muted/50 py-16 md:py-32'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-12 mx-auto max-w-2xl space-y-6 text-center'>
              <h1 className='text-center text-4xl font-semibold lg:text-5xl'>Apoyo y Colaboración Comunitaria</h1>
              <p>Tu contribución hace posible el desarrollo de Pinto Los Pellines. Conoce las formas en que puedes apoyar y participar en el crecimiento de nuestra comunidad.</p>
          </div>
          <CustomClerkPricing />
        </div>
      </section>
      <CallToAction />
      <FAQs />
      <Footer />
    </div>
  );
}