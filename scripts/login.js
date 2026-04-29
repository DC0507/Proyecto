// Importamos la configuracion de Supabase para conectar con la base de datos
import { supabase } from "./supabase.js";
import { createNavbar } from "../views/components/navbar.js";
import { showAlert } from "./alerts.js";

const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault(); // Evita que el formulario recargue la pagina

  const email = document.getElementById("client-email").value.trim();
  const password = document.getElementById("client-pws").value.trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    // Si sale "Invalid login credentials", revisa que no haya espacios en el input
    console.error("Error de Supabase:", error.status, error.message);
    await showAlert(error.message, { icon: "error", title: "Error" });
  } else {
    window.location.href = `../index.html`; // Redirige al usuario a la pagina principal despues de iniciar sesion
  }
});
createNavbar(); // Llama a la funcion para crear la barra de navegacion al cargar la pagina
