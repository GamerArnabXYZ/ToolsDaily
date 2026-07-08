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

  const submit = () => {
    const q = input.value.trim();
    if (!q) {
      window.location.href = "search.html";
      return;
    }
    window.location.href = "search.html?q=" + encodeURIComponent(q);
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  });

  const btn = input.parentElement.querySelector("[data-search-submit]");
  if (btn) btn.addEventListener("click", submit);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeaderSearch);
} else {
  initHeaderSearch();
}
