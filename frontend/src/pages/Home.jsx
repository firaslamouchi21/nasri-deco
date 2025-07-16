import HeroSection from '../components/HeroSection';
import GalleryCarousel from '../components/GalleryCarousel';
import ServicesSection from '../components/ServicesSection';
import TestimonialsSection from '../components/TestimonialsSection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-white">
      <HeroSection />
      <ServicesSection />
      <GalleryCarousel />
      <TestimonialsSection />
    </div>
  );
} 