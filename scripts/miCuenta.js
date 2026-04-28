import { redirectToLogin } from "./auth.js";
import { supabase } from "./supabase.js";
import { createNavbar } from "../views/components/navbar.js";
export default async function setupMiCuenta() {
    const accountContainer = document.querySelector(".acccount-wrapper");
    if (!accountContainer) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        redirectToLogin();
        return;
    }

    const { data: user } = await supabase
        .from("perfiles")
        .select("nombre, apellido, telefono")
        .eq("id", session.user.id)
        .single();

    accountContainer.innerHTML = `
        <section class="account-shell">
            <div class="account-card">
                <div class="account-card__header">
                    <span class="account-badge">Perfil</span>
                    <h1>Mi Cuenta</h1>
                    <p>Consulta tu informaci&oacute;n personal y los datos asociados a tu cuenta.</p>
                </div>
                <div class="account-grid">
                    <article class="account-item">
                        <span class="account-label">Nombre</span>
                        <strong class="account-value">${user?.nombre || "No proporcionado"}</strong>
                    </article>
                    <article class="account-item">
                        <span class="account-label">Apellido</span>
                        <strong class="account-value">${user?.apellido || "No proporcionado"}</strong>
                    </article>
                    <article class="account-item">
                        <span class="account-label">Email</span>
                        <strong class="account-value">${session.user.email || "No proporcionado"}</strong>
                    </article>
                    <article class="account-item">
                        <span class="account-label">Tel&eacute;fono</span>
                        <strong class="account-value">${user?.telefono || "No proporcionado"}</strong>
                    </article>
                </div>
            </div>
        </section>`;
}

setupMiCuenta();
createNavbar(); // Llama a la función para crear la barra de navegación al cargar la página