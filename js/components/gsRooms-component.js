import { getInfo, postInfo, patchInfo, deleteInfo } from "../api/crudApi.js";
import RoomModel from "../models/roomModel.js";

export class GsroomsComponent extends HTMLElement {
  constructor() {
    super();
    this.rooms = [];
    this.editingRoom = null;
  }

  connectedCallback() {
    this.render();
    this.loadRooms();
  }

  async loadRooms() {
    const data = await getInfo("rooms");
    this.rooms = data || [];
    this.renderRoomList();
  }

  render() {
    this.innerHTML = /* html */`
      <style>
        @import "../../css/gsRooms.css";
      </style>
      <section class="admin-rooms-section">
        <div class="header-actions">
          <h2>Gestión de Habitaciones</h2>
          <button id="btnAddRoom" class="btn-primary">+ Añadir habitación</button>
        </div>

        <div id="roomList" class="room-list"></div>

        <div id="roomFormContainer" class="room-form-overlay hidden"></div>
      </section>
    `;

    this.querySelector("#btnAddRoom").addEventListener("click", () => this.openRoomForm());
  }

  renderRoomList() {
    const listContainer = this.querySelector("#roomList");
    listContainer.innerHTML = "";

    if (this.rooms.length === 0) {
      listContainer.innerHTML = `<p class="empty-msg">No hay habitaciones registradas.</p>`;
      return;
    }

    this.rooms.forEach((room) => {
      const card = document.createElement("div");
      card.classList.add("room-card");
      card.innerHTML = `
        <img src="${room.images?.[0] || '../../assets/images/default-room.jpg'}" alt="${room.title}" class="room-img" />
        <div class="room-info">
          <h3>${room.title}</h3>
          <p>${room.description}</p>
          <p><strong>Camas:</strong> ${room.beds}</p>
          <p><strong>Máx. huéspedes:</strong> ${room.maxGuests}</p>
          <p><strong>Precio:</strong> COP ${room.pricePerNight.toLocaleString()}</p>
          <div class="room-actions">
            <button class="btn-secondary edit-room" data-id="${room.id}">Editar</button>
            <button class="btn-danger delete-room" data-id="${room.id}">Eliminar</button>
          </div>
        </div>
      `;
      listContainer.appendChild(card);
    });

    this.querySelectorAll(".edit-room").forEach((btn) =>
      btn.addEventListener("click", (e) => this.editRoom(e.target.dataset.id))
    );

    this.querySelectorAll(".delete-room").forEach((btn) =>
      btn.addEventListener("click", (e) => this.deleteRoom(e.target.dataset.id))
    );
  }

  openRoomForm(room = null) {
    this.editingRoom = room;

    const container = this.querySelector("#roomFormContainer");
    container.classList.remove("hidden");

    container.innerHTML = `
      <div class="room-form-container">
        <h3>${room ? "Editar habitación" : "Añadir nueva habitación"}</h3>
        <form id="roomForm" class="room-form">
          <label>Título</label>
          <input type="text" name="title" value="${room?.title || ""}" required />

          <label>Slug (único)</label>
          <input type="text" name="slug" value="${room?.slug || ""}" required />

          <label>Descripción</label>
          <textarea name="description" required>${room?.description || ""}</textarea>

          <label>Camas</label>
          <input type="text" name="beds" value="${room?.beds || ""}" required />

          <label>Máximo de huéspedes</label>
          <input type="number" name="maxGuests" value="${room?.maxGuests || ""}" required />

          <label>Precio por noche (COP)</label>
          <input type="number" name="pricePerNight" value="${room?.pricePerNight || ""}" required />

          <label>Servicios (separados por coma)</label>
          <input type="text" name="services" value="${room?.services?.join(", ") || ""}" required />

          <label>URLs de imágenes (mínimo 4, separadas por coma)</label>
          <textarea name="images" placeholder="Debe ser URL directas" required>${room?.images?.join(", ") || ""}</textarea>

          <label>Activa</label>
          <select name="active" required>
            <option value="true" ${room?.active ? "selected" : ""}>Sí</option>
            <option value="false" ${!room?.active ? "selected" : ""}>No</option>
          </select>

          <div class="form-buttons">
            <button type="submit" class="btn-primary">${room ? "Guardar cambios" : "Registrar habitación"}</button>
            <button type="button" class="btn-secondary" id="cancelForm">Cancelar</button>
          </div>
        </form>
      </div>
    `;

    container.querySelector("#cancelForm").addEventListener("click", () => {
      container.classList.add("hidden");
      container.innerHTML = "";
    });

    container.querySelector("#roomForm").addEventListener("submit", (e) => this.saveRoom(e));
  }

  async saveRoom(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const roomData = { ...RoomModel };

    formData.forEach((value, key) => {
      if (key === "services") {
        roomData.services = value.split(",").map((s) => s.trim());
      } else if (key === "images") {
        roomData.images = value.split(",").map((s) => s.trim());
      } else if (key === "active") {
        roomData.active = value === "true";
      } else {
        roomData[key] = value;
      }
    });

    if (this.editingRoom) {
      await patchInfo("rooms", this.editingRoom.id, roomData);
    } else {
      await postInfo("rooms", roomData);
    }

    this.querySelector("#roomFormContainer").classList.add("hidden");
    this.querySelector("#roomFormContainer").innerHTML = "";
    this.loadRooms();
  }

  async editRoom(id) {
    const room = this.rooms.find((r) => r.id == id);
    this.openRoomForm(room);
  }

  async deleteRoom(id) {
    const confirmDelete = confirm("¿Seguro que deseas eliminar esta habitación?");
    if (!confirmDelete) return;
    await deleteInfo("rooms", id);
    this.loadRooms();
  }
}

customElements.define("gsrooms-component", GsroomsComponent);
