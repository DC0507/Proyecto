import { supabase } from "./supabase.js";
import { crearProducto } from "../views/components/producto.js";

// contenedor 
const contenedor = document.getElementById("contenedor-productos");

// función para cargar los productos
async function cargarProductos() {
    const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("nombre", { ascending: false })
    .limit(15);
    // .range(0, 14); (es lo mismo que .limit)

    if (error) {
        console.error("Error cargando los productos", error);
        return;
    }
    
    // mostrar los productos
    data.forEach(producto => {
        const card = crearProducto(producto);
        contenedor.appendChild(card);
    });
}
    
// ejecutarlo
cargarProductos();

// *****************************************************************

const input = document.getElementById("search");
const lista = document.getElementById("sugerencias");

// Guarda nombres de los productos
let sugerencias = [];

// Carga los datos y activa el autocompletado
async function iniciar() {
  const { data, error } = await supabase
    .from("productos")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  // Mostrar datos obtenidos
  console.log("Datos:", data);

  // Guarda únicamente el nombre de cada producto en el arreglo sugerencias
  sugerencias = data.map(p => p.nombre);

  input.addEventListener("input", () => {
    const texto = input.value.toLowerCase();

    // Limpia la lista
    lista.innerHTML = "";

    // Input vacío, no mostrar nada
    if (texto === "") return;

    // Filtrar los nombres que incluyan el texto escrito por el usuario
    const filtrados = sugerencias.filter(nombre =>
      nombre.toLowerCase().includes(texto)
    );

    // Mostrar solo las primeras 5 coincidencias
    filtrados.slice(0, 5).forEach(nombre => {
        
      // Crear un elemento de lista por cada sugerencia
      const li = document.createElement("li");
      li.textContent = nombre;

      // Al hacer clic en una sugerencia, colocarla en el input y limpiar la lista
      li.addEventListener("click", () => {
        input.value = nombre;
        lista.innerHTML = "";
      });

      // Agregar la sugerencia a la lista visible en pantalla
      lista.appendChild(li);

    });
  });
}

iniciar();