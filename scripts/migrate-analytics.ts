import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log('Creating analytics_logs table...');
  await sql`
    CREATE TABLE IF NOT EXISTS analytics_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
      session_id VARCHAR(255) NOT NULL,
      event_type VARCHAR(100) NOT NULL,
      event_data JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('Creating indexes...');
  await sql`CREATE INDEX IF NOT EXISTS idx_analytics_logs_app_id ON analytics_logs(app_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_analytics_logs_session_id ON analytics_logs(session_id);`;
  console.log('Done!');
}

main().catch(console.error);
