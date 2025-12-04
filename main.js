// =============== 탭 전환 ===============
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tool = btn.dataset.tool;
    document.querySelectorAll(".tab-panel").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(tool).classList.remove("hidden");
  });
});

// =============== 파일 읽기 ===============
function readImage(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

// =============== PNG → JPG ===============
async function pngToJpg(file) {
  const imgData = await readImage(file);
  return await convertImage(imgData, "image/jpeg", 0.92);
}

// =============== PNG → WEBP ===============
async function pngToWebp(file) {
  const imgData = await readImage(file);
  return await convertImage(imgData, "image/webp", 0.9);
}

// =============== HEIC → JPG ===============
async function heicToJpg(file) {
  const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
  return URL.createObjectURL(blob);
}

// =============== 이미지 압축 ===============
async function compressImage(file, quality) {
  const imgData = await readImage(file);
  return await convertImage(imgData, "image/jpeg", quality);
}

// 공용 변환 함수
async function convertImage(src, type, quality) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL(type, quality));
    };
    img.src = src;
  });
}

// =============== 리사이즈 ===============
async function resizeImage(file, width, height) {
  const src = await readImage(file);
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = src;
  });
}

// =============== EXIF 제거 ===============
async function stripExif(file) {
  const src = await readImage(file);
  return await convertImage(src, "image/jpeg", 0.92);
}

// =============== 이미지 → PDF ===============
async function imagesToPdf(files) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  for (let i = 0; i < files.length; i++) {
    const imgData = await readImage(files[i]);

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
  }

  pdf.save("result.pdf");
}

// =============== PDF 병합(간단) ===============
async function pdfMerge(files) {
  alert("🔧 간단 병합은 준비 중입니다.\n이미지는 정상 작동합니다!");
}

// =============== 버튼 바인딩 ===============
document.querySelectorAll("[data-action-button]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const action = btn.dataset.actionButton;
    const input = document.querySelector(`[data-action="${action}"]`);

    if (!input || !input.files.length) {
      alert("파일을 선택해주세요!");
      return;
    }

    const file = input.files[0];

    if (action === "pngToJpg") {
      const out = await pngToJpg(file);
      download(out, "converted.jpg");
    }

    if (action === "pngToWebp") {
      const out = await pngToWebp(file);
      download(out, "converted.webp");
    }

    if (action === "heicToJpg") {
      const out = await heicToJpg(file);
      downloadURL(out, "converted.jpg");
    }

    if (action === "compress") {
      const quality = document.querySelector("[data-quality]").value;
      const out = await compressImage(file, quality);
      download(out, "compressed.jpg");
    }

    if (action === "resize") {
      const w = document.querySelector("[data-width]").value;
      const h = document.querySelector("[data-height]").value;
      const out = await resizeImage(file, w, h);
      download(out, "resized.png");
    }

    if (action === "stripExif") {
      const out = await stripExif(file);
      download(out, "noexif.jpg");
    }

    if (action === "imagesToPdf") {
      await imagesToPdf(input.files);
    }
  });
});

// =============== 다운로드 도구 ===============

// Base64 다운로드
function download(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

// Blob URL 다운로드
function downloadURL(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
