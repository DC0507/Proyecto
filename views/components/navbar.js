import { supabase } from "/scripts/supabase.js";

export async function createNavbar() {
    const navbarWrapper = document.querySelector(".nav-wrapper");
    if (!navbarWrapper) return;
    navbarWrapper.innerHTML = `<a href="index.html"><img src="media/images/logo.png" alt="" id="logo" /></a>
        <!-- Barra de búsqueda -->
        <div class="search-container">
          <div class="search-box">
            <input
              type="search"
              id="search"
              placeholder="Buscar productos..."
            />
            <span class="search-icon"></span>
          </div>
          <ul id="sugerencias" class="sugerencias"></ul>
        </div>`;
    const navbar = document.createElement("nav");
    navbar.classList.add("navbar");
    const ul = document.createElement("ul");
    ul.innerHTML = `<li><a href="views/misProductos.html">Productos</a></li>
            <li><a href="views/miCuenta.html">Mi Cuenta</a></li>
            <li><a href="views/misPedidos.html">Mis Pedidos</a></li>
            <li><a href="views/miCarrito.html">Mi Carrito</a></li>`;

    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    if (session) {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#" id="logout-btn">Cerrar Sesión</a>`;
        const logoutBtn = li.querySelector("#logout-btn");
        logoutBtn.onclick = async () => {
            await supabase.auth.signOut();
            window.location.href = 'views/login.html';
        };
        ul.appendChild(li);
    }
    navbar.appendChild(ul);
    navbarWrapper.appendChild(navbar);
}