import { z } from 'zod'

export const fellowshipInterests = [
  'Climate Change', 'Environmental Conservation', 'Waste Management', 'Renewable Energy',
  'Sustainable Agriculture', 'Biodiversity', 'Water & Sanitation', 'Climate Education',
  'Climate Advocacy', 'Green Entrepreneurship', 'Circular Economy', 'Community Development',
  'Digital Innovation', 'Other',
] as const

export const fellowshipSkills = [
  'Leadership', 'Public Speaking', 'Research', 'Data Analysis', 'Digital Skills',
  'Social Media', 'Graphic Design', 'Video Production', 'Writing', 'Community Mobilization',
  'Project Management', 'Entrepreneurship', 'Advocacy', 'Teaching/Training', 'Other',
] as const

export const fellowshipStatuses = [
  'Submitted', 'Under Review', 'Shortlisted', 'Interview/Assessment', 'Selected', 'Waitlisted', 'Not Selected',
] as const

const wordLimit = (max: number, label: string) =>
  z.string().trim().min(20, `${label} must be at least 20 characters`).refine(
    (value) => value.split(/\s+/).filter(Boolean).length <= max,
    `${label} must be ${max} words or fewer`
  )

export const fellowshipApplicationSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().regex(/^(?:\+234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number'),
  gender: z.string().min(1, 'Select a gender option'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  age: z.number().min(16, 'Applicants must be at least 16').max(40, 'Enter a valid age'),
  state: z.string().min(2, 'State is required'),
  lga: z.string().min(2, 'LGA is required'),
  community: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  address: z.string().optional(),
  education: z.string().min(2, 'Select your highest qualification'),
  fieldOfStudy: z.string().optional(),
  institution: z.string().optional(),
  occupation: z.string().min(2, 'Select your current status'),
  organization: z.string().optional(),
  role: z.string().optional(),
  hasClimateExperience: z.enum(['Yes', 'No']),
  climateExperience: z.string().optional(),
  climateInterests: z.array(z.string()).min(1, 'Select at least one interest'),
  motivation: wordLimit(300, 'Motivation'),
  communityChallenge: wordLimit(300, 'Community challenge'),
  proposedImpact: wordLimit(300, 'Proposed impact'),
  leadershipExperience: wordLimit(300, 'Leadership experience'),
  climateLeadership: wordLimit(200, 'Climate leadership'),
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  digitalLiteracy: z.string().min(1, 'Select your digital literacy level'),
  availability: z.enum(['Yes', 'No']),
  referralSource: z.string().min(1, 'Tell us how you heard about the fellowship'),
  declarationAccepted: z.boolean().refine((value) => value, 'You must accept the declaration'),
  communicationsOptIn: z.boolean(),
})

export type FellowshipApplicationValues = z.infer<typeof fellowshipApplicationSchema>

export const fellowshipConfig = {
  title: 'Shara Climate Champions Fellowship',
  description: 'A youth fellowship for climate leadership and community action.',
  duration: '12 weeks',
  format: 'A blended programme with virtual learning and community action.',
  contactEmail: 'hello@shara.com.ng',
  applicationOpen: true,
  maxApplications: null as number | null,
}

export function calculateAge(dateOfBirth: string) {
  const birthDate = new Date(dateOfBirth)
  if (Number.isNaN(birthDate.getTime())) return 0
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const birthdayPassed = today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())
  if (!birthdayPassed) age -= 1
  return age
}

export function generateFellowshipApplicationId(sequence = Date.now()) {
  return `SCCF-${new Date().getFullYear()}-${String(sequence).slice(-5).padStart(5, '0')}`
}

export async function getFellowshipConfig() {
  try {
    const { prisma } = await import('@/lib/prisma')
    const settings = await prisma.fellowshipSettings.findUnique({ where: { id: 1 } })
    return settings ? { ...fellowshipConfig, ...settings, applicationOpen: settings.applicationOpen } : fellowshipConfig
  } catch {
    return fellowshipConfig
  }
}