import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } from '@azure/storage-blob'

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)

export async function uploadImageToBlob(file: File): Promise<string> {
  const containerName = 'images'
  const containerClient = blobServiceClient.getContainerClient(containerName)

  // Create container without public access
  await containerClient.createIfNotExists()

  const blobName = `${Date.now()}-${file.name}`
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  const arrayBuffer = await file.arrayBuffer()
  await blockBlobClient.uploadData(arrayBuffer, {
    blobHTTPHeaders: {
      blobContentType: file.type,
    },
  })

  // Generate SAS URL that expires in 1 year
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse('r'), // read-only
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 365 * 24 * 60 * 60 * 1000),
    },
    sharedKeyCredential
  ).toString()

  return `${blockBlobClient.url}?${sasToken}`
}

export function generateSASToken(containerName: string, blobName: string): string {
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse('r'), // read-only
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 365 * 24 * 60 * 60 * 1000),
    },
    sharedKeyCredential
  ).toString()

  return sasToken
}

export function getBlobNameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathSegments = urlObj.pathname.split('/')
    return pathSegments.slice(2).join('/') // Skip container name
  } catch (error) {
    console.error('Invalid URL:', error)
    return null
  }
}