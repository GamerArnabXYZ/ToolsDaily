/* Daily Tools — Favicon Generator */
(function () {
  "use strict";

  const SIZES = [
    { size: 16, name: "favicon-16x16.png", label: "16×16" },
    { size: 32, name: "favicon-32x32.png", label: "32×32" },
    { size: 180, name: "apple-touch-icon.png", label: "180×180 (Apple)" },
    { size: 192, name: "android-chrome-192x192.png", label: "192×192 (Android)" },
    { size: 512, name: "android-chrome-512x512.png", label: "512×512 (PWA)" },
  ];

  const fileInput = document.getElementById("fileInput");
  const dropText = document.getElementById("dropText");
  const resultsPanel = document.getElementById("resultsPanel");
  const favGrid = document.getElementById("favGrid");
  const snippetBox = document.getElementById("snippet");
  const snippetHidden = document.getElementById("snippetHidden");

  function resizeToDataUrl(img, size) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
    return canvas.toDataURL("image/png");
  }

  function buildSnippet() {
    return [
      '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
      '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
      '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
      '<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">',
      '<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">',
    ].join("\n");
  }

  function handleFile(file) {
    if (!file) return;
    dropText.textContent = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        favGrid.innerHTML = "";
        SIZES.forEach((spec) => {
          const dataUrl = resizeToDataUrl(img, spec.size);
          const item = document.createElement("div");
          item.className = "fav-item";
          item.innerHTML = `
            <img src="${dataUrl}" width="48" height="48" alt="${spec.label} favicon preview" />
            <a href="${dataUrl}" download="${spec.name}">${spec.label}</a>
          `;
          favGrid.appendChild(item);
        });

        const snippet = buildSnippet();
        snippetBox.textContent = snippet;
        snippetHidden.value = snippet;
        resultsPanel.style.display = "block";
      };
      img.onerror = () => DailyTools.showToast("Could not read that image file");
      img.src = e.target.result;
    };
    reader.onerror = () => DailyTools.showToast("Could not read that file");
    reader.readAsDataURL(file);
  }

  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
  });
})();
