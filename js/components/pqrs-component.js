import { getInfo } from "../api/crudApi.js";

export class PqrsComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
    this.pqrs = [];
    this.reservas = [];
  }

  async connectedCallback() {
    await this.loadData();
    this.render();
    this.setupEventListeners();
  }

  async loadData() {
    try {
      const [pqrs, booking] = await Promise.all([
        getInfo("pqrs"),
        getInfo("bookings"),
      ]);

      this.pqrs = pqrs.filter((p) => p.userId === this.currentUser.id);
      const bookings = booking;
      this.reservas = bookings.filter((b) => b.userId === this.currentUser.id);
    } catch (error) {
      console.error("Error cargando reservas:", error);
    }
  }

  setupEventListeners() {

    const btnEnviar = this.shadowRoot.querySelector("#enviar");
    if (btnEnviar) {
      btnEnviar.addEventListener("click", () => this.handlePqrs());
    }

    const btnELiminar = this.shadowRoot.querySelector("#eliminar");
    if (btnELiminar) {
        const confirmDelete = confirm(
          "¿Seguro que deseas cancelar esta PQRs?"
        );
        if (!confirmDelete) return;
        deleteInfo("bookings", id);
      }
  }

async handlePqrs() {
    if (!this.currentUser) {
      alert(
        "⚠️ Debes registrarte o iniciar sesión para poder realizar una PQRS."
      );
      return;
    }

    const newPqrs = {
      reservaId: this.shadowRoot.querySelector("#reserva").value,
        userId: this.currentUser.id,
        asunto: this.shadowRoot.querySelector("#asunto").value,
        tipo: this.shadowRoot.querySelector("#tipo").value,
        descripcion: this.shadowRoot.querySelector("#descripcion").value,
        fecha: new Date().toISOString(),
        estado: "pendiente",
        respuesta: '',
    };

    try {
      await postInfo("PQRS", newPqrs);
      alert("✅ PQRS realizada con éxito.");
      this.remove();
    } catch (err) {
      console.error("Error creando PQRS:", err);
      alert("❌ Ocurrió un error al crear la PQRS. Intenta de nuevo.");
    }
  }

  render() {
    const hoy = new Date();

    const reservaUser = this.reservas;

    this.shadowRoot.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "../../css/mis-reservas.css";
      </style>

      <section class="mis-reservas-container fade-in">
        <h2>Hola, ${this.currentUser.fullName.split(" ")[0]} 👋</h2>
        <h2 class="sub-title">
            Crear una PQRs
        </h2>
        <h3>
            Selecciona la reserva a la que hace referencia la PQRs
        </h3> 
        <select name="" id="reserva">
        ${
            reservaUser.length > 0
              ? this.renderSection(reservaUser)
              : `<div class="empty">
                   <p>No tienes reservas hechas.</p>
                   <a href="reservas.html" class="btn-primary">Hacer una reserva</a>
                 </div>`
          }
        </select>
        <h3>
            Asunto de la PQRs
        </h3>
        <input type="text" name="" id="asunto">
        <h3>
            ¿Qué tipo de PQRs deseas realizar?
        </h3>
        <select name="tipo" id="tipo">
            <option value="">--Selecciona un tipo--</option>
            <option value="Queja">Queja</option>
            <option value="Reclamo">Reclamo</option>
        </select>
        <h3>
            Descripcion de la PQRs
        </h3>
        <input type="text" name="" id="descripcion">
        <button id="enviar">Enviar</button>  
      </section>

      <section class="mis-reservas-container fade-in">
        <p class="intro">Aquí puedes consultar tus PQRs.</p>

        ${
          pqrs.length > 0
            ? this.renderPQRS("Historial PQRS", this.pqrs)
            : `<div class="empty">
                 <p>No tienes pqrs.</p>
               </div>`
        }

      </section>
    `;
  }

  renderSection(reservas) {
    const cards = reservas
      .map((res) => {
        return `
            <option value="${res.id}">${res.startDate} → ${res.endDate}</option>
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

  renderPQRS(titulo, pqrs) {
    const cards = pqrs
      .map((pqrs) => {
        return `
          <div class="reserva-card">
            <div class="reserva-info">
              <p><strong>Asunto:</strong> ${pqrs.asunto}</p>
              <p><strong>Tipo:</strong> ${pqrs.tipo}</p>
              <p><strong>Descripcion:</strong> $${pqrs.descripcion}</p>
              <p><strong>Fecha de radicacion:</strong> $${pqrs.fecha}</p>
              <p><strong>Estado:</strong> $${pqrs.estado}</p>
              <p><strong>Respuesta:</strong> $${pqrs.respuesta}</p>
              <button id="eliminar">Eliminar</button> 
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

customElements.define("pqrs-component", PqrsComponent);
