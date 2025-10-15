// detalle-component.js
import { getInfo, postInfo } from "../api/crudApi.js";

export class DetalleHabitacion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.room = null;
    this.currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
  }

  async connectedCallback() {
    const rid = this.getAttribute("room-id");
    if (rid) {
      try {
        this.room = await getInfo("rooms", rid);
      } catch (err) {
        console.error("Error cargando room en detalle:", err);
      }
    }

    if (!this.room) {
      this.shadowRoot.innerHTML = `<div style="padding:2rem; color:#333">No se pudo cargar la información de la habitación.</div>`;
      return;
    }

    this.render();
    this.setupEventListeners();
    this.initCarousel();

    document.body.style.overflow = "hidden";
  }

  disconnectedCallback() {
    document.body.style.overflow = "";
  }

  setupEventListeners() {
    const closeBtn = this.shadowRoot.querySelector(".close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.remove();
      });
    }

    const btnReservar = this.shadowRoot.querySelector(".btn-reservar");
    if (btnReservar) {
      btnReservar.addEventListener("click", () => this.handleReservation());
    }
  }

  initCarousel() {
    const slides = Array.from(
      this.shadowRoot.querySelectorAll(".carousel-slide")
    );
    const prevBtn = this.shadowRoot.querySelector(".prev");
    const nextBtn = this.shadowRoot.querySelector(".next");
    if (!slides.length || !prevBtn || !nextBtn) return;

    let currentSlide = 0;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
    };

    prevBtn.addEventListener("click", () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });

    nextBtn.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });

    showSlide(currentSlide);
  }

  async handleReservation() {
    if (!this.currentUser) {
      alert(
        "⚠️ Debes registrarte o iniciar sesión para poder realizar una reserva."
      );
      return;
    }

    const startDate = this.shadowRoot.querySelector("#start-date").value;
    const endDate = this.shadowRoot.querySelector("#end-date").value;
    const guests = parseInt(this.shadowRoot.querySelector("#guests").value);

    if (!startDate || !endDate || !guests) {
      alert("Por favor completa todos los campos antes de reservar.");
      return;
    }

    const bookings = (await getInfo("bookings")) || [];
    const overlapping = bookings.some(
      (b) =>
        b.roomId == this.room.id &&
        ((startDate >= b.startDate && startDate <= b.endDate) ||
          (endDate >= b.startDate && endDate <= b.endDate) ||
          (startDate <= b.startDate && endDate >= b.endDate))
    );

    if (overlapping) {
      alert(
        "❌ Esta habitación no está disponible en las fechas seleccionadas."
      );
      return;
    }

    const totalDays = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = totalDays * this.room.pricePerNight;

    const newBooking = {
      roomId: this.room.id,
      userId: this.currentUser.id,
      startDate,
      endDate,
      guests,
      totalPrice,
      status: "confirmada",
      createdAt: new Date().toISOString(),
    };

    try {
      await postInfo("bookings", newBooking);
      alert("✅ Reserva realizada con éxito.");
      this.remove();
    } catch (err) {
      console.error("Error creando reserva:", err);
      alert("❌ Ocurrió un error al crear la reserva. Intenta de nuevo.");
    }
  }

  render() {
    const room = this.room;
    if (!room) {
      this.shadowRoot.innerHTML = `<div style="padding:2rem">Cargando...</div>`;
      return;
    }

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../../css/detalle.css">

      <div class="modal-overlay">
        <div class="modal-content">
          <button class="close-btn" aria-label="Cerrar">&times;</button>
          
          <h2 class="room-title">${room.title}</h2>

          <div class="modal-body">
            <!-- 🖼️ Carrusel -->
            <div class="carousel-container">
              ${room.images
                .map(
                  (img) => `
                <div class="carousel-slide">
                  <img src="${img}" alt="${room.title}">
                </div>`
                )
                .join("")}
              <button class="prev" aria-label="Anterior">&#10094;</button>
              <button class="next" aria-label="Siguiente">&#10095;</button>
            </div>

            <!-- 📋 Información -->
            <div class="room-details">
              <p class="description">${room.description}</p>
              <p><strong>Camas:</strong> ${room.beds}</p>
              <p><strong>Capacidad máxima:</strong> ${
                room.maxGuests
              } personas</p>
              <div class="services">
                <h4>Servicios incluidos:</h4>
                <ul>
                  ${room.services
                    .map((service) => `<li>• ${service}</li>`)
                    .join("")}
                </ul>
              </div>

              <div class="price-section">
                <p class="price"><strong>Precio por noche:</strong> $${room.pricePerNight.toLocaleString()}</p>
              </div>

              <div class="booking-section">
                <label>Fecha de inicio:</label>
                <input type="date" id="start-date">

                <label>Fecha de fin:</label>
                <input type="date" id="end-date">

                <label>Cantidad de personas:</label>
                <input type="number" id="guests" min="1" max="${
                  room.maxGuests
                }" value="1">

                <button class="btn-reservar">Reservar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("detalle-component", DetalleHabitacion);
