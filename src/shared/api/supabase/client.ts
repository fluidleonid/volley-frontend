import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://vbkfuvncmlvmuaanulzy.supabase.co';

export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_P3G_S-CW-k_p_3euA1GrKg_Yt7Xo90w';

/**
 *Staging environment uses mock data and exposes the role switcher in Profile.
 *Production environment connects to Supabase with empty default state and Telegram Auth.
 */
export const IS_STAGING = import.meta.env.VITE_APP_ENV === 'staging';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
