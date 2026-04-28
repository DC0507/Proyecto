import {supabase} from "./supabase.js";
import { crearProducto } from "../views/components/producto.js";
import { crearCategoria } from "../views/components/categoria.js";
import { createNavbar } from "../views/components/navbar.js";

// Inicializar la barra de navegación
await createNavbar();
// Contenedor de los productos
const productsContainer = document.querySelector(".products-container");
// Contenedor de las categorías
const categoriesContainer = document.querySelector(".categories-container");

//Función para cargar los productos desde Supabase
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
cargarProductos();

//Llamada a la función para cargar las categorías al iniciar la página
cargarCategorias();

// Función para manejar la búsqueda de productos ***************************************************************
const input = document.getElementById("search");
const sugerencias = document.getElementById("sugerencias");

let timeout = null;

input.addEventListener("input", () => {
  clearTimeout(timeout);

  const valor = input.value.trim();

  if (!valor) {
    sugerencias.classList.remove("active");
    sugerencias.innerHTML = "";
    return;
  }

  timeout = setTimeout(() => {
    buscarProductos(valor);
  }, 300);
});

async function buscarProductos(texto) {
  const { data, error } = await supabase
    .from("productos")
    .select("nombre")  
    .ilike("nombre", `%${texto}%`)
    .limit(5);

  if (error) {
    console.error("Error buscando:", error);
    return;
  }

  mostrarSugerencias(data);
}

function mostrarSugerencias(items) {
  sugerencias.innerHTML = "";

  if (!items.length) {
    sugerencias.classList.remove("active");
    return;
  }

  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.nombre;

    li.addEventListener("click", () => {
      input.value = item.nombre;
      sugerencias.classList.remove("active");
    });

    sugerencias.appendChild(li);
  });

  sugerencias.classList.add("active");
}
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-container")) {
    sugerencias.classList.remove("active");
  }
});
