const video = document.getElementById('previewVideo');
const links = document.getElementById('serviceLinks');

// 15초 미리보기 후 링크 표시
video.addEventListener('timeupdate', () => {
    if(video.currentTime >= 15) {
        video.pause();
        links.style.display = 'flex';
    }
});

// 재생 중 glow 효과
video.addEventListener('play', () => {
    video.classList.add('playing');
});
video.addEventListener('pause', () => {
    video.classList.remove('playing');
});
