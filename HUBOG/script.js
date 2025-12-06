cconst video = document.getElementById('previewVideo');
const links = document.getElementById('serviceLinks');

// 15초 미리보기 후 링크 표시
video.addEventListener('timeupdate', () => {
    if(video.currentTime >= 15) {
        video.pause();
        links.style.display = 'flex';
    }
});
