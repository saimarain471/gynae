import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://skvqevuimiqdapcpufin.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrdnFldnVpbWlxZGFwY3B1ZmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NTIwOTMsImV4cCI6MjA5ODEyODA5M30.VL4K1BGTd6d-O29OOL6-pUoyYqmoXZamgVMANGC2dLA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})
