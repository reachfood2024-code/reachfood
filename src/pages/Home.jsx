import Hero from '../components/home/Hero';
import AboutSection from '../components/home/AboutSection';
import ProductsGrid from '../components/home/ProductsGrid';
import FeaturesSection from '../components/home/FeaturesSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <ProductsGrid />
      <FeaturesSection />
    </main>
  );
}
