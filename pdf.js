// pdf.js
document.getElementById("pdfConvertBtn").addEventListener("click", async () => {
  const file = document.getElementById("pdfInput").files[0];
  if(!file){ alert("파일 선택 필요"); return; }

  const reader = new FileReader();
  reader.onload = (e)=>{
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit:'pt', format:'a4' });

    if(file.type.startsWith('image/')){
      const img = new Image();
      img.src = e.target.result;
      img.onload = ()=>{
        const ratio = Math.min(595/img.width, 842/img.height);
        pdf.addImage(img,'PNG',0,0,img.width*ratio,img.height*ratio);
        const link = document.getElementById("pdfDownload");
        link.href = pdf.output('bloburl');
        link.download = `converted_${file.name.split('.')[0]}.pdf`;
        link.style.display = 'inline';
        link.textContent = '다운로드';
      };
    } else if(file.type === 'application/pdf'){
      const blob = new Blob([e.target.result], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.getElementById("pdfDownload");
      link.href = url;
      link.download = file.name;
      link.style.display = 'inline';
      link.textContent = '다운로드';
    } else {
      alert("지원하지 않는 파일 형식");
    }
  };

  if(file.type.startsWith('image/')) reader.readAsDataURL(file);
  else reader.readAsArrayBuffer(file);
});
