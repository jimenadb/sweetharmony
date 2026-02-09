document.addEventListener("DOMContentLoaded", () => {
  // Configuración
  const config = {
    text: "Volver al inicio",
    destination: "http://localhost/sweetharmony/sweetharmony/dashboard/html/Dashboard.html",
    colors: {
      primary: "hsl(148, 20%, 38%)",
      primaryDark: "hsl(148, 20%, 28%)",
      text: "#ffffff",
      shadow: "rgba(103, 162, 135, 0.3)"
    },
    position: { top: "24px", left: "24px" },
    icon: `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    `
  };

  // Crear botón
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "modern-back-btn";
  btn.setAttribute("aria-label", config.text);
  btn.setAttribute("role", "navigation");

  // Contenedor interno
  const btnContent = document.createElement("span");
  btnContent.className = "btn-content";
  
  // Icono SVG
  const iconContainer = document.createElement("span");
  iconContainer.className = "btn-icon";
  iconContainer.innerHTML = config.icon;
  
  // Texto
  const textSpan = document.createElement("span");
  textSpan.className = "btn-text";
  textSpan.textContent = config.text;

  // Ensamblar
  btnContent.appendChild(iconContainer);
  btnContent.appendChild(textSpan);
  btn.appendChild(btnContent);

  // Estilos CSS-in-JS con variables CSS
  const styles = `
    .modern-back-btn {
      --primary: ${config.colors.primary};
      --primary-dark: ${config.colors.primaryDark};
      --text: ${config.colors.text};
      --shadow: ${config.colors.shadow};
      --radius: 999px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      position: fixed;
      top: ${config.position.top};
      left: ${config.position.left};
      padding: 0;
      font-family: 'Urbanist', system-ui, -apple-system, sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text);
      background: var(--primary);
      border: none;
      border-radius: var(--radius);
      cursor: pointer;
      z-index: 9999;
      overflow: hidden;
      transition: var(--transition);
      box-shadow: 
        0 4px 12px var(--shadow),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .modern-back-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 50%,
        rgba(255, 255, 255, 0.05) 100%
      );
      border-radius: var(--radius);
      z-index: 1;
    }

    .modern-back-btn::after {
      content: '';
      position: absolute;
      inset: 1px;
      background: var(--primary);
      border-radius: calc(var(--radius) - 1px);
      z-index: 2;
      transition: var(--transition);
    }

    .btn-content {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0.85rem 1.6rem;
      z-index: 3;
    }

    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
      margin-right: 2px;
    }

    .btn-text {
      letter-spacing: 0.3px;
      transition: transform 0.3s ease;
    }

    /* Estados */
    .modern-back-btn:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 8px 24px var(--shadow),
        0 0 0 1px rgba(255, 255, 255, 0.15) inset;
    }

    .modern-back-btn:hover::after {
      background: var(--primary-dark);
    }

    .modern-back-btn:hover .btn-icon {
      transform: translateX(-3px);
    }

    .modern-back-btn:hover .btn-text {
      transform: translateX(1px);
    }

    .modern-back-btn:active {
      transform: translateY(0) scale(0.98);
      transition: transform 0.1s ease;
    }

    .modern-back-btn:focus {
      outline: none;
      box-shadow: 
        0 0 0 3px rgba(103, 162, 135, 0.4),
        0 8px 24px var(--shadow);
    }

    /* Ripple effect */
    .modern-back-btn .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      transform: scale(0);
      animation: ripple 0.6s linear;
      z-index: 1;
    }

    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    /* Animación de entrada */
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .modern-back-btn {
      animation: slideIn 0.5s ease-out;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .modern-back-btn {
        top: 16px;
        left: 16px;
        font-size: 0.9rem;
      }
      
      .btn-content {
        padding: 0.7rem 1.4rem;
        gap: 8px;
      }
    }

    @media (max-width: 480px) {
      .modern-back-btn {
        padding: 0.6rem 1.2rem;
        font-size: 0.85rem;
      }
      
      .btn-icon svg {
        width: 16px;
        height: 16px;
      }
    }

    /* Modo oscuro automático */
    @media (prefers-color-scheme: dark) {
      .modern-back-btn {
        box-shadow: 
          0 4px 16px rgba(0, 0, 0, 0.3),
          0 0 0 1px rgba(255, 255, 255, 0.05) inset;
      }
      
      .modern-back-btn:hover {
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      }
    }
  `;

  // Inyectar estilos
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Eventos
  btn.addEventListener("click", (e) => {
    // Efecto ripple
    createRipple(e, btn);
    
    // Navegación con pequeño retraso para el efecto
    setTimeout(() => {
      window.location.href = config.destination;
    }, 300);
  });

  // Función efecto ripple
  function createRipple(event, element) {
    const circle = document.createElement("span");
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - element.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - element.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");

    const ripple = element.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    element.appendChild(circle);
  }

  // Atajo de teclado (Alt + V)
  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.key === "v") {
      e.preventDefault();
      btn.click();
    }
  });

  // Inyectar en el DOM
  document.body.appendChild(btn);

  // Log en desarrollo
  if (window.location.hostname === "localhost") {
    console.log("🚀 Botón moderno 'Volver al inicio' cargado");
    console.log("📌 Atajo de teclado: Alt + V");
  }
});