import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://mpfbesxxfkommozkyklh.supabase.co"

// ⚠️ TÄHÄN PITÄÄ OLLA SUPABASE "anon public key" (ei sb_publishable)
const supabaseKey = "sb_publishable_OEDj66z090rEiyugV3sBTQ_K7uJX1UJ"

export const supabase = createClient(supabaseUrl, supabaseKey)