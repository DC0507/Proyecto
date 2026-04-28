// Importamos la configuración de Supabase para conectar con la base de datos
import { supabase } from "/scripts/supabase.js";

const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    const name = document.getElementById("register-name").value.trim();
    const lastname = document.getElementById("register-lastname").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const phone = document.getElementById("register-phone").value.trim();
    const password = document.getElementById("register-password").value.trim();

    // Validación básica
    if (!name || !lastname || !email || !phone || !password) {
      alert("Por favor, completa todos los campos");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error de Supabase:", error.status, error.message);
      alert(error.message);
    } else {
      // Insertar o actualizar en perfiles
      const { user } = data;
      if (user) {
        const { error: profileError } = await supabase
          .from('perfiles')
          .upsert([
            {
              id: user.id,
              nombre: name,
              apellido: lastname,
              correo: email,
              telefono: phone,
            }
          ], { onConflict: 'id' });

        if (profileError) {
          console.error("Error upserting profile:", profileError);
          alert("Registro exitoso, pero error al guardar perfil: " + profileError.message);
        } else {
          alert("Usuario registrado con éxito!");
          window.location.href = `/`; // Redirige al usuario a la página principal después de registrarse
        }
      } else {
        alert("Usuario registrado con éxito!");
        window.location.href = `/`;
      }
    }
  });
}
