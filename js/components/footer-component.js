export class FooterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const year = new Date().getFullYear();

    this.shadowRoot.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "../../css/footer.css";
      </style>
      <footer class="footer">
        <div class="footer-wave">
          <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path fill="#F9F9F9" d="M0,64L60,69.3C120,75,240,85,360,85.3C480,85,600,75,720,69.3C840,64,960,64,1080,74.7C1200,85,1320,107,1380,117.3L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
          </svg>
        </div>

        <div class="footer-content">
          <div class="footer-brand">
            <img src="../../assets/images/logo.png" alt="Logo del hotel" class="footer-logo">
            <h3>Hotel El Rincón del Carmen</h3>
            <p>Un refugio natural donde el descanso se siente.</p>
          </div>

          <div class="footer-links">
            <h4>Explora</h4>
            <ul>
              <li><a href="../../index.html">Inicio</a></li>
              <li><a href="../../pages/user/reservas.html">Reservas</a></li>
              <li><a href="../../pages/user/contacto.html">Contacto</a></li>
            </ul>
          </div>

          <div class="footer-contact">
            <h4>Contáctanos</h4>
            <p>📍 Calle 10 #5-21</p>
            <p>📞 +57 301 456 7890</p>
            <p>✉️ contacto@rincondelcarmen.com</p>

            <div class="social-icons">
              <a href="#"><i class="fa-brands fa-instagram"></i></a>
              <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="#"><i class="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; ${year} Hotel El Rincón del Carmen — Todos los derechos reservados.</p>
        </div>
      </footer>
    `;
  }
}

customElements.define("footer-component", FooterComponent);
