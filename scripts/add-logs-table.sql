-- App View Logs table
CREATE TABLE IF NOT EXISTS app_view_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  visitor_name VARCHAR(255) NOT NULL,
  visitor_email VARCHAR(255),
  visitor_phone VARCHAR(50),
  os VARCHAR(100),
  browser VARCHAR(100),
  device_type VARCHAR(50), -- 'mobile', 'tablet', 'desktop'
  ip_address VARCHAR(45), -- IPv4 or IPv6
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX idx_app_view_logs_app_id ON app_view_logs(app_id);
CREATE INDEX idx_app_view_logs_created_at ON app_view_logs(created_at);
