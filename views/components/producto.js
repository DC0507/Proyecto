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
  btnAgregar.addEventListener("click", () => {
    console.log("Producto agregado:", producto);
    localStorage.setItem("carrito", JSON.stringify(carrito)); // conecta al carrito
  });

  // Botón favorito
  const btnFavorito = document.createElement("button");
  btnFavorito.classList.add("product-btn-favorite");
  btnFavorito.textContent = "Favorito";
  btnFavorito.addEventListener("click", () => {
    console.log("Producto marcado como favorito:", producto);
  });

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
