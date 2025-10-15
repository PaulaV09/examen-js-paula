import { postInfo, findInfo } from "../api/crudApi.js";
import UserModel from "../models/userModel.js";

export class RegisterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEvents();
  }

  addEvents() {
    const form = this.shadowRoot.querySelector(".register-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const identificacion = this.shadowRoot
        .querySelector("#identificacion")
        .value.trim();
      const fullName = this.shadowRoot.querySelector("#nombre").value.trim();
      const nacionalidad = this.shadowRoot
        .querySelector("#nacionalidad")
        .value.trim();
      const email = this.shadowRoot.querySelector("#email").value.trim();
      const telefono = this.shadowRoot.querySelector("#telefono").value.trim();
      const password = this.shadowRoot.querySelector("#password").value.trim();

      if (
        !identificacion ||
        !fullName ||
        !nacionalidad ||
        !email ||
        !telefono ||
        !password
      ) {
        alert("Por favor completa todos los campos.");
        return;
      }

      try {
        // Verificar duplicados
        const [existingUser, existingId] = await Promise.all([
          findInfo("users", { email }),
          findInfo("users", { identificacion }),
        ]);

        if (
          (existingUser && existingUser.length > 0) ||
          (existingId && existingId.length > 0)
        ) {
          alert("Ya existe un usuario con este correo o identificación.");
          return;
        }

        const newUser = { ...UserModel };
        newUser.identificacion = identificacion;
        newUser.fullName = fullName;
        newUser.nacionalidad = nacionalidad;
        newUser.email = email;
        newUser.telefono = telefono;
        newUser.password = password;

        await postInfo("users", newUser);

        alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
        form.reset();

        window.location.href = "../../pages/public/login.html";
      } catch (error) {
        console.error("Error al registrar usuario:", error);
        alert("❌ No se pudo completar el registro. Intenta nuevamente.");
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "../../css/register.css";
      </style>
      <div class="register-container">
        <h2>Crear cuenta</h2>
        <form class="register-form">
          <div class="columna">
            <div class="form-group">
              <label for="identificacion">Número de identificación</label>
              <input type="text" id="identificacion" name="identificacion" placeholder="Ingresa tu número de identificación" required />
            </div>

            <div class="form-group">
              <label for="nombre">Nombre completo</label>
              <input type="text" id="nombre" name="nombre" placeholder="Ingresa tu nombre completo" required />
            </div>

            <div class="form-group">
              <label for="nacionalidad">Nacionalidad</label>
              <input type="text" id="nacionalidad" name="nacionalidad" placeholder="Ej: Colombiana" required />
            </div>
          </div>

          <div class="columna">
            <div class="form-group">
              <label for="email">Correo electrónico</label>
              <input type="email" id="email" name="email" placeholder="Ingresa tu correo" required />
            </div>

            <div class="form-group">
              <label for="telefono">Teléfono</label>
              <input type="tel" id="telefono" name="telefono" placeholder="Ingresa tu número de contacto" required />
            </div>

            <div class="form-group">
              <label for="password">Contraseña</label>
              <input type="password" id="password" name="password" placeholder="Crea una contraseña" required />
            </div>
          </div>

          <button type="submit" class="btn-register">Registrarme</button>
        </form>

        <p class="login-text">
          ¿Ya tienes una cuenta?
          <a href="../../pages/public/login.html" id="goToLogin">Inicia sesión</a>
        </p>
      </div>
    `;
  }
}

customElements.define("register-component", RegisterComponent);
