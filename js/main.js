/* =====================================================================
   Daily Tools — UI logic
   Modular, dependency-free. Loaded with `defer` so the UI paints first.
   Tool registry lives in js/tools-data.js (window.TOOLS / window.CATEGORIES).
   Responsibilities:
     - Live search across tool cards (title + description + category)
     - Category filtering via pill row (multi-narrowing with search)
     - Ads disabled by default; see initAds() note for re-enabling
   ===================================================================== */



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

// ── Ads (disabled by default) ──────────────────────────────────────────────
// To enable AdSense, add <div class="ad-slot" data-ad-slot></div> where you
// want a unit, then set a real publisher id below. Left OFF because no
// publisher id is configured — the site ships with zero third-party ad JS.
// const ADS = { client: "ca-pub-XXXXXXXXXXXXXXXX", slot: "XXXXXXXXXX" };
// function initAds(cfg) { /* inject adsbygoogle loader + slot attrs */ }

function init() {
  const grid = document.getElementById("tools-grid");
  const filters = document.getElementById("filter-row");
  const search = document.getElementById("site-search");
  if (grid) buildCards(grid);
  if (filters) buildFilterRow(filters);
  if (search) initSearch(search);
  if (grid && (search || filters)) render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

