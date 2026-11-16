/**
 * Supabase Database Adapter (PostgREST / Supabase API Integration)
 *
 * Connects the Motorcycle Repair Shop Management System to Supabase PostgreSQL
 * using SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY).
 * Falls back cleanly to in-memory stores during offline automated unit tests.
 */

const config = require('../config');

function isSupabaseConfigured() {
  return Boolean(config.supabaseUrl && config.supabaseKey);
}

function getSupabaseHeaders(extra = {}) {
  return {
    apikey: config.supabaseKey,
    Authorization: `Bearer ${config.supabaseKey}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
    ...extra,
  };
}

async function supabaseRestRequest(table, { method = 'GET', query = '', body = null } = {}) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const baseUrl = config.supabaseUrl.replace(/\/+$/, '');
  const url = `${baseUrl}/rest/v1/${table}${query ? `?${query}` : ''}`;

  const options = {
    method,
    headers: getSupabaseHeaders(),
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Supabase error (${response.status}): ${errText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

module.exports = {
  isSupabaseConfigured,
  getSupabaseHeaders,
  supabaseRestRequest,
};
