import { supabase } from "./supabase.js";
import { createNavbar } from "../views/components/navbar.js";

function setPerfil(perfil) {
  document.getElementById("perfil-nombre").textContent = perfil?.nombre ?? "-";
  document.getElementById("perfil-apellido").textContent = perfil?.apellido ?? "-";
  document.getElementById("perfil-telefono").textContent = perfil?.telefono ?? "-";
  document.getElementById("perfil-correo").textContent = perfil?.correo ?? "-";
}

async function cargarPerfilActual() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("No se pudo obtener el usuario actual:", userError);
    setPerfil(null);
    return;
  }

  const { data: perfil, error: perfilError } = await supabase
    .from("perfiles")
    .select("nombre, apellido, telefono, correo")
    .eq("id", user.id)
    .maybeSingle();

  if (perfilError) {
    console.error("Error al cargar el perfil:", perfilError);
    setPerfil(null);
    return;
  }

  setPerfil(perfil);
}

document.addEventListener("DOMContentLoaded", async () => {
  await createNavbar();
  await cargarPerfilActual();
});
