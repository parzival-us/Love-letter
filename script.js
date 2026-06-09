// ===== DOM Elements =====
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const questionView = document.getElementById('question-view');
const successView = document.getElementById('success-view');
const dodgeCounter = document.getElementById('dodge-counter');
const dodgeCount = document.getElementById('dodge-count');
const heartRain = document.getElementById('heart-rain');
const subtitleEl = document.getElementById('subtitle');
const starsCanvas = document.getElementById('stars-canvas');
const trailCanvas = document.getElementById('trail-canvas');

let escapeCount = 0;
let yesScale = 1;

// ===================================================================
//  1. STARFIELD BACKGROUND
// ===================================================================
(function initStars() {
  const ctx = starsCanvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 120;

  function resize() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height,
      r: 0.4 + Math.random() * 1.6,
      alpha: 0.2 + Math.random() * 0.6,
      speed: 0.003 + Math.random() * 0.008,
      phase: Math.random() * Math.PI * 2,
    });
  }

  function draw(time) {
    ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    for (const s of stars) {
      const twinkle = 0.4 + 0.6 * Math.sin(time * s.speed + s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 220, 240, ${s.alpha * twinkle})`;
      ctx.fill();

      // Tiny glow
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 180, 210, ${s.alpha * twinkle * 0.12})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// ===================================================================
//  2. MOUSE / TOUCH HEART TRAIL
// ===================================================================
(function initTrail() {
  const ctx = trailCanvas.getContext('2d');
  let particles = [];
  let mouse = { x: -100, y: -100 };
  let lastSpawn = 0;

  function resize() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('touchmove', function (e) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }, { passive: true });

  const heartEmojis = ['💖', '✨', '💕', '💗', '✨'];

  function draw(time) {
    ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    // Spawn new particles at intervals
    if (time - lastSpawn > 60 && mouse.x > 0) {
      lastSpawn = time;
      particles.push({
        x: mouse.x + (Math.random() - 0.5) * 10,
        y: mouse.y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -1 - Math.random() * 2,
        life: 1,
        decay: 0.015 + Math.random() * 0.01,
        size: 10 + Math.random() * 10,
        emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
      });
    }

    // Update & draw
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02; // slight gravity
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = p.life;
      ctx.font = p.size + 'px serif';
      ctx.fillText(p.emoji, p.x, p.y);
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// ===================================================================
//  3. AMBIENT FLOATING HEARTS
// ===================================================================
function createAmbientHearts() {
  const container = document.getElementById('ambient-hearts');
  const hearts = ['💕', '💗', '💖', '✨', '💘', '💝', '🌸'];

  for (let i = 0; i < 18; i++) {
    const heart = document.createElement('span');
    heart.className = 'ambient-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (10 + Math.random() * 14) + 's';
    heart.style.animationDelay = (Math.random() * 12) + 's';
    heart.style.fontSize = (0.8 + Math.random() * 1.4) + 'rem';
    container.appendChild(heart);
  }
}

// ===================================================================
//  4. TYPEWRITER EFFECT FOR SUBTITLE
// ===================================================================
function typewriter(el, text, speed) {
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  el.appendChild(cursor);

  function type() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text.charAt(i)), cursor);
      i++;
      setTimeout(type, speed);
    } else {
      // Remove cursor after a pause
      setTimeout(function () {
        cursor.style.animation = 'none';
        cursor.style.opacity = '0';
        cursor.style.transition = 'opacity 0.5s';
      }, 1500);
    }
  }
  type();
}

// ===================================================================
//  5. LUMINOUS ORB SPAWNER
// ===================================================================
function createOrbs() {
  const colors = [
    'rgba(255, 75, 122, 0.5)',
    'rgba(196, 77, 255, 0.4)',
    'rgba(255, 154, 158, 0.45)',
    'rgba(255, 200, 220, 0.35)',
  ];

  for (let i = 0; i < 8; i++) {
    const orb = document.createElement('div');
    orb.className = 'orb';
    const size = 4 + Math.random() * 8;
    orb.style.width = size + 'px';
    orb.style.height = size + 'px';
    orb.style.background = colors[Math.floor(Math.random() * colors.length)];
    orb.style.left = Math.random() * 100 + '%';
    orb.style.bottom = '-20px';
    orb.style.animationDuration = (8 + Math.random() * 16) + 's';
    orb.style.animationDelay = (Math.random() * 10) + 's';
    orb.style.boxShadow = `0 0 ${size * 3}px ${orb.style.background}`;
    document.body.appendChild(orb);
  }
}

// ===================================================================
//  6. SPARKLE BURST EFFECT
// ===================================================================
function createSparkleBurst(cx, cy, count) {
  const colors = ['#ff4b7a', '#ff9a9e', '#ffd1dc', '#fff', '#c44dff', '#ffb6c1'];

  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];

    const angle = Math.random() * Math.PI * 2;
    const dist = 20 + Math.random() * 100;
    const sx = Math.cos(angle) * dist;
    const sy = Math.sin(angle) * dist;

    sparkle.style.left = cx + 'px';
    sparkle.style.top = cy + 'px';
    sparkle.style.setProperty('--sx', sx + 'px');
    sparkle.style.setProperty('--sy', sy + 'px');

    const size = 3 + Math.random() * 7;
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';

    document.body.appendChild(sparkle);
    setTimeout(function () { sparkle.remove(); }, 900);
  }
}

// ===================================================================
//  7. RIPPLE EFFECT ON BUTTON CLICK
// ===================================================================
function createRipple(btn, e) {
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  btn.appendChild(ripple);
  setTimeout(function () { ripple.remove(); }, 600);
}

// ===================================================================
//  8. CONFETTI BURST
// ===================================================================
function createConfetti(count) {
  const colors = ['#ff4b7a', '#c44dff', '#ff9a9e', '#ffd1dc', '#ffb347', '#87ceeb', '#fff'];

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = (20 + Math.random() * 60) + '%';
    confetti.style.top = '-10px';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    confetti.style.width = (5 + Math.random() * 8) + 'px';
    confetti.style.height = (5 + Math.random() * 8) + 'px';
    confetti.style.animationDuration = (2 + Math.random() * 3) + 's';
    confetti.style.animationDelay = (Math.random() * 1.5) + 's';
    document.body.appendChild(confetti);
    setTimeout(function () { confetti.remove(); }, 5000);
  }
}

// ===================================================================
//  9. NO BUTTON DODGE LOGIC
// ===================================================================
const dodgeMessages = [
  '', '', '',
  'Nice try 😏',
  "You can't catch it!",
  "It's too fast! 🏃‍♂️",
  'Just say yes already! 😄',
  'The button has spoken 💅',
  'Resistance is futile 💘',
  'Give up yet? 😂',
  'I could do this all day 💖',
  'Your heart knows the answer 🥰',
];

function escapeNoButton() {
  escapeCount++;

  if (!btnNo.classList.contains('escaped')) {
    btnNo.classList.add('escaped');
  }

  // Random safe position
  const btnW = btnNo.offsetWidth;
  const btnH = btnNo.offsetHeight;
  const pad = 24;
  const maxX = window.innerWidth - btnW - pad;
  const maxY = window.innerHeight - btnH - pad;
  const newX = pad + Math.random() * maxX;
  const newY = pad + Math.random() * maxY;

  btnNo.style.left = newX + 'px';
  btnNo.style.top = newY + 'px';

  // Gradually shrink and fade the No button
  const noScale = Math.max(0.55, 1 - escapeCount * 0.04);
  const noOpacity = Math.max(0.4, 1 - escapeCount * 0.05);
  btnNo.style.transform = `scale(${noScale})`;
  btnNo.style.opacity = noOpacity;

  // Grow the Yes button
  yesScale += 0.07;
  btnYes.style.transform = `scale(${yesScale})`;

  // Update counter / show playful message
  dodgeCounter.classList.add('visible');
  if (escapeCount < dodgeMessages.length && dodgeMessages[escapeCount]) {
    dodgeCounter.textContent = dodgeMessages[escapeCount];
  } else {
    dodgeCount.textContent = escapeCount;
    dodgeCounter.innerHTML = 'Dodged: <strong>' + escapeCount + '</strong> times';
  }

  // Sparkle burst at new position
  createSparkleBurst(newX + btnW / 2, newY + btnH / 2, 6);
}

btnNo.addEventListener('mouseenter', escapeNoButton);
btnNo.addEventListener('touchstart', function (e) {
  e.preventDefault();
  escapeNoButton();
}, { passive: false });
btnNo.addEventListener('click', function (e) {
  e.preventDefault();
  escapeNoButton();
});

// ===================================================================
//  10. YES BUTTON CLICK — CELEBRATION
// ===================================================================
btnYes.addEventListener('click', function (e) {
  createRipple(btnYes, e);

  setTimeout(function () {
    questionView.style.display = 'none';
    successView.classList.add('show');
    btnNo.style.display = 'none';

    // Celebration effects!
    startHeartRain();
    createConfetti(50);
    createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 40);

    // Second wave of confetti
    setTimeout(function () { createConfetti(30); }, 1200);
  }, 200);
});

// ===================================================================
//  11. HEART RAIN CELEBRATION
// ===================================================================
function startHeartRain() {
  const emojis = ['❤️', '💖', '💗', '💕', '💘', '💝', '🥰', '😍', '🎉', '✨', '🌹', '🌸'];
  let spawned = 0;
  const total = 70;

  function spawnHeart() {
    if (spawned >= total) return;
    spawned++;

    const heart = document.createElement('span');
    heart.className = 'rain-heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (1.2 + Math.random() * 2.2) + 'rem';

    const dur = 2.5 + Math.random() * 3.5;
    heart.style.animationDuration = dur + 's';
    heartRain.appendChild(heart);
    setTimeout(function () { heart.remove(); }, dur * 1000);
    setTimeout(spawnHeart, 60 + Math.random() * 100);
  }
  spawnHeart();

  // Continuous gentle rain
  setInterval(function () {
    const heart = document.createElement('span');
    heart.className = 'rain-heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (1 + Math.random() * 1.6) + 'rem';
    const dur = 3.5 + Math.random() * 4;
    heart.style.animationDuration = dur + 's';
    heartRain.appendChild(heart);
    setTimeout(function () { heart.remove(); }, dur * 1000);
  }, 450);
}

// ===================================================================
//  12. INIT
// ===================================================================
createAmbientHearts();
createOrbs();
typewriter(subtitleEl, 'I promise to make every day special ✨', 55);
