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