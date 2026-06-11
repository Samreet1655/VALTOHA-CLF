// 📑 Puraani line badal kar ye sahi package name likho:
import { createClient } from "@supabase/supabase-js";

// Ye aapke project ki unique credentials hain jo cloud se link karti hain
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);