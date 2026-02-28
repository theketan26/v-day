import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } from '@azure/storage-blob'

let blobServiceClient: BlobServiceClient | null = null;
let sharedKeyCredential: StorageSharedKeyCredential | null = null;

function getClient() {
  if (!blobServiceClient || !sharedKeyCredential) {
    let accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
    let accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';

    if (connectionString) {
      blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

      // Auto-extract account name and key from connection string if missing/mismatched
      const nameMatch = connectionString.match(/AccountName=([^;]+)/);
      const keyMatch = connectionString.match(/AccountKey=([^;]+)/);

      if (nameMatch) accountName = nameMatch[1];
      if (keyMatch) accountKey = keyMatch[1];
    }

    if (accountName && accountKey) {
      sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    }
  }
  return { blobServiceClient, sharedKeyCredential };
}

export async function uploadImageToBlob(file: File): Promise<string> {
  const { blobServiceClient, sharedKeyCredential } = getClient();
  if (!blobServiceClient || !sharedKeyCredential) throw new Error("Azure storage not configured");

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
      startsOn: new Date(new Date().valueOf() - 5 * 60 * 1000), // 5 mins clock skew allowance
      expiresOn: new Date(new Date().valueOf() + 365 * 24 * 60 * 60 * 1000),
    },
    sharedKeyCredential
  ).toString()

  return `${blockBlobClient.url}?${sasToken}`
}

export function generateSASToken(containerName: string, blobName: string): string {
  const { sharedKeyCredential } = getClient();
  if (!sharedKeyCredential) throw new Error("Azure storage not configured");

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse('r'), // read-only
      startsOn: new Date(new Date().valueOf() - 5 * 60 * 1000), // 5 mins clock skew allowance
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