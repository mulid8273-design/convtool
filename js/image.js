document.getElementById("imageConvertBtn").addEventListener("click", () => {
    const file = document.getElementById("imageInput").files[0];
    if(!file){ alert("이미지를 선택해주세요!"); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
        const link = document.getElementById("imageDownload");
        link.href = e.target.result;
        link.download = "converted_" + file.name;
        link.style.display = "inline";
        link.textContent = "다운로드";
    };
    reader.readAsDataURL(file);
});
