/* =====================================================================
   Daily Tools — header search (all pages)
   Enables the header search box on every page. On submit (Enter), it
   navigates to the shared results page with the query as ?q=.
   Every page loads js/tools-data.js before this one.
   ===================================================================== */

function initHeaderSearch() {
  const input = document.getElementById("site-search");
  if (!input) return;

  input.disabled = false;
  input.removeAttribute("disabled");

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) {
        // Empty query -> just go to the search page (shows all / hint).
        window.location.href = "search.html";
        return;
      }
      window.location.href = "search.html?q=" + encodeURIComponent(q);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeaderSearch);
} else {
  initHeaderSearch();
}
