/* =====================================================================
   Daily Tools — UI logic
   Modular, dependency-free. Loaded with `defer` so the UI paints first.
   Responsibilities:
     - Live search across tool cards (title + description + tags)
     - Category filtering via pill row (multi-narrowing with search)
     - AdSense slot boot (auto-loads data-ad-slot when config present)
   ===================================================================== */

const TOOLS = [
  { name: "JSON Formatter", desc: "Pretty-print, validate and minify JSON instantly.", category: "developers", href: "tools/json-formatter.html", icon: "{}" },
  { name: "CSS Minifier", desc: "Strip whitespace and comments from CSS safely.", category: "developers", href: "tools/css-minifier.html", icon: "</>" },
  { name: "Base64 Encode", desc: "Encode and decode text or files to Base64.", category: "developers", href: "tools/base64.html", icon: "B64" },
  { name: "Hash Generator", desc: "MD5, SHA-1, SHA-256 of any input string.", category: "developers", href: "tools/hash.html", icon: "#" },
  { name: "Word Counter", desc: "Count words, characters, sentences and reading time.", category: "students", href: "tools/word-counter.html", icon: "W" },
  { name: "Citation Builder", desc: "Generate APA, MLA and Chicago citations.", category: "students", href: "tools/citation.html", icon: "❝" },
  { name: "Grade Calculator", desc: "Weight your assignments into a final grade.", category: "students", href: "tools/grade.html", icon: "%" },
  { name: "Unit Converter", desc: "Length, mass, temperature and more.", category: "students", href: "tools/unit.html", icon: "⇄" },
  { name: "Attendance Tracker", desc: "Log and summarise class attendance.", category: "teachers", href: "tools/attendance.html", icon: "✓" },
  { name: "Rubric Scorer", desc: "Score students against a reusable rubric.", category: "teachers", href: "tools/rubric.html", icon: "★" },
  { name: "Lesson Timer", desc: "Pace lessons with a clean countdown timer.", category: "teachers", href: "tools/timer.html", icon: "⏱" },
  { name: "Quiz Maker", desc: "Build a quick multiple-choice quiz.", category: "teachers", href: "tools/quiz.html", icon: "?" },
  { name: "Image to Base64", desc: "Read an image and copy its data URL.", category: "everyday", href: "tools/image.html", icon: "▦" },
  { name: "Password Generator", desc: "Strong, copy-ready random passwords.", category: "everyday", href: "tools/password.html", icon: "🔑" },
  { name: "Tip Calculator", desc: "Split bills and tips with friends.", category: "everyday", href: "tools/tip.html", icon: "$" },
  { name: "Color Picker", desc: "Pick, copy and convert HEX/RGB/HSL.", category: "everyday", href: "tools/color.html", icon: "◑" },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "students", label: "Students" },
  { id: "teachers", label: "Teachers" },
  { id: "developers", label: "Developers" },
  { id: "everyday", label: "Everyday" },
];

/* ---- State ---- */
const state = { query: "", category: "all" };

/* ---- DOM refs ---- */
let cardEls = [];

function buildFilterRow(container) {
  const frag = document.createDocumentFragment();
  CATEGORIES.forEach((c) => {
    const b = document.createElement("button");
    b.className = "pill";
    b.type = "button";
    b.textContent = c.label;
    b.dataset.category = c.id;
    b.setAttribute("aria-pressed", String(c.id === state.category));
    b.addEventListener("click", () => {
      state.category = c.id;
      document.querySelectorAll(".pill").forEach((p) =>
        p.setAttribute("aria-pressed", String(p.dataset.category === c.id))
      );
      render();
    });
    frag.appendChild(b);
  });
  container.appendChild(frag);
}

function buildCards(grid) {
  const frag = document.createDocumentFragment();
  TOOLS.forEach((t) => {
    const a = document.createElement("a");
    a.className = "card";
    a.href = t.href;
    a.dataset.name = t.name.toLowerCase();
    a.dataset.desc = t.desc.toLowerCase();
    a.dataset.category = t.category;
    a.innerHTML = `
      <span class="card__icon mono" aria-hidden="true">${t.icon}</span>
      <span class="card__title">${t.name}</span>
      <p class="card__desc">${t.desc}</p>
      <span class="card__meta">${t.category} / tool</span>`;
    frag.appendChild(a);
  });
  grid.appendChild(frag);
  cardEls = Array.from(grid.querySelectorAll(".card"));
}

function matches(card) {
  const okCat = state.category === "all" || card.dataset.category === state.category;
  if (!okCat) return false;
  if (!state.query) return true;
  const hay = `${card.dataset.name} ${card.dataset.desc} ${card.dataset.category}`;
  return hay.includes(state.query);
}

function render() {
  let visible = 0;
  cardEls.forEach((card) => {
    const show = matches(card);
    card.hidden = !show;
    if (show) visible++;
  });
  const none = document.querySelector(".no-results");
  if (none) none.classList.toggle("is-visible", visible === 0);
}

function initSearch(input) {
  input.addEventListener("input", (e) => {
    state.query = e.target.value.trim().toLowerCase();
    render();
  });
}

function initAds() {
  const cfg = window.__ADS__;
  if (!cfg || !cfg.client || !cfg.slot) return;
  const slot = document.querySelector("[data-ad-slot]");
  if (!slot) return;
  slot.dataset.adClient = cfg.client;
  slot.dataset.adSlot = cfg.slot;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
  document.head.appendChild(s);
}

function init() {
  const grid = document.getElementById("tools-grid");
  const filters = document.getElementById("filter-row");
  const search = document.getElementById("site-search");
  if (grid) buildCards(grid);
  if (filters) buildFilterRow(filters);
  if (search) initSearch(search);
  if (grid && (search || filters)) render();
  initAds();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

export { TOOLS, CATEGORIES };
