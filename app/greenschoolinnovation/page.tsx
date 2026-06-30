import { Metadata } from 'next'
import { GsicRegistrationSection } from '@/components/gsic-registration-section'

export const metadata: Metadata = {
  title: 'GSIC Registration | Green School Innovation Challenge Dutse',
  description: 'Register for the Green School Innovation Challenge with a responsive submission form and countdown to the deadline.',
}

export default function GreenSchoolInnovationPage() {
  return <GsicRegistrationSection />
}
