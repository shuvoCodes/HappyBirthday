const bgAudio = document.getElementById('birthday-audio');
if (bgAudio) {
  const desiredVolume = 0.2;
  let musicStarted = false;
  bgAudio.volume = desiredVolume;
  bgAudio.loop = true;

  const startMusic = () => {
    if (musicStarted) return;
    bgAudio.volume = desiredVolume;
    bgAudio.muted = false;
    bgAudio.play()
      .then(() => {
        musicStarted = true;
      })
      .catch(() => {});
  };

  window.addEventListener('load', startMusic, { once: true });
  document.addEventListener('pointerdown', startMusic);
  document.addEventListener('keydown', startMusic);
}

const voiceButtons = document.querySelectorAll('.voice-btn');
const pages = Array.from(document.querySelectorAll('.story-page'));
let currentPageIndex = 0;

function speakText(text) {
  if (!('speechSynthesis' in window)) return;

  if (bgAudio) bgAudio.pause();
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'bn-BD';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

function showPage(index) {
  currentPageIndex = (index + pages.length) % pages.length;

  pages.forEach((page, pageIndex) => {
    page.classList.toggle('active', pageIndex === currentPageIndex);
  });

  const activeVoiceButton = pages[currentPageIndex].querySelector('.voice-btn');
  if (activeVoiceButton) {
    const text = activeVoiceButton.dataset.text || activeVoiceButton.textContent.trim();
    speakText(text);
  }
}

voiceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const text = button.dataset.text || button.textContent.trim();
    speakText(text);
  });
});

document.querySelectorAll('.nav-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const direction = button.classList.contains('next') ? 1 : -1;
    showPage(currentPageIndex + direction);
  });
});

const celebrationButton = document.querySelector('.cta');
if (celebrationButton) {
  const celebrationColors = ['#ff4f91', '#ffd34f', '#74dcff', '#bd79ff', '#74f0b4', '#ff8b4f'];

  celebrationButton.addEventListener('click', () => {
    document.querySelector('.celebration-effects')?.remove();

    const effects = document.createElement('div');
    effects.className = 'celebration-effects';
    effects.setAttribute('aria-hidden', 'true');

    for (let index = 0; index < 90; index += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.setProperty('--left', `${Math.random() * 100}%`);
      piece.style.setProperty('--size', `${5 + Math.random() * 8}px`);
      piece.style.setProperty('--color', celebrationColors[index % celebrationColors.length]);
      piece.style.setProperty('--duration', `${2.5 + Math.random() * 2.5}s`);
      piece.style.setProperty('--delay', `${Math.random() * 0.9}s`);
      piece.style.setProperty('--drift', `${Math.random() * 240 - 120}px`);
      piece.style.setProperty('--spin', `${Math.random() * 1080 - 540}deg`);
      effects.append(piece);
    }

    for (let index = 0; index < 18; index += 1) {
      const balloon = document.createElement('span');
      balloon.className = 'heart-balloon';
      balloon.textContent = '♥';
      balloon.style.setProperty('--left', `${Math.random() * 92 + 4}%`);
      balloon.style.setProperty('--size', `${32 + Math.random() * 30}px`);
      balloon.style.setProperty('--color', celebrationColors[index % celebrationColors.length]);
      balloon.style.setProperty('--duration', `${6 + Math.random() * 3}s`);
      balloon.style.setProperty('--delay', `${Math.random() * 1.8}s`);
      balloon.style.setProperty('--drift', `${Math.random() * 140 - 70}px`);
      effects.append(balloon);
    }

    document.body.append(effects);
    window.setTimeout(() => effects.remove(), 11000);
  });
}

const revealItems = document.querySelectorAll('.card, .hero-card, .friend-sign, .prompt-box');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = entry.target.style.animation || 'cardReveal 0.9s ease-out both';
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));
showPage(0);
