import Hero from '../components/home/Hero';
import SelfHeatingShowcase from '../components/home/SelfHeatingShowcase';
import AboutSection from '../components/home/AboutSection';
import ProductsGrid from '../components/home/ProductsGrid';
import FeaturesSection from '../components/home/FeaturesSection';
import B2BSection from '../components/home/B2BSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <SelfHeatingShowcase />
      <AboutSection />
      <ProductsGrid />
      <FeaturesSection />
      <B2BSection />
    </main>
  );
}
