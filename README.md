# Romantic Apps Platform - Detailed Documentation

## Project Overview

The **Romantic Apps Platform** is a full-stack web application that enables users to create, customize, and share personalized romantic experiences using pre-built HTML templates. The platform is ideal for Valentine's Day proposals, romantic messages, anniversary celebrations, and other love-themed occasions.

## Core Functionality

### User Management & Authentication

- **Secure Registration & Login**: Complete authentication system with bcrypt password hashing
- **Session Management**: Token-based session handling with automatic expiry
- **Access Control**: Automatic session validation and logout on unauthorized access
- **User Profiles**: Full profile management capabilities for registered users

### Template System

The platform uses a powerful HTML-based template engine:

- **Dynamic Templates**: HTML templates with placeholder syntax (`{{placeholder}}`)
- **Multiple Themes**: Support for romantic proposals, Valentine's messages, and more
- **Custom Styling**: Each template includes custom CSS for unique styling
- **Interactive Elements**: JavaScript support for animations and user interactions
- **Flexible Fields**: Configurable customization fields including:
  - Text inputs
  - Textarea for longer content
  - Number fields
  - Date pickers
  - URL inputs
  - Image uploads
- **Public Gallery**: Browse and select from available templates

### App Creation & Editing

- **Visual Editor**: Intuitive interface for customizing template fields ([template-editor-new.tsx](components/editor/template-editor-new.tsx))
- **Real-time Preview**: Live iframe rendering to see changes instantly
- **Image Integration**: Seamless Azure Blob Storage integration for image uploads
- **Field Validation**: Built-in validation for all field types
- **Draft Mode**: Save work in progress before publishing
- **Secure Sharing**: Unique slug generation and passkey protection for each app

### Sharing & Access Control

- **Passkey Protection**: Every app is secured with a passkey for privacy
- **Shareable URLs**: Clean, shareable links with embedded authentication
- **Public Viewing**: Dedicated viewing endpoint at `/view-app/[id]`
- **Render API**: Server-side rendering endpoint for generating final HTML experiences
- **Privacy First**: Creators control who can access their romantic messages

### Analytics & Tracking

Comprehensive visitor tracking system for understanding engagement:

- **Visitor Information**: Captures name, email, and phone (optional)
- **Device Fingerprinting**: 
  - Operating system detection
  - Browser identification
  - Device type (mobile/tablet/desktop)
  - IP address logging
  - User agent string
- **View Statistics**: Track total views and unique visitors
- **Response Tracking**: Monitor visitor responses to apps
- **Analytics Dashboard**: Dedicated dashboard at `/dashboard/analytics/[id]`
- **Engagement Metrics**: Detailed insights into how recipients interact with apps

### Image Management

Robust image handling with Azure Blob Storage:

- **Secure Storage**: Images stored in Azure Blob containers
- **SAS Tokens**: Time-limited access using Shared Access Signatures
- **Upload Validation**: 
  - Maximum file size: 5MB
  - Supported formats: JPG, PNG, GIF, WEBP
- **Auto-provisioning**: Automatic container creation if needed
- **RESTful API**: Separate endpoints for upload and URL retrieval

## Technical Architecture

### Frontend Stack

- **Next.js 14+**: Modern React framework with App Router architecture
- **React + TypeScript**: Type-safe component development
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Radix UI**: Accessible, unstyled UI primitives including:
  - Dialog/Modal components
  - Form controls (Label, Input, Checkbox)
  - Navigation components
  - Dropdown menus
  - And 20+ other components
- **Custom Components**: Organized component library in `/components`:
  - Authentication forms ([login-form.tsx](components/auth/login-form.tsx), [register-form.tsx](components/auth/register-form.tsx))
  - Dashboard widgets ([app-card.tsx](components/dashboard/app-card.tsx))
  - Template editor ([template-editor-new.tsx](components/editor/template-editor-new.tsx))
  - App viewers ([app-viewer.tsx](components/viewer/app-viewer.tsx))
  - Reusable UI components

### Backend & API

- **Next.js API Routes**: Server-side API endpoints and rendering
- **RESTful Architecture**: Well-organized API structure under `/app/api`:
  - `/api/auth/*` - Authentication endpoints
  - `/api/apps/*` - App CRUD operations
  - `/api/templates/*` - Template management
  - `/api/analytics/*` - Analytics data
  - `/api/public/apps/*` - Public app access and logging
  - `/api/upload-image` - Image upload handling
  - `/api/get-image-url` - SAS URL generation
  - `/api/render/[id]` - HTML rendering
- **Database**: Neon PostgreSQL with serverless driver (@neondatabase/serverless)
- **Storage**: Azure Blob Storage SDK (@azure/storage-blob)
- **Security**:
  - bcryptjs for password hashing
  - crypto-js for additional encryption utilities
  - Session token validation
  - SAS token-based image access

### Database Schema

Robust PostgreSQL schema defined in [setup-db.sql](scripts/setup-db.sql):

#### Users Table
```sql
- id (UUID, primary key)
- email (unique)
- password_hash
- full_name
- created_at
- updated_at
```

#### Sessions Table
```sql
- id (UUID, primary key)
- user_id (foreign key to users)
- session_token (unique)
- expires_at
- created_at
```

#### Templates Table
```sql
- id (UUID, primary key)
- name
- description
- theme
- html_template (HTML with placeholders)
- css_template (custom CSS)
- js_template (JavaScript for interactions)
- thumbnail_url
- customization_fields (JSONB)
- is_public
- created_at
- updated_at
```

#### Apps Table
```sql
- id (UUID, primary key)
- creator_id (foreign key to users)
- template_id (foreign key to templates)
- title
- slug (unique)
- passkey
- customizations (JSONB)
- is_published
- created_at
- updated_at
```

#### App Responses Table
```sql
- id (UUID, primary key)
- app_id (foreign key to apps)
- visitor_id
- screen_index
- response_data (JSONB)
- created_at
```

#### App View Logs Table
```sql
- id (UUID, primary key)
- app_id (foreign key to apps)
- visitor_name
- visitor_email
- visitor_phone
- os
- browser
- device_type
- ip_address
- user_agent
- viewed_at
```

### File Structure

```
v-day/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── apps/                 # App management
│   │   ├── templates/            # Template operations
│   │   ├── analytics/            # Analytics data
│   │   ├── public/apps/          # Public app access & logging
│   │   ├── upload-image/         # Image upload
│   │   ├── get-image-url/        # SAS URL generation
│   │   └── render/               # HTML rendering
│   ├── dashboard/                # Dashboard pages
│   ├── editor/                   # Template editor pages
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── templates/                # Template selection
│   ├── view/                     # Private app viewing
│   ├── view-app/                 # Public app viewing
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── auth/                     # Authentication forms
│   ├── dashboard/                # Dashboard widgets
│   ├── editor/                   # Template editor
│   ├── icons/                    # Custom icon components
│   ├── templates/                # Template selector
│   ├── ui/                       # Reusable UI components
│   └── viewer/                   # App viewer components
├── lib/                          # Utility functions
│   ├── api-client.ts             # API client wrapper
│   ├── auth.ts                   # Authentication helpers
│   ├── azure-storage.ts          # Azure Blob Storage integration
│   ├── db.ts                     # Database connection
│   └── validation.ts             # Input validation
├── public/                       # Static assets
│   └── templates/                # Template assets
├── scripts/                      # Database scripts
│   ├── setup-db.sql              # Initial schema
│   ├── add-logs-table.sql        # Logs table migration
│   ├── seed-templates.sql        # Sample templates
│   └── migrate-analytics.ts      # Analytics migration
├── types/                        # TypeScript definitions
│   └── index.ts                  # Shared types
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
└── SETUP.md                      # Setup instructions
```

## Key Features

### 1. Template Customization Engine
Dynamic field rendering based on template configuration with support for all major input types.

### 2. Secure Image Uploads
Azure Blob Storage integration with SAS token protection for time-limited, secure image access.

### 3. Passkey Protection
Privacy-first sharing mechanism ensuring only intended recipients can view romantic messages.

### 4. Real-time Preview
Live iframe rendering allows creators to see exactly how their app will appear to recipients.

### 5. Analytics Dashboard
Detailed visitor tracking provides insights into who viewed the app, when, and from what device.

### 6. Responsive Design
Mobile-first design with Tailwind CSS ensures beautiful experiences on all devices.

### 7. Comprehensive Error Handling
Built-in validation and user-friendly error messages throughout the application.

## Deployment & Setup

### Prerequisites
- Node.js 18 or higher
- Neon PostgreSQL database account
- Azure Storage Account
- pnpm, npm, or yarn package manager

### Environment Variables

Create a `.env.local` file with the following:

```env
DATABASE_URL=your_neon_database_url
AZURE_STORAGE_ACCOUNT_NAME=your_storage_account
AZURE_STORAGE_ACCOUNT_KEY=your_storage_key
AZURE_STORAGE_CONTAINER_NAME=romantic-app-images
AZURE_STORAGE_SAS_EXPIRY_HOURS=24
```

### Installation Steps

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Setup Database**
   ```bash
   # Run migrations in order
   psql $DATABASE_URL -f scripts/setup-db.sql
   psql $DATABASE_URL -f scripts/add-logs-table.sql
   psql $DATABASE_URL -f scripts/seed-templates.sql
   ```

3. **Start Development Server**
   ```bash
   pnpm dev
   ```

4. **Access Application**
   Open [http://localhost:3000](http://localhost:3000)

### Database Migrations

All database scripts are available in the `/scripts` directory:
- `setup-db.sql` - Initial schema creation
- `add-logs-table.sql` - Analytics logging table
- `seed-templates.sql` - Sample template data

## Usage Workflows

### For Creators

1. **Register/Login**: Create an account or sign in
2. **Browse Templates**: Choose from pre-built romantic templates
3. **Customize**: Fill in personalized content and upload images
4. **Preview**: See real-time preview of the final result
5. **Publish**: Generate shareable link with passkey
6. **Share**: Send link to your loved one
7. **Track**: Monitor views and responses in analytics dashboard

### For Recipients

1. **Receive Link**: Get shareable URL from creator
2. **Enter Passkey**: Authenticate with provided passkey
3. **View Experience**: Enjoy personalized romantic app
4. **Respond**: Interact with any questions or prompts
5. **Captured**: View automatically logged for creator's analytics

## Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **Session Tokens**: Secure, time-limited session management
- **Passkey Protection**: Unique passkeys for each app
- **SAS Tokens**: Time-limited image access URLs
- **SQL Injection Protection**: Parameterized queries throughout
- **HTTPS Ready**: Designed for secure production deployment
- **Environment Isolation**: Sensitive credentials in environment variables

## Performance Optimizations

- **Serverless Architecture**: Neon serverless PostgreSQL for scalability
- **CDN-Ready**: Static assets optimizable for CDN delivery
- **Image Optimization**: Built-in Next.js image optimization
- **Code Splitting**: Automatic route-based code splitting
- **API Route Caching**: Cacheable API responses where appropriate

## Future Enhancement Opportunities

- Email notifications for app views
- More template themes and variations
- Video support alongside images
- Social sharing integrations
- Custom domain support for apps
- Template marketplace
- Collaborative editing
- Scheduled publishing
- Export to PDF/Video

## Support & Documentation

For detailed setup instructions, see [SETUP.md](SETUP.md)

For type definitions, refer to [types/index.ts](types/index.ts)

---

**Built with ❤️ for creating unforgettable romantic moments**
