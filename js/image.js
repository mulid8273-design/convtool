document.getElementById("imageConvertBtn").addEventListener("click", () => {
    const file = document.getElementById("imageInput").files[0];
    if(!file){ alert("이미지를 선택해주세요!"); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width; canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(blob => {
                const link = document.getElementById("imageDownload");
                link.href = URL.createObjectURL(blob);
                link.download = "converted_" + file.name;
                link.style.display = "inline";
                link.textContent = "다운로드";
            }, "image/png"); // PNG로 변환 예시
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});
