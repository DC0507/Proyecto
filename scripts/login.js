// Descripcion: Logica de inicio de sesion de usuarios.

// Importaciones necesarias
import { supabase } from "./supabase.js";
import { createNavbar } from "../views/components/navbar.js";
import { showAlert } from "./alerts.js";

const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault(); // Evita que el formulario recargue la pagina

  const email = document.getElementById("client-email").value.trim();
  const password = document.getElementById("client-pws").value.trim();

  // Intenta autenticar con email/password en Supabase Auth.
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    // Maneja errores de autenticacion mostrando un mensaje al usuario.
    console.error("Error de Supabase:", error.status, error.message);
    await showAlert(error.message, { icon: "error", title: "Error" });
  } else {
    window.location.href = `../index.html`; // Redirige al usuario a la pagina principal despues de iniciar sesion
  }
});
createNavbar(); // Llama a la funcion para crear la barra de navegacion al cargar la pagina

