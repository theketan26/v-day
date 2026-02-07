import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { sql } from './db'
import type { User } from './db'

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(email: string, password: string, name: string): Promise<User> {
  const passwordHash = await hashPassword(password)
  const userId = crypto.randomUUID()
  const now = new Date()

  const result = await sql(
    `INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, password_hash, name, created_at, updated_at`,
    [userId, email, passwordHash, name, now, now]
  )

  if (result.length === 0) throw new Error('Failed to create user')

  return result[0] as User
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql(
    `SELECT id, email, password_hash, name, created_at, updated_at
     FROM users WHERE email = $1`,
    [email]
  )

  return result.length > 0 ? (result[0] as User) : null
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await sql(
    `SELECT id, email, password_hash, name, created_at, updated_at
     FROM users WHERE id = $1`,
    [id]
  )

  return result.length > 0 ? (result[0] as User) : null
}

export async function setAuthSession(userId: string): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = crypto.randomUUID()

  cookieStore.set('auth_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  await sql(
    `INSERT INTO sessions (user_id, session_token, expires_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (session_token) DO UPDATE SET expires_at = $3`,
    [userId, sessionId, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
  )
}

export async function clearAuthSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('auth_session')
}

export async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('auth_session')?.value

  if (!sessionId) return null

  const result = await sql(
    `SELECT user_id FROM sessions
     WHERE session_token = $1 AND expires_at > NOW()`,
    [sessionId]
  )

  return result.length > 0 ? (result[0].user_id as string) : null
}

export async function getAuthUser(): Promise<User | null> {
  const userId = await getAuthUserId()
  if (!userId) return null
  return getUserById(userId)
}
