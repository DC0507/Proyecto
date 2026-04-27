// Importamos la configuración de Supabase para conectar con la base de datos
import { supabase } from "./supabase.js";
import { createNavbar } from "../views/components/navbar.js";

const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault(); // Evita que el formulario recargue la página

  const email = document.getElementById("client-email").value.trim();
  const password = document.getElementById("client-pws").value.trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    // Si sale "Invalid login credentials", revisa que no haya espacios en el input
    console.error("Error de Supabase:", error.status, error.message);
    alert(error.message);
  } else {
    window.location.href = `/Proyecto/index.html`; // Redirige al usuario a la página principal después de iniciar sesión
  }
});
createNavbar(); // Llama a la función para crear la barra de navegación al cargar la página