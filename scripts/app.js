import { supabase } from "./supabase.js";
import { setupAddToCartButtons } from "./carrito.js";

const productContainer = document.querySelector(".products-carousel");
const AUTO_SLIDE_MS = 4000;

async function fetchProducts() {
  const { data: products, error } = await supabase
    .from("productos")
    .select("*")
    .order("id_cat", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  const categoryCounts = new Map();

  return (products || []).filter((product) => {
    const categoryId = product.id_cat;
    const currentCount = categoryCounts.get(categoryId) || 0;

    if (currentCount >= 2) {
      return false;
    }

    categoryCounts.set(categoryId, currentCount + 1);
    return true;
  });
}

function renderProducts(products) {
  if (!productContainer) return;

  productContainer.innerHTML = `
    <div class="products-carousel-viewport">
      <div class="products-carousel-track"></div>
    </div>
    <div class="products-carousel-dots" aria-label="Paginacion de productos"></div>
  `;

  const track = productContainer.querySelector(".products-carousel-track");

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.dataset.productId = product.id;

    const imageSrc = `./media/images/products/${product.id}.webp`;

    card.innerHTML = `
      <img
        class="product-img"
        src="${imageSrc}"
        alt="${product.nombre || "Producto"}"
        onerror="this.onerror=null; this.src='./media/images/products/default-product.webp';"
      />
      <p class="product-details">
        <span class="product-name">${product.nombre || "Producto sin nombre"}</span>
        <span class="product-price">Precio: ₡${product.precio || "0"}</span>
      </p>
      <button class="product-btn-add">+Agregar</button>
      <button class="product-btn-details">+Favorito</button>
    `;

    track.appendChild(card);
  });
  setupAddToCartButtons();
  setupCarousel();
}

function getCardsPerView() {
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 960) return 2;
  return 4;
}

function setupCarousel() {
  const viewport = productContainer?.querySelector(".products-carousel-viewport");
  const track = productContainer?.querySelector(".products-carousel-track");
  const dotsContainer = productContainer?.querySelector(".products-carousel-dots");

  if (!viewport || !track || !dotsContainer) return;

  const cards = Array.from(track.children);
  if (cards.length === 0) return;

  let currentIndex = 0;
  let cardsPerView = getCardsPerView();
  let totalPages = 1;
  let autoSlideId;

  const restartAutoSlide = () => {
    window.clearInterval(autoSlideId);

    if (totalPages <= 1) return;

    autoSlideId = window.setInterval(() => {
      goToPage(currentIndex + 1);
    }, AUTO_SLIDE_MS);
  };

  const renderDots = () => {
    dotsContainer.innerHTML = "";

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "products-carousel-dot";
      dot.setAttribute("aria-label", `Ir al grupo ${pageIndex + 1}`);

      if (pageIndex === currentIndex) {
        dot.classList.add("is-active");
      }

      dot.addEventListener("click", () => {
        goToPage(pageIndex);
        restartAutoSlide();
      });

      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = () => {
    const dots = dotsContainer.querySelectorAll(".products-carousel-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
    });
  };

  const updateLayout = () => {
    cardsPerView = getCardsPerView();
    totalPages = Math.max(1, Math.ceil(cards.length / cardsPerView));
    currentIndex = Math.min(currentIndex, totalPages - 1);

    cards.forEach((card) => {
      card.style.flex = `0 0 calc((100% - ${(cardsPerView - 1) * 20}px) / ${cardsPerView})`;
    });

    renderDots();
    updatePosition();
    restartAutoSlide();
  };

  const updatePosition = () => {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 20;
    const offset = currentIndex * cardsPerView * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  };

  const goToPage = (pageIndex) => {
    if (totalPages <= 0) return;
    currentIndex = (pageIndex + totalPages) % totalPages;
    updatePosition();
  };

  viewport.addEventListener("mouseenter", () => window.clearInterval(autoSlideId));
  viewport.addEventListener("mouseleave", restartAutoSlide);
  window.addEventListener("resize", updateLayout);

  updateLayout();
}

async function init() {
  const products = await fetchProducts();
  renderProducts(products);
}

init();
