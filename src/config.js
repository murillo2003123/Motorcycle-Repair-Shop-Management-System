/**
 * Week 11 Task 3 — Environment & Application Configuration (Supabase & Vercel)
 *
 * Reads configuration from environment variables with safe production defaults.
 * APP_DEBUG is off (false) by default in production so no stack traces leak.
 */

const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'production',
  appDebug: process.env.APP_DEBUG === 'true',
  shopName:
    process.env.SHOP_NAME || 'Murillo, Cabatingan & Dagala Motorcycle Repair Shop',
  defaultRole: process.env.DEFAULT_OWNER_ROLE || 'owner',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey:
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '',
};

module.exports = config;
