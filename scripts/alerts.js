// Descripcion: Utilidades para mostrar alertas y notificaciones al usuario.

// Carga dinámica de SweetAlert para evitar cargar la librería si no es necesaria.
let sweetAlertLoader = null;

function loadSweetAlert() {
  // Reutiliza la libreria si ya fue cargada previamente.
  if (window.Swal) return Promise.resolve(window.Swal);
  if (sweetAlertLoader) return sweetAlertLoader;

  sweetAlertLoader = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
    script.onload = () => resolve(window.Swal || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });

  return sweetAlertLoader;
}

export async function showAlert(message, options = {}) {
  // Normaliza el mensaje para evitar errores cuando llega null/undefined.
  const Swal = await loadSweetAlert();
  const text = typeof message === "string" ? message : String(message ?? "");

  if (Swal) {
    return Swal.fire({
      title: options.title || "Aviso",
      text,
      icon: options.icon || "info",
      confirmButtonText: options.confirmButtonText || "Aceptar",
    });
  }

  // Fallback nativo si SweetAlert no se pudo cargar.
  alert(text);
  return null;
}

