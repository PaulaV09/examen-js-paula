import { getInfo, patchInfo, deleteInfo } from "../api/crudApi.js";

export class GspqrsComponent extends HTMLElement {
  constructor() {
    super();
    this.pqrs = [];
  }

  async connectedCallback() {
    await this.loadPqrs();
    this.render();
    this.addEvents();
  }

  async loadPqrs() {
    const data = await getInfo("pqrs");
    const hoy = new Date();
    const pqrs = this.pqrs;
  }

  render() {
    this.innerHTML = /* html */ `
      <style>
        @import "../../css/gsBookings.css";
      </style>

      <section class="reservas-container">
        <h2 class="reservas-title">Gestión de PQRS</h2>

        <div class="reservas-grid">
          ${this.pqrs
            .map(
              (r) => `
            <div class="reserva-card" data-id="${r.id}">
              <div class="reserva-header">
                <h3>Reserva #${r.id}</h3>
                <span class="status ${r.estado.toLowerCase()}">${
                r.estado
              }</span>
              </div>

              <div class="reserva-info">
                <p><strong>UserId:</strong> ${r.userID}</p>
                <p><strong>ReservaId:</strong> ${r.reservaId}</p>
                <p><strong>Asunto:</strong> ${r.asunto}</p>
                <p><strong>Tipo:</strong> ${r.tipo}</p>
                <p><strong>Descripcion:</strong> ${r.descripcion}</p>
                <p><strong>Fecha de radicacion:</strong> $${r.fecha}</p>
              </div>

              <div class="reserva-actions">
                <button class="btn change-status" data-status="pendiente">Pendiente</button>
                <button class="btn change-status" data-status="positiva">Dar respuesta positiva</button>
                <button class="btn change-status" data-status="negativa">Dar respuesta negativa</button>
                <button class="btn change-status" data-status="cancelada">Cancelar</button>
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
        await patchInfo("pqrs", id, { estado: newStatus });

        if (newStatus === "cancelada") {
          const confirmDelete = confirm(
            "¿Seguro que deseas cancelar esta pqrs?"
          );
          if (!confirmDelete) return;
          await deleteInfo("pqrs", id);
        }

        await this.loadPqrs();
        this.render();
        this.addEvents();
      });
    });
  }
}

customElements.define("gspqrs-component", GspqrsComponent);
