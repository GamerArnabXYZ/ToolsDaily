/* Daily Tools — Image Compressor */
(function () {
  "use strict";

  const fileInput = document.getElementById("fileInput");
  const dropText = document.getElementById("dropText");
  const origPreview = document.getElementById("origPreview");
  const outPreview = document.getElementById("outPreview");
  const qualitySlider = document.getElementById("quality");
  const qualityVal = document.getElementById("qualityVal");
  const origSizeEl = document.getElementById("origSize");
  const newSizeEl = document.getElementById("newSize");
  const savedPctEl = document.getElementById("savedPct");
  const downloadBtn = document.getElementById("downloadBtn");

  let currentImage = null;
  let originalFileSize = 0;
  let originalFileName = "image";
  let currentObjectUrl = null;

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function compressAndRender() {
    if (!currentImage) return;

    const canvas = document.createElement("canvas");
    canvas.width = currentImage.naturalWidth;
    canvas.height = currentImage.naturalHeight;
    const ctx = canvas.getContext("2d");
    // Fill white first so transparent PNGs don't turn black in JPG output.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentImage, 0, 0);

    const quality = parseInt(qualitySlider.value, 10) / 100;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = URL.createObjectURL(blob);
        outPreview.src = currentObjectUrl;
        outPreview.style.display = "block";

        newSizeEl.textContent = formatBytes(blob.size);
        const savedPct = originalFileSize > 0
          ? Math.max(0, Math.round((1 - blob.size / originalFileSize) * 100))
          : 0;
        savedPctEl.textContent = savedPct + "%";

        downloadBtn.href = currentObjectUrl;
        const base = originalFileName.replace(/\.[^.]+$/, "");
        downloadBtn.download = base + "-compressed.jpg";
        downloadBtn.style.display = "inline-flex";
      },
      "image/jpeg",
      quality
    );
  }

  function handleFile(file) {
    if (!file) return;
    originalFileSize = file.size;
    originalFileName = file.name || "image";
    origSizeEl.textContent = formatBytes(originalFileSize);
    dropText.textContent = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        currentImage = img;
        origPreview.src = e.target.result;
        origPreview.style.display = "block";
        compressAndRender();
      };
      img.onerror = () => {
        DailyTools.showToast("Could not read that image file");
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      DailyTools.showToast("Could not read that file");
    };
    reader.readAsDataURL(file);
  }

  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
  });

  qualitySlider.addEventListener("input", () => {
    qualityVal.textContent = qualitySlider.value + "%";
    compressAndRender();
  });
})();
