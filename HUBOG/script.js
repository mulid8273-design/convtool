const albumArt = document.getElementById('albumArt');
const albumAudio = document.getElementById('albumAudio');

// 앨범 아트 클릭 시 재생/일시정지 토글
albumArt.addEventListener('click', () => {
    if(albumAudio.paused) {
        albumAudio.play();
    } else {
        albumAudio.pause();
    }
});
