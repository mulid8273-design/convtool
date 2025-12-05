// pdf.js
import jsPDF from 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

document.getElementById("pdfConvertBtn").addEventListener("click", async () => {
  const file = document.getElementById("pdfInput").files[0];
  if(!file){ alert("파일을 선택해주세요!"); return; }

  const reader = new FileReader();
  reader.onload = (e)=>{
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({unit:'pt', format:'a4'});

    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      const ratio = Math.min(595/img.width, 842/img.height);
      pdf.addImage(img, 'PNG', 0, 0, img.width*ratio, img.height*ratio);

      const link = document.getElementById("pdfDownload");
      link.href = pdf.output('bloburl');
      link.download = "converted.pdf";
      link.style.display = "inline";
      link.textContent = "다운로드";
    }
  };
  reader.readAsDataURL(file);
});
