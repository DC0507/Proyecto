
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://eoeudoocwxyorctowwop.supabase.co'
const supabaseKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZXVkb29jd3h5b3JjdG93d29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NzY4NDUsImV4cCI6MjA5MDE1Mjg0NX0.u2RgjXr0aCyDMgO3XCCATvFNwvuS768xMEpmh_1vcZ0
export const supabase = createClient(supabaseUrl, supabaseKey)