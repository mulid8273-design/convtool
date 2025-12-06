import { $, downloadFile } from "./main.js";

const input = $("fileInput");
const convertBtn = $("fileConvertBtn");
const format = $("fileFormat");
const result = $("fileResult");

convertBtn.addEventListener("click", async () => {
  if (!input.files.length) {
    result.textContent = "파일을 선택하세요.";
    return;
  }

  const file = input.files[0];
  const type = format.value;

  if (type === "txt") {
    result.textContent = "PDF → TXT 변환 중…";

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((i) => i.str).join(" ");
      text += strings + "\n";
    }

    const blob = new Blob([text], { type: "text/plain" });
    downloadFile(blob, "converted.txt");

    result.textContent = "변환 완료!";
  }

  if (type === "pdf") {
    result.textContent = "TXT → PDF 변환 중…";

    const text = await file.text();
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const lines = pdf.splitTextToSize(text, 180);
    pdf.text(lines, 15, 20);

    pdf.save("converted.pdf");

    result.textContent = "변환 완료!";
  }
});
