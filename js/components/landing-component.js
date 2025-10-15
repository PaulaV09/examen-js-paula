import { getInfo } from "../api/crudApi.js";
import "/js/components/detalle-component.js";

export class LandingComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.slides = [];
    this.testimonials = [
      {
        name: "María G.",
        text: "Un lugar maravilloso, atención impecable.",
        rating: 5,
      },
      {
        name: "Andrés P.",
        text: "Desconexión total. Volvería sin dudarlo.",
        rating: 5,
      },
      { name: "Lucía R.", text: "Ambiente y comida excelentes.", rating: 5 },
    ];

    this._carouselIndex = 0;
    this._testiIndex = 0;
    this._autoPlayTimer = null;
  }

  async connectedCallback() {
    await this.loadRoomsFromDB();
    this.render();
    this.cache();
    this.attachEvents();
    this.startAutoplay();
    this.startTestimonialsAutoplay();
  }

  disconnectedCallback() {
    this.stopAutoplay();
    this.stopTestimonialsAutoplay();
  }

  async loadRoomsFromDB() {
    try {
      const data = await getInfo("rooms");
      if (Array.isArray(data)) {
        this.slides = data
          .filter((room) => room.active === true)
          .slice(0, 6)
          .map((room) => ({
            img: room.images?.[0] || "../../assets/images/default-room.jpg",
            title: room.title,
            price: `Desde COP ${room.pricePerNight} / noche`,
            id: room.id,
            description: room.description,
            beds: room.beds,
            maxGuests: room.maxGuests,
            services: room.services,
          }));
      } else {
        console.warn("⚠️ No se obtuvieron habitaciones válidas desde la API.");
      }
    } catch (err) {
      console.error("❌ Error al cargar habitaciones:", err);
    }
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "../../css/landing.css";
      </style>

      <section class="hero" id="hero">
        <div class="hero-media" aria-hidden="true"></div>
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <h1>Descubre la serenidad en <span>El Rincón del Carmen</span></h1>
          <p class="hero-sub">Un refugio natural donde el confort y la calidez se encuentran.</p>
          <div class="hero-ctas">
            <button class="btn btn-primary" id="viewRoomsBtn">🛏️ Ver habitaciones</button>
            <button class="btn btn-ghost" id="reserveBtn">📅 Reservar ahora</button>
          </div>
        </div>
      </section>

      <section class="section carousel-section" id="rooms">
        <div class="section-header">
          <h2>Nuestras habitaciones</h2>
          <p>Espacios pensados para tu descanso — elegancia y comodidad en cada detalle.</p>
        </div>

        <div class="carousel" aria-roledescription="carousel">
          <div class="carousel-track"></div>
          <button class="carousel-btn prev" aria-label="Anterior">‹</button>
          <button class="carousel-btn next" aria-label="Siguiente">›</button>
          <div class="carousel-dots"></div>
        </div>
      </section>

      <section class="section services-section">
        <h3>Servicios destacados</h3>
        <div class="services-grid">
          <article class="service-card">
            <div class="service-icon">🍽️</div>
            <h4>Restaurante gourmet</h4>
            <p>Sabores locales con técnica internacional.</p>
          </article>

          <article class="service-card">
            <div class="service-icon">💆</div>
            <h4>Spa & Zonas húmedas</h4>
            <p>Rituales y relajación para reconectar.</p>
          </article>

          <article class="service-card">
            <div class="service-icon">🌿</div>
            <h4>Jardines naturales</h4>
            <p>Paseos y espacios para disfrutar la naturaleza.</p>
          </article>

          <article class="service-card">
            <div class="service-icon">💻</div>
            <h4>WiFi & Workspace</h4>
            <p>Conectividad y zonas tranquilas para trabajar.</p>
          </article>
        </div>
      </section>

      <section class="section gallery-section">
        <h3>Momentos en el Rincón</h3>
        <div class="gallery-grid">
          <img src="../../assets/images/gallery-1.jpg" alt="Piscina" data-full="../../assets/images/gallery-1.jpg">
          <img src="../../assets/images/gallery-2.jpg" alt="Comedor" data-full="../../assets/images/gallery-2.jpg">
          <img src="../../assets/images/gallery-3.jpg" alt="Habitación" data-full="../../assets/images/gallery-3.jpg">
          <img src="../../assets/images/gallery-4.jpg" alt="Jardines" data-full="../../assets/images/gallery-4.jpg">
        </div>
      </section>

      <section class="section why-section">
        <h3>Porqué elegirnos?</h3>
        <div class="why-grid">
          <div class="why-card">
            <h4>Atención personalizada</h4>
            <p>Nuestro equipo cuida cada detalle durante tu estadía.</p>
          </div>
          <div class="why-card">
            <h4>Entorno natural privilegiado</h4>
            <p>Despierta con paisajes que invitan a la calma.</p>
          </div>
          <div class="why-card">
            <h4>Ambiente de paz y descanso</h4>
            <p>Habitaciones diseñadas para favorecer el sueño reparador.</p>
          </div>
          <div class="why-card">
            <h4>Precios justos y transparentes</h4>
            <p>Ofrecemos tarifas claras sin sorpresas.</p>
          </div>
        </div>
      </section>

      <section class="section testimonios">
        <h3>Lo que dicen nuestros huéspedes</h3>
        <div class="testimonios-grid">
          ${this.testimonials
            .map(
              (t) => `
              <div class="flip-card">
                <div class="flip-card-inner">
                  <div class="flip-card-front">
                    <h4>${t.name}</h4>
                    <p>${"⭐".repeat(t.rating)}</p>
                  </div>
                  <div class="flip-card-back">
                    <p>"${t.text}"</p>
                  </div>
                </div>
              </div>
            `
            )
            .join("")}
        </div>
      </section>

      <section class="section cta-final">
        <div class="cta-inner">
          <h2>Vive la experiencia Rincón del Carmen</h2>
          <p>Reserva hoy tu descanso ideal.</p>
          <div class="cta-actions">
            <button class="btn btn-primary" id="finalReserve">Reservar ahora</button>
          </div>
        </div>
      </section>

      <div class="lightbox" id="lightbox" aria-hidden="true">
        <div class="lightbox-inner">
          <button class="lb-close" id="lbClose" aria-label="Cerrar">✕</button>
          <img src="" alt="" id="lbImage">
        </div>
      </div>
    `;
  }

  cache() {
    this.$ = {
      hero: this.shadowRoot.querySelector(".hero"),
      heroMedia: this.shadowRoot.querySelector(".hero-media"),
      viewRoomsBtn: this.shadowRoot.querySelector("#viewRoomsBtn"),
      reserveBtn: this.shadowRoot.querySelector("#reserveBtn"),
      carouselTrack: this.shadowRoot.querySelector(".carousel-track"),
      prevBtn: this.shadowRoot.querySelector(".carousel-btn.prev"),
      nextBtn: this.shadowRoot.querySelector(".carousel-btn.next"),
      dots: this.shadowRoot.querySelector(".carousel-dots"),
      gallery: this.shadowRoot.querySelectorAll(".gallery-grid img"),
      lightbox: this.shadowRoot.querySelector("#lightbox"),
      lbImage: this.shadowRoot.querySelector("#lbImage"),
      lbClose: this.shadowRoot.querySelector("#lbClose"),
      finalReserve: this.shadowRoot.querySelector("#finalReserve"),
    };
  }

  attachEvents() {
    window.addEventListener("scroll", () => {
      const rect = this.$.hero.getBoundingClientRect();
      const offset = Math.min(Math.max(-rect.top / 6, -40), 40);
      this.$.heroMedia.style.transform = `translateY(${offset}px) scale(1.05)`;
    });

    this.$.viewRoomsBtn.addEventListener("click", () =>
      this.scrollToSection("#rooms")
    );
    this.$.reserveBtn.addEventListener(
      "click",
      () => (window.location.href = "../../pages/user/reservas.html")
    );
    this.$.finalReserve.addEventListener(
      "click",
      () => (window.location.href = "../../pages/user/reservas.html")
    );

    this.buildCarousel();

    this.$.nextBtn.addEventListener("click", () => this.nextSlide());
    this.$.prevBtn.addEventListener("click", () => this.prevSlide());
    this.$.dots.addEventListener("click", (e) => {
      if (e.target.matches(".dot")) {
        const idx = Number(e.target.dataset.index);
        this.goToSlide(idx);
      }
    });

    this.addCarouselTouch();

    this.$.gallery.forEach((img) => {
      img.addEventListener("click", () => {
        const src = img.dataset.full || img.src;
        this.openLightbox(src, img.alt);
      });
    });
    this.$.lbClose.addEventListener("click", () => this.closeLightbox());
    this.$.lightbox.addEventListener("click", (e) => {
      if (e.target === this.$.lightbox) this.closeLightbox();
    });
  }

  scrollToSection(selector) {
    const pageEl =
      document.querySelector(selector) ||
      document.getElementById(selector.replace("#", ""));
    if (pageEl) {
      pageEl.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const el = this.shadowRoot.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  buildCarousel() {
    this.$.carouselTrack.innerHTML = "";
    this.$.dots.innerHTML = "";

    this.slides.forEach((s, i) => {
      const slide = document.createElement("div");
      slide.className = "carousel-slide";
      slide.innerHTML = `
        <div class="slide-inner">
          <img src="${s.img}" alt="${s.title}">
          <div class="slide-meta">
            <h4>${s.title}</h4>
            <p class="price">${s.price}</p>
            <p class="desc">${s.description}</p>
            <p class="info">🛏️ ${s.beds}</p>
            <p class="info">👥 Max ${s.maxGuests} huéspedes</p>
            <div class="services">
              ${s.services
                .map((sv) => `<span class="service-tag">${sv}</span>`)
                .join("\n \n")}
            </div>
            <button class="btn view-more" data-id="${s.id}">Ver más</button>
          </div>
        </div>
      `;
      this.$.carouselTrack.appendChild(slide);

      const dot = document.createElement("button");
      dot.className = "dot";
      dot.dataset.index = i;
      if (i === 0) dot.classList.add("active");
      this.$.dots.appendChild(dot);

      slide.querySelector(".view-more").addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openRoomDetail(s.id);
      });
    });

    this.openRoomDetail = (room) => {
      const modal = document.createElement("detalle-component");
      modal.setAttribute("room-id", room);
      document.body.appendChild(modal);
      document.body.style.overflow = "hidden";
    };

    this.updateCarouselPosition();
  }

  updateCarouselPosition() {
    const slides = this.shadowRoot.querySelectorAll(".carousel-slide");
    const width = slides[0]?.clientWidth || 0;
    this.$.carouselTrack.style.transform = `translateX(-${
      this._carouselIndex * (width + 24)
    }px)`;
    this.$.dots
      .querySelectorAll(".dot")
      .forEach((d, i) =>
        d.classList.toggle("active", i === this._carouselIndex)
      );
  }

  nextSlide() {
    this._carouselIndex = (this._carouselIndex + 1) % this.slides.length;
    this.updateCarouselPosition();
  }
  prevSlide() {
    this._carouselIndex =
      (this._carouselIndex - 1 + this.slides.length) % this.slides.length;
    this.updateCarouselPosition();
  }
  goToSlide(idx) {
    this._carouselIndex = idx;
    this.updateCarouselPosition();
  }

  addCarouselTouch() {
    const track = this.$.carouselTrack;
    let startX = 0,
      currentX = 0,
      dragging = false;

    track.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        dragging = true;
        this.stopAutoplay();
      },
      { passive: true }
    );

    track.addEventListener(
      "touchmove",
      (e) => {
        if (!dragging) return;
        currentX = e.touches[0].clientX;
        const dx = currentX - startX;
        track.style.transition = "none";
        track.style.transform = `translateX(${
          -this._carouselIndex *
            (track.querySelector(".carousel-slide")?.clientWidth + 24) +
          dx
        }px)`;
      },
      { passive: true }
    );

    track.addEventListener("touchend", () => {
      dragging = false;
      track.style.transition = "";
      const dx = currentX - startX;
      if (dx > 60) this.prevSlide();
      else if (dx < -60) this.nextSlide();
      this.startAutoplay();
    });
  }

  startAutoplay() {
    this.stopAutoplay();
    this._autoPlayTimer = setInterval(() => this.nextSlide(), 4500);
  }
  stopAutoplay() {
    if (this._autoPlayTimer) clearInterval(this._autoPlayTimer);
  }

  openLightbox(src, alt = "") {
    this.$.lbImage.src = src;
    this.$.lbImage.alt = alt;
    this.$.lightbox.classList.add("open");
  }
  closeLightbox() {
    this.$.lbImage.src = "";
    this.$.lightbox.classList.remove("open");
  }

  startTestimonialsAutoplay() {
    this.stopTestimonialsAutoplay();
    this._testiTimer = setInterval(() => this.nextTestimonial(), 5000);
  }
  stopTestimonialsAutoplay() {
    if (this._testiTimer) clearInterval(this._testiTimer);
  }
  nextTestimonial() {
    this._testiIndex = (this._testiIndex + 1) % this.testimonials.length;
  }
}

customElements.define("landing-component", LandingComponent);
