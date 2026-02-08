// Database entity types based on setup-db.sql

export interface User {
  id: string; // UUID
  email: string;
  password_hash: string;
  full_name?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Session {
  id: string; // UUID
  user_id: string; // UUID reference to users.id
  session_token: string;
  expires_at: Date | string;
  created_at: Date | string;
}

// Template customization field definition
export interface CustomizationField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'url' | 'image';
  default: string;
}

// Updated Template interface for HTML-based templates
export interface Template {
  id: string; // UUID
  name: string;
  description?: string;
  theme: string; // 'romantic', etc.
  html_template: string; // HTML template with {{placeholder}} syntax
  css_template?: string; // Custom CSS for this template
  js_template?: string; // JavaScript for animations and interactions
  thumbnail_url?: string; // Preview image
  customization_fields: CustomizationField[]; // Fields users can customize
  is_public: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface App {
  id: string; // UUID
  creator_id: string; // UUID reference to users.id
  template_id: string; // UUID reference to templates.id
  title: string;
  slug: string;
  passkey: string;
  customizations: any; // User's custom content (tags, images, music, etc.)
  is_published: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface AppResponse {
  id: string; // UUID
  app_id: string; // UUID reference to apps.id
  visitor_id?: string; // Anonymous or user ID
  screen_index?: number;
  response_data?: any; // Answers to questions, etc.
  created_at: Date | string;
}

// API Response types
export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthUser extends Omit<User, 'password_hash'> {
  // User without password hash for API responses
}

export interface AppWithTemplate extends App {
  template?: Template;
  creator?: AuthUser;
}

export interface AppStats {
  total_responses: number;
  unique_visitors: number;
}

export interface CreateAppRequest {
  template_id: string;
  title: string;
  customizations: any;
}

export interface UpdateAppRequest {
  title?: string;
  customizations?: any;
  is_published?: boolean;
}

export interface PublishAppRequest {
  is_published: boolean;
}

// Form validation types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  full_name?: string;
}

export interface AppCustomization {
  [key: string]: any;
}

// Template types
export interface TemplateScreen {
  id: string;
  type: string;
  content: any;
  order: number;
}

export interface TemplateTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    [key: string]: string;
  };
  animations?: {
    [key: string]: any;
  };
}