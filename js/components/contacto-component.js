export class ContactoComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "../../css/contacto.css";
      </style>

      <section class="contacto-section">
        <div class="contacto-container">
          <div class="contacto-formulario">
            <h2>Contáctanos</h2>
            <p>En el Hotel El Rincón del Carmen estaremos encantados de atenderte. Déjanos tu mensaje o consulta y te responderemos lo antes posible.</p>
            
            <form id="contact-form">
              <div class="form-group">
                <label for="nombre">Nombre completo</label>
                <input type="text" id="nombre" name="nombre" placeholder="Escribe tu nombre" required>
              </div>

              <div class="form-group">
                <label for="email">Correo electrónico</label>
                <input type="email" id="email" name="email" placeholder="ejemplo@correo.com" required>
              </div>

              <div class="form-group">
                <label for="telefono">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" placeholder="+57 300 000 0000">
              </div>

              <div class="form-group">
                <label for="mensaje">Mensaje</label>
                <textarea id="mensaje" name="mensaje" rows="4" placeholder="Escribe tu mensaje aquí..." required></textarea>
              </div>

              <button type="submit" class="btn-enviar">Enviar mensaje</button>
            </form>
          </div>

          <div class="contacto-info">
            <h3>Ubicación</h3>
            <p>📍 Calle 10 #5-21</p>
            <p>📞 +57 301 456 7890</p>
            <p>✉️ contacto@rincondelcarmen.com</p>

            <div class="mapa">
              <iframe
                src="https://www.google.com/maps?output=embed"
                width="100%"
                height="250"
                style="border:0;"
                allowfullscreen=""
                loading="lazy">
              </iframe>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define("contacto-component", ContactoComponent);
