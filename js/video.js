document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("videoInput");
    const button = document.getElementById("convertVideoBtn");

    if (!input || !button) {
        console.warn("video.js: 변환 요소를 찾지 못했습니다.");
        return;
    }

    button.addEventListener("click", () => {
        if (input.files.length === 0) {
            alert("동영상을 선택해 주세요.");
            return;
        }

        alert("동영상 변환 기능은 서버 필요 — 현재는 데모 상태입니다.");
    });
});
