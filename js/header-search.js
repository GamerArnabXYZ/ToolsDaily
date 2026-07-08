/* =====================================================================
   Daily Tools — header search behavior
   Wires the global header search box: typing navigates to the search
   results page, and pressing Enter/or clicking submits immediately.

   The header markup differs per page type:
     • Marketing/legal pages render the search field inside a 404-style
       container (#hdr-search / #hdr-submit).
     • Tool pages render it inside a <form id="search-form">.
   initHeaderSearch() sets up whichever variant is present on the page,
   so calling it unconditionally is safe.
   ===================================================================== */
(function () {
  "use strict";
  const DT = (window.DailyTools = window.DailyTools || {});

  DT.initHeaderSearch = function () {
    const input = document.getElementById("site-search");
    if (!input) return;

    const form = document.getElementById("search-form");

    // Form-based search (tool pages): intercept submit, no native reload.
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const q = input.value.trim();
        if (!q) return;
        window.location.href = "./../search.html?q=" + encodeURIComponent(q);
      });
      return; // form path handles submission; nothing else to wire.
    }

    // Standalone search field (marketing / legal pages).
    const wrap = document.getElementById("hdr-search");
    const submit = document.getElementById("hdr-submit");
    if (!wrap && !submit) return;

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const q = input.value.trim();
        if (!q) return;
        window.location.href = "./search.html?q=" + encodeURIComponent(q);
      }
    });
    if (submit) {
      submit.addEventListener("click", function () {
        const q = input.value.trim();
        if (!q) return;
        window.location.href = "./search.html?q=" + encodeURIComponent(q);
      });
    }
  };
})();

document.addEventListener("DOMContentLoaded", function () {
  if (window.DailyTools) window.DailyTools.initHeaderSearch();
});
