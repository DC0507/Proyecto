console.log("inicio");

console.log(input, lupa);

lupa.addEventListener("click", () => {
  console.log("CLICK FUNCIONA");

  const texto = input.value;
  console.log("Texto:", texto);
});

import { supabase } from "/scripts/supabase.js";

const input = document.getElementById("search");

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    buscar();
  }
});

const lupa = document.querySelector("img.search-icon");

lupa.addEventListener("click", () => {
  buscar();
});

function buscar() {
  const texto = input.value.trim();

  if (texto === "") return;

  // Redirige con parámetro en URL
  window.location.href = `resultados.html?q=${encodeURIComponent(texto)}`;
}

const supabase = createClient('https://eoeudoocwxyorctowwop.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZXVkb29jd3h5b3JjdG93d29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NzY4NDUsImV4cCI6MjA5MDE1Mjg0NX0.u2RgjXr0aCyDMgO3XCCATvFNwvuS768xMEpmh_1vcZ0');

const contenedor = document.getElementById("contenedor-resultados");

// Obtener lo que escribió el usuario
const params = new URLSearchParams(window.location.search);
const query = params.get("q");

async function cargarResultados() {
    if (!query) return;

  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .ilike("nombre", `%${query}%`); // búsqueda tipo "contiene"

  if (error) {
    console.error(error);
    return;
  }

  if (data.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron productos</p>";
    return;
  }

  data.forEach(producto => {
    const card = crearProducto(producto);
    contenedor.appendChild(card);
  });
}

cargarResultados();

// document.body.insertAdjacentHTML("afterbegin", `<h2>Resultados para: ${query}</h2>`);