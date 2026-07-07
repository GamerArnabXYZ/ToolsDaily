/* Password Generator — crypto-based, entropy estimate */
(function () {
  const SETS = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    num: "0123456789",
    sym: "!@#$%^&*()-_=+[]{};:,.<>?",
  };

  const len = document.getElementById("len");
  const lenVal = document.getElementById("len-val");
  const out = document.getElementById("out");
  const bitsEl = document.getElementById("bits");
  const strengthEl = document.getElementById("strength");

  function charset() {
    let pool = "";
    for (const k in SETS) if (document.getElementById(k).checked) pool += SETS[k];
    return pool;
  }

  function generate() {
    const pool = charset();
    if (!pool) {
      out.textContent = "Select at least one set";
      bitsEl.textContent = "0";
      strengthEl.textContent = "—";
      return;
    }
    const n = parseInt(len.value, 10);
    const bytes = new Uint32Array(n);
    crypto.getRandomValues(bytes);
    let pw = "";
    for (let i = 0; i < n; i++) pw += pool[bytes[i] % pool.length];

    // Guarantee at least one char from each selected set (when length allows)
    const keys = Object.keys(SETS).filter((k) => document.getElementById(k).checked);
    if (n >= keys.length) {
      keys.forEach((k, i) => { pw = pw.substring(0, i) + SETS[k][crypto.getRandomValues(new Uint32Array(1))[0] % SETS[k].length] + pw.substring(i + 1); });
    }

    out.textContent = pw;
    const entropy = n * (Math.log2(pool.length));
    bitsEl.textContent = Math.round(entropy);
    strengthEl.textContent = entropy < 40 ? "Weak" : entropy < 60 ? "Fair" : entropy < 80 ? "Strong" : "Very strong";
  }

  len.addEventListener("input", () => (lenVal.textContent = len.value));
  document.getElementById("gen").addEventListener("click", generate);
  generate();
})();
