// Descripcion: Utilidades de autenticacion y proteccion de vistas.

// Importaciones de módulos
import { supabase } from "./supabase.js";

// Configuración de tiempos para inactividad
const INACTIVITY_LIMIT = 2 * 60 * 1000; // 2 minutos
const WARNING_BEFORE = 30 * 1000; // 30 segundos antes
let warningTimeout;
let logoutTimeout;

async function checkAccess() {
  // Si no hay sesion, redirige inmediatamente a login.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirectToLogin();
    return;
  }
  setupInactivitySystem();
}

function setupInactivitySystem() {
  // Configura el sistema de detección de inactividad para proteger la sesión del usuario.
  // Inyecta estilos para el modal de advertencia (si no existen).
  injectModalStyles();
  // Inicia el sistema de detección de inactividad.
  resetTimers();

  // Escuchar interacciones para reiniciar el tiempo
  const events = ["mousedown", "keydown", "touchstart", "scroll"];
  events.forEach((event) => {
    document.addEventListener(
      event,
      () => {
        if (!document.getElementById("inactivity-modal")) {
          resetTimers();
        }
      },
      true,
    );
  });
}

function resetTimers() {
  // Limpia los timers existentes para evitar múltiples modales o cierres.
  // Si el usuario interactúa, se reinician ambos timers.
  clearTimeout(warningTimeout);
  // Si el modal de advertencia está activo, lo oculta al detectar actividad.
  clearTimeout(logoutTimeout);
  hideWarning();

  // 1. Muestra aviso antes de cerrar sesion por inactividad.
  warningTimeout = setTimeout(showWarning, INACTIVITY_LIMIT - WARNING_BEFORE);

  // 2. Cierre definitivo de sesion cuando vence el limite.
  logoutTimeout = setTimeout(redirectToLogin, INACTIVITY_LIMIT);
}

function showWarning() {
  // Crea y muestra un modal de advertencia al usuario indicando que su sesión expirará pronto por inactividad.
  const modal = document.createElement("div");
  modal.id = "inactivity-modal";
  modal.innerHTML = `
        <div class="modal-content">
            <h3>¿Sigues ahí?</h3>
            <p>Tu sesión expirará en 30 segundos por inactividad.</p>
            <button id="stay-btn">Continuar trabajando</button>
        </div>
    `;
  document.body.appendChild(modal);
  document.getElementById("stay-btn").onclick = resetTimers;
}

function hideWarning() {
  // Elimina el modal de advertencia si el usuario interactúa o se reinician los timers.
  const modal = document.getElementById("inactivity-modal");
  if (modal) modal.remove();
}

export async function redirectToLogin() {
  // Cierra sesion local/remota y redirige segun la profundidad de ruta.
  await supabase.auth.signOut();
  const inViews = window.location.pathname.includes("/views/");
  window.location.href = inViews ? "login.html" : "views/login.html";
}

function injectModalStyles() {
  // Inyecta estilos CSS para el modal de advertencia de inactividad, asegurando que solo se agreguen una vez.
  if (document.getElementById("modal-styles")) return;
  const style = document.createElement("style");
  style.id = "modal-styles";
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

// Verifica el acceso al cargar la página. Si el cuerpo del documento tiene el atributo data-requires-auth="true", 
// se llama a checkAccess para validar la sesión del usuario y configurar el sistema de inactividad.
if (document.body?.dataset.requiresAuth === "true") {
  checkAccess();
}
