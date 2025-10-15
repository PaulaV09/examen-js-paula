export class NavComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    setTimeout(() => {
      this.handleScroll();
      this.handleMenu();
      this.handleLogout();
    }, 0);
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.scrollHandler);
  }

  scrollHandler = () => {
    const nav = this.querySelector(".navbar");
    if (!nav) return;
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  };

  handleScroll() {
    window.addEventListener("scroll", this.scrollHandler);
  }

  handleMenu() {
    const toggle = this.querySelector(".menu-toggle");
    const menu = this.querySelector(".mobile-menu");

    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        menu.classList.toggle("active");
        toggle.classList.toggle("is-open");
      });

      menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          menu.classList.remove("active");
          toggle.classList.remove("is-open");
        });
      });
    }
  }

  handleLogout() {
    const logoutBtns = this.querySelectorAll("#logout");
    logoutBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        window.location.href = "../../index.html";
      });
    });
  }

  render() {
    const userData = JSON.parse(localStorage.getItem("currentUser"));
    const role = userData?.role || null;
    const userName = userData?.fullName?.split(" ")[0] || null;

    let navLinks = "";
    let userSection = "";
    let mobileLinks = "";

    // NAV PÚBLICO
    if (!role) {
      navLinks = `
        <a href="../../index.html">Inicio</a>
        <a href="../../pages/user/reservas.html">Reservas</a>
        <a href="../../pages/user/contacto.html">Contacto</a>
      `;
      userSection = `
        <div class="auth-buttons">
          <button class="btn btn-login" onclick="location.href='../../pages/public/login.html'">Login</button>
          <button class="btn btn-register" onclick="location.href='../../pages/public/register.html'">Registro</button>
        </div>
      `;
      mobileLinks = `
        <a href="../../index.html">Inicio</a>
        <a href="../../pages/user/reservas.html">Reservas</a>
        <a href="../../pages/user/contacto.html">Contacto</a>
        <a href="../../pages/public/login.html">Login</a>
        <a href="../../pages/public/register.html">Registro</a>
      `;
    } else if (role === "user") {
      navLinks = `
        <a href="../../pages/user/inicio.html">Inicio</a>
        <a href="../../pages/user/reservas.html">Reservas</a>
        <a href="../../pages/user/contacto.html">Contacto</a>
        <a href="../../pages/user/mis-reservas.html">Mis Reservas</a>
        <a href="../../pages/user/pqrs.html">PQRs</a>
      `;
      userSection = `
        <div class="user-menu">
          <span>Hola, ${userName} 👋</span>
          <div class="dropdown">
            <a href="#" id="logout">Cerrar sesión</a>
            <a href="../../pages/user/perfil.html">Mi perfil</a>
          </div>
        </div>
      `;
      mobileLinks = `
        <a href="../../pages/user/inicio.html">Inicio</a>
        <a href="../../pages/user/reservas.html">Reservas</a>
        <a href="../../pages/user/contacto.html">Contacto</a>
        <a href="../../pages/user/mis-reservas.html">Mis Reservas</a>
        <a href="../../pages/user/pqrs.html">PQRs</a>
        <a href="../../pages/user/perfil.html">Mi perfil</a>
        <a href="#" id="logout">Cerrar sesión</a>
      `;
    } else if (role === "admin") {
      navLinks = `
        <a href="../../pages/admin/gsRooms.html">Gestionar habitaciones</a>
        <a href="../../pages/admin/gsBookings.html">Gestionar reservas</a>
        <a href="../../pages/admin/gsPqrs.html">Gestionar PQRs</a>
      `;
      userSection = `
        <div class="user-menu">
          <span>${userName} (Admin) ⚙️</span>
          <div class="dropdown">
            <a href="#" id="logout">Cerrar sesión</a>
          </div>
        </div>
      `;
      mobileLinks = `
        <a href="../../pages/admin/gsRooms.html">Gestionar habitaciones</a>
        <a href="../../pages/admin/gsBookings.html">Gestionar reservas</a>
        <a href="../../pages/admin/gsPqrs.html">Gestionar PQRs</a>
        <a href="#" id="logout">Cerrar sesión</a>
      `;
    }

    this.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "../../css/nav.css";
      </style>
      <nav class="navbar">
        <div class="logo"><img src="../../assets/images/logo.png" alt="Logo del hotel" class="footer-logo" style="width: 5%"> Hotel Rincón del Carmen</div>
        <div class="nav-links">${navLinks}</div>
        ${userSection}
        <div class="menu-toggle" aria-label="Abrir menú">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
      </nav>

      <div class="mobile-menu">
        ${mobileLinks}
      </div>
    `;
  }
}

customElements.define("nav-component", NavComponent);
