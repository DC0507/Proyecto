import { supabase } from "../../scripts/supabase.js";

// Función para crear un elemento de producto
export function crearProducto(producto) {
  // Crear contenedor principal
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("product-card");

  // Imagen del producto
  const cardImg = document.createElement("img");
  cardImg.classList.add("product-img");
  cardImg.src =
    `../../media/images/products/${producto.id}.webp` ||
    "../../media/images/products/default-product.png"; // usa imagen por defecto si el producto no tiene

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

  // Botón agregar
  const btnAgregar = document.createElement("button");
  btnAgregar.classList.add("product-btn-add");
  btnAgregar.textContent = "+Agregar";
  btnAgregar.addEventListener("click", () => agregarAlCarrito(producto.id));

  // Botón favorito
  const btnFavorito = document.createElement("button");
  btnFavorito.classList.add("product-btn-favorite");
  btnFavorito.innerHTML = "&hearts;"; // icono de corazón
  btnFavorito.setAttribute("aria-label", "Agregar a favoritos");
  btnFavorito.addEventListener("click", () => toggleFavorito(producto.id, btnFavorito));

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

// Función para agregar un producto al carrito
async function agregarAlCarrito(productoId) {
  // Obtener el usuario actual
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Verificar si el usuario está autenticado
  if (authError || !user) {
    console.error("Authentication failed:", authError);
    alert("Debes iniciar sesión para agregar productos al carrito.");
    return;
  }

  const usuarioId = user.id;

  // Verificar si el producto ya está en el carrito
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

  if (existingItem) {// Si el producto ya está en el carrito, incrementar la cantidad
    const { error: updateError } = await supabase
      .from("carrito")
      .update({ cantidad: existingItem.cantidad + 1 })
      .eq("id", existingItem.id);

    if (updateError) {
      console.error("Error al actualizar el carrito:", updateError);
      return;
    }
  } else {// Si el producto no está en el carrito, agregarlo como nuevo item
    const { error: insertError } = await supabase
      .from("carrito")
      .insert({
        usuario_id: usuarioId,
        producto_id: productoId,
        cantidad: 1
      });

    if (insertError) {
      console.error("Error al agregar al carrito:", insertError);
      return;
    }
  }
}

// Función para agregar/remover un producto de favoritos
async function toggleFavorito(productoId, btnElement) {
  // Obtener el usuario actual
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Verificar si el usuario está autenticado
  if (authError || !user) {
    console.error("Authentication failed:", authError);
    alert("Debes iniciar sesión para agregar productos a favoritos.");
    return;
  }

  const usuarioId = user.id;

  // Verificar si el producto ya está en favoritos
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
    // Si el producto ya está en favoritos, eliminarlo
    const { error: deleteError } = await supabase
      .from("favoritos")
      .delete()
      .eq("id", existingFavorite.id);

    if (deleteError) {
      console.error("Error al eliminar de favoritos:", deleteError);
      return;
    }

    // Remover la tarjeta del producto del DOM
    const productCard = btnElement.closest(".product-card");
    if (productCard) {
      productCard.remove();
    }

    // Remover clase activa del botón
    btnElement.classList.remove("active");
  } else {
    // Si el producto no está en favoritos, agregarlo
    const { error: insertError } = await supabase
      .from("favoritos")
      .insert({
        usuario_id: usuarioId,
        producto_id: productoId
      });

    if (insertError) {
      console.error("Error al agregar a favoritos:", insertError);
      return;
    }

    // Agregar clase activa al botón
    btnElement.classList.add("active");
  }
}