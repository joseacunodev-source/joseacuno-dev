/* ============================================================
   JOSE ELMAR ACUNO — Portfolio Scripts
   main.js
   ============================================================ */

// Firebase analytics is initialized in index.html.

// ── EASTER EGG ──────────────────────────────────────────────────
console.log(
  "%c i know you are inspecting my elements :)",
  "color: #C6102E; font-family: 'DM Mono', monospace; font-size: 14px; font-weight: bold; padding: 8px 12px; border: 1px solid #C6102E; border-radius: 4px;"
);


// ── CUSTOM CURSOR ────────────────────────────────────────────────
const cur  = document.getElementById("cur");
const ring = document.getElementById("cur-ring");
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
let mx = 0, my = 0, rx = 0, ry = 0;

if (!isTouchDevice) {
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + "px";
    cur.style.top  = my + "px";
  });

  (function animateRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
    requestAnimationFrame(animateRing);
  })();
}


// ── LINK HOVER STATE ─────────────────────────────────────────────
if (!isTouchDevice) {
  document
    .querySelectorAll("a, button, .skill-pill, .exp-item, .num-cell")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("link-hover"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("link-hover"));
    });
}


// ── LINK HANDLING ───────────────────────────────────────────────
function scrollToSection(targetId) {
  const targetEl = document.getElementById(targetId);
  const navHeight = document.querySelector("nav")?.offsetHeight || 0;

  if (targetEl) {
    const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;
    window.scrollTo({ top, behavior: "smooth" });
    history.pushState(null, "", `#${targetId}`);
  } else {
    window.location.hash = `#${targetId}`;
  }
}

document.querySelectorAll("a, button[data-scroll-target]").forEach((el) => {
  const href   = el.getAttribute("href");
  const target = el.getAttribute("target");
  const rel    = el.getAttribute("rel");
  const scrollTarget = el.getAttribute("data-scroll-target");

  if (scrollTarget) {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToSection(scrollTarget);
      if (el.closest("#mobile-menu")) {
        closeMobileMenu();
      }
    });
    return;
  }

  if (!href) return;

  el.setAttribute("data-href", href);

  if (el.hasAttribute("download")) return;

  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      if (target === "_blank") {
        window.open(href, "_blank", rel ? `rel=${rel}` : "");
      } else {
        window.location.href = href;
      }
    });
    return;
  }

  if (href.startsWith("#")) {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToSection(href.slice(1));
      history.pushState(null, "", href);
    });
    return;
  }

  el.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = href;
  });
});


// ── TOOLTIP ──────────────────────────────────────────────────────
if (!isTouchDevice) {
  document.querySelectorAll(".research-title, .contact-link").forEach((el) => {
    const tooltip = document.getElementById("tooltip");

    el.addEventListener("mouseenter", (e) => {
      tooltip.textContent = el.classList.contains("contact-link")
        ? "pls hire this guy"
        : "psst click me";
      tooltip.style.left = e.clientX + 14 + "px";
      tooltip.style.top  = e.clientY + "px";
      tooltip.classList.add("show");
    });

    el.addEventListener("mouseleave", () => {
      tooltip.classList.remove("show");
    });

    el.addEventListener("mousemove", (e) => {
      tooltip.style.left = e.clientX + 14 + "px";
      tooltip.style.top  = e.clientY + "px";
    });
  });
}


// ── CURSOR PROJECT PREVIEWS ───────────────────────────────────────
const previewFloat = document.getElementById("preview-float");
const previewCards = document.querySelectorAll(".project-card[data-preview]");
let previewX = 0;
let previewY = 0;
let previewTargetX = 0;
let previewTargetY = 0;

function setPreviewContent(card) {
  if (!previewFloat) return;

  const text = card.dataset.preview || "";
  const image = card.dataset.image || "";

  previewFloat.innerHTML = `
    ${image ? `<img class="preview-image" src="${image}" alt="${text}">` : ""}
    <span class="preview-text">${text}</span>
  `;
}

function animatePreview() {
  if (previewFloat) {
    previewX += (previewTargetX - previewX) * 0.16;
    previewY += (previewTargetY - previewY) * 0.16;
    previewFloat.style.left = previewX + "px";
    previewFloat.style.top  = previewY + "px";
  }
  requestAnimationFrame(animatePreview);
}

if (!isTouchDevice) {
  animatePreview();

  previewCards.forEach((card) => {
    card.addEventListener("mouseenter", (e) => {
      setPreviewContent(card);
      previewTargetX = e.clientX + 110;
      previewTargetY = e.clientY - 40;
      previewX = previewTargetX;
      previewY = previewTargetY;
      previewFloat && previewFloat.classList.add("show");
    });

    card.addEventListener("mousemove", (e) => {
      previewTargetX = e.clientX + 110;
      previewTargetY = e.clientY - 40;
    });

    card.addEventListener("mouseleave", () => {
      previewFloat && previewFloat.classList.remove("show");
    });
  });
}


// ── MOBILE MENU ─────────────────────────────────────────────────
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileClose = document.getElementById("mobile-close");

function openMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.setAttribute("aria-hidden", "false");
  mobileMenu.style.display = "flex";
  requestAnimationFrame(() => mobileMenu.classList.add("open"));
  document.body.classList.add("menu-open");
  document.body.style.overflow = "hidden";
  mobileClose?.focus();
}

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove("open");
  setTimeout(() => {
    mobileMenu.style.display = "none";
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    document.body.style.overflow = "";
    menuBtn?.focus();
  }, 300);
}

menuBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (mobileMenu?.classList.contains("open")) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

mobileClose?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeMobileMenu();
});

document.querySelectorAll("#mobile-menu .mobile-nav-button").forEach((button) => {
  button.addEventListener("click", () => {
    closeMobileMenu();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu?.classList.contains("open")) closeMobileMenu();
});

// ── THEME SLIDER ─────────────────────────────────────────────────
const track     = document.getElementById("theme-track");
const thumb     = document.getElementById("theme-thumb");
const iconLight = document.getElementById("icon-light");
const iconDark  = document.getElementById("icon-dark");
const htmlEl    = document.documentElement;

const TRACK_H = 80;
const THUMB_H = 18;
const MAX_TOP = TRACK_H - THUMB_H;

let isDark   = false;
let dragging = false;
let startY   = 0;
let startTop = 0;

function getInitialTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved === "dark";
  } catch {
    // Fall back to the device preference when storage is unavailable.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function setTheme(dark) {
  isDark = dark;
  htmlEl.setAttribute("data-theme", dark ? "dark" : "light");
  try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch { /* storage unavailable */ }
  thumb.style.top = (dark ? MAX_TOP : 0) + "px";
  iconLight.classList.toggle("active", !dark);
  iconDark.classList.toggle("active", dark);
  track.setAttribute("aria-pressed", String(dark));
}

setTheme(getInitialTheme());

thumb.addEventListener("mousedown", (e) => {
  dragging = true;
  startY   = e.clientY;
  startTop = parseInt(thumb.style.top) || 0;
  e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  let newTop = startTop + (e.clientY - startY);
  newTop = Math.max(0, Math.min(MAX_TOP, newTop));
  thumb.style.top = newTop + "px";
  const frac = newTop / MAX_TOP;
  iconLight.style.opacity = frac < 0.5 ? 1 : 0.5;
  iconDark.style.opacity  = frac > 0.5 ? 1 : 0.5;
  htmlEl.setAttribute("data-theme", frac > 0.5 ? "dark" : "light");
});

document.addEventListener("mouseup", () => {
  if (!dragging) return;
  dragging = false;
  const top = parseInt(thumb.style.top) || 0;
  setTheme(top / MAX_TOP > 0.5);
});

track.addEventListener("click", () => {
  if (dragging) return;
  setTheme(!isDark);
});


// ── NAV SHRINK ON SCROLL ──────────────────────────────────────────
const nav        = document.querySelector("nav");
const COLLAPSE_Y = 40;

const updateNavState = () => {
  nav.classList.toggle("shrink", window.scrollY > COLLAPSE_Y);
};

window.addEventListener("scroll", updateNavState);
window.addEventListener("load", () => {
  updateNavState();
  window.scrollTo(0, 0);
});


// ── SCROLL REVEAL ────────────────────────────────────────────────
const revealEls = document.querySelectorAll(".r");
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("on"), i * 60);
      }
    });
  },
  { threshold: 0.1 }
);

revealEls.forEach((el) => revealObs.observe(el));


// ── SCROLL INDICATOR ─────────────────────────────────────────────
const dots        = document.querySelectorAll(".indicator-dot");
const numDots     = dots.length;
const whiteDots   = Array.from(dots).slice(0, numDots - 1);
let blinkTimeouts = [];
let blinkTriggered = false;

function stopBlinkSequence() {
  blinkTimeouts.forEach((t) => clearTimeout(t));
  blinkTimeouts = [];
}

function startBlinkSequence() {
  stopBlinkSequence();
  const blinkCount = 12;
  let step = 0;

  function blinkStep() {
    whiteDots.forEach((dot) => {
      const lit = Math.random() > 0.4;
      dot.style.backgroundColor = lit ? "#ffffff" : "rgba(255,255,255,0.2)";
      dot.style.opacity = lit ? "1" : "0.35";
    });

    step += 1;
    if (step < blinkCount) {
      const delay = 80 + Math.random() * 120;
      blinkTimeouts.push(setTimeout(blinkStep, delay));
    } else {
      whiteDots.forEach((dot) => {
        dot.style.backgroundColor = "#ffffff";
        dot.style.opacity = "1";
      });
    }
  }

  blinkStep();
}

function updateScrollIndicator() {
  const maxScroll      = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = maxScroll === 0 ? 0 : window.scrollY / maxScroll;
  const atBottom       = scrollProgress >= 0.99;
  document.getElementById("back-to-top")?.classList.toggle("show", atBottom);

  if (atBottom && !blinkTriggered) {
    blinkTriggered = true;
    startBlinkSequence();
  }
  if (!atBottom) {
    blinkTriggered = false;
    stopBlinkSequence();
  }

  dots.forEach((dot, index) => {
    if (index === numDots - 1) {
      dot.style.backgroundColor = "#C6102E";
      dot.style.opacity = "1";
    } else if (!atBottom) {
      const threshold = (index + 1) / (numDots - 1);
      if (scrollProgress >= threshold) {
        dot.style.backgroundColor = "#ffffff";
        dot.style.opacity = "1";
      } else {
        dot.style.backgroundColor = "rgba(170,170,170,0.4)";
        dot.style.opacity = "1";
      }
    }
  });
}

window.addEventListener("scroll", updateScrollIndicator);
updateScrollIndicator();

document.getElementById("back-to-top")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// ── ACHIEVEMENT IMAGE LIGHTBOX ────────────────────────────────────
const lightbox        = document.getElementById("lightbox");
const lightboxImg     = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose   = document.getElementById("lightbox-close");
let lightboxTrigger = null;

function openLightbox(card) {
  if (!lightbox || !lightboxImg || !lightboxCaption) return;
  const src = card.dataset.image || "";
  const caption = card.dataset.caption || "";
  lightboxTrigger = card;
  lightboxImg.src = src;
  lightboxImg.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightboxClose?.focus();
}

function closeLightbox() {
  if (!lightbox || lightbox.hidden) return;
  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lightboxImg?.removeAttribute("src");
  lightboxTrigger?.focus();
  lightboxTrigger = null;
}

document.querySelectorAll(".achievement-card[data-image]").forEach((card) => {
  card.addEventListener("click", () => openLightbox(card));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLightbox(card);
    }
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
  if (e.key === "Tab" && !lightbox?.hidden) {
    e.preventDefault();
    lightboxClose?.focus();
  }
});


// ── HERO ENTRANCE ────────────────────────────────────────────────
function runHeroEntrance() {
  const idx = document.querySelector(".hero-index");
  setTimeout(() => idx && idx.classList.add("in"), 100);

  document.querySelectorAll(".hero-line-inner").forEach((el, i) => {
    setTimeout(() => el.classList.add("in"), 200 + i * 120);
  });

  const desc = document.querySelector(".hero-desc");
  const tags = document.querySelector(".hero-tags");
  const quote = document.querySelector(".hero-quote");
  setTimeout(() => desc && desc.classList.add("in"), 680);
  setTimeout(() => tags && tags.classList.add("in"), 780);
  setTimeout(() => quote && quote.classList.add("in"), 880);
}

function runStartupLoader() {
  const loader = document.getElementById("startup-loader");
  const percent = document.getElementById("loader-percent");
  const bar = document.querySelector(".loader-bar");

  if (!loader || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    loader && loader.remove();
    document.body.classList.remove("is-loading");
    runHeroEntrance();
    return;
  }

  let progress = 0;
  const startedAt = performance.now();
  const minDuration = 1900;

  const tick = () => {
    const elapsed = performance.now() - startedAt;
    const target = Math.min(100, Math.round((elapsed / minDuration) * 100));
    progress += (target - progress) * 0.18;

    const shown = Math.min(99, Math.round(progress));
    percent.textContent = shown + "%";
    bar.style.width = shown + "%";

    if (elapsed < minDuration) {
      requestAnimationFrame(tick);
      return;
    }

    percent.textContent = "100%";
    bar.style.width = "100%";

    setTimeout(() => {
      document.body.classList.add("loader-exit");
      setTimeout(() => {
        loader.remove();
        document.body.classList.remove("is-loading", "loader-exit");
        runHeroEntrance();
      }, 900);
    }, 180);
  };

  requestAnimationFrame(tick);
}

window.addEventListener("load", runStartupLoader);


// ── COUNT-UP NUMBERS ─────────────────────────────────────────────
function countUp(el, target, suffix, duration) {
  let start = 0;
  const step  = duration / target;

  const timer = setInterval(() => {
    start++;
    el.textContent = start + suffix;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    }
  }, step);
}

const numData = [
  { val: 5,   suffix: "+" },
  { val: 4,   suffix: ""  },
  { val: 1,   suffix: ""  },
  { val: "∞", suffix: ""  },
];

const numObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      numObs.unobserve(entry.target);

      entry.target.querySelectorAll(".num-cell").forEach((cell, i) => {
        const big = cell.querySelector(".num-big");
        if (!big) return;

        setTimeout(() => {
          if (numData[i].val === "∞") {
            big.textContent = "∞";
            return;
          }
          big.textContent = "0" + numData[i].suffix;
          countUp(big, numData[i].val, numData[i].suffix, 600);
        }, i * 120);
      });
    });
  },
  { threshold: 0.4 }
);

const numsGrid = document.querySelector(".about-nums");
if (numsGrid) numObs.observe(numsGrid);


// ── ACTIVE NAV LINK ───────────────────────────────────────────────
const navLinks = document.querySelectorAll("nav ul button, nav ul a");
const sections = ["hero", "about", "skills", "experience", "achievements", "research", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function updateActiveNav() {
  let current = sections[0];
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec;
  });
  navLinks.forEach((el) => {
    const target = el.getAttribute("data-scroll-target") || el.getAttribute("data-href") || el.getAttribute("href") || "";
    const isActive = target === current.id || target === `#${current.id}`;
    el.classList.toggle("nav-active", isActive);
  });
}

window.addEventListener("scroll", updateActiveNav);
updateActiveNav();


// ── MAGNETIC CONTACT EMAIL ────────────────────────────────────────
const magEl = document.querySelector(".contact-email");

if (magEl) {
  magEl.addEventListener("mousemove", (e) => {
    const rect = magEl.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) * 0.22;
    const dy   = (e.clientY - cy) * 0.22;
    magEl.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  magEl.addEventListener("mouseleave", () => {
    magEl.style.transform  = "translate(0, 0)";
    magEl.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1), color 0.2s, border-color 0.2s";
  });

  magEl.addEventListener("mouseenter", () => {
    magEl.style.transition = "transform 0.1s linear, color 0.2s, border-color 0.2s";
  });
}
