import { createClient } from "@supabase/supabase-js"
/*

EXPO_PUBLIC_SUPABASE_URL=https://mpfbesxxfkommozkyklh.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_OEDj66z090rEiyugV3sBTQ_K7uJX1UJ
*/
const supabaseUrl = "https://mpfbesxxfkommozkyklh.supabase.co"
const supabaseKey = "sb_publishable_OEDj66z090rEiyugV3sBTQ_K7uJX1UJ"

export const supabase = createClient(supabaseUrl, supabaseKey)