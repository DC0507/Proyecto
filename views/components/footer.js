export default function createFooter() {
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
        <div class="site-footer__content">
            <div class="site-footer__brand">
                <span class="site-footer__eyebrow">Clonemart</span>
                <p class="site-footer__copy">&copy; 2026 Clonemart. Todos los derechos reservados.</p>
            </div>
            <div class="site-footer__socials" aria-label="Redes sociales">
                <a class="site-footer__social-link" href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2H21.5l-7.11 8.128L22.75 22h-6.548l-5.126-6.708L5.21 22H1.95l7.605-8.694L1.55 2h6.714l4.633 6.118L18.244 2Zm-1.142 18h1.804L7.28 3.894H5.345L17.102 20Z"/>
                    </svg>
                </a>
                <a class="site-footer__social-link" href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 6.8A5.2 5.2 0 1 1 6.8 12 5.21 5.21 0 0 1 12 6.8Zm0 1.8A3.4 3.4 0 1 0 15.4 12 3.41 3.41 0 0 0 12 8.6Z"/>
                    </svg>
                </a>
                <a class="site-footer__social-link" href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M13.5 22v-7.3h2.45l.37-2.85H13.5V10c0-.83.23-1.39 1.43-1.39h1.52V6.06A20.7 20.7 0 0 0 14.23 6C12 6 10.5 7.36 10.5 9.86v2H8v2.85h2.5V22h3Z"/>
                    </svg>
                </a>
            </div>
        </div>
    `;
    return footer;
}

const footerRoot = document.querySelector("footer[data-footer-root]");
if (footerRoot) {
    footerRoot.replaceWith(createFooter());
}
