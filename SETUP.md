# Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Azure Storage Account (for image uploads)
- Neon Database (PostgreSQL)

## Installation Steps

### 1. Install Dependencies

First, install the Node.js dependencies including the Azure Storage SDK:

```bash
npm install @azure/storage-blob
# or
pnpm add @azure/storage-blob
# or
yarn add @azure/storage-blob
```

### 2. Environment Configuration

Copy the `.env.example` file to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
- `DATABASE_URL` - Your Neon database connection string
- `AZURE_STORAGE_ACCOUNT_NAME` - Azure Storage account name
- `AZURE_STORAGE_ACCOUNT_KEY` - Azure Storage account key
- `AZURE_STORAGE_CONTAINER_NAME` - Container name (default: "romantic-app-images")
- `AZURE_STORAGE_SAS_EXPIRY_HOURS` - SAS token expiry in hours (default: 24)

### 3. Database Setup

Run the database setup scripts in order:

```bash
# 1. Create initial database schema
psql $DATABASE_URL -f scripts/setup-db.sql

# 2. Add logs table for tracking app views
psql $DATABASE_URL -f scripts/add-logs-table.sql

# 3. Seed template data (optional)
psql $DATABASE_URL -f scripts/seed-templates.sql
```

Or connect to your Neon database console and run each SQL file manually.

### 4. Azure Storage Container Setup

The application will automatically create the container if it doesn't exist, but you can also create it manually:

1. Go to Azure Portal
2. Navigate to your Storage Account
3. Go to "Containers"
4. Create a new container named "romantic-app-images"
5. Set access level to "Private"

### 5. Start Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Features

### Image Upload
- Upload images securely to Azure Blob Storage
- Images are protected with SAS tokens
- Automatic image optimization and validation
- Maximum file size: 5MB
- Supported formats: JPG, PNG, GIF, WEBP

### App View Logging
- Automatic logging of app views
- Captures visitor information (name, email, phone)
- Tracks device information (OS, browser, device type)
- Records IP address for analytics

### Session Management
- Automatic logout on unauthorized API responses
- Session token validation
- Secure cookie-based authentication

## Usage

### For Template Editors
When creating or editing templates, you can now use image fields:

1. In the template editor, add a customization field with type "image"
2. Users will see an image upload button instead of a text input
3. Uploaded images are stored in Azure Blob Storage
4. Images are rendered with secure SAS tokens

### For App Viewers
When accessing a protected app:

1. Enter your name (required)
2. Optionally provide email and phone number
3. Enter the passkey
4. Your access is logged for analytics

## Troubleshooting

### Azure Storage Errors
If you see "Azure Storage not configured" errors:
- Verify your Azure credentials in `.env.local`
- Ensure the storage account exists and is accessible
- Check that the account key is correct

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure all migration scripts have been run
- Check Neon dashboard for connection issues

### Image Upload Fails
- Check file size (max 5MB)
- Verify file type is supported
- Ensure Azure container exists and is accessible
- Check that your session is valid (logged in)
