import Hero from '../components/home/Hero';
import SelfHeatingShowcase from '../components/home/SelfHeatingShowcase';
import AboutSection from '../components/home/AboutSection';
import ProductsGrid from '../components/home/ProductsGrid';
import FeaturesSection from '../components/home/FeaturesSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <SelfHeatingShowcase />
      <AboutSection />
      <ProductsGrid />
      <FeaturesSection />
    </main>
  );
}
