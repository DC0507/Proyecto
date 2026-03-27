import { supabase } from "./supabase.js";

export async function setupAddToCartButtons() {
    document.querySelectorAll(".product-btn-add").forEach(button => {
        // Limpiar listeners previos
        button.replaceWith(button.cloneNode(true));
    });

    document.querySelectorAll(".product-btn-add").forEach(button => {
        button.addEventListener("click", async (e) => {
            const card = e.target.closest(".product-card");
            
            // BUSQUEDA FLEXIBLE: Buscamos las clases sin importar la estructura exacta
            const nameEl = card.querySelector(".product-name");
            // Buscamos .product-price o .price-value para cubrir ambos archivos
            const priceEl = card.querySelector(".product-price") || card.querySelector(".price-value");

            if (!nameEl || !priceEl) {
                console.error("No se encontraron los datos del producto en la tarjeta.");
                return;
            }

            const productId = card.dataset.productId;
            const productName = nameEl.innerText;
            const productPriceStr = priceEl.innerText;
            
            // Extraer solo números (quita ₡, "Precio:", etc)
            const productPrice = parseFloat(productPriceStr.replace(/[^0-9.-]+/g, ""));

            // 1. Verificar sesión
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert("Inicia sesión para comprar.");
                window.location.href = "../views/login.html";
                return;
            }

            // 2. Guardar en LocalStorage
            let cart = JSON.parse(localStorage.getItem("carrito")) || [];
            const existingIndex = cart.findIndex(item => item.id === productId);

            if (existingIndex > -1) {
                cart[existingIndex].cantidad += 1;
            } else {
                cart.push({
                    id: productId,
                    nombre: productName,
                    precio: productPrice,
                    cantidad: 1
                });
            }

            localStorage.setItem("carrito", JSON.stringify(cart));

            // 3. Feedback visual
            const originalText = button.innerText;
            button.innerText = "¡Agregado!";
            button.classList.add("btn-success"); // Si usas Bootstrap
            
            setTimeout(() => {
                button.innerText = originalText;
                button.classList.remove("btn-success");
            }, 1000);
        });
    });
}