import Header from '@/components/layout/Header';
import HeroSection from '@/components/sections/HeroSection';
import dynamic from 'next/dynamic';

const IdeaSection = dynamic(() => import('@/components/sections/IdeaSection'));
const ExperienceSection = dynamic(() => import('@/components/sections/ExperienceSection'));
const StatsSection = dynamic(() => import('@/components/sections/StatsSection'));
const WhyChooseSection = dynamic(() => import('@/components/sections/WhyChooseSection'));
const MomentsSection = dynamic(() => import('@/components/sections/MomentsSection'));
const TestimonialSection = dynamic(() => import('@/components/sections/TestimonialSection'));
const CTASection = dynamic(() => import('@/components/sections/CTASection'));
const Footer = dynamic(() => import('@/components/layout/Footer'));
export default function Home() {
  return (
    <main id="main-content" className="bg-luxury-light min-h-screen">
      <Header />
      <HeroSection />
      <IdeaSection />
      <ExperienceSection />
      <StatsSection />
      <WhyChooseSection />
      <MomentsSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </main>
  );
}
