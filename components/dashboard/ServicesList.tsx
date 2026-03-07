'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Service = {
  id: number
  title: string
  description: string
}

type ServicesListProps = {
  services: Service[]
}

export default function ServicesList({ services }: ServicesListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card key={service.id} className="bg-white">
          <CardHeader>
            <CardTitle className="text-base">{service.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
