/* --------------------------------------------------
   AUDIO & INTERACTION CONTROLLER
-------------------------------------------------- */
let currentAudio = null;
let timer = null;
let progressInterval = null;
const DURATION = 30; // 10秒間固定

const buttons = document.querySelectorAll('.track-btn');
const windowFrame = document.getElementById('windowFrame');
const treeImage = document.getElementById('treeImage');
const progressBar = document.getElementById('progressBar');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const audioSrc = 'audio/' + btn.getAttribute('data-track');
    const scene = btn.getAttribute('data-scene');

    // 再生中の音があれば停止
    stopCurrentTrack();

    // アクティブボタンの更新
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // トラック再生
    playTrack(audioSrc, scene);
  });
});

function playTrack(src, scene) {
  currentAudio = new Audio(src);
  
  // シーン属性の設定（CSSフィルター連動）
  windowFrame.setAttribute('data-scene', scene);

  // 風・雨時の揺れアニメーション付与
  treeImage.classList.remove('sway', 'heavy-sway');
  if (scene === 'wind') {
    treeImage.classList.add('sway');
  } else if (scene === 'rain') {
    treeImage.classList.add('heavy-sway');
  }

  // 音声再生
  currentAudio.play().catch(err => {
    console.log("Audio play prevented by browser policy:", err);
  });

  // 10秒間のプログレスバー演出
  let startTime = Date.now();
  progressBar.style.transform = 'scaleX(1)';

  progressInterval = setInterval(() => {
    let elapsed = (Date.now() - startTime) / 1000;
    let remainingRatio = 1 - (elapsed / DURATION);

    if (remainingRatio <= 0) {
      progressBar.style.transform = 'scaleX(0)';
      clearInterval(progressInterval);
    } else {
      progressBar.style.transform = `scaleX(${remainingRatio})`;
    }
  }, 50);

  // 10秒後に自動停止
  timer = setTimeout(() => {
    stopCurrentTrack();
  }, DURATION * 1000);
}

function stopCurrentTrack() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (timer) clearTimeout(timer);
  if (progressInterval) clearInterval(progressInterval);

  progressBar.style.transform = 'scaleX(0)';
  treeImage.classList.remove('sway', 'heavy-sway');
  windowFrame.setAttribute('data-scene', 'none');
  buttons.forEach(b => b.classList.remove('active'));
}
