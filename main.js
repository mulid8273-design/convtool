/* 탭 전환 */
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.dataset.tab;
    document.querySelectorAll(".tab-panel").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(tab).classList.remove("hidden");
  });
});

/* 파일 선택 핸들러 */
function getFile(input) {
  return input.files && input.files[0] ? input.files[0] : null;
}

/* PNG → JPG */
async function pngToJpg(file) {
  const img = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
  downloadBlob(blob, file.name.replace(".png", ".jpg"));
}

/* PNG → WEBP */
async function pngToWebp(file) {
  const img = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const blob = await canvas.convertToBlob({ type: "image/webp", quality: 0.9 });
  downloadBlob(blob, file.name.replace(".png", ".webp"));
}

/* HEIC → JPG */
async function heicToJpg(file) {
  const blob = await heic2any({ blob: file, toType: "image/jpeg" });
  downloadBlob(blob, file.name.replace(".heic", ".jpg"));
}

/* 압축 */
async function compress(file, q) {
  const img = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: q });
  downloadBlob(blob, "compressed.jpg");
}

/* 리사이즈 */
async function resize(file, w, h) {
  const img = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);
  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
  downloadBlob(blob, "resized.jpg");
}

/* 이미지 → PDF */
async function imagesToPdf(files) {
  const pdf = new window.jspdf.jsPDF();
  let first = true;

  for (const file of files) {
    const img = await fileToBase64(file);
    if (!first) pdf.addPage();
    first = false;
    pdf.addImage(img, "JPEG", 10, 10, 190, 0);
  }
  pdf.save("images.pdf");
}

/* PDF 병합(간단) */
async function pdfMerge(files) {
  // 매우 단순한 병합 (1개 PDF로 페이지 추가)
  const pdf = new window.jspdf.jsPDF();
  let first = true;

  for (const file of files) {
    const buf = await file.arrayBuffer();
    const src = await pdf.loadFile(buf);

    src.getPages().forEach((p, idx) => {
      if (!first || idx > 0) pdf.addPage();
      pdf.addImage(p, "JPEG", 10, 10, 190, 0);
    });

    first = false;
  }

  pdf.save("merged.pdf");
}

/* EXIF 제거 */
async function stripExif(file) {
  const img = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
  downloadBlob(blob, "no_exif.jpg");
}

/* Base64 ↔ 이미지 */
document.getElementById("b64toimg").onclick = () => {
  const txt = document.getElementById("b64area").value;
  const a = document.createElement("a");
  a.href = txt;
  a.download = "image.png";
  a.click();
};

document.getElementById("imgtob64").onclick = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async () => {
    const file = input.files[0];
    const b64 = await fileToBase64(file);
    document.getElementById("b64area").value = b64;
  };
  input.click();
};

/* 도우미 */
function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function fileToBase64(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(file);
  });
}

/* 실행 버튼 연결 */
document.querySelectorAll("[data-run]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const action = btn.dataset.run;
    const card = btn.closest(".card");
    const input = card.querySelector("input[type=file]");
    const file = input.multiple ? [...input.files] : getFile(input);

    const q = card.querySelector("[data-quality]")?.value;
    const w = card.querySelector("[data-width]")?.value;
    const h = card.querySelector("[data-height]")?.value;

    if (!file) return alert("파일을 선택하세요.");

    if (action === "pngToJpg") pngToJpg(file);
    if (action === "pngToWebp") pngToWebp(file);
    if (action === "heicToJpg") heicToJpg(file);
    if (action === "compress") compress(file, q);
    if (action === "resize") resize(file, Number(w), Number(h));
    if (action === "imagesToPdf") imagesToPdf(file);
    if (action === "pdfMerge") pdfMerge(file);
    if (action === "stripExif") stripExif(file);
  });
});
