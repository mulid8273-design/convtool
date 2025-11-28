function downloadFile(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
}

function convertToJPG() {
    const file = document.getElementById("fileInput").files[0];
    if (!file) return alert("파일을 선택하세요!");

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
            downloadFile(URL.createObjectURL(blob), "converted.jpg");
        }, "image/jpeg", 0.9);
    };
}

function convertToWEBP() {
    const file = document.getElementById("fileInput").files[0];
    if (!file) return alert("파일을 선택하세요!");

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
            downloadFile(URL.createObjectURL(blob), "converted.webp");
        }, "image/webp", 0.9);
    };
}

function resizeImage() {
    alert("리사이즈 기능은 다음 업데이트에서 추가됩니다!");
}

function convertToPDF() {
    alert("PDF 변환 기능은 다음 업데이트에서 추가됩니다!");
}
