const mobileMenuButton = document.getElementById("mobile-menu-button");
   const mobileMenu = document.getElementById("mobile-menu");
   const loader = document.getElementById("loader");
   const mainContent = document.getElementById("main-content");
   const modal = document.getElementById("modal");
   const modalClose = document.getElementById("modal-close");
   const modalDesc = document.getElementById("modal-desc");
   const btnContact = document.getElementById("btn-contact");

   mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
   });

   // Optional: close mobile menu when clicking a link
   mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
     mobileMenu.classList.add("hidden");
    });
   });

   // Animate loader bar and then hide loader and show main content
   window.addEventListener("load", () => {
    setTimeout(() => {
     loader.style.display = "none";
     mainContent.classList.remove("hidden");
    }, 2200);
   });

   // Modal content for each button
   const infoContent = {
    web: `
        <p>Aprende paso a paso a crear y administrar tu propio sitio web, desde el diseño hasta la publicación en internet.</p>
        <ul class="list-disc list-inside mt-2">
          <li>Diseño web moderno y responsivo</li>
          <li>Herramientas para crear páginas sin código</li>
          <li>Optimización para motores de búsqueda (SEO)</li>
          <li>Publicación y mantenimiento sencillo</li>
        </ul>
      `,
    hosting: `
        <p>Alquilar un hosting te ofrece múltiples beneficios para tu sitio web o proyecto digital:</p>
        <ul class="list-disc list-inside mt-2">
          <li>Alta disponibilidad y uptime garantizado para que tu sitio esté siempre en línea.</li>
          <li>Soporte técnico especializado para resolver cualquier inconveniente rápidamente.</li>
          <li>Escalabilidad para crecer con tu negocio sin complicaciones.</li>
          <li>Seguridad avanzada para proteger tus datos y los de tus usuarios.</li>
          <li>Acceso a herramientas y paneles de control fáciles de usar.</li>
        </ul>
      `,
    accessories: `
        <p>Linux es un sistema operativo robusto y seguro, ideal para servidores y entornos profesionales.</p>
        <ul class="list-disc list-inside mt-2">
          <li>Estabilidad y rendimiento confiable</li>
          <li>Amplio soporte de software y comunidad</li>
          <li>Alta seguridad y personalización</li>
          <li>Ideal para proyectos de hosting y desarrollo</li>
        </ul>
      `,
    investment: `
        <p>La inversión inteligente te permite maximizar tus recursos y obtener mejores rendimientos con menor riesgo.</p>
        <ul class="list-disc list-inside mt-2">
          <li>Diversificación de portafolio</li>
          <li>Análisis de mercado y tendencias</li>
          <li>Gestión profesional de inversiones</li>
          <li>Optimización fiscal y financiera</li>
        </ul>
      `,
    bundles: `
        <p>Nuestros paquetes combinan planes de internet con accesorios y servicios adicionales para el mejor valor.</p>
        <ul class="list-disc list-inside mt-2">
          <li>Paquete Inicial: Internet básico con accesorios esenciales</li>
          <li>Paquete Familiar: Internet de alta velocidad con soporte para múltiples dispositivos</li>
        </ul>
      `,
    support: `
        <p>Ofrecemos soporte técnico profesional para ayudarte a resolver cualquier problema y optimizar tu experiencia digital.</p>
        <ul class="list-disc list-inside mt-2">
          <li>Asistencia 24/7</li>
          <li>Soluciones rápidas y efectivas</li>
          <li>Asesoría personalizada</li>
          <li>Monitoreo y mantenimiento preventivo</li>
        </ul>
      `,
   };

   // Show modal with content
   function showModal(content) {
    modalDesc.innerHTML =
     content + `<div class="mt-6 flex justify-end"><button id="modal-back" class="btn-minimal">Volver</button></div>`;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    // Add event listener for the new "Volver" button
    const modalBack = document.getElementById("modal-back");
    if (modalBack) {
     modalBack.addEventListener("click", () => {
      hideModal();
     });
    }
   }

   // Hide modal
   function hideModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
   }

   // Attach event listeners to buttons
   document.getElementById("btn-web").addEventListener("click", () => {
    showModal(infoContent.web);
   });
   document.getElementById("btn-hosting").addEventListener("click", () => {
    showModal(infoContent.hosting);
   });
   document.getElementById("btn-accessories").addEventListener("click", () => {
    showModal(infoContent.accessories);
   });
   document.getElementById("btn-investment").addEventListener("click", () => {
    showModal(infoContent.investment);
   });
   document.getElementById("btn-bundles").addEventListener("click", () => {
    showModal(infoContent.bundles);
   });
   document.getElementById("btn-support").addEventListener("click", () => {
    // Enviar correo a soportegetorg2021@gmail.com
    window.location.href = "mailto:soportegetorg2021@gmail.com";
   });
   btnContact.addEventListener("click", () => {
    // Scroll to top or main content
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Close modal if open
    hideModal();
   });

   document.getElementById("modal-close").addEventListener("click", hideModal);

   // Close modal on outside click
   modal.addEventListener("click", (e) => {
    if (e.target === modal) {
     hideModal();
    }
   });

   // Close modal on Escape key
   window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
     hideModal();
    }
   });

   // Accessibility buttons
   const btnIncreaseFont = document.getElementById("btn-increase-font");
   const btnDecreaseFont = document.getElementById("btn-decrease-font");
   const btnToggleContrast = document.getElementById("btn-toggle-contrast");

   btnIncreaseFont?.addEventListener("click", () => {
    const currentSize = parseFloat(
     getComputedStyle(document.documentElement).fontSize
    );
    if (currentSize < 22) {
     document.documentElement.style.fontSize = currentSize + 1 + "px";
    }
   });

   btnDecreaseFont?.addEventListener("click", () => {
    const currentSize = parseFloat(
     getComputedStyle(document.documentElement).fontSize
    );
    if (currentSize > 12) {
     document.documentElement.style.fontSize = currentSize - 1 + "px";
    }
   });

   btnToggleContrast?.addEventListener("click", () => {
    document.body.classList.toggle("high-contrast");
   });