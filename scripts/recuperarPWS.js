// Descripcion: Logica para recuperar la contrasena del usuario.

// Importaciones necesarias
import { supabase } from "./supabase.js";
import { showAlert } from "./alerts.js";

const resetForm = document.getElementById("reset-password-form");

if (resetForm) {
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la pagina

    const email = document.getElementById("reset-email").value.trim();

    if (!email) {
      await showAlert("Por favor, ingresa tu correo electronico", { icon: "warning", title: "Campo incompleto" });
      return;
    }

    const projectBase = window.location.pathname.split("/views/")[0];
    // Redirige al formulario de nueva contrasena al abrir el enlace del correo.
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${projectBase}/views/actualizarPWS.html`,
    });

    if (error) {
      console.error("Error de Supabase:", error.status, error.message);
      await showAlert("Error al enviar el enlace: " + error.message, { icon: "error", title: "Error" });
    } else {
      await showAlert("Enlace de recuperacion enviado! Revisa tu correo electronico.", { icon: "success", title: "Listo" });
      window.location.href = "../index.html"; // Redirige al usuario a la pagina principal despues de enviar el enlace
    }
  });
}

