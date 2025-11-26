const fileInput = document.getElementById("fileInput");
const downloadLink = document.getElementById("downloadLink");

function loadImage() {
    return new Promise((resolve, reject) => {
        const file = fileInput.files[0];
        if (!file) return reject("파일 없음");

        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

async function convertToJPG() {
    const img = await loadImage();
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);

    const url = canvas.toDataURL("image/jpeg", 0.9);
    downloadLink.href = url;
    downloadLink.download = "converted.jpg";
    downloadLink.style.display = "block";
}

async function convertToWEBP() {
    const img = await loadImage();
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);

    const url = canvas.toDataURL("image/webp", 0.9);
    downloadLink.href = url;
    downloadLink.download = "converted.webp";
    downloadLink.style.display = "block";
}

async function resizeImage() {
    const img = await loadImage();
    const scale = 0.5; 
    const canvas = document.createElement("canvas");
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

    const url = canvas.toDataURL("image/png");
    downloadLink.href = url;
    downloadLink.download = "resized.png";
    downloadLink.style.display = "block";
}

async function convertToPDF() {
    const img = await loadImage();
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("p", "mm", "a4");
    const width = 190;
    const ratio = img.height / img.width;
    const height = width * ratio;

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);

    const imgData = canvas.toDataURL("image/png");

    pdf.addImage(imgData, "PNG", 10, 10, width, height);
    const pdfBlob = pdf.output("blob");

    const pdfUrl = URL.createObjectURL(pdfBlob);
    downloadLink.href = pdfUrl;
    downloadLink.download = "converted.pdf";
    downloadLink.style.display = "block";
}
