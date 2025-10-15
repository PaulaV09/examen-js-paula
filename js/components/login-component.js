import { findInfo } from "../api/crudApi.js";

export class LoginComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEvents();
  }

  addEvents() {
    const form = this.shadowRoot.querySelector(".login-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = this.shadowRoot.querySelector("#username").value.trim();
      const password = this.shadowRoot.querySelector("#password").value.trim();

      if (!email || !password) {
        alert("Por favor ingresa tu correo y contraseña.");
        return;
      }

      try {
        const users = await findInfo("users", { email });

        if (!users || users.length === 0) {
          alert("❌ No se encontró ningún usuario con ese correo.");
          return;
        }

        const user = users[0];
        if (user.password !== password) {
          alert("❌ Contraseña incorrecta. Intenta nuevamente.");
          return;
        }

        localStorage.setItem("currentUser", JSON.stringify(user));

        alert(`✅ Bienvenido, ${user.fullName}`);

        if (user.role === "admin") {
          window.location.href = "../../pages/admin/gsRooms.html";
        } else {
          window.location.href = "../../pages/user/inicio.html";
        }
      } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        alert("❌ Error al iniciar sesión. Intenta más tarde.");
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "../../css/login.css";
      </style>

      <div class="login-container">
        <h2>Iniciar sesión</h2>
        <form class="login-form">
          <div class="form-group">
            <label for="username">Correo electrónico</label>
            <input type="email" id="username" name="username" placeholder="Ingresa tu correo" required>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" name="password" placeholder="Tu contraseña" required>
          </div>

          <button type="submit" class="btn-login">Iniciar sesión</button>

          <p class="register-text">
            ¿No tienes cuenta?
            <a href="../../pages/public/register.html" id="register-link">Regístrate aquí</a>
          </p>
        </form>
      </div>
    `;
  }
}

customElements.define("login-component", LoginComponent);
