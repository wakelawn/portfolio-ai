const yearEl = document.getElementById("year");
const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.getElementById("mobile-nav");
const galaxyCanvas = document.getElementById("galaxy-canvas");
const introGalaxyCanvas = document.getElementById("intro-galaxy-canvas");
const introGate = document.getElementById("intro-gate");
const introEnter = document.getElementById("intro-enter");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

function initGalaxyBackground(canvas, options = {}) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const {
    starCount = 220,
    speedMultiplier = 1,
    centerXFactor = 0.58,
    centerYFactor = 0.42,
    radiusFactor = 0.42,
    opacityBoost = 1,
  } = options;
  const stars = [];

  let width = 0;
  let height = 0;
  let centerX = 0;
  let centerY = 0;
  let radius = 0;

  for (let i = 0; i < starCount; i += 1) {
    stars.push({
      orbit: 0,
      angle: Math.random() * Math.PI * 2,
      size: 0.6 + Math.random() * 1.6,
      speed: (0.00015 + Math.random() * 0.0006) * speedMultiplier,
      alpha: 0.2 + Math.random() * 0.65,
    });
  }

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    centerX = width * centerXFactor;
    centerY = height * centerYFactor;
    radius = Math.min(width, height) * radiusFactor;

    stars.forEach((star) => {
      star.orbit = radius * (0.12 + Math.random() * 1.05);
    });
  };

  const drawNebula = (time) => {
    const t = time * 0.00008;

    const glowA = ctx.createRadialGradient(
      centerX + Math.cos(t) * 35,
      centerY + Math.sin(t * 0.9) * 24,
      0,
      centerX,
      centerY,
      radius * 0.92
    );
    glowA.addColorStop(0, `rgba(118, 158, 255, ${0.18 * opacityBoost})`);
    glowA.addColorStop(0.35, `rgba(64, 96, 176, ${0.14 * opacityBoost})`);
    glowA.addColorStop(1, "rgba(5, 8, 15, 0)");
    ctx.fillStyle = glowA;
    ctx.fillRect(0, 0, width, height);

    const glowB = ctx.createRadialGradient(
      centerX - radius * 0.34,
      centerY + radius * 0.24,
      0,
      centerX - radius * 0.34,
      centerY + radius * 0.24,
      radius * 0.8
    );
    glowB.addColorStop(0, `rgba(98, 137, 215, ${0.12 * opacityBoost})`);
    glowB.addColorStop(1, "rgba(8, 12, 22, 0)");
    ctx.fillStyle = glowB;
    ctx.fillRect(0, 0, width, height);
  };

  const drawStars = () => {
    for (let i = 0; i < stars.length; i += 1) {
      const star = stars[i];
      const x = centerX + Math.cos(star.angle) * star.orbit;
      const y = centerY + Math.sin(star.angle) * star.orbit * 0.52;

      ctx.beginPath();
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(226, 238, 255, ${Math.min(star.alpha * opacityBoost, 1)})`;
      ctx.fill();
    }
  };

  const drawCore = () => {
    const core = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.22);
    core.addColorStop(0, `rgba(224, 239, 255, ${Math.min(0.9 * opacityBoost, 1)})`);
    core.addColorStop(0.35, `rgba(134, 175, 255, ${Math.min(0.45 * opacityBoost, 1)})`);
    core.addColorStop(1, "rgba(10, 16, 30, 0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.22, 0, Math.PI * 2);
    ctx.fill();
  };

  const step = (time) => {
    ctx.clearRect(0, 0, width, height);

    const backdrop = ctx.createLinearGradient(0, 0, 0, height);
    backdrop.addColorStop(0, "#02040a");
    backdrop.addColorStop(0.45, "#060d1b");
    backdrop.addColorStop(1, "#091224");
    ctx.fillStyle = backdrop;
    ctx.fillRect(0, 0, width, height);

    drawNebula(time);
    drawStars();
    drawCore();

    if (!reducedMotion) {
      for (let i = 0; i < stars.length; i += 1) {
        stars[i].angle += stars[i].speed;
      }
      requestAnimationFrame(step);
    }
  };

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(step);
}

if (introEnter && introGate) {
  const enterPortfolio = () => {
    if (!document.body.classList.contains("intro-active")) {
      return;
    }

    document.body.classList.add("intro-entering");

    window.setTimeout(() => {
      document.body.classList.remove("intro-active", "intro-entering");
      document.body.classList.add("intro-complete");
      introGate.setAttribute("aria-hidden", "true");
    }, 1150);
  };

  introEnter.addEventListener("click", enterPortfolio);
  introGate.addEventListener("click", (event) => {
    if (event.target === introGate || event.target === introGalaxyCanvas) {
      enterPortfolio();
    }
  });
}

initGalaxyBackground(introGalaxyCanvas, {
  starCount: 300,
  speedMultiplier: 1.8,
  centerXFactor: 0.5,
  centerYFactor: 0.5,
  radiusFactor: 0.5,
  opacityBoost: 1.15,
});

initGalaxyBackground(galaxyCanvas, {
  starCount: 180,
  speedMultiplier: 0.8,
  centerXFactor: 0.62,
  centerYFactor: 0.38,
  radiusFactor: 0.4,
  opacityBoost: 0.9,
});

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("show");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("show");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}
