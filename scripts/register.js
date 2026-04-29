// Descripcion: Logica de registro de nuevos usuarios.

// Importaciones necesarias
import { supabase } from "./supabase.js";
import { showAlert } from "./alerts.js";

const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la pagina

    const name = document.getElementById("register-name").value.trim();
    const lastname = document.getElementById("register-lastname").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const phone = document.getElementById("register-phone").value.trim();
    const password = document.getElementById("register-password").value.trim();

    // Validacion basica
    if (!name || !lastname || !email || !phone || !password) {
      await showAlert("Por favor, completa todos los campos", { icon: "warning", title: "Campos incompletos" });
      return;
    }

    // Crea el usuario en Supabase Auth.
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error de Supabase:", error.status, error.message);
      await showAlert(error.message, { icon: "error", title: "Error" });
    } else {
      // Insertar o actualizar en `perfiles` para guardar datos extendidos.
      const { user } = data;
      if (user) {
        const { error: profileError } = await supabase
          .from("perfiles")
          .upsert(
            [
              {
                id: user.id,
                nombre: name,
                apellido: lastname,
                correo: email,
                telefono: phone,
              },
            ],
            { onConflict: "id" },
          );

        if (profileError) {
          console.error("Error upserting profile:", profileError);
          await showAlert("Registro exitoso, pero error al guardar perfil: " + profileError.message, { icon: "warning", title: "Atencion" });
        } else {
          await showAlert("Usuario registrado con exito!", { icon: "success", title: "Registro exitoso" });
          window.location.href = `../index.html`; // Redirige al usuario a la pagina principal despues de registrarse
        }
      } else {
        await showAlert("Usuario registrado con exito!", { icon: "success", title: "Registro exitoso" });
        window.location.href = `../index.html`;
      }
    }
  });
}

