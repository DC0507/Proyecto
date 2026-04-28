import { supabase } from "./supabase.js";
import { createNavbar } from "../views/components/navbar.js";

let currentUser = null;

function setPerfil(perfil) {
  document.getElementById("perfil-nombre").textContent = perfil?.nombre ?? "-";
  document.getElementById("perfil-apellido").textContent = perfil?.apellido ?? "-";
  document.getElementById("perfil-telefono").textContent = perfil?.telefono ?? "-";
  document.getElementById("perfil-correo").textContent = perfil?.correo ?? "-";
}

function setInputs(perfil) {
  document.getElementById("input-telefono").value = perfil?.telefono ?? "";
  document.getElementById("input-correo").value = perfil?.correo ?? "";
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

  currentUser = user;

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
  setInputs(perfil);
}

async function guardarCambiosContacto(event) {
  event.preventDefault();

  if (!currentUser) {
    alert("No hay una sesion activa.");
    return;
  }

  const telefono = document.getElementById("input-telefono").value.trim();
  const correo = document.getElementById("input-correo").value.trim();
  const saveBtn = document.getElementById("perfil-guardar-btn");

  if (!correo) {
    alert("El correo no puede estar vacio.");
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = "Guardando...";

  try {
    // Actualiza correo en Auth para mantener la sesion/usuario sincronizados.
    const { error: authUpdateError } = await supabase.auth.updateUser({
      email: correo,
    });

    if (authUpdateError) {
      throw authUpdateError;
    }

    // Actualiza contacto en la tabla perfiles.
    const { error: perfilUpdateError } = await supabase
      .from("perfiles")
      .update({
        telefono,
        correo,
      })
      .eq("id", currentUser.id);

    if (perfilUpdateError) {
      throw perfilUpdateError;
    }

    await cargarPerfilActual();
    alert("Informacion actualizada correctamente.");
  } catch (error) {
    console.error("Error al guardar cambios:", error);
    alert(`No se pudo actualizar la informacion: ${error.message}`);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Guardar cambios";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await createNavbar();
  await cargarPerfilActual();
  document
    .getElementById("perfil-form")
    .addEventListener("submit", guardarCambiosContacto);
});
