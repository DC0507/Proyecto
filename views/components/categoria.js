export function crearCategoria(categoria) {
  const inViews = window.location.pathname.includes("/views/");
  const rootPrefix = inViews ? "../" : "";
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
  cardImg.src =
    `${rootPrefix}media/images/categories/${categoria.id}.gif` ||
    `${rootPrefix}media/images/categories/default-category.png`;
  link.dataset.catId = categoria.id;

  link.appendChild(cardImg);
  cardContainer.appendChild(link);

  const cardTitle = document.createElement("p");
  cardTitle.classList.add("category-name");
  cardTitle.innerHTML = `<b>${categoria.nombre.charAt(0).toUpperCase() + categoria.nombre.slice(1).toLowerCase()}</b>`;
  cardContainer.appendChild(cardTitle);

  return cardContainer;
}
