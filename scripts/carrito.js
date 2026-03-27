// cart.js
import { supabase } from "./supabase.js";

export async function setupAddToCartButtons() {
    const addButtons = document.querySelectorAll(".product-btn-add");

    addButtons.forEach(button => {
        // Remove existing listener to prevent double triggers if re-rendered
        button.replaceWith(button.cloneNode(true));
    });

    // Re-select and add logic
    document.querySelectorAll(".product-btn-add").forEach(button => {
        button.addEventListener("click", async (e) => {
            const card = e.target.closest(".product-card");
            const productId = card.dataset.productId;
            const productName = card.querySelector(".product-name").innerText;
            const productPriceStr = card.querySelector(".product-price").innerText;
            
            // Extract numeric value from "Precio: ₡5000"
            const productPrice = parseFloat(productPriceStr.replace(/[^0-9.-]+/g, ""));

            // 1. Check if user is logged in
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                alert("Debes iniciar sesión para agregar productos al carrito.");
                window.location.href = "../views/login.html";
                return;
            }

            // 2. Add to Cart Logic (Local Storage approach for speed)
            const cartItem = {
                id: productId,
                nombre: productName,
                precio: productPrice,
                cantidad: 1
            };

            let cart = JSON.parse(localStorage.getItem("carrito")) || [];
            
            // Check if product already exists
            const existingIndex = cart.findIndex(item => item.id === productId);
            if (existingIndex > -1) {
                cart[existingIndex].cantidad += 1;
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem("carrito", JSON.stringify(cart));

            // 3. Visual feedback
            const originalText = button.innerText;
            button.innerText = "¡Agregado!";
            button.style.backgroundColor = "#2ecc71";
            
            setTimeout(() => {
                button.innerText = originalText;
                button.style.backgroundColor = "";
            }, 1500);
        });
    });
}
