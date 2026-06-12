"use strict";

// ── Elements ──────────────────────────────────────
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

// ── Sections mapped by data-section attr ──────────
const sections = Array.from(document.querySelectorAll("section[id]"));

// ── Hamburger toggle ──────────────────────────────
hamburger.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
});

// Close menu when a nav link is clicked (mobile)
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-label", "메뉴 열기");
  });
});

// Close menu on outside click
document.addEventListener("click", (e) => {
  if (!navbar.contains(e.target)) {
    navMenu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-label", "메뉴 열기");
  }
});

// ── Navbar scroll shadow ───────────────────────────
function onScroll() {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
  updateActiveLink();
}

// ── Active nav link on scroll ─────────────────────
function updateActiveLink() {
  const scrollMid = window.scrollY + window.innerHeight / 2;

  let current = sections[0].id;
  sections.forEach((sec) => {
    if (sec.offsetTop <= scrollMid) current = sec.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === current);
  });
}

window.addEventListener("scroll", onScroll, { passive: true });

// Run once on load
onScroll();

// ── Smooth scroll with offset compensation ────────
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").replace("#", "");
    const target = document.getElementById(targetId);
    if (!target) return;
    const navH = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

// Hero button smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  if (anchor.classList.contains("nav-link")) return; // already handled
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;
    const targetId = href.replace("#", "");
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const navH = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

// ── Project modal ─────────────────────────────────
(function () {
  const modal = document.getElementById("projectModal");
  const closeBtn = document.getElementById("modalClose");

  function openModal(card) {
    const thumb = document.getElementById("modalThumb");
    const img = document.getElementById("modalImg");
    const label = document.getElementById("modalLabel");
    const title = document.getElementById("modalTitle");
    const desc = document.getElementById("modalDesc");
    const list = document.getElementById("modalFeatures");
    const links = document.getElementById("modalLinks");

    // 썸네일
    thumb.style.background = card.dataset.imgBg || "var(--gray-100)";
    img.src = card.dataset.img || "";
    img.alt = card.dataset.title || "";
    label.textContent = card.dataset.imgLabel || "";

    // 텍스트
    title.textContent = card.dataset.title || "";
    desc.textContent = card.dataset.desc || "";

    // 태그
    const tagsWrap = modal.querySelector(".modal-tags");
    const cardTags = card.querySelector(".project-tags");
    if (tagsWrap && cardTags) tagsWrap.innerHTML = cardTags.innerHTML;

    // 구현 기능
    list.innerHTML = (card.dataset.features || "")
      .split("|")
      .filter(Boolean)
      .map((f) => `<li>${f.trim()}</li>`)
      .join("");

    // 버튼
    links.innerHTML = "";
    if (card.dataset.github && card.dataset.github !== "#") {
      links.innerHTML += `<a href="${card.dataset.github}" target="_blank" rel="noopener" class="btn btn-sm btn-dark">GitHub</a>`;
    } else if (card.dataset.github) {
      links.innerHTML += `<a href="#" class="btn btn-sm btn-dark">GitHub</a>`;
    }
    if (card.dataset.demo && card.dataset.demo !== "#") {
      links.innerHTML += `<a href="${card.dataset.demo}" target="_blank" rel="noopener" class="btn btn-sm btn-primary">Live Demo</a>`;
    } else if (card.dataset.demo) {
      links.innerHTML += `<a href="#" class="btn btn-sm btn-primary">Live Demo</a>`;
    }
    if (card.dataset.pdf) {
      links.innerHTML += `<a href="${card.dataset.pdf}" target="_blank" rel="noopener" class="btn btn-sm btn-pdf">📄 PDF</a>`;
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".project-card").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return; // 버튼 클릭은 모달 안 열림
      openModal(card);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
})();

// ── About tab switching ───────────────────────────
document.querySelectorAll(".about-tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    btn
      .closest(".about-tab-card")
      .querySelectorAll(".about-tab-btn")
      .forEach((b) => b.classList.remove("active"));
    btn
      .closest(".about-tab-card")
      .querySelectorAll(".about-tab-panel")
      .forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + tab).classList.add("active");
  });
});

// ── Hero typewriter ───────────────────────────────
(function () {
  const el = document.getElementById("heroTitle");
  if (!el) return;

  // Segments: [text, isHighlight, lineBreakAfter]
  const segments = [
    ["안정적이고 확장 가능한", false, true],
    ["백엔드 시스템", true, false],
    ["을 만드는", false, true],
    ["개발자 ", false, false],
    ["이성현", true, false],
    ["입니다.", false, false],
  ];

  // Build DOM nodes upfront, hidden
  const nodes = segments.map(([text, highlight, br]) => {
    const span = document.createElement("span");
    span.className = highlight ? "highlight" : "";
    el.appendChild(span);
    if (br) el.appendChild(document.createElement("br"));
    return { span, text };
  });

  // Cursor element
  const cursor = document.createElement("span");
  cursor.className = "typewriter-cursor";
  cursor.textContent = "|";
  el.appendChild(cursor);

  let segIdx = 0,
    charIdx = 0;
  const SPEED = 55; // ms per character

  function type() {
    if (segIdx >= nodes.length) {
      // Blink then fade cursor
      setTimeout(() => cursor.classList.add("typewriter-cursor--done"), 1200);
      return;
    }
    const { span, text } = nodes[segIdx];
    if (charIdx < text.length) {
      span.textContent += text[charIdx++];
      setTimeout(type, SPEED);
    } else {
      segIdx++;
      charIdx = 0;
      setTimeout(type, segIdx === 1 ? 120 : SPEED); // slight pause after first line
    }
  }

  // Start after a short delay so hero entry animation settles
  setTimeout(type, 400);
})();

// ── Scroll-reveal animation ───────────────────────
const revealElements = document.querySelectorAll(
  ".tech-card, .project-card, .contact-card, .strength-card, .about-grid",
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

// Add initial hidden style via JS so CSS-only visitors still see content
const style = document.createElement("style");
style.textContent = `
  .tech-card, .project-card, .contact-card, .strength-card, .about-grid {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .tech-card.revealed, .project-card.revealed, .contact-card.revealed,
  .strength-card.revealed, .about-grid.revealed {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

revealElements.forEach((el) => revealObserver.observe(el));
