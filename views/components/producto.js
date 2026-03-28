export function crearProducto(producto) {
  
  // Crear contenedor principal
  const div = document.createElement("div");
  div.classList.add("product-card");

  // Imagen
  const img = document.createElement("img");
  img.classList.add("product-img");
  img.src = `../media/images/products/${producto.id}.webp` || "../media/images/products/default-product.webp"; // usa imagen por defecto si el producto no tiene 

  // Contenedor de detalles
  const detalles = document.createElement("p");
  detalles.classList.add("product-details");

  // ID
  const id = document.createElement("span");
  id.classList.add("product-id");
  id.textContent = `ID: ${producto.id}`;
  id.hidden = true; // no muestra el id en pantalla

  // Nombre
  const nombre = document.createElement("span");
  nombre.classList.add("product-name");
  nombre.textContent = producto.nombre;

  // Precio
  const precio = document.createElement("span");
  precio.classList.add("product-price");
  precio.textContent = `Precio: ₡${producto.precio}`;
  
  // Peso (es opcional por el momento)
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

  // Botón detalles
  const btnDetalles = document.createElement("button");
  btnDetalles.classList.add("product-btn-details");
  btnDetalles.textContent = "Detalles";
  btnDetalles.addEventListener("click", () => {
    console.log("Ver detalles de:", producto);
    // Aún falta mostrar una pantalla emergente con la información del producto
  });

  // Armar estructura
  detalles.appendChild(id)
  detalles.appendChild(nombre);
  detalles.appendChild(precio);
  detalles.appendChild(peso);

  div.appendChild(img);
  div.appendChild(detalles);
  div.appendChild(btnAgregar);
  div.appendChild(btnDetalles);

  return div;
}