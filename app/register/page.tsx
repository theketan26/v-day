import { RegisterForm } from '@/components/auth/register-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account - Romantic Apps',
  description: 'Create an account to start building romantic experiences.',
}

export default function RegisterPage() {
  return <RegisterForm />
}
