function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-inner">
      <p class="footer-text">© 2026 Copyright. Todos los derechos reservados Clonemart 2026</p>
      <div class="footer-social" aria-label="Redes sociales">
        <a href="#" aria-label="Instagram" title="Instagram" class="footer-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5"></rect>
            <circle cx="12" cy="12" r="4"></circle>
            <circle cx="17.5" cy="6.5" r="1"></circle>
          </svg>
        </a>
        <a href="#" aria-label="Facebook" title="Facebook" class="footer-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1z"></path>
          </svg>
        </a>
        <a href="#" aria-label="X" title="X" class="footer-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4h4.5l4 5.4L17.4 4H20l-6.2 7.2L20 20h-4.6l-4.3-5.8L6.3 20H4l6.2-7.2z"></path>
          </svg>
        </a>
      </div>
    </div>
  `;
  return footer;
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".site-footer")) {
    document.body.appendChild(createFooter());
  }
});

