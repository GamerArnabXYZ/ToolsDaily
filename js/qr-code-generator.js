/* Daily Tools — QR Code Generator (UI) */
(function () {
  "use strict";

  const input = document.getElementById("qrInput");
  const canvas = document.getElementById("qrCanvas");
  const errorEl = document.getElementById("qrError");
  const charCount = document.getElementById("charCount");
  const downloadBtn = document.getElementById("downloadQr");
  const ctx = canvas.getContext("2d");

  function render() {
    const text = input.value;
    charCount.textContent = new TextEncoder().encode(text).length;
    errorEl.textContent = "";

    if (!text) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#9a9a9a";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Type something to generate a QR code", canvas.width / 2, canvas.height / 2);
      downloadBtn.removeAttribute("href");
      return;
    }

    let result;
    try {
      result = DailyToolsQR.generate(text);
    } catch (e) {
      errorEl.textContent = e.message;
      return;
    }

    const n = result.size;
    const quiet = 4;
    const scale = Math.max(2, Math.floor(280 / (n + quiet * 2)));
    const px = (n + quiet * 2) * scale;
    canvas.width = px;
    canvas.height = px;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, px, px);
    ctx.fillStyle = "#000000";
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (result.modules[r][c]) {
          ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
        }
      }
    }

    downloadBtn.href = canvas.toDataURL("image/png");
  }

  let debounceTimer = null;
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(render, 150);
  });

  render();
})();
