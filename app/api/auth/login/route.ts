import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, verifyPassword, setAuthSession } from '@/lib/auth'
import { loginSchema } from '@/lib/validation'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validatedData = loginSchema.parse(body)

    // Find user
    const user = await getUserByEmail(validatedData.email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(validatedData.password, user.password_hash)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Set session
    await setAuthSession(user.id)

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = error.errors.reduce((acc, err) => {
        const path = err.path[0]?.toString() || 'unknown'
        acc[path] = err.message
        return acc
      }, {} as Record<string, string>)

      return NextResponse.json(
        { error: 'Validation failed', fieldErrors },
        { status: 400 }
      )
    }

    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
