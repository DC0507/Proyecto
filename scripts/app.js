// Descripcion: Logica principal de la pagina de inicio y carga de productos.

// Importaciones de módulos y componentes
import { supabase } from "./supabase.js";
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

// Función para manejar la búsqueda de productos con autocompletado
const input = document.getElementById("search");
const sugerencias = document.getElementById("sugerencias");

let timeout = null;

input.addEventListener("input", () => {
  // Debounce basico para no consultar en cada tecla instantaneamente.
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
  // Consulta ligera: solo nombres para autocompletado.
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
  // Reinicia lista antes de pintar nuevas sugerencias.
  sugerencias.innerHTML = "";

  if (!items.length) {
    sugerencias.classList.remove("active");
    return;
  }

  items.forEach((item) => {
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
  // Cierra el dropdown cuando el click ocurre fuera del buscador.
  if (!e.target.closest(".search-container")) {
    sugerencias.classList.remove("active");
  }
});

//Carrusel de anuncios
const carruselContainer = document.querySelector("#carouselExampleAutoplaying");

// Obtiene URL publica del logo alojado en el bucket.
const { data: anuncio1 } = supabase.storage
  .from("productos-images")
  .getPublicUrl("anuncios/anuncio1.png");

const { data: anuncio2 } = supabase.storage
  .from("productos-images")
  .getPublicUrl("anuncios/anuncio2.png");

  const { data: anuncio3 } = supabase.storage
  .from("productos-images")
  .getPublicUrl("anuncios/anuncio3.png");
carruselContainer.innerHTML = `
<div class="carousel-inner">
        <div class="carousel-item active">
          <img src="${anuncio1.publicUrl}" class="d-block w-100" alt="..." />
        </div>
        <div class="carousel-item">
          <img src="${anuncio2.publicUrl}" class="d-block w-100" alt="..." />
        </div>
        <div class="carousel-item">
          <img src="${anuncio3.publicUrl}" class="d-block w-100" alt="..." />
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>`;

