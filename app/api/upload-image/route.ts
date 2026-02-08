import { NextRequest, NextResponse } from 'next/server'
import { uploadImageToBlob, generateSASToken } from '../../../lib/azure-storage'
import { cookies } from 'next/headers'
import { sql } from '../../../lib/db'

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('auth_session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify session
    const sessions = await sql(
      `SELECT user_id FROM sessions WHERE session_token = $1 AND expires_at > NOW()`,
      [sessionToken]
    )

    if (sessions.length === 0) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Azure Blob Storage
    const blobUrl = await uploadImageToBlob(file)

    // Generate SAS token for secure access
    const secureUrl = generateSASToken('images', fileName)

    return NextResponse.json(
      {
        url: blobUrl,
        secureUrl,
        fileName
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
