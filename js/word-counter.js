/* Word Counter — live counts as you type. */
(function () {
  const ta = document.getElementById("text");
  if (!ta) return;

  const out = {
    words: document.getElementById("words"),
    chars: document.getElementById("chars"),
    charsNo: document.getElementById("chars-no"),
    sentences: document.getElementById("sentences"),
    paragraphs: document.getElementById("paragraphs"),
    read: document.getElementById("read"),
  };

  function count(text) {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNo = text.replace(/\s/g, "").length;
    // Strip common abbreviations (Dr., e.g., etc.) before counting so they
    // don't register as sentence boundaries.
    const stripped = trimmed.replace(
      /\b(?:mr|mrs|ms|dr|prof|st|sr|jr|capt|gen|col|sgt|rev|hon|no|inc|ltd|co|etc|vs|e\.g|i\.e)\./gi,
      ""
    );
    const sentences = stripped ? (stripped.match(/[.!?](\s|$)/g) || []).length : 0;
    const paragraphs = trimmed ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const minutes = words / 200;
    let reading;
    if (words === 0) reading = "0s";
    else if (minutes < 1) reading = Math.max(1, Math.round(minutes * 60)) + "s";
    else reading = Math.round(minutes) + "m";
    return { words, chars, charsNo, sentences, paragraphs, reading };
  }

  function render() {
    const c = count(ta.value);
    out.words.textContent = c.words.toLocaleString();
    out.chars.textContent = c.chars.toLocaleString();
    out.charsNo.textContent = c.charsNo.toLocaleString();
    out.sentences.textContent = c.sentences.toLocaleString();
    out.paragraphs.textContent = c.paragraphs.toLocaleString();
    out.read.textContent = c.reading;
  }

  ta.addEventListener("input", render);
  render();
})();
