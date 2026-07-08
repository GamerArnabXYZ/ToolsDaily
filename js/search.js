/* =====================================================================
   Daily Tools — search results page
   Reads ?q= from the URL, matches against window.TOOLS (name, desc,
   category), and renders result cards. Falls back to a hint when no
   query is present, and a no-results state when nothing matches.
   ===================================================================== */

function cardHTML(tool) {
  const label = tool.category.charAt(0).toUpperCase() + tool.category.slice(1);
  return (
    '<a class="card" href="' + tool.href + '">' +
    '<div class="card__icon" aria-hidden="true">' + tool.icon + "</div>" +
    '<div class="card__title">' + tool.name + "</div>" +
    '<p class="card__desc">' + tool.desc + "</p>" +
    '<div class="card__meta">' + label + "</div>" +
    "</a>"
  );
}

function renderSearch() {
  const params = new URLSearchParams(window.location.search);
  const q = (params.get("q") || "").trim().toLowerCase();

  const grid = document.getElementById("results-grid");
  const noResults = document.getElementById("no-results");
  const title = document.getElementById("results-title");
  const sub = document.getElementById("results-sub");

  if (!grid) return;

  if (!q) {
    title.textContent = "Search tools";
    sub.textContent = "Type in the search bar above to find a tool.";
    grid.innerHTML = "";
    noResults.classList.remove("is-visible");
    return;
  }

  const matches = (window.TOOLS || []).filter((t) =>
    t.name.toLowerCase().includes(q) ||
    t.desc.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q)
  );

  // Reflect the query back into the header search box so re-search works.
  const input = document.getElementById("site-search");
  if (input) input.value = q;

  title.textContent = "Results for “" + q + "”";
  sub.textContent =
    matches.length +
    (matches.length === 1 ? " tool found" : " tools found") +
    ".";

  if (matches.length) {
    grid.innerHTML = matches.map(cardHTML).join("");
    noResults.classList.remove("is-visible");
  } else {
    grid.innerHTML = "";
    noResults.classList.add("is-visible");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderSearch);
} else {
  renderSearch();
}
