let sweetAlertLoader = null;

function loadSweetAlert() {
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

  alert(text);
  return null;
}
