import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

export const sql = neon(process.env.DATABASE_URL)

export interface User {
  id: string
  email: string
  password_hash: string
  name: string | null
  created_at: Date
  updated_at: Date
}

export interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string
  config: Record<string, unknown>
  created_at: Date
}

export interface App {
  id: string
  user_id: string
  template_id: string
  title: string
  customization: Record<string, unknown>
  passkey: string
  is_public: boolean
  created_at: Date
  updated_at: Date
}

export interface AppResponse {
  id: string
  app_id: string
  responses: Record<string, unknown>
  visitor_name: string | null
  created_at: Date
}
