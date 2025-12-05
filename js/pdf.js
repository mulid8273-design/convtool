document.getElementById("pdfConvertBtn").addEventListener("click", () => {
  const file = document.getElementById("pdfInput").files[0];
  if(!file){
    alert("파일을 선택해주세요!");
    return;
  }

  // 브라우저 내 안정 변환: 2MB 이하 권장
  if(file.size > 2 * 1024 * 1024){
    alert("브라우저에서는 2MB 이하 PPT/PDF 파일만 안정적으로 변환 가능합니다.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e){
    const blob = new Blob([e.target.result], {type:"application/pdf"});
    const link = document.getElementById("pdfDownload");
    link.href = URL.createObjectURL(blob);
    link.download = `converted_${file.name.split('.')[0]}.pdf`;
    link.style.display = "inline";
    link.textContent = '다운로드';
  };
  reader.readAsArrayBuffer(file);
});
