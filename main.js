// -----------------------------
// 탭 전환 기능
// -----------------------------
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tool;

    // 모든 버튼 active 제거
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // 모든 패널 숨김
    document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.add("hidden"));

    // 선택된 패널 표시
    document.getElementById(target).classList.remove("hidden");
  });
});


// -----------------------------
// 도구 기능들 (변환/편집/PDF)
// -----------------------------
function loadImage(file) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = URL.createObjectURL(file);
  });
}

// PNG → JPG
async function pngToJpg(file) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  canvas.toBlob(blob => {
    downloadBlob(blob, file.name.replace(/\.png$/, ".jpg"));
  }, "image/jpeg", 0.92);
}

// PNG → WEBP
async function pngToWebp(file) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  canvas.toBlob(blob => {
    downloadBlob(blob, file.name.replace(/\.png$/, ".webp"));
  }, "image/webp", 0.9);
}

// HEIC → JPG
async function heicToJpg(file) {
  const output = await heic2any({ blob: file, toType: "image/jpeg" });
  downloadBlob(output, file.name.replace(/\.heic$/, ".jpg"));
}

// 이미지 압축
async function compressImage(file, quality=0.8) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  canvas.toBlob(blob => {
    downloadBlob(blob, file.name.replace(/\.(png|jpg|jpeg)$/, "_compressed.jpg"));
  }, "image/jpeg", quality);
}

// 이미지 리사이즈
async function resizeImage(file, width, height) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  canvas.toBlob(blob => {
    downloadBlob(blob, "resized.jpg");
  }, "image/jpeg");
}


// 여러 이미지 → PDF
async function imagesToPdf(files) {
  const pdf = new jspdf.jsPDF();
  let first = true;

  for (let f of files) {
    const img = await loadImage(f);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);

    const imgData = canvas.toDataURL("image/jpeg", 0.9);
    if (!first) pdf.addPage();
    first = false;
    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297); // A4
  }

  pdf.save("images.pdf");
}

// EXIF 제거
async function stripExif(file) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext("2d").drawImage(img, 0, 0);
  canvas.toBlob(blob => downloadBlob(blob, "no_exif.jpg"), "image/jpeg", 0.92);
}


// -----------------------------
// 공용 다운로드 함수
// -----------------------------
function downloadBlob(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}


// -----------------------------
// 버튼 이벤트 연결
// -----------------------------
document.querySelectorAll("[data-action-button]").forEach(button => {
  button.addEventListener("click", async () => {
    const action = button.dataset.actionButton;
    const input = document.querySelector(`[data-action='${action}']`);
    const files = input.files;

    if (!files.length) {
      alert("파일을 선택하세요.");
      return;
    }

    if (action === "pngToJpg") return pngToJpg(files[0]);
    if (action === "pngToWebp") return pngToWebp(files[0]);
    if (action === "heicToJpg") return heicToJpg(files[0]);

    if (action === "compress") {
      const q = document.querySelector("[data-quality]").value;
      return compressImage(files[0], q);
    }

    if (action === "resize") {
      const w = document.querySelector("[data-width]").value;
      const h = document.querySelector("[data-height]").value;
      return resizeImage(files[0], Number(w), Number(h));
    }

    if (action === "imagesToPdf") return imagesToPdf(files);

    if (action === "stripExif") return stripExif(files[0]);

    alert("아직 구현되지 않은 기능입니다.");
  });
});
