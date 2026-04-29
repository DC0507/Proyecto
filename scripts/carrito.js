// Descripcion: Logica para gestionar el carrito de compras.

// Importaciones necesarias
import { supabase } from "./supabase.js";
import { createNavbar } from "../views/components/navbar.js";
import { showAlert } from "./alerts.js";

function eliminarItem(id) {
  // Elimina el item y vuelve a consultar para refrescar totales/tabla.
  supabase
    .from("carrito")
    .delete()
    .eq("id", id)
    .then(({ error }) => {
      if (error) {
        console.error("Error al eliminar el item del carrito:", error);
      } else {
        console.log("Item eliminado del carrito");
        cargarCarrito(); // Recargar el carrito para reflejar los cambios
      }
    });
}

function actualizarCantidad(id, nuevaCantidad) {
  // Persiste la nueva cantidad y refresca la vista.
  supabase
    .from("carrito")
    .update({ cantidad: nuevaCantidad })
    .eq("id", id)
    .then(({ error }) => {
      if (error) {
        console.error("Error al actualizar la cantidad del item en el carrito:", error);
      } else {
        console.log("Cantidad actualizada en el carrito");
        cargarCarrito(); // Recargar el carrito para reflejar los cambios
      }
    });
}

// Hacer la funcion accesible globalmente
window.eliminarItem = eliminarItem;
window.actualizarCantidad = actualizarCantidad;

function renderCarrito(data = []) {
  // Renderiza el carrito con los datos proporcionados. Si no hay datos, muestra mensaje de carrito vacío.
  const carritoContainer = document.querySelector(".carrito-container");

  // Limpiar el contenedor antes de renderizar
  carritoContainer.innerHTML = "";

  // Si no hay items, mostrar mensaje de carrito vacío.
  if (data.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Tu carrito está vacío.";
    carritoContainer.appendChild(emptyMessage);
    return;
  }

  const titleCarrito = document.createElement("h2");
  titleCarrito.textContent = "Carrito de Compras";
  carritoContainer.appendChild(titleCarrito);

  const carritoTable = document.createElement("table");
  const headerRow = document.createElement("tr");
  const headers = ["Producto", "Cantidad", "Precio Unitario", "Total", "Acciones"];

  headers.forEach((headerText) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });

  // Limpiar filas anteriores (mantener solo encabezados).
  const rows = carritoTable.querySelectorAll("tr:not(:first-child)");
  rows.forEach((row) => row.remove());

  carritoTable.appendChild(headerRow);
  // Llenar la tabla con los datos del carrito
  data.forEach((item) => {
    const row = document.createElement("tr");
    const totalItem = item.cantidad * item.precio_unitario;

    row.innerHTML = `
                    <td>${item.nombre}</td>
                    <td>
                      <input type="number" value="${item.cantidad}" min="1" onchange="actualizarCantidad(${item.id}, this.value)">
                    </td>
                    <td>₡${parseFloat(item.precio_unitario).toFixed(2)}</td>
                    <td>₡${totalItem.toFixed(2)}</td>
                    <td><button class="btn-eliminar" data-id="${item.id}" onclick="eliminarItem(${item.id})">&times;</button></td>
                `;
    carritoTable.appendChild(row);
  });

  carritoContainer.appendChild(carritoTable);

  const pagarBtn = document.createElement("button");
  pagarBtn.textContent = "Pagar";
  pagarBtn.className = "btn-pagar";
  pagarBtn.addEventListener("click", async () => {
    await showAlert("Funcionalidad de pago no implementada aun", { icon: "info", title: "Proximamente" });
    // Aqui puedes disparar el flujo de pago real (API, redireccion, etc.)
  });
  carritoContainer.appendChild(pagarBtn);

  return carritoTable;
}

async function cargarCarrito() {
  // Carga los items del carrito para el usuario autenticado y los renderiza.

  // Verificar autenticacion y obtener el usuario actual.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Usuario no autenticado", authError);
    return;
  }

  // Consultar items del carrito para el usuario actual.
  const { data: carritoItems, error } = await supabase.from("carrito").select("*").eq("usuario_id", user.id);

  if (error) {
    console.error("Error al cargar el carrito:", error);
    return;
  }

  if (!carritoItems || carritoItems.length === 0) {
    renderCarrito([]);

    return;
  }

  // Obtener informacion completa de productos
  const productIds = carritoItems.map((item) => item.producto_id);
  const { data: productos, error: productosError } = await supabase.from("productos").select("*").in("id", productIds);

  if (productosError) {
    console.error("Error al cargar productos:", productosError);
    return;
  }

  // Mezcla items del carrito con datos de producto para render final.
  const carritoConProductos = carritoItems.map((carritoItem) => {
    const producto = productos.find((p) => p.id === carritoItem.producto_id);
    return {
      ...carritoItem,
      nombre: producto ? producto.nombre : "Producto no encontrado",
      precio_unitario: producto ? producto.precio : carritoItem.precio_unitario,
    };
  });

  renderCarrito(carritoConProductos);
}

createNavbar();
cargarCarrito();

