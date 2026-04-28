import { supabase } from "./supabase.js";

const INACTIVITY_LIMIT = 2 * 60 * 1000; // 2 minuto
const WARNING_BEFORE = 30 * 1000;      // 30 segundos antes
let warningTimeout;
let logoutTimeout;

async function checkAccess() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        redirectToLogin();
        return;
    }
    setupInactivitySystem();
}

function setupInactivitySystem() {
    injectModalStyles();
    resetTimers();
    
    // Escuchar interacciones para reiniciar el tiempo
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
        document.addEventListener(event, () => {
            if (!document.getElementById('inactivity-modal')) {
                resetTimers();
            }
        }, true);
    });
}

function resetTimers() {
    clearTimeout(warningTimeout);
    clearTimeout(logoutTimeout);
    hideWarning();

    // 1. Timer para mostrar el aviso (a los 1:30 min)
    warningTimeout = setTimeout(showWarning, INACTIVITY_LIMIT - WARNING_BEFORE);
    
    // 2. Timer para cierre definitivo (a los 2:00 min)
    logoutTimeout = setTimeout(redirectToLogin, INACTIVITY_LIMIT);
}

function showWarning() {
    const modal = document.createElement('div');
    modal.id = 'inactivity-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>¿Sigues ahí?</h3>
            <p>Tu sesión expirará en 30 segundos por inactividad.</p>
            <button id="stay-btn">Continuar trabajando</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('stay-btn').onclick = resetTimers;
}

function hideWarning() {
    const modal = document.getElementById('inactivity-modal');
    if (modal) modal.remove();
}

export async function redirectToLogin() {
    await supabase.auth.signOut();
    const inViews = window.location.pathname.includes("/views/");
    window.location.href = inViews ? "login.html" : "views/login.html";
}

function injectModalStyles() {
    if (document.getElementById('modal-styles')) return;
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.innerHTML = `
        #inactivity-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); display: flex; align-items: center;
            justify-content: center; z-index: 9999; font-family: sans-serif;
        }
        .modal-content {
            background: white; padding: 2rem; border-radius: 8px; text-align: center;
        }
        #stay-btn {
            background: #3ecf8e; color: white; border: none; padding: 10px 20px;
            border-radius: 4px; cursor: pointer; margin-top: 10px;
        }
    `;
    document.head.appendChild(style);
}

if (document.body?.dataset.requiresAuth === "true") {
    checkAccess();
}
