import { supabase } from "./supabase.js";

function renderCarrito(data) {
  const carritoContainer = document.querySelector(".carrito-container");

  const titleCarrito = document.createElement("h2");
  titleCarrito.textContent = "Carrito de Compras";
  carritoContainer.appendChild(titleCarrito);

  const carritoTable = document.createElement("table");
  const headerRow = document.createElement("tr");
  const headers = ["Producto", "Cantidad", "Precio Unitario", "Total"];

  headers.forEach((headerText) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });

  // Limpiar filas anteriores (mantener el header)
  const rows = carritoTable.querySelectorAll("tr:not(:first-child)");
  rows.forEach((row) => row.remove());

  carritoTable.appendChild(headerRow);
  // Llenar la tabla con los datos del carrito
  data.forEach((item) => {
    const row = document.createElement("tr");
    const totalItem = item.cantidad * item.precio_unitario;

    row.innerHTML = `
                    <td>${item.nombre || "Producto"}</td>
                    <td>${item.cantidad}</td>
                    <td>$${parseFloat(item.precio_unitario).toFixed(2)}</td>
                    <td>$${totalItem.toFixed(2)}</td>
                `;
    carritoTable.appendChild(row);
  });

  carritoContainer.appendChild(carritoTable);

  const pagarBtn = document.createElement('button');
  pagarBtn.textContent = 'Pagar';
  pagarBtn.className = 'btn-pagar';
  pagarBtn.addEventListener('click', () => {
    alert('Funcionalidad de pago no implementada aún');
    // Aquí puedes disparar el flujo de pago real (API, redirección, etc.)
  });
  carritoContainer.appendChild(pagarBtn);

  return carritoTable;
}

async function cargarCarrito() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error("Usuario no autenticado", authError);
    return;
  }
  
  const { data: carritoItems, error } = await supabase
    .from("carrito")
    .select("*")
    .eq("usuario_id", user.id);
  
  if (error) {
    console.error("Error al cargar el carrito:", error);
    return;
  }
  
  if (!carritoItems || carritoItems.length === 0) {
    renderCarrito([]);
    return;
  }
  
  // Obtener información completa de productos
  const productIds = carritoItems.map(item => item.producto_id);
  const { data: productos, error: productosError } = await supabase
    .from("productos")
    .select("*")
    .in("id", productIds);
  
  if (productosError) {
    console.error("Error al cargar productos:", productosError);
    return;
  }
  
  // Combinar datos del carrito con información de productos
  const carritoConProductos = carritoItems.map(carritoItem => {
    const producto = productos.find(p => p.id === carritoItem.producto_id);
    return {
      ...carritoItem,
      nombre: producto ? producto.nombre : "Producto no encontrado",
      precio_unitario: producto ? producto.precio : carritoItem.precio_unitario
    };
  });
  
  renderCarrito(carritoConProductos);
}

cargarCarrito();