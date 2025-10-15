// booking-component.js
import { getInfo } from "../api/crudApi.js";

export class BookingComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.rooms = [];
    this.filteredRooms = [];
  }

  connectedCallback() {
    this.render();
    this.loadRooms();
    this.shadowRoot
      .querySelector("#searchForm")
      .addEventListener("submit", (e) => this.handleSearch(e));
  }

  async loadRooms() {
    try {
      this.rooms = (await getInfo("rooms")) || [];
    } catch (error) {
      console.error("Error cargando habitaciones:", error);
    }
  }

  async handleSearch(e) {
    e.preventDefault();

    const startDate = this.shadowRoot.querySelector("#startDate").value;
    const endDate = this.shadowRoot.querySelector("#endDate").value;
    const guests = parseInt(this.shadowRoot.querySelector("#guests").value);

    if (!startDate || !endDate) {
      this.showMessage("Por favor selecciona ambas fechas.", "error");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      this.showMessage(
        "La fecha final debe ser posterior a la inicial.",
        "error"
      );
      return;
    }

    try {
      const bookings = (await getInfo("bookings")) || [];

      this.filteredRooms = this.rooms.filter((room) => {
        if (!room.active) return false;
        if (guests > room.maxGuests) return false;

        const isBooked = bookings.some((booking) => {
          if (booking.roomId !== room.id) return false;
          const bStart = new Date(booking.startDate);
          const bEnd = new Date(booking.endDate);
          return (
            (start >= bStart && start < bEnd) ||
            (end > bStart && end <= bEnd) ||
            (start <= bStart && end >= bEnd)
          );
        });

        return !isBooked;
      });

      if (guests > Math.max(...this.rooms.map((r) => r.maxGuests))) {
        this.showMessage(
          "No hay habitaciones que soporten esa cantidad de personas. Te recomendamos dividir tu reserva.",
          "warning"
        );
        this.renderRoomList([]);
        return;
      }

      if (this.filteredRooms.length === 0) {
        this.showMessage(
          "No tenemos disponibilidad para esa fecha. Prueba modificando las fechas seleccionadas.",
          "info"
        );
      } else {
        this.showMessage("", "");
      }

      this.renderRoomList(this.filteredRooms);
    } catch (error) {
      console.error("Error en búsqueda:", error);
    }
  }

  showMessage(text, type) {
    const messageBox = this.shadowRoot.querySelector("#message");
    messageBox.textContent = text;
    messageBox.className = type ? `message ${type}` : "message";
  }

  renderRoomList(rooms) {
    const container = this.shadowRoot.querySelector("#results");
    container.innerHTML = "";

    if (rooms.length === 0) return;

    rooms.forEach((room) => {
      const card = document.createElement("div");
      card.classList.add("room-card");

      card.innerHTML = `
        <div class="room-image">
          <img src="${room.images[0]}" alt="${room.title}" />
        </div>
        <div class="room-info">
          <h3>${room.title}</h3>
          <p>${room.description}</p>
          <div class="room-footer">
            <div class="price">$${room.pricePerNight.toLocaleString()} / noche</div>
            <button class="btn-view" data-id="${room.id}">Ver más</button>
          </div>
        </div>
      `;

      card.querySelector(".btn-view").addEventListener("click", () => {
        this.openRoomDetail(room);
      });

      container.appendChild(card);
    });
  }

  openRoomDetail(room) {
    const modal = document.createElement("detalle-component");
    modal.setAttribute("room-id", room.id);
    document.body.appendChild(modal);

    document.body.style.overflow = "hidden";
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../../css/booking.css">

      <section class="booking-container">
        <h2>Consulta disponibilidad</h2>

        <form id="searchForm" class="search-panel">
          <div class="field">
            <label for="startDate">Fecha de entrada</label>
            <input type="date" id="startDate" required>
          </div>
          <div class="field">
            <label for="endDate">Fecha de salida</label>
            <input type="date" id="endDate" required>
          </div>
          <div class="field">
            <label for="guests">Personas</label>
            <input type="number" id="guests" min="1" value="1" required>
          </div>
          <button type="submit" class="btn-search">Buscar</button>
        </form>

        <div id="message" class="message"></div>

        <div id="results" class="results-grid"></div>
      </section>
    `;
  }
}

customElements.define("booking-component", BookingComponent);
