// Descripcion: Componente para renderizar tarjetas de categorias.
import { supabase } from "../../scripts/supabase.js";

export function crearCategoria(categoria) {
  // Calcula la ruta del enlace segun la ubicacion actual de la vista.
  const inViews = window.location.pathname.includes("/views/");
  const viewPrefix = inViews ? "" : "views/";
  // Crear contenedor principal
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("category-card");

  // Imagen
  const cardImg = document.createElement("img");
  cardImg.classList.add("category-icon");

  // Enlace a la categoria
  const link = document.createElement("a");
  link.href = `${viewPrefix}categoria.html?catId=${categoria.id}`;
  const { data: categoryImageData } = supabase.storage
    .from("productos-images")
    .getPublicUrl(`categories/${categoria.id}.gif`);
  // Imagen por defecto si falla o no existe la imagen de categoria.
  const { data: defaultImageData } = supabase.storage
    .from("productos-images")
    .getPublicUrl("categories/default-category.png");
  cardImg.src = categoryImageData?.publicUrl || defaultImageData?.publicUrl;
  cardImg.onerror = () => {
    cardImg.src = defaultImageData?.publicUrl || "";
  };
  link.dataset.catId = categoria.id;

  link.appendChild(cardImg);
  cardContainer.appendChild(link);

  const cardTitle = document.createElement("p");
  cardTitle.classList.add("category-name");
  cardTitle.innerHTML = `<b>${categoria.nombre.charAt(0).toUpperCase() + categoria.nombre.slice(1).toLowerCase()}</b>`;
  cardContainer.appendChild(cardTitle);

  return cardContainer;
}

