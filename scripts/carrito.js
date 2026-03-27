const contenedor = document.getElementById("contenedor-carrito");

// Obtener carrito
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Mostrar productos
carrito.forEach(producto => {
  const div = document.createElement("div");
  div.classList.add("product-card");

  div.innerHTML = `
    <p>${producto.nombre}</p>
    <p>Precio: ₡${producto.precio}</p>
    <p>Peso: ${producto.peso} kg</p>
  `;

  contenedor.appendChild(div);
});