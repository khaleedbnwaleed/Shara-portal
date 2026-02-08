import { Suspense } from 'react';
import Header from '@/components/header';
import Hero from '@/components/hero';
import About from '@/components/about';
import ImpactGallery from '@/components/impact-gallery';
import Awards from '@/components/awards';
import Team from '@/components/team';
import Projects from '@/components/projects';
import Gallery from '@/components/gallery';
import Partners from '@/components/partners';
import PricingPlans from '@/components/pricing-plans';
import WhyUs from '@/components/why-us';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Suspense fallback={<div className="h-96" />}>
        <About />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <ImpactGallery />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <Awards />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <Gallery />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <Team />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<div className="h-32" />}>
        <Partners />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <PricingPlans />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <WhyUs />
      </Suspense>
      <Footer />
    </main>
  );
}
