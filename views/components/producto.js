import { supabase } from "../../scripts/supabase.js";

export function crearProducto(producto) {
  // Crear contenedor principal
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("product-card");

  // Imagen
  const cardImg = document.createElement("img");
  cardImg.classList.add("product-img");
  cardImg.src =
    `../../media/images/products/${producto.id}.webp` ||
    "../../media/images/products/default-product.png"; // usa imagen por defecto si el producto no tiene

  // Contenedor de detalles
  const detalles = document.createElement("p");
  detalles.classList.add("product-details");

  // Nombre
  const nombre = document.createElement("span");
  nombre.classList.add("product-name");
  nombre.textContent = producto.nombre;

  // Precio
  const precio = document.createElement("span");
  precio.classList.add("product-price");
  precio.textContent = `Precio: ₡${producto.precio}`;

  // Peso
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
  btnFavorito.textContent = "+Favorito";

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

async function agregarAlCarrito(productoId) {
  // Obtener el usuario actual
  const { data: { user }, error: authError } = await supabase.auth.getUser();

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

  if (existingItem) {
    // Incrementar cantidad
    const { error: updateError } = await supabase
      .from("carrito")
      .update({ cantidad: existingItem.cantidad + 1 })
      .eq("id", existingItem.id);

    if (updateError) {
      console.error("Error al actualizar el carrito:", updateError);
      return;
    }
  } else {
    // Insertar nuevo item
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