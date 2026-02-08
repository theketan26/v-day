import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail, setAuthSession } from '../../../../lib/auth'
import { registerSchema } from '../../../../lib/validation'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validatedData = registerSchema.parse(body)

    // Check if user exists
    const existingUser = await getUserByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Create user
    const user = await createUser(
      validatedData.email,
      validatedData.password,
      validatedData.full_name
    )

    // Set session
    await setAuthSession(user.id)

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = error.issues.reduce((acc: any, err: any) => {
        const path = err.path[0]?.toString() || 'unknown'
        acc[path] = err.message
        return acc
      }, {} as Record<string, string>)

      return NextResponse.json(
        { error: 'Validation failed', fieldErrors },
        { status: 400 }
      )
    }

    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
