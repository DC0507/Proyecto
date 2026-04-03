export function crearCategoria(categoria) {
  // Crear contenedor principal
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("category-card");

  // Enlace a la categoría
  const link = document.createElement("a");
  link.href = `../views/categoria.html?catId=${categoria.id}`;
  link.dataset.catId = categoria.id;
  
  // Imagen
  const cardImg = document.createElement("img");
  cardImg.classList.add("category-icon");
  cardImg.src =
    `../Proyecto/media/images/categories/${categoria.id}.gif` ||
    "../Proyecto/media/images/categories/default-category.png"; // usa imagen por defecto si la categoría no tiene

  link.appendChild(cardImg);
  cardContainer.appendChild(link);

  const cardTitle = document.createElement("p");
  cardTitle.classList.add("category-name");
  cardTitle.innerHTML = `<b>${categoria.nombre.charAt(0).toUpperCase() + categoria.nombre.slice(1).toLowerCase()}</b>`;
  cardContainer.appendChild(cardTitle);

  return cardContainer;
}
