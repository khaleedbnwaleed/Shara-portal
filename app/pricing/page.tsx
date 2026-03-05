import Header from '@/components/header';
import Footer from '@/components/footer';
import PricingPlans from '@/components/pricing-plans';

export default function PricingRoute() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <PricingPlans />
      <Footer />
    </main>
  );
}
