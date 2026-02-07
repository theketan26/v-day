import { LoginForm } from '@/components/auth/login-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - Romantic Apps',
  description: 'Sign in to your account and create romantic experiences.',
}

export default function LoginPage() {
  return <LoginForm />
}
