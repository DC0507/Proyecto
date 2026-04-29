// Descripcion: Componente para renderizar productos y gestionar acciones de carrito/favoritos.
import { supabase } from "../../scripts/supabase.js";
import { redirectToLogin } from "../../scripts/auth.js";
import { showAlert } from "../../scripts/alerts.js";

// Funcion para crear un elemento de producto
export function crearProducto(producto) {
  // Crear contenedor principal
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("product-card");

  // Imagen del producto
  const cardImg = document.createElement("img");
  cardImg.classList.add("product-img");
  const { data: productImageData } = supabase.storage
    .from("productos-images")
    .getPublicUrl(`products/${producto.id}.webp`);
  const { data: defaultImageData } = supabase.storage
    .from("productos-images")
    .getPublicUrl("products/default-product.webp");
  cardImg.src = productImageData?.publicUrl || defaultImageData?.publicUrl;
  cardImg.onerror = () => {
    cardImg.src = defaultImageData?.publicUrl || "";
  };
  cardImg.alt = producto.nombre;

  // Contenedor de detalles del producto
  const detalles = document.createElement("p");
  detalles.classList.add("product-details");

  // Nombre del producto
  const nombre = document.createElement("span");
  nombre.classList.add("product-name");
  nombre.textContent = producto.nombre;

  // Precio del producto
  const precio = document.createElement("span");
  precio.classList.add("product-price");
  precio.textContent = `Precio: ₡${producto.precio}`;

  // Peso del producto
  const peso = document.createElement("span");
  peso.classList.add("product-weight");
  peso.textContent = `Peso: ${producto.peso} kg`;

  // Boton agregar
  const btnAgregar = document.createElement("button");
  btnAgregar.classList.add("product-btn-add");
  btnAgregar.textContent = "+Agregar";
  btnAgregar.addEventListener("click", () => agregarAlCarrito(producto.id));

  // Boton favorito
  const btnFavorito = document.createElement("button");
  btnFavorito.classList.add("product-btn-favorite");
  setFavoritoVisualState(btnFavorito, false);
  btnFavorito.setAttribute("aria-label", "Agregar a favoritos");
  btnFavorito.addEventListener("click", () => toggleFavorito(producto.id, btnFavorito));
  inicializarEstadoFavorito(producto.id, btnFavorito);

  // Armar estructura
  detalles.appendChild(nombre);
  detalles.appendChild(precio);
  detalles.appendChild(peso);

  cardContainer.appendChild(cardImg);
  cardContainer.appendChild(detalles);
  cardContainer.appendChild(btnAgregar);
  cardContainer.appendChild(btnFavorito);

  return cardContainer;
}

function setFavoritoVisualState(btnElement, esFavorito) {
  // Cambia icono, clase y etiqueta accesible segun el estado favorito.
  btnElement.textContent = esFavorito ? "♥" : "♡";
  btnElement.classList.toggle("active", esFavorito);
  btnElement.setAttribute("aria-label", esFavorito ? "Quitar de favoritos" : "Agregar a favoritos");
}

async function inicializarEstadoFavorito(productoId, btnElement) {
  // Consulta estado inicial para pintar el corazon correctamente al render.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    setFavoritoVisualState(btnElement, false);
    return;
  }

  const { data: existingFavorite, error: selectError } = await supabase
    .from("favoritos")
    .select("id")
    .eq("usuario_id", user.id)
    .eq("producto_id", productoId)
    .maybeSingle();

  if (selectError) {
    console.error("Error al inicializar favoritos:", selectError);
    return;
  }

  setFavoritoVisualState(btnElement, Boolean(existingFavorite));
}

// Funcion para agregar un producto al carrito
async function agregarAlCarrito(productoId) {
  // Obtener el usuario actual
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Verificar si el usuario esta autenticado
  if (authError || !user) {
    console.error("Authentication failed:", authError);
    await showAlert("Debes iniciar sesion para agregar productos al carrito.", { icon: "warning", title: "Sesion requerida" });
    redirectToLogin();
    return;
  }

  const usuarioId = user.id;

  // Verificar si el producto ya esta en el carrito
  const { data: existingItem, error: selectError } = await supabase
    .from("carrito")
    .select("id, cantidad")
    .eq("usuario_id", usuarioId)
    .eq("producto_id", productoId)
    .maybeSingle();

  if (selectError) {
    console.error("Error al verificar el carrito:", selectError);
    return;
  }

  if (existingItem) {
    // Si el producto ya esta en el carrito, incrementar la cantidad
    const { error: updateError } = await supabase
      .from("carrito")
      .update({ cantidad: existingItem.cantidad + 1 })
      .eq("id", existingItem.id);

    if (updateError) {
      console.error("Error al actualizar el carrito:", updateError);
      return;
    }
  } else {
    // Si el producto no esta en el carrito, agregarlo como nuevo item
    const { error: insertError } = await supabase.from("carrito").insert({
      usuario_id: usuarioId,
      producto_id: productoId,
      cantidad: 1,
    });

    if (insertError) {
      console.error("Error al agregar al carrito:", insertError);
      return;
    }
  }
}

// Funcion para agregar/remover un producto de favoritos
async function toggleFavorito(productoId, btnElement) {
  // Obtener el usuario actual
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Verificar si el usuario esta autenticado
  if (authError || !user) {
    console.error("Authentication failed:", authError);
    await showAlert("Debes iniciar sesion para agregar productos a favoritos.", { icon: "warning", title: "Sesion requerida" });
    redirectToLogin();
    return;
  }

  const usuarioId = user.id;

  // Verificar si el producto ya esta en favoritos
  const { data: existingFavorite, error: selectError } = await supabase
    .from("favoritos")
    .select("id")
    .eq("usuario_id", usuarioId)
    .eq("producto_id", productoId)
    .maybeSingle();

  if (selectError) {
    console.error("Error al verificar favoritos:", selectError);
    return;
  }

  if (existingFavorite) {
    // Si el producto ya esta en favoritos, eliminarlo
    const { error: deleteError } = await supabase.from("favoritos").delete().eq("id", existingFavorite.id);

    if (deleteError) {
      console.error("Error al eliminar de favoritos:", deleteError);
      return;
    }

    // Remover la tarjeta del producto del DOM
    const productCard = btnElement.closest(".product-card");
    if (productCard) {
      productCard.remove();
    }

    setFavoritoVisualState(btnElement, false);
  } else {
    // Si el producto no esta en favoritos, agregarlo
    const { error: insertError } = await supabase.from("favoritos").insert({
      usuario_id: usuarioId,
      producto_id: productoId,
    });

    if (insertError) {
      console.error("Error al agregar a favoritos:", insertError);
      return;
    }

    setFavoritoVisualState(btnElement, true);
  }
}

