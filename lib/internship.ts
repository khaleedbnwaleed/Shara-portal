import { z } from 'zod'

export const internshipPositions = [
  'Social Media Manager Intern',
  'Graphic Designer Intern',
  'Climate Education & Course Development Intern',
] as const

export const internshipApplicationSchema = z.object({
  // Step 1: Personal Information
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  location: z.string().min(2, 'Location is required'),
  country: z.string().min(2, 'Country is required'),
  state: z.string().min(2, 'State is required'),
  age: z.number().min(18, 'You must be at least 18 years old').max(100, 'Please enter a valid age'),
  gender: z.string().optional(),
  
  // Step 2: Position
  position: z.enum(internshipPositions, {
    errorMap: () => ({ message: 'Please select a valid internship position' }),
  }),
  
  // Step 3: Education & Experience
  highestQualification: z.string().min(2, 'Highest qualification is required'),
  fieldOfStudy: z.string().min(2, 'Field of study is required'),
  institution: z.string().min(2, 'Institution name is required'),
  graduationYear: z.number().min(1950).max(new Date().getFullYear() + 2),
  currentOccupation: z.string().optional(),
  previousExperience: z.string().min(10, 'Please describe your previous experience'),
  relevantSkills: z.string().min(10, 'Please list your relevant skills'),
  
  // Motivation
  interestReason: z.string().min(20, 'Please provide a detailed answer (at least 20 characters)'),
  learningGoals: z.string().min(20, 'Please provide a detailed answer (at least 20 characters)'),
  contribution: z.string().min(20, 'Please provide a detailed answer (at least 20 characters)'),
  
  // Position-Specific (Social Media)
  socialMediaPlatforms: z.string().optional(),
  socialMediaTools: z.string().optional(),
  socialMediaPortfolio: z.string().optional(),
  socialMediaCampaign: z.string().optional(),
  
  // Position-Specific (Graphic Designer)
  designTools: z.string().optional(),
  designPortfolioUrl: z.string().url('Please enter a valid portfolio URL').optional().or(z.literal('')),
  designExperience: z.string().optional(),
  
  // Position-Specific (Climate Education)
  educationContentExp: z.string().optional(),
  teachingExperience: z.string().optional(),
  onlineCourseExp: z.string().optional(),
  educationPortfolio: z.string().optional(),
  climateTopicIdea: z.string().optional(),
  
  // Step 4: Availability
  preferredStartDate: z.string().transform(str => new Date(str)),
  availability: z.enum(['Part-time', 'Full-time']),
  workingArrangement: z.enum(['Remote']),
  
  // Declarations
  unpaidInternshipAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the unpaid internship terms to apply' }),
  }),
  declarationAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the declaration to submit your application' }),
  }),
})

export type InternshipApplicationValues = z.infer<typeof internshipApplicationSchema>

// Generate unique application reference
export function generateApplicationRef(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = 'SHARA-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
