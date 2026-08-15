'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

import {
  internshipApplicationSchema,
  internshipPositions,
  type InternshipApplicationValues,
} from '@/lib/internship'

type FormValues = InternshipApplicationValues

export function InternshipApplicationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(internshipApplicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      location: '',
      country: '',
      state: '',
      age: 18,
      gender: '',
      position: 'Social Media Manager Intern',
      highestQualification: '',
      fieldOfStudy: '',
      institution: '',
      graduationYear: new Date().getFullYear(),
      currentOccupation: '',
      previousExperience: '',
      relevantSkills: '',
      interestReason: '',
      learningGoals: '',
      contribution: '',
      preferredStartDate: new Date().toISOString().split('T')[0],
      availability: 'Part-time',
      workingArrangement: 'Remote',
      unpaidInternshipAccepted: false,
      declarationAccepted: false,
    },
  })

  const selectedPosition = form.watch('position')
  const unpaidAccepted = form.watch('unpaidInternshipAccepted')
  const declarationAccepted = form.watch('declarationAccepted')

  const steps = [
    { id: 0, title: 'Personal Information', description: 'Tell us about yourself' },
    { id: 1, title: 'Position Selection', description: 'Choose the internship you want to apply for' },
    { id: 2, title: 'Education & Experience', description: 'Share your background and skills' },
    { id: 3, title: 'Position-Specific Questions', description: 'Answer role-specific questions' },
    { id: 4, title: 'Availability', description: 'Let us know your availability' },
    { id: 5, title: 'Declarations & Submission', description: 'Review and submit your application' },
  ]

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/internship/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to submit application')
      }

      toast({
        title: 'Application Submitted',
        description: 'Your internship application has been successfully received.',
      })

      router.push(`/internship/success?ref=${data.applicationRef}`)
    } catch (error) {
      toast({
        title: 'Failed to Submit Application',
        description: (error as Error).message,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = []

    if (currentStep === 0) {
      fieldsToValidate = ['fullName', 'email', 'phoneNumber', 'location', 'country', 'state', 'age']
    } else if (currentStep === 1) {
      fieldsToValidate = ['position']
    } else if (currentStep === 2) {
      fieldsToValidate = [
        'highestQualification',
        'fieldOfStudy',
        'institution',
        'graduationYear',
        'previousExperience',
        'relevantSkills',
        'interestReason',
        'learningGoals',
        'contribution',
      ]
    } else if (currentStep === 3) {
      // Position-specific validation handled dynamically
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
      return
    } else if (currentStep === 4) {
      fieldsToValidate = ['preferredStartDate', 'availability', 'workingArrangement']
    }

    const isValid = await form.trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Steps Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className={`flex-1 flex items-center ${idx < steps.length - 1 ? 'relative' : ''}`}
            >
              <button
                onClick={() => {
                  if (idx < currentStep) {
                    setCurrentStep(idx)
                  }
                }}
                disabled={idx > currentStep}
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                  idx < currentStep
                    ? 'bg-primary text-primary-foreground cursor-pointer hover:scale-110'
                    : idx === currentStep
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground cursor-default'
                }`}
              >
                {idx < currentStep ? '✓' : idx + 1}
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`absolute left-1/2 top-1/2 w-full h-1 -translate-y-1/2 ${
                    idx < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                  style={{ marginLeft: '20px' }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">{steps[currentStep].title}</h2>
          <p className="text-muted-foreground">{steps[currentStep].description}</p>
        </div>
      </div>

      {/* Unpaid Internship Notice */}
      {currentStep === 0 && (
        <Alert className="mb-6 border-accent/50 bg-accent/5">
          <AlertCircle className="h-4 w-4 text-accent" />
          <AlertTitle className="text-accent font-semibold">
            IMPORTANT: This is an Unpaid Internship Programme
          </AlertTitle>
          <AlertDescription className="text-sm mt-2 text-foreground">
            The internship positions offered by Shara Eco Solutions Limited are unpaid learning and
            professional development opportunities. No salary, stipend, allowance, or financial
            remuneration is attached to these positions.
            <br />
            <br />
            Applicants should only apply if they understand and are willing to participate under
            these conditions.
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 0: Personal Information */}
          {currentStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Please provide your basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="+234 800 123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City/Location *</FormLabel>
                        <FormControl>
                          <Input placeholder="Lagos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nigeria" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province *</FormLabel>
                        <FormControl>
                          <Input placeholder="Lagos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="18"
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender (Optional)</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 1: Position Selection */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Position Selection</CardTitle>
                <CardDescription>Which internship position are you applying for?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Position *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {internshipPositions.map((pos) => (
                            <SelectItem key={pos} value={pos}>
                              {pos}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-primary/20">
                  <p className="text-sm text-foreground font-medium mb-2">Position Selected:</p>
                  <p className="text-lg font-semibold text-primary">{selectedPosition}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Education & Experience */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Education & Experience</CardTitle>
                <CardDescription>Tell us about your background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="highestQualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highest Qualification *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Bachelor's Degree" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fieldOfStudy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Digital Marketing" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution *</FormLabel>
                        <FormControl>
                          <Input placeholder="University/College name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="graduationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation Year *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1950"
                            max={new Date().getFullYear() + 2}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="currentOccupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Employment/Occupation (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Student, Freelancer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="previousExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Experience *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your previous work experience, projects, and achievements..."
                          className="resize-none min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="relevantSkills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relevant Skills *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List your relevant skills (e.g., Social Media Management, Graphic Design, Writing)..."
                          className="resize-none min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interestReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why are you interested in joining Shara Eco Solutions? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us what excites you about this opportunity..."
                          className="resize-none min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="learningGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What do you hope to learn during the internship? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your learning goals and what you want to gain..."
                          className="resize-none min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What can you contribute to Shara Eco Solutions? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain how you can contribute to our team and projects..."
                          className="resize-none min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 3: Position-Specific Questions */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Position-Specific Questions</CardTitle>
                <CardDescription>Answer questions related to {selectedPosition}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Social Media Manager */}
                {selectedPosition === 'Social Media Manager Intern' && (
                  <>
                    <FormField
                      control={form.control}
                      name="socialMediaPlatforms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Which social media platforms have you managed? *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Instagram, TikTok, LinkedIn, Twitter, Facebook..."
                              className="resize-none min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialMediaTools"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            What social media management tools have you used? *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Meta Business Suite, Buffer, Hootsuite, Canva..."
                              className="resize-none min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialMediaPortfolio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfolio / Social Media Account URL *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://instagram.com/yourprofile or portfolio link"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Share a link to your social media profile or portfolio
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialMediaCampaign"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Describe one successful social media campaign you have worked on *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about a campaign's objectives, your role, and the results..."
                              className="resize-none min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Graphic Designer */}
                {selectedPosition === 'Graphic Designer Intern' && (
                  <>
                    <FormField
                      control={form.control}
                      name="designTools"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Which design tools do you use? *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Canva, Adobe Photoshop, Illustrator, Figma..."
                              className="resize-none min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="designPortfolioUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfolio URL *</FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="https://yourportfolio.com or https://behance.net/yourprofile"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Share a link to your design portfolio
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="designExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Describe your design experience *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your design background, projects, style, and achievements..."
                              className="resize-none min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Climate Education */}
                {selectedPosition === 'Climate Education & Course Development Intern' && (
                  <>
                    <FormField
                      control={form.control}
                      name="educationContentExp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Do you have experience developing educational content? *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe any experience with creating educational materials, lessons, or content..."
                              className="resize-none min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="teachingExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Do you have teaching or training experience? *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about any teaching, tutoring, or training experience..."
                              className="resize-none min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="onlineCourseExp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Have you developed an online course before? *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe any experience creating online courses or using LMS platforms..."
                              className="resize-none min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="educationPortfolio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfolio or Previous Educational Work URL *</FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="https://yourportfolio.com or link to educational work samples"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Share a link to your educational content or projects
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="climateTopicIdea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Describe one climate/environmental topic you would like to develop into an
                            online course *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share an idea for a course topic, outline, and target audience..."
                              className="resize-none min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Availability */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Availability & Work Arrangement</CardTitle>
                <CardDescription>Tell us about your availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="preferredStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Start Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workingArrangement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Working Arrangement *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Currently, we offer remote internship positions only.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 5: Declarations & Submission */}
          {currentStep === 5 && (
            <>
              <Alert className="border-accent/50 bg-accent/5">
                <AlertCircle className="h-4 w-4 text-accent" />
                <AlertTitle className="text-accent font-semibold">
                  UNPAID INTERNSHIP ACKNOWLEDGEMENT
                </AlertTitle>
                <AlertDescription className="text-sm mt-2 text-foreground">
                  I understand that this internship position is unpaid. I acknowledge that I will
                  not receive a salary, stipend, allowance, or other financial remuneration for
                  participating in the internship programme.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle>Application Declarations</CardTitle>
                  <CardDescription>Please review and accept before submitting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="unpaidInternshipAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-primary/20 p-4 bg-primary/5">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="flex-1">
                          <FormLabel className="text-sm font-semibold leading-relaxed cursor-pointer">
                            I have read, understood and accept the unpaid nature of this internship
                            *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Final Declaration</AlertTitle>
                    <AlertDescription className="text-sm mt-2">
                      I confirm that the information provided in this application is accurate and
                      complete. I understand that submitting this application does not guarantee
                      selection and that shortlisted applicants may be contacted for further
                      assessment or interview.
                    </AlertDescription>
                  </Alert>

                  <FormField
                    control={form.control}
                    name="declarationAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-primary/20 p-4 bg-primary/5">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="flex-1">
                          <FormLabel className="text-sm font-semibold leading-relaxed cursor-pointer">
                            I agree to the declaration *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {!unpaidAccepted && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Required</AlertTitle>
                      <AlertDescription>
                        You must acknowledge and accept that this is an unpaid internship before
                        submitting your application.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>

            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep} className="bg-primary hover:bg-primary/90 gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!unpaidAccepted || !declarationAccepted || isSubmitting}
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                {isSubmitting && <Spinner className="w-4 h-4" />}
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
