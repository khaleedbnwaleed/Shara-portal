import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_jtN96WFHxsiJ@ep-sparkling-credit-aidvotrp-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require',
  },
})
