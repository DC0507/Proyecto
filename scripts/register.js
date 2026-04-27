// Importamos la configuración de Supabase para conectar con la base de datos
import { supabase } from "./supabase.js";

const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    // Validación básica
    if (!name || !email || !password) {
      alert("Por favor, completa todos los campos");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          nombre: name,
        },
      },
    });

    if (error) {
      console.error("Error de Supabase:", error.status, error.message);
      alert(error.message);
    } else {
      alert("Usuario registrado con éxito!");
      window.location.href = `${window.location.origin}/index.html`; // Redirige al usuario a la página principal después de registrarse
    }
  });
}
