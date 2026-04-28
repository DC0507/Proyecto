import { supabase } from "/scripts/supabase.js";
import { crearProducto } from "/views/components/producto.js";
import { crearCategoria } from "/views/components/categoria.js";
import { createNavbar } from "/views/components/navbar.js";

// Contenedor de los productos
const productsContainer = document.querySelector(".products-container");
// Contenedor de las categorías
const categoriesContainer = document.querySelector(".categories-container");

//Función para cargar los productos desde Supabase
async function cargarProductos(catId) {
  let query = supabase
    .from("productos")
    .select("*")
    .eq("id_cat", catId)
    .order("nombre", { ascending: true });

  const { data: productos, error } = await query.limit(12);

  if (error) {
    console.error("Error al cargar productos:", error);
    return;
  }

  productos.forEach((producto) => {
    const productoElement = crearProducto(producto);
    productsContainer.appendChild(productoElement);
  });
}

//Función para cargar las categorías desde Supabase
async function cargarCategorias() {
  const { data: categorias, error } = await supabase
    .from("categorias")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error al cargar categorías:", error);
    return;
  }

  categorias.forEach((categoria) => {
    const categoriaElement = crearCategoria(categoria);
    categoriesContainer.appendChild(categoriaElement);
  });
}

//Llamada a la función para cargar los productos al iniciar la página
const urlParams = new URLSearchParams(window.location.search);
const catId = urlParams.get("catId");
cargarProductos(catId);

//Llamada a la función para cargar las categorías al iniciar la página
cargarCategorias();
createNavbar();