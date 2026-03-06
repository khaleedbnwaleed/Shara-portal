import Header from '@/components/header'
import Footer from '@/components/footer'
import VolunteerInfo from '@/components/volunteer-info'
import VolunteerForm from '@/components/volunteer-form'

export const metadata = {
  title: 'Volunteer | Shara',
  description:
    'Join Shara as a volunteer and support sustainable waste solutions across communities.',
}

export default function VolunteerPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <VolunteerInfo />
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <VolunteerForm />
        </div>
      </section>
      <Footer />
    </main>
  )
}
