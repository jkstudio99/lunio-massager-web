import HomeHeroSection from '@/components/home/HomeHeroSection';
import HomeTrustStrip from '@/components/home/HomeTrustStrip';
import HomeBenefitsSection from '@/components/home/HomeBenefitsSection';
import HomeCategoryShowcase from '@/components/home/HomeCategoryShowcase';
import HomeStorySection from '@/components/home/HomeStorySection';
import HomeProductsSection from '@/components/home/HomeProductsSection';
import HomeProcessSection from '@/components/home/HomeProcessSection';
import HomeReviewsSection from '@/components/home/HomeReviewsSection';
import HomeCtaSection from '@/components/home/HomeCtaSection';

export default function HomePage() {
  return (
    <>
      <HomeHeroSection />
      <HomeTrustStrip />
      <HomeBenefitsSection />
      <HomeCategoryShowcase />
      <HomeStorySection />
      <HomeProductsSection />
      <HomeProcessSection />
      <HomeReviewsSection />
      <HomeCtaSection />
    </>
  );
}
