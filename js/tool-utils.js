/* =====================================================================
   Daily Tools — shared tool-page utilities
   Provides a single toast + copy-to-clipboard helper so every tool page
   shares the same interaction vocabulary. Loaded with `defer`.
   ===================================================================== */

function showToast(msg) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("is-visible");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("is-visible"), 1800);
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    showToast("Copied to clipboard");
  } catch {
    showToast("Copy failed");
  }
}

// Delegate any element with [data-copy] (holds the source selector) or
// [data-copy-text] (holds literal text) to the copy helper.
document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-copy], [data-copy-text]");
  if (!target) return;
  e.preventDefault();
  if (target.hasAttribute("data-copy-text")) {
    copyText(target.getAttribute("data-copy-text"));
  } else {
    const node = document.querySelector(target.getAttribute("data-copy"));
    if (node) copyText(node.value ?? node.textContent ?? "");
  }
});

if (document.readyState !== "loading") {
  document.querySelectorAll(".year").forEach((e) => (e.textContent = new Date().getFullYear()));
} else {
  document.addEventListener("DOMContentLoaded", () =>
    document.querySelectorAll(".year").forEach((e) => (e.textContent = new Date().getFullYear()))
  );
}

window.DailyTools = { showToast, copyText };
