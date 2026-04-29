import { supabase } from "./supabase.js";
import { crearProducto } from "../views/components/producto.js";
import { createNavbar } from "../views/components/navbar.js";
import { showAlert } from "./alerts.js";

// Funcion para cargar los productos favoritos del usuario
async function cargarProductosFavoritos() {
  // Obtener el usuario actual
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Verificar si el usuario esta autenticado
  if (authError || !user) {
    console.error("Authentication failed:", authError);
    await showAlert("Debes iniciar sesion para ver tus productos favoritos.", { icon: "warning", title: "Sesion requerida" });
    window.location.href = "login.html";
    return;
  }

  const usuarioId = user.id;

  try {
    // Obtener los favoritos del usuario con los detalles del producto
    const { data: favoritos, error: favoritosError } = await supabase
      .from("favoritos")
      .select("productos(id, nombre, precio, peso)")
      .eq("usuario_id", usuarioId);

    if (favoritosError) {
      console.error("Error al cargar favoritos:", favoritosError);
      await showAlert("Error al cargar tus productos favoritos.", { icon: "error", title: "Error" });
      return;
    }

    const productosContainer = document.querySelector(".products-container");
    productosContainer.innerHTML = ""; // Limpiar contenedor

    // Verificar si hay favoritos
    if (!favoritos || favoritos.length === 0) {
      productosContainer.innerHTML = "<p>No has agregado productos a favoritos.</p>";
      return;
    }

    // Crear y agregar cada producto al contenedor
    favoritos.forEach((favorito) => {
      if (favorito.productos) {
        const producto = favorito.productos;
        const productoElement = crearProducto(producto);
        productosContainer.appendChild(productoElement);
      }
    });
  } catch (error) {
    console.error("Error inesperado:", error);
    await showAlert("Error al cargar tus productos favoritos.", { icon: "error", title: "Error" });
  }
}

// Cargar productos cuando el DOM este listo
document.addEventListener("DOMContentLoaded", cargarProductosFavoritos);

// Escuchar cambios en los productos cuando se elimina un favorito
document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver(() => {
    const productosContainer = document.querySelector(".products-container");
    const productCards = productosContainer.querySelectorAll(".product-card");
  });

  observer.observe(document.querySelector(".products-container"), {
    childList: true,
    subtree: true,
  });
});

createNavbar();
