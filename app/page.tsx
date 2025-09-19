import Image from "next/image";
import HeroSection from "./(landing)/hero-section";
import FeaturesOne from "./(landing)/features-one";
import FeaturesSection5 from "./(landing)/features-5";
import FeaturesSection5Mirror from "./(landing)/features-5-mirror";
import FeaturesSection52 from "./(landing)/features-52";
import Testimonials from "./(landing)/testimonials";
import Pricing from "./(landing)/pricing-section-two";
import CallToAction from "./(landing)/call-to-action";
import FAQs from "./(landing)/faqs";
import Footer from "./(landing)/footer";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection5 />
      <FeaturesSection5Mirror />
      <FeaturesSection52 />
      <FeaturesOne />
      <Testimonials />
      <Pricing />
      <CallToAction />
      <FAQs />
      <Footer />
    </div>
  );
}