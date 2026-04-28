// Importamos la configuración de Supabase para conectar con la base de datos
import { supabase } from "./supabase.js";

const resetForm = document.getElementById("reset-password-form");

if (resetForm) {
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    const email = document.getElementById("reset-email").value.trim();

    if (!email) {
      alert("Por favor, ingresa tu correo electrónico");
      return;
    }

    const projectBase = window.location.pathname.split("/views/")[0];
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${projectBase}/views/actualizarPWS.html`,
    });

    if (error) {
      console.error("Error de Supabase:", error.status, error.message);
      alert("Error al enviar el enlace: " + error.message);
    } else {
      alert("¡Enlace de recuperación enviado! Revisa tu correo electrónico.");
      window.location.href = "../index.html";// Redirige al usuario a la página principal después de enviar el enlace
    }
  });
}
