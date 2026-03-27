// Importamos la configuración de Supabase para conectar con la base de datos
import { supabase } from "./supabase.js";
async function checkAccess() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        window.location.href = '../views/login.html';
    }
}

checkAccess();
