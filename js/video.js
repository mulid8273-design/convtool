import { $, downloadFile } from "./main.js";

let ffmpeg;
let loaded = false;

async function loadFFmpeg() {
  if (loaded) return;
  ffmpeg = FFmpeg.createFFmpeg({ log: true });

  await ffmpeg.load();
  loaded = true;
}

const input = $("videoInput");
const format = $("videoFormat");
const convertBtn = $("videoConvertBtn");
const result = $("videoResult");

convertBtn.addEventListener("click", async () => {
  if (!input.files.length) {
    result.textContent = "영상을 선택해주세요.";
    return;
  }

  const file = input.files[0];
  const target = format.value;
  const outputName = `converted.${target}`;

  result.textContent = "FFmpeg 로드 중…";

  await loadFFmpeg();

  result.textContent = "영상 변환 중… 잠시만 기다려주세요.";

  // 파일을 FFmpeg FS에 저장
  ffmpeg.FS("writeFile", "input", await file.arrayBuffer());

  // 변환 명령 실행
  await ffmpeg.run("-i", "input", outputName);

  // 결과 가져오기
  const data = ffmpeg.FS("readFile", outputName);
  const blob = new Blob([data.buffer], { type: `video/${target}` });

  downloadFile(blob, outputName);

  result.textContent = "영상 변환 완료!";
});
