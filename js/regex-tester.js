/* Daily Tools — Regex Tester */
(function () {
  "use strict";

  const patternInput = document.getElementById("pattern");
  const flagsInput = document.getElementById("flags");
  const testStringInput = document.getElementById("testString");
  const errorEl = document.getElementById("error");
  const highlightEl = document.getElementById("highlight");
  const matchListEl = document.getElementById("matchList");
  const matchCountLabel = document.getElementById("matchCountLabel");

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function run() {
    const pattern = patternInput.value;
    const flags = flagsInput.value.replace(/[^gimsuy]/g, "");
    const text = testStringInput.value;

    errorEl.textContent = "";

    if (!pattern) {
      highlightEl.innerHTML = escapeHtml(text) || "<span style=\"color:var(--mute)\">Enter a pattern to see matches highlighted here.</span>";
      matchListEl.innerHTML = "";
      matchCountLabel.textContent = "Highlighted matches";
      return;
    }

    let re;
    try {
      re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    } catch (e) {
      errorEl.textContent = e.message;
      highlightEl.innerHTML = escapeHtml(text);
      matchListEl.innerHTML = "";
      matchCountLabel.textContent = "Highlighted matches";
      return;
    }

    if (!text) {
      highlightEl.innerHTML = "<span style=\"color:var(--mute)\">Type test text above to see matches.</span>";
      matchListEl.innerHTML = "";
      matchCountLabel.textContent = "Highlighted matches";
      return;
    }

    const matches = [];
    let lastIndex = 0;
    let html = "";
    let m;
    let guard = 0;
    re.lastIndex = 0;

    while ((m = re.exec(text)) !== null) {
      guard++;
      if (guard > 5000) break; // safety guard against pathological patterns
      matches.push(m);
      html += escapeHtml(text.slice(lastIndex, m.index));
      html += "<mark>" + escapeHtml(m[0] || "") + "</mark>";
      lastIndex = m.index + (m[0] ? m[0].length : 0);
      if (m[0] === "") {
        // zero-length match: advance manually to avoid infinite loop
        re.lastIndex++;
        if (re.lastIndex > text.length) break;
      }
    }
    html += escapeHtml(text.slice(lastIndex));
    highlightEl.innerHTML = html;

    matchCountLabel.textContent = `${matches.length} match${matches.length === 1 ? "" : "es"}`;

    if (matches.length === 0) {
      matchListEl.innerHTML = "<div class=\"regex-match-item\">No matches.</div>";
    } else {
      matchListEl.innerHTML = matches
        .slice(0, 200)
        .map((mm, i) => {
          const groups = mm.slice(1).filter((g) => g !== undefined);
          const groupsText = groups.length
            ? " — groups: " + groups.map((g) => `"${escapeHtml(g)}"`).join(", ")
            : "";
          return `<div class="regex-match-item">#${i + 1} at ${mm.index}: "${escapeHtml(mm[0])}"${groupsText}</div>`;
        })
        .join("");
    }
  }

  [patternInput, flagsInput, testStringInput].forEach((el) => {
    el.addEventListener("input", run);
  });

  run();
})();
