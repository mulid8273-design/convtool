// 탭 전환
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;

    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".tab-panel").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(tab).classList.remove("hidden");
  });
});

// 이미지 로드 헬퍼
function loadImage(file) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = URL.createObjectURL(file);
  });
}

// PNG → JPG
async function pngToJpg(input) {
  const file = input.files[0];
  const img = await loadImage(file);

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  canvas.toBlob(blob => download(blob, "converted.jpg"), "image/jpeg", 0.9);
}

// PNG → WEBP
async function pngToWebp(input) {
  const file = input.files[0];
  const img = await loadImage(file);

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext("2d").drawImage(img, 0, 0);

  canvas.toBlob(blob => download(blob, "converted.webp"), "image/webp", 0.9);
}

// HEIC → JPG
async function heicToJpg(input) {
  const file = input.files[0];
  const blob = await heic2any({ blob: file, toType: "image/jpeg" });
  download(blob, "converted.jpg");
}

// 압축
async function compress(input) {
  const file = input.files[0];
  const img = await loadImage(file);
  const q = document.querySelector("[data-quality]").value;

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext("2d").drawImage(img, 0, 0);

  canvas.toBlob(blob => download(blob, "compressed.jpg"), "image/jpeg", q);
}

// 리사이즈
async function resize(input) {
  const file = input.files[0];
  const img = await loadImage(file);

  const w = document.querySelector("[data-width]").value || img.width;
  const h = document.querySelector("[data-height]").value || img.height;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(img, 0, 0, w, h);

  canvas.toBlob(blob => download(blob, "resized.jpg"), "image/jpeg", 0.9);
}

// 이미지 → PDF
async function imagesToPdf(input) {
  const files = [...input.files];

  const pdf = new jspdf.jsPDF();

  for (let i = 0; i < files.length; i++) {
    const img = await loadImage(files[i]);

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);

    const data = canvas.toDataURL("image/jpeg", 0.9);
    if (i > 0) pdf.addPage();
    pdf.addImage(data, "JPEG", 10, 10, 180, 0);
  }

  pdf.save("images.pdf");
}

// 다운로드 헬퍼
function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

// 버튼 실행 연결
document.querySelectorAll("[data-run]").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.run;
    const input = document.querySelector(`[data-action="${action}"]`);
    window[action](input);
  });
});
