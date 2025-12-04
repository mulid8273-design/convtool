// 탭 전환
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.add("hidden"));
    document.getElementById(btn.dataset.tool).classList.remove("hidden");
  });
});

// 파일 처리 공용 함수
function fileFromInput(input) {
  return input.files?.[0] || null;
}

// 다운로드
function download(name, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

// PNG → JPG
async function convertPngToJpg(file) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  return new Promise(res => canvas.toBlob(res, "image/jpeg", 0.92));
}

// PNG → WEBP
async function convertPngToWebp(file) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return new Promise(res => canvas.toBlob(res, "image/webp", 0.92));
}

// HEIC → JPG
async function convertHeicToJpg(file) {
  return heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9,
  });
}

// 이미지 로드
function loadImage(file) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => res(img);
    img.src = URL.createObjectURL(file);
  });
}

// 압축
async function compressImage(file, quality) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return new Promise(res => canvas.toBlob(res, "image/jpeg", quality));
}

// 리사이즈
async function resizeImage(file, w, h) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);
  return new Promise(res => canvas.toBlob(res, "image/png"));
}

// 이미지 → PDF
async function imagesToPdf(files) {
  const pdf = new window.jspdf.jsPDF();
  let first = true;

  for (const f of files) {
    const img = await loadImage(f);
    const imgData = await fileToBase64(f);

    if (!first) pdf.addPage();
    first = false;

    pdf.addImage(imgData, "JPEG", 10, 10, 190, 0);
  }
  return pdf;
}

function fileToBase64(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(file);
  });
}

// EXIF 제거
async function stripExif(file) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return new Promise(res => canvas.toBlob(res, "image/jpeg", 0.9));
}

// 버튼 이벤트 연결
document.querySelectorAll("[data-action-button]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const action = btn.dataset.actionButton;
    const panel = btn.closest(".card");
    const input = panel.querySelector(".file-input");
    const file = fileFromInput(input);

    if (!file) return alert("파일을 선택하세요!");

    // 기능 매핑
    if (action === "pngToJpg") {
      download("converted.jpg", await convertPngToJpg(file));
    }
    if (action === "pngToWebp") {
      download("converted.webp", await convertPngToWebp(file));
    }
    if (action === "heicToJpg") {
      const blob = await convertHeicToJpg(file);
      download("converted.jpg", blob);
    }
    if (action === "compress") {
      const quality = Number(panel.querySelector("[data-quality]").value);
      download("compressed.jpg", await compressImage(file, quality));
    }
    if (action === "resize") {
      const w = Number(panel.querySelector("[data-width]").value);
      const h = Number(panel.querySelector("[data-height]").value);
      download("resized.png", await resizeImage(file, w, h));
    }
    if (action === "imagesToPdf") {
      const files = input.files;
      const pdf = await imagesToPdf(files);
      pdf.save("images.pdf");
    }
    if (action === "stripExif") {
      download("no-exif.jpg", await stripExif(file));
    }
  });
});
