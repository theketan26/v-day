# Romantic Apps Platform - Brief Documentation

## Project Summary

**Romantic Apps Platform** - A web application for creating and sharing personalized romantic experiences through customizable templates.

---

## What It Does (4 Key Points)

### 1. **Customizable Romantic Experiences**
Users create personalized romantic apps (proposals, Valentine's messages, anniversary notes) using beautiful pre-built HTML templates. Templates support customizable text, images, dates, and other fields, allowing creators to craft unique, heartfelt experiences for their loved ones.

### 2. **Secure Sharing & Privacy**
Each app is protected with a unique passkey and shared via a clean, shareable URL. This privacy-first approach ensures that intimate romantic messages remain private between creator and recipient. Only those with the correct passkey can access the app.

### 3. **Analytics & Engagement Tracking**
Comprehensive visitor logging captures every view with detailed information including visitor name, contact details, device type, operating system, browser, and IP address. Creators can see exactly when their loved one viewed the message through a dedicated analytics dashboard.

### 4. **Cloud-Powered Media Management**
Integrated Azure Blob Storage enables secure image uploads with automatic optimization and SAS token-protected access. Images are validated (max 5MB, JPG/PNG/GIF/WEBP formats), securely stored in the cloud, and served with time-limited access tokens for enhanced security.

---

## Tech Stack

### **Frontend Technologies**
- **Next.js 14** - React framework with App Router for modern web applications
- **React** - Component-based UI library
- **TypeScript** - Type-safe JavaScript for better developer experience
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Radix UI** - Accessible, unstyled UI component library (20+ components)

### **Backend Technologies**
- **Next.js API Routes** - Server-side API endpoints and rendering
- **Neon PostgreSQL** - Serverless PostgreSQL database (@neondatabase/serverless)
- **bcryptjs** - Secure password hashing and authentication
- **crypto-js** - Additional encryption utilities

### **Storage & Infrastructure**
- **Azure Blob Storage** - Cloud storage for images (@azure/storage-blob)
- **SAS Tokens** - Time-limited secure access to uploaded images

### **Development Tools**
- **pnpm** - Fast, disk-efficient package manager
- **ESLint** - Code linting and quality checks
- **PostCSS** - CSS processing and optimization

---

## Database Schema Overview

- **users** - User accounts with authentication
- **sessions** - Active user sessions with expiry
- **templates** - HTML/CSS/JS templates with customization schemas
- **apps** - User-created romantic apps with customizations (JSONB)
- **app_responses** - Visitor responses to app interactions
- **app_view_logs** - Detailed visitor tracking and analytics data

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Run database migrations
psql $DATABASE_URL -f scripts/setup-db.sql
psql $DATABASE_URL -f scripts/add-logs-table.sql

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Key Features

✅ Visual template editor with real-time preview  
✅ Secure passkey-protected sharing  
✅ Azure Blob Storage image uploads  
✅ Comprehensive visitor analytics  
✅ Mobile-responsive design  
✅ Session-based authentication  
✅ Customizable HTML/CSS/JS templates  
✅ RESTful API architecture  

---

## Project Structure

```
/app          - Next.js pages and API routes
/components   - Reusable React components
/lib          - Utility functions (auth, db, storage)
/types        - TypeScript type definitions
/public       - Static assets and templates
/scripts      - Database setup and migrations
```

---

**For detailed documentation, see [detailed-documentation.md](detailed-documentation.md)**
