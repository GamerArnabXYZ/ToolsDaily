/* =====================================================================
   Daily Tools — shared client utilities
   Exposes helpers on a single global namespace (window.DailyTools) so the
   site's scripts don't pollute the global scope and don't risk name
   collisions with each other or with third-party snippets.

   Responsibilities:
     - DailyTools.showToast(msg)    → transient status message
     - DailyTools.copyText(text,btn)→ clipboard copy with fallback
     - Delegated click handler for [data-copy] / [data-copy-text] buttons
       used across every tool page.
   ===================================================================== */
(function () {
  "use strict";

  const DT = (window.DailyTools = window.DailyTools || {});

  /* ---- Lightweight toast -------------------------------------------- */
  DT.showToast = function (message) {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 250);
    }, 2200);
  };

  /* ---- Clipboard with graceful fallback ----------------------------- */
  DT.copyText = function (text, btn) {
    const done = () => {
      const original = btn ? btn.textContent : "";
      if (btn) {
        btn.textContent = "Copied";
        setTimeout(() => {
          btn.textContent = original;
        }, 1200);
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(fallback);
    } else {
      fallback();
    }
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        done();
      } catch (e) {
        DT.showToast("Copy failed");
      }
      ta.remove();
    }
  };

  /* ---- Delegated copy-button handler ---------------------------------
     Tool pages mark copy triggers with:
       data-copy="#selector"      → copy the text of that element
       data-copy-text="..."       → copy this literal value (e.g. set by JS)
     A single document-level listener serves every page. */
  document.addEventListener("click", function (e) {
    const trigger = e.target.closest("[data-copy], [data-copy-text]");
    if (!trigger) return;
    e.preventDefault();
    let text = "";
    if (trigger.hasAttribute("data-copy-text")) {
      text = trigger.getAttribute("data-copy-text");
    } else {
      const target = document.querySelector(trigger.getAttribute("data-copy"));
      if (!target) return;
      text = target.value !== undefined && target.value !== ""
        ? target.value
        : target.textContent;
    }
    DT.copyText(text, trigger);
  });
})();
