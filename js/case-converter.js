/* Daily Tools — Case Converter */
(function () {
  "use strict";

  const input = document.getElementById("in");
  const output = document.getElementById("out");

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }

  function toSentenceCase(str) {
    return str
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
  }

  function words(str) {
    return str
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((w) => w.toLowerCase());
  }

  function toCamelCase(str) {
    const w = words(str);
    return w
      .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      .join("");
  }

  function toSnakeCase(str) {
    return words(str).join("_");
  }

  function toKebabCase(str) {
    return words(str).join("-");
  }

  const converters = {
    upper: (s) => s.toUpperCase(),
    lower: (s) => s.toLowerCase(),
    title: toTitleCase,
    sentence: toSentenceCase,
    camel: toCamelCase,
    snake: toSnakeCase,
    kebab: toKebabCase,
  };

  document.querySelectorAll("[data-case]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fn = converters[btn.getAttribute("data-case")];
      if (!fn) return;
      output.value = fn(input.value || "");
      document.querySelectorAll("[data-case]").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
    });
  });
})();
