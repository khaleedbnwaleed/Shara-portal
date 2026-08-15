'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Briefcase } from 'lucide-react'

interface OpportunityCardProps {
  position: string
  department: string
  overview: string
  responsibilities: string[]
  skills: string[]
  portfolioRequired?: boolean
}

export function OpportunityCard({
  position,
  department,
  overview,
  responsibilities,
  skills,
  portfolioRequired,
}: OpportunityCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl text-primary">{position}</CardTitle>
            <CardDescription className="text-sm mt-1">{department}</CardDescription>
          </div>
          <Briefcase className="w-6 h-6 text-accent flex-shrink-0" />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Role Overview</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{overview}</p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Responsibilities</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {responsibilities.slice(0, 5).map((resp, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-accent flex-shrink-0">•</span>
                <span>{resp}</span>
              </li>
            ))}
            {responsibilities.length > 5 && (
              <li className="text-accent text-xs font-semibold pt-1">
                +{responsibilities.length - 5} more responsibilities
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Preferred Skills</h4>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 6).map((skill, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 6 && (
              <Badge variant="outline" className="text-xs">
                +{skills.length - 6}
              </Badge>
            )}
          </div>
        </div>

        {portfolioRequired && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mt-2">
            <p className="text-xs font-semibold text-accent">📁 Portfolio Required</p>
            <p className="text-xs text-muted-foreground mt-1">
              You will be asked to provide portfolio samples or examples of previous work.
            </p>
          </div>
        )}

        <Link href="/internship/apply" className="mt-auto">
          <Button className="w-full bg-primary hover:bg-primary/90">
            View Full Details & Apply
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
