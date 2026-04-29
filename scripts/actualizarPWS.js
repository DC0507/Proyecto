// Descripcion: Logica para actualizar la contraseña del usuario autenticado.

// Importamos la configuracion de Supabase para conectar con la base de datos
import { supabase } from "./supabase.js";

// Importamos la funcion para mostrar alertas personalizadas
import { showAlert } from "./alerts.js";

const updatePasswordForm = document.getElementById("update-password-form");

async function handleInvalidRecoveryLink() {
  // Muestra aviso y regresa al flujo de recuperacion si el enlace no sirve.
  await showAlert("Enlace de recuperacion invalido o expirado. Solicita uno nuevo.", { icon: "error", title: "Enlace invalido" });
  window.location.href = "recuperarPWS.html";
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById("new-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    if (!newPassword || !confirmPassword) {
      await showAlert("Por favor, completa ambos campos", { icon: "warning", title: "Campos incompletos" });
      return;
    }

    if (newPassword !== confirmPassword) {
      await showAlert("Las contraseñas no coinciden", { icon: "warning", title: "Validacion" });
      return;
    }

    if (newPassword.length < 6) {
      await showAlert("La contraseña debe tener al menos 6 caracteres", { icon: "warning", title: "Validacion" });
      return;
    }

    // Verifica que exista sesion temporal creada por el enlace de recuperacion.
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      await handleInvalidRecoveryLink();
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Error updating password:", error);
      await showAlert("Error al actualizar la contraseña: " + error.message, { icon: "error", title: "Error" });
    } else {
      await showAlert("Contraseña actualizada exitosamente", { icon: "success", title: "Listo" });
      window.location.href = "../index.html"; // Redirect to home
    }
  });
}

// Revisa si hay errores en la URL (e.g., enlace expirado)
const urlParams = new URLSearchParams(window.location.hash.substring(1));
if (urlParams.get("error")) {
  handleInvalidRecoveryLink();
}

