import { NextRequest, NextResponse } from 'next/server'
import { generateSASToken, getBlobNameFromUrl } from '../../../lib/azure-storage'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { imageUrl } = body

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Extract blob name from URL
    const blobName = getBlobNameFromUrl(imageUrl)
    
    if (!blobName) {
      return NextResponse.json(
        { error: 'Invalid image URL' },
        { status: 400 }
      )
    }

    // Generate SAS token
    const secureUrl = generateSASToken('images', blobName)

    return NextResponse.json(
      { secureUrl },
      { status: 200 }
    )
  } catch (error) {
    console.error('SAS token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate SAS token' },
      { status: 500 }
    )
  }
}
