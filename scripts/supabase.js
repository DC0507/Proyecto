// Descripcion: Configuracion y exportacion del cliente de Supabase.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Credenciales del proyecto en Supabase (URL + clave publica anon).
const supabaseUrl = 'https://mgtxiqhxpdkjhhbibjaz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ndHhpcWh4cGRramhoYmliamF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NTUxNDgsImV4cCI6MjA5MDAzMTE0OH0.9ztr7RM5PfyMPjrioo7sUNNtXjR53yRThuZe83L2ttg'
// Cliente reutilizable para consultas, auth y storage.
export const supabase = createClient(supabaseUrl, supabaseKey)
