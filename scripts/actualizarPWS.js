// Importamos la configuración de Supabase para conectar con la base de datos
import { supabase } from "./supabase.js";

const updatePasswordForm = document.getElementById("update-password-form");

if (updatePasswordForm) {
  updatePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById("new-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    if (!newPassword || !confirmPassword) {
      alert("Por favor, completa ambos campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Check if there's a valid session from the recovery link
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      alert("Enlace de recuperación inválido o expirado. Solicita uno nuevo.");
      window.location.href = "../views/recuperarPWS.html";
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error("Error updating password:", error);
      alert("Error al actualizar la contraseña: " + error.message);
    } else {
      alert("Contraseña actualizada exitosamente");
      window.location.href = "../index.html"; // Redirect to home
    }
  });
}

// Check for errors in URL (e.g., expired link)
const urlParams = new URLSearchParams(window.location.hash.substring(1));
if (urlParams.get('error')) {
  alert("Enlace de recuperación inválido o expirado. Solicita uno nuevo.");
  window.location.href = "../views/recuperarPWS.html";
}