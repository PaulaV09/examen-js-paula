// mis-reservas-component.js
import { getInfo } from "../api/crudApi.js";

export class MisReservasComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
    this.reservas = [];
    this.rooms = [];
  }

  async connectedCallback() {
    await this.loadData();
    this.render();
  }

  async loadData() {
    try {
      const [bookings, rooms] = await Promise.all([
        getInfo("bookings"),
        getInfo("rooms"),
      ]);

      this.rooms = rooms;
      this.reservas = bookings.filter((b) => b.userId === this.currentUser.id);
    } catch (error) {
      console.error("Error cargando reservas:", error);
    }
  }

  getRoomInfo(roomId) {
    return this.rooms.find((r) => r.id === roomId);
  }

  render() {
    const hoy = new Date();

    const futuras = this.reservas.filter((r) => new Date(r.startDate) >= hoy);
    const pasadas = this.reservas.filter((r) => new Date(r.endDate) < hoy);

    this.shadowRoot.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "../../css/mis-reservas.css";
      </style>

      <section class="mis-reservas-container fade-in">
        <h2>Hola, ${this.currentUser.fullName.split(" ")[0]} 👋</h2>
        <p class="intro">Aquí puedes consultar tus próximas reservas y el historial de tus estancias.</p>

        ${
          futuras.length > 0
            ? this.renderSection("Próximas reservas", futuras)
            : `<div class="empty">
                 <p>No tienes reservas próximas.</p>
                 <a href="reservas.html" class="btn-primary">Hacer una reserva</a>
               </div>`
        }

        <div class="contacto-info">
          <p>¿Necesitas cancelar o modificar una reserva?</p>
          <p>Contáctanos: <strong>reservas@rincondelcarmen.com</strong> o al <strong>(+57) 301 456 7890</strong></p>
        </div>

        ${
          pasadas.length > 0
            ? this.renderSection("Historial de reservas", pasadas)
            : ""
        }

      </section>
    `;
  }

  renderSection(titulo, reservas) {
    const cards = reservas
      .map((res) => {
        const room = this.getRoomInfo(res.roomId);
        return `
          <div class="reserva-card">
            <div class="img-wrapper">
              <img src="${
                room?.images?.[0] || "assets/img/default-room.jpg"
              }" alt="${room?.title || "Habitación"}">
            </div>
            <div class="reserva-info">
              <h3>${room?.title || "Habitación"}</h3>
              <p><strong>Fechas:</strong> ${res.startDate} → ${res.endDate}</p>
              <p><strong>Huéspedes:</strong> ${res.guests}</p>
              <p><strong>Total:</strong> $${res.totalPrice.toLocaleString()}</p>
              <span class="estado ${res.status}">${res.status}</span>
            </div>
          </div>
        `;
      })
      .join("");

    return `
      <div class="reserva-section">
        <h3>${titulo}</h3>
        <div class="reserva-grid">${cards}</div>
      </div>
    `;
  }
}

customElements.define("mis-reservas-component", MisReservasComponent);
