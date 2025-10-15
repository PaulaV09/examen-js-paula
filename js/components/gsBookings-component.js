import { getInfo, patchInfo, deleteInfo } from "../api/crudApi.js";

export class GsbookingComponent extends HTMLElement {
  constructor() {
    super();
    this.reservas = [];
  }

  async connectedCallback() {
    await this.loadReservas();
    this.render();
    this.addEvents();
  }

  async loadReservas() {
    const data = await getInfo("bookings");
    const hoy = new Date();
    this.reservas = data.filter((r) => new Date(r.startDate) >= hoy);
  }

  render() {
    this.innerHTML = /* html */ `
      <style>
        @import "../../css/gsBookings.css";
      </style>

      <section class="reservas-container">
        <h2 class="reservas-title">Gestión de Reservas</h2>

        <div class="reservas-grid">
          ${this.reservas
            .map(
              (r) => `
            <div class="reserva-card" data-id="${r.id}">
              <div class="reserva-header">
                <h3>Reserva #${r.id}</h3>
                <span class="status ${r.status.toLowerCase()}">${
                r.status
              }</span>
              </div>

              <div class="reserva-info">
                <p><strong>Habitación:</strong> ${r.roomId}</p>
                <p><strong>Cliente:</strong> ${r.userId}</p>
                <p><strong>Desde:</strong> ${r.startDate}</p>
                <p><strong>Hasta:</strong> ${r.endDate}</p>
                <p><strong>Huéspedes:</strong> ${r.guests}</p>
                <p><strong>Total:</strong> $${r.totalPrice}</p>
              </div>

              <div class="reserva-actions">
                <button class="btn change-status" data-status="pendiente">Pendiente</button>
                <button class="btn change-status" data-status="confirmada">Confirmar</button>
                <button class="btn change-status" data-status="cancelada">Cancelar</button>
                <button class="btn edit">Modificar</button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </section>

      <div class="modal-overlay hidden"></div>
    `;
  }

  addEvents() {
    this.querySelectorAll(".change-status").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.closest(".reserva-card").dataset.id;
        const newStatus = e.target.dataset.status;
        await patchInfo("bookings", id, { status: newStatus });

        if (newStatus === "cancelada") {
          const confirmDelete = confirm(
            "¿Seguro que deseas cancelar esta reserva?"
          );
          if (!confirmDelete) return;
          await deleteInfo("bookings", id);
        }

        await this.loadReservas();
        this.render();
        this.addEvents();
      });
    });

    this.querySelectorAll(".edit").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.closest(".reserva-card").dataset.id;
        const reserva = this.reservas.find((r) => r.id == id);
        this.showModal(reserva);
      });
    });
  }

  showModal(reserva) {
    const overlay = this.querySelector(".modal-overlay");
    overlay.classList.remove("hidden");
    overlay.innerHTML = `
      <div class="modal">
        <h3>Modificar Fechas</h3>
        <form id="editForm">
          <label>Fecha de inicio</label>
          <input type="date" name="startDate" value="${reserva.startDate}" required>

          <label>Fecha de fin</label>
          <input type="date" name="endDate" value="${reserva.endDate}" required>

          <div class="modal-actions">
            <button type="button" class="btn-modal btn-cancel">Cancelar</button>
            <button type="submit" class="btn-modal btn-save">Guardar</button>
          </div>
        </form>
      </div>
    `;

    overlay.querySelector(".btn-cancel").addEventListener("click", () => {
      overlay.classList.add("hidden");
      overlay.innerHTML = "";
    });

    overlay.querySelector("#editForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const newStart = form.startDate.value;
      const newEnd = form.endDate.value;

      if (new Date(newEnd) <= new Date(newStart)) {
        alert("La fecha final debe ser posterior a la inicial");
        return;
      }

      await patchInfo("bookings", reserva.id, {
        startDate: newStart,
        endDate: newEnd,
      });

      overlay.classList.add("hidden");
      overlay.innerHTML = "";
      await this.loadReservas();
      this.render();
      this.addEvents();
    });
  }
}

customElements.define("gsbooking-component", GsbookingComponent);
