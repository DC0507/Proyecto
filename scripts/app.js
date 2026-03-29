import {supabase} from "../scripts/supabase.js";
import { crearProducto } from "../views/components/producto.js";

const productsContainer = document.querySelector(".products-container");

async function cargarProductos() {
  const { data: productos, error } = await supabase
    .from("productos")
    .select("*")
    .order("nombre", { ascending: true })
    .order("id_cat", { ascending: true })
    .limit(12);

  if (error) {
    console.error("Error al cargar productos:", error);
    return;
  }

  productos.forEach((producto) => {
    const productoElement = crearProducto(producto);
    productsContainer.appendChild(productoElement);
  });
}

cargarProductos();