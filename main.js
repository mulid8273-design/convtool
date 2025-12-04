// 탭 전환
const tabs = document.querySelectorAll(".nav-btn");
const panels = document.querySelectorAll(".tab-panel");

tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;

    tabs.forEach(b => b.classList.remove("active"));
    panels.forEach(p => p.classList.add("hidden"));

    btn.classList.add("active");
    document.getElementById(target).classList.remove("hidden");
  });
});

// ========== 기능 구현 ==========

// 파일 → 이미지 객체 로드
function loadImage(file) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => res(img);
    img.src = URL.createObjectURL(file);
  });
}

// PNG → JPG
async function pngToJpg(file) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  canvas.toBlob(b => downloadFile(b, "converted.jpg"), "image/jpeg", 0.92);
}

// PNG → WEBP
async function pngToWebp(file) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  canvas.toBlob(b => downloadFile(b, "converted.webp"), "image/webp", 0.9);
}

// HEIC → JPG
async function heicToJpg(file) {
  const blob = await heic2any({ blob: file, toType: "image/jpeg" });
  downloadFile(blob, "converted.jpg");
}

// 이미지 압축
async function compress(file, q) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  canvas.toBlob(b => downloadFile(b, "compressed.jpg"), "image/jpeg", q);
}

// 리사이즈
async function resize(file, w, h) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);

  canvas.toBlob(b => downloadFile(b, "resized.png"), "image/png");
}

// 크롭 (간단)
function crop(file) {
  const url = URL.createObjectURL(file);
  window.open(url, "_blank");
}

// 이미지 → PDF
async function imagesToPdf(files) {
  const pdf = new jspdf.jsPDF({ unit: "px" });

  for (let i = 0; i < files.length; i++) {
    const img = await loadImage(files[i]);
    const imgData = await toDataURL(img);

    if (i !== 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, img.width, img.height);
  }

  pdf.save("images.pdf");
}

function toDataURL(img) {
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return c.toDataURL("image/jpeg", 1);
}

// EXIF 제거
async function stripExif(file) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext("2d").drawImage(img, 0, 0);

  canvas.toBlob(b => downloadFile(b, "no-exif.jpg"), "image/jpeg", 0.95);
}

// 다운로드 헬퍼
function downloadFile(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
}

// 버튼 실행 연결
document.querySelectorAll("[data-run]").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.run;
    const fileInput = btn.parentElement.querySelector("[data-action]");
    const file = fileInput?.files?.[0];

    if (!file) return alert("파일을 선택해 주세요");

    const quality = btn.parentElement.querySelector("[data-quality"]?.value;
    const width = btn.parentElement.querySelector("[data-width"]?.value;
    const height = btn.parentElement.querySelector("[data-height"]?.value;

    if (action === "pngToJpg") pngToJpg(file);
    if (action === "pngToWebp") pngToWebp(file);
    if (action === "heicToJpg") heicToJpg(file);
    if (action === "compress") compress(file, quality);
    if (action === "resize") resize(file, Number(width), Number(height));
    if (action === "crop") crop(file);
    if (action === "imagesToPdf") imagesToPdf(fileInput.files);
    if (action === "stripExif") stripExif(file);
  });
});

// 파스텔 컬러 생성
const genBtn = document.getElementById("genPastel");
const box = document.getElementById("pastelBox");

if (genBtn) {
  genBtn.addEventListener("click", () => {
    const r = 200 + Math.floor(Math.random() * 55);
    const g = 200 + Math.floor(Math.random() * 55);
    const b = 200 + Math.floor(Math.random() * 55);
    const col = `rgb(${r},${g},${b})`;
    box.style.background = col;
    box.textContent = col;
  });
}
