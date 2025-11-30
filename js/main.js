const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");

fileInput.addEventListener("change", () => {
    fileName.innerText = fileInput.files.length
        ? fileInput.files[0].name
        : "선택된 파일 없음";
});

function convertToJPG() {
    alert("PNG → JPG 변환 기능 준비 중!");
}

function convertToWEBP() {
    alert("PNG → WEBP 변환 기능 준비 중!");
}

function resizeImage() {
    alert("이미지 리사이즈 기능 준비 중!");
}

function imageToPDF() {
    alert("이미지 → PDF 기능 준비 중!");
}
