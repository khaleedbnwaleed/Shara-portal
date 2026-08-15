'use client'

import { OpportunityCard } from './OpportunityCard'

export function OpportunitiesSection() {
  const opportunities = [
    {
      position: 'Social Media Manager Intern',
      department: 'Digital Media & Communications',
      overview:
        'We are looking for a creative and proactive Social Media Manager Intern to help strengthen Shara Eco Solutions\' digital presence and communicate our environmental, climate and innovation initiatives to a wider audience.',
      responsibilities: [
        'Manage and support Shara\'s social media platforms',
        'Create and schedule social media content',
        'Develop weekly and monthly content calendars',
        'Write engaging captions and campaign messages',
        'Monitor audience engagement and growth',
        'Support promotion of events, campaigns, fellowships and programmes',
        'Track basic social media analytics',
        'Prepare social media performance reports',
        'Collaborate with the Graphic Designer',
        'Support digital campaigns and online community engagement',
      ],
      skills: [
        'Social media management',
        'Content creation',
        'Copywriting',
        'Canva',
        'Meta Business Suite',
        'Social media analytics',
        'Communication',
        'Creativity',
        'Community management',
      ],
    },
    {
      position: 'Graphic Designer Intern',
      department: 'Creative & Digital Communications',
      overview:
        'We are looking for a creative Graphic Designer Intern who can transform environmental, climate and sustainability ideas into compelling visual communication materials.',
      responsibilities: [
        'Design social media graphics',
        'Create flyers and posters',
        'Design event banners',
        'Create digital campaign materials',
        'Design certificates',
        'Create presentation graphics',
        'Maintain Shara\'s visual identity',
        'Develop creative concepts for campaigns',
        'Collaborate with the Social Media Manager',
        'Design materials for Shara Climate Academy',
        'Support branding for events and programmes',
      ],
      skills: [
        'Canva',
        'Adobe Photoshop',
        'Adobe Illustrator',
        'Graphic design',
        'Typography',
        'Layout design',
        'Branding',
        'Visual communication',
        'Creative thinking',
      ],
      portfolioRequired: true,
    },
    {
      position: 'Climate Education & Course Development Intern',
      department: 'Shara Climate Academy',
      overview:
        'We are looking for a passionate individual to support the development of online courses and educational resources for Shara Climate Academy.',
      responsibilities: [
        'Research climate change topics',
        'Research environmental sustainability',
        'Develop online courses',
        'Create course outlines',
        'Develop learning modules',
        'Write lesson content',
        'Create learning objectives',
        'Develop quizzes and assessments',
        'Create assignments',
        'Develop presentation materials',
        'Prepare educational workbooks',
        'Develop video lesson scripts',
        'Convert research into learner-friendly educational content',
        'Assist with uploading courses to the learning platform',
        'Review and update course materials',
        'Work with subject-matter experts',
      ],
      skills: [
        'Research',
        'Academic writing',
        'Course development',
        'Curriculum development',
        'Content development',
        'Education/training',
        'Climate knowledge',
        'Environmental sustainability',
        'Canva',
        'PowerPoint',
        'LMS experience',
      ],
    },
  ]

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Available Internship Positions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our current internship opportunities and find the position that best matches your skills and interests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {opportunities.map((opp, idx) => (
            <OpportunityCard key={idx} {...opp} />
          ))}
        </div>
      </div>
    </section>
  )
}
