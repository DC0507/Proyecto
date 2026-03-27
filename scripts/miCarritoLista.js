// cartView.js

const formatCRC = (val) => new Intl.NumberFormat('es-CR', {
    style: 'currency', currency: 'CRC', minimumFractionDigits: 0 
}).format(val);

function loadCart() {
    const cartBody = document.getElementById('cart-items-body');
    const totalDisplay = document.getElementById('cart-total');
    const cart = JSON.parse(localStorage.getItem("carrito")) || [];

    if (cart.length === 0) {
        document.getElementById('cart-content').innerHTML = `
            <div style="text-align:center; padding: 50px;">
                <p>Tu carrito está vacío.</p>
                <a href="../index.html" style="color: #3ecf8e;">Ir a ver productos</a>
            </div>`;
        return;
    }

    let totalGeneral = 0;

    cartBody.innerHTML = cart.map((item, index) => {
        const subtotal = item.precio * item.cantidad;
        totalGeneral += subtotal;

        return `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 15px;">${item.nombre}</td>
                <td style="padding: 15px;">${formatCRC(item.precio)}</td>
                <td style="padding: 15px;">
                    <input type="number" value="${item.cantidad}" min="1" 
                        style="width: 50px; padding: 5px;" 
                        onchange="window.updateQty(${index}, this.value)">
                </td>
                <td style="padding: 15px;">${formatCRC(subtotal)}</td>
                <td style="padding: 15px;">
                    <button onclick="window.removeItem(${index})" style="color: #e63946; border: none; background: none; cursor: pointer;">X</button>
                </td>
            </tr>
        `;
    }).join('');

    totalDisplay.innerText = `Total: ${formatCRC(totalGeneral)}`;
}

// Global functions for the buttons inside the table
window.updateQty = (index, newQty) => {
    let cart = JSON.parse(localStorage.getItem("carrito"));
    cart[index].cantidad = parseInt(newQty);
    localStorage.setItem("carrito", JSON.stringify(cart));
    loadCart();
};

window.removeItem = (index) => {
    let cart = JSON.parse(localStorage.getItem("carrito"));
    cart.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(cart));
    loadCart();
};

document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
    if(confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        localStorage.removeItem("carrito");
        loadCart();
    }
});

document.getElementById('checkout-btn')?.addEventListener('click', () => {
    alert("Redirigiendo a la pasarela de pago... (Vista en construcción)");
    // window.location.href = './pago.html'; 
});

document.addEventListener('DOMContentLoaded', loadCart);
