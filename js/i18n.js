/* Daily Tools — i18n engine.
   Language is selected via ?lang= query param: en (default), hi, bn,
   hinglish, banglish. All text lives in js/translations.json — this file
   only contains the loading/swapping logic. Adding or editing text later
   means editing translations.json, not this file. */

const SUPPORTED_LANGS = ["en", "hi", "bn", "hinglish", "banglish"];
const LANG_NAMES = { en: "English", hi: "हिन्दी", bn: "বাংলা", hinglish: "Hinglish", banglish: "Banglish" };

function translationsPath() {
  // Pages under /tools/ are one level deeper than root-level pages.
  return location.pathname.includes("/tools/") ? "../js/translations.json" : "./js/translations.json";
}

function getLang() {
  const params = new URLSearchParams(location.search);
  const l = params.get("lang");
  return SUPPORTED_LANGS.includes(l) ? l : "en";
}

function buildLangUrl(lang) {
  const url = new URL(location.href);
  if (lang === "en") url.searchParams.delete("lang");
  else url.searchParams.set("lang", lang);
  return url.pathname + url.search + url.hash;
}

function applyLang(strings, lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (strings[key] && strings[key][lang]) el.textContent = strings[key][lang];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (strings[key] && strings[key][lang]) el.setAttribute("placeholder", strings[key][lang]);
  });
  document.documentElement.setAttribute("lang", lang === "hi" ? "hi" : lang === "bn" ? "bn" : "en");
}

function buildBanner(strings, currentLang) {
  const bar = document.createElement("div");
  bar.className = "lang-banner";
  bar.setAttribute("role", "region");

  const text = document.createElement("span");
  text.textContent = (strings.banner_prompt && strings.banner_prompt[currentLang]) || "Want to translate this page?";
  bar.appendChild(text);

  const btnRow = document.createElement("div");
  btnRow.className = "lang-banner__btns";
  SUPPORTED_LANGS.filter((l) => l !== "en").forEach((l) => {
    const a = document.createElement("a");
    a.href = buildLangUrl(l);
    a.textContent = LANG_NAMES[l];
    btnRow.appendChild(a);
  });
  bar.appendChild(btnRow);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "lang-banner__close";
  closeBtn.setAttribute("aria-label", (strings.banner_close_aria && strings.banner_close_aria[currentLang]) || "Close");
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", () => {
    bar.remove();
    try { localStorage.setItem("dt_banner_dismissed", "1"); } catch (e) {}
  });
  bar.appendChild(closeBtn);

  document.body.insertBefore(bar, document.body.firstChild);
}

function buildActiveSwitcher(lang) {
  const bar = document.createElement("div");
  bar.className = "lang-banner lang-banner--active";
  const text = document.createElement("span");
  text.textContent = LANG_NAMES[lang];
  bar.appendChild(text);
  const btnRow = document.createElement("div");
  btnRow.className = "lang-banner__btns";
  SUPPORTED_LANGS.filter((l) => l !== lang).forEach((l) => {
    const a = document.createElement("a");
    a.href = buildLangUrl(l);
    a.textContent = LANG_NAMES[l];
    btnRow.appendChild(a);
  });
  bar.appendChild(btnRow);
  document.body.insertBefore(bar, document.body.firstChild);
}

async function initI18n() {
  let strings;
  try {
    const res = await fetch(translationsPath());
    strings = await res.json();
  } catch (e) {
    console.error("i18n: could not load translations.json", e);
    return; // fail silently — page stays in English (default HTML text)
  }

  const lang = getLang();
  applyLang(strings, lang);

  let dismissed = false;
  try { dismissed = localStorage.getItem("dt_banner_dismissed") === "1"; } catch (e) {}

  if (lang === "en" && !dismissed) buildBanner(strings, lang);
  if (lang !== "en") buildActiveSwitcher(lang);
}

document.addEventListener("DOMContentLoaded", initI18n);
