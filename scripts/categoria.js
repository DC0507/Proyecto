import { supabase } from './supabase.js'

const productContainer = document.querySelector('.products-carousel')
const categoryTitle = document.querySelector('#category-title')
const categoryEmpty = document.querySelector('#category-empty')

const categories = {
  1: 'Carnes y Pescado',
  2: 'Frutas y Verduras',
  3: 'Panadería',
  4: 'Hogar',
  5: 'Mascotas',
  6: 'Juguetes',
  7: 'Deportes',
  8: 'Electrónica',
}

function getCategoryIdFromQuery() {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('catId')
  if (!raw) return null

  const id = Number(raw)
  if (!Number.isInteger(id) || id <= 0) return null

  if (!Object.prototype.hasOwnProperty.call(categories, id)) return null

  return id
}

async function fetchProductsByCategory(categoryId) {
  const { data: products, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id_cat', categoryId)

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return products || []
}

function renderCategoryTitle(categoryId) {
  const name = categories[categoryId] || 'Categoría desconocida'
  categoryTitle.textContent = `Categoría: ${name}`
}

function renderProducts(products) {
  productContainer.innerHTML = ''

  if (!products || products.length === 0) {
    categoryEmpty.style.display = 'block'
    return
  }

  categoryEmpty.style.display = 'none'

  products.forEach((product) => {
    const card = document.createElement('div')
    card.classList.add('product-card')
    card.dataset.productId = product.id

    card.innerHTML = `
      <img class="product-img" src="../media/images/products/${
        product.imagen || 'default-product.png'
      }" alt="${product.nombre || 'Producto'}" />
      <div class="product-info">
        <p>
          <span class="product-name">${product.nombre || 'Producto sin nombre'}</span>
          <br />
          <b>Precio:</b> ₡<span class="price-value">${product.precio || '0'}</span>
        </p>
      </div>
      <div class="product-actions">
        <button class="product-btn-add" aria-label="Agregar al carrito">+ Agregar</button>
        <button class="product-btn-details">Detalles</button>
      </div>
    `

    productContainer.appendChild(card)
  })
}

async function init() {
  const categoryId = getCategoryIdFromQuery()

  if (!categoryId) {
    console.warn('ID de categoría inválido o ausente; redirigiendo al inicio.')
    window.location.href = '../index.html'
    return
  }

  renderCategoryTitle(categoryId)

  const products = await fetchProductsByCategory(categoryId)
  renderProducts(products)
}

init()
