import { createFFmpeg, fetchFile } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.2/dist/ffmpeg.min.js';
const ffmpeg = createFFmpeg({ log: true });

document.getElementById("videoConvertBtn").addEventListener("click", async ()=>{
  const file = document.getElementById("videoInput").files[0];
  if(!file){ alert("파일을 선택해주세요!"); return; }

  if(!ffmpeg.isLoaded()) await ffmpeg.load();
  ffmpeg.FS('writeFile', file.name, await fetchFile(file));

  const outputFormat = file.name.endsWith('.mp4') ? 'webm' : 'mp4';
  await ffmpeg.run('-i', file.name, `output.${outputFormat}`);
  const data = ffmpeg.FS('readFile', `output.${outputFormat}`);

  const url = URL.createObjectURL(new Blob([data.buffer],{type:`video/${outputFormat}`}));
  const link = document.getElementById("videoDownload");
  link.href = url;
  link.download = `converted_${file.name.split('.')[0]}.${outputFormat}`;
  link.style.display = 'inline';
  link.textContent = '다운로드';
});
