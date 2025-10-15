import { patchInfo } from "../api/crudApi.js";

export class PerfilComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.user = JSON.parse(localStorage.getItem("currentUser")) || null;
    this.isEditing = false;
  }

  connectedCallback() {
    this.render();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.render();
  }

  async saveChanges(e) {
    e.preventDefault();

    const formData = new FormData(this.shadowRoot.querySelector("#editForm"));
    const updatedUser = {
      nacionalidad: formData.get("nacionalidad"),
      email: formData.get("email"),
      telefono: formData.get("telefono"),
      password: formData.get("password"),
    };

    try {
      const updated = await patchInfo("users", this.user.id, updatedUser);

      if (updated) {
        const newUser = { ...this.user, ...updatedUser };
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        this.user = newUser;
        this.isEditing = false;
        this.render();
        this.showMessage("Datos actualizados correctamente.", "success");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      this.showMessage("Hubo un error al guardar los cambios.", "error");
    }
  }

  showMessage(text, type) {
    const msg = this.shadowRoot.querySelector("#message");
    msg.textContent = text;
    msg.className = `message ${type}`;
    msg.style.display = "block";
    setTimeout(() => (msg.style.display = "none"), 4000);
  }

  render() {
    const {
      fullName,
      identificacion,
      nacionalidad,
      email,
      telefono,
      password,
    } = this.user || {};

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../../css/perfil.css">
      <section class="profile-container">
        <div class="profile-card">
          <div class="avatar">
            <div class="avatar-circle">${
              fullName?.charAt(0).toUpperCase() || "U"
            }</div>
          </div>

          <h2>${fullName || "Usuario"}</h2>
          <p class="id">Identificación: <strong>${identificacion}</strong></p>

          ${
            this.isEditing
              ? `
            <form id="editForm" class="edit-form">
              <label>Nacionalidad</label>
              <input type="text" name="nacionalidad" value="${
                nacionalidad || ""
              }" required>

              <label>Correo electrónico</label>
              <input type="email" name="email" value="${email || ""}" required>

              <label>Teléfono</label>
              <input type="text" name="telefono" value="${
                telefono || ""
              }" required>

              <label>Contraseña</label>
              <input type="password" name="password" value="${
                password || ""
              }" required>

              <div class="actions">
                <button type="submit" class="btn save">Guardar cambios</button>
                <button type="button" class="btn cancel">Cancelar</button>
              </div>
            </form>
          `
              : `
            <div class="info">
              <p><strong>Nacionalidad:</strong> ${nacionalidad}</p>
              <p><strong>Correo:</strong> ${email}</p>
              <p><strong>Teléfono:</strong> ${telefono}</p>
              <p><strong>Contraseña:</strong> ${"*".repeat(password.length)}</p>
            </div>
            <button class="btn edit">Actualizar datos</button>
          `
          }

          <div id="message" class="message"></div>
        </div>
      </section>
    `;

    if (this.isEditing) {
      this.shadowRoot
        .querySelector("#editForm")
        .addEventListener("submit", (e) => this.saveChanges(e));
      this.shadowRoot
        .querySelector(".cancel")
        .addEventListener("click", () => this.toggleEdit());
    } else {
      this.shadowRoot
        .querySelector(".edit")
        .addEventListener("click", () => this.toggleEdit());
    }
  }
}

customElements.define("perfil-component", PerfilComponent);
