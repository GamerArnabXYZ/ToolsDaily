/* JSON Formatter — beautify / minify / validate */
(function () {
  const input = document.getElementById("input");
  const output = document.getElementById("output");
  const status = document.getElementById("status");

  function setStatus(msg, ok) {
    if (!status) return;
    status.textContent = msg;
    status.style.color = ok === false ? "var(--error, #ee0000)" : "var(--mute)";
  }

  function parse() {
    try {
      return { ok: true, data: JSON.parse(input.value) };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  function run(mode) {
    if (!input.value.trim()) {
      output.textContent = "";
      setStatus("Nothing to format yet.");
      return;
    }
    const res = parse();
    if (!res.ok) {
      output.textContent = "";
      setStatus("Invalid JSON — " + res.error, false);
      return;
    }
    const text =
      mode === "minify"
        ? JSON.stringify(res.data)
        : JSON.stringify(res.data, null, 2);
    output.textContent = text;
    setStatus("Valid JSON · " + text.length.toLocaleString() + " chars", true);
  }

  document.getElementById("beautify").addEventListener("click", () => run("beautify"));
  document.getElementById("minify").addEventListener("click", () => run("minify"));
  document.getElementById("sample").addEventListener("click", () => {
    input.value = '{"tool":"json-formatter","fast":true,"tags":["dev","free"],"n":42}';
    run("beautify");
  });

  input.addEventListener("input", () => {
    if (input.value.trim()) run("beautify");
    else setStatus("Ready.");
  });
})();
