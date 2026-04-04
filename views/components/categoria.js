export function crearCategoria(categoria) {
  // Crear contenedor principal
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("category-card");

  // Enlace a la categoría
  const link = document.createElement("a");
  link.dataset.catId = categoria.id;
  if (document.title != "Clonemart"){
  cardImg.src =
    link.href = `../views/categoria.html?catId=${categoria.id}`;
  } else {
    link.href = `./views/categoria.html?catId=${categoria.id}`;
  }
  
  // Imagen
  const cardImg = document.createElement("img");
  cardImg.classList.add("category-icon");
  if (document.title != "Clonemart"){
  cardImg.src =
    `../media/images/categories/${categoria.id}.gif` ||
    "../media/images/categories/default-category.png"; // usa imagen por defecto si la categoría no tiene
  } else {
    `./media/images/categories/${categoria.id}.gif` ||
    "./media/images/categories/default-category.png"; // usa imagen por defecto si la categoría no tiene
  }
  link.appendChild(cardImg);
  cardContainer.appendChild(link);

  const cardTitle = document.createElement("p");
  cardTitle.classList.add("category-name");
  cardTitle.innerHTML = `<b>${categoria.nombre.charAt(0).toUpperCase() + categoria.nombre.slice(1).toLowerCase()}</b>`;
  cardContainer.appendChild(cardTitle);

  return cardContainer;
}
