// =====================================================================
//  LOVE LETTER — ULTIMATE EDITION
//  Features: Cinematic intro, multi-scene navigation, music, theme
//  toggle, fireworks, shooting stars, countdown, gallery, response
// =====================================================================

// ===== Globals =====
let escapeCount = 0;
let yesScale = 1;
let currentScene = 'intro';
let yesTimestamp = null;
let isDark = true;

// ===== DOM Cache =====
const $ = (id) => document.getElementById(id);
const scenes = {
  intro:        $('intro-scene'),
  question:     $('question-scene'),
  success:      $('success-scene'),
  'love-letter':$('love-letter-scene'),
  gallery:      $('gallery-scene'),
  countdown:    $('countdown-scene'),
  response:     $('response-scene'),
};

const btnYes       = $('btn-yes');
const btnNo        = $('btn-no');
const dodgeCounter = $('dodge-counter');
const dodgeCount   = $('dodge-count');
const subtitleEl   = $('subtitle');
const heartRain    = $('heart-rain');
const starsCanvas  = $('stars-canvas');
const trailCanvas  = $('trail-canvas');
const fwCanvas     = $('fireworks-canvas');
const sceneNav     = $('scene-nav');
const musicBtn     = $('music-toggle');
const themeBtn     = $('theme-toggle');

// =====================================================================
//  1. SCENE MANAGEMENT
// =====================================================================
function showScene(name, skipAnim) {
  if (!scenes[name]) return;
  const prev = scenes[currentScene];
  const next = scenes[name];
  currentScene = name;

  // Update nav dots
  document.querySelectorAll('.scene-dot').forEach(function (d) {
    d.classList.toggle('active', d.dataset.scene === name);
  });

  if (prev && prev !== next) {
    prev.style.transition = skipAnim ? 'none' : 'opacity 0.8s ease, transform 0.8s ease';
    prev.style.opacity = '0';
    prev.style.pointerEvents = 'none';
    prev.style.transform = 'scale(0.97)';
  }

  setTimeout(function () {
    next.style.transition = skipAnim ? 'none' : 'opacity 0.8s ease, transform 0.8s ease';
    next.style.opacity = '1';
    next.style.pointerEvents = 'auto';
    next.style.transform = 'scale(1)';
  }, skipAnim ? 0 : 300);
}

// Nav dot clicks
document.querySelectorAll('.scene-dot').forEach(function (dot) {
  dot.addEventListener('click', function () {
    showScene(dot.dataset.scene);
  });
});

// Reveal post-yes navigation dots
function revealPostYesDots() {
  sceneNav.classList.add('visible');
  document.querySelectorAll('.scene-dot').forEach(function (d) {
    d.style.display = '';
  });
}

// =====================================================================
//  2. CINEMATIC INTRO
// =====================================================================
(function runIntro() {
  // After 3.5s, fade out intro and show the question
  setTimeout(function () {
    scenes.intro.classList.add('fade-out');
    setTimeout(function () {
      scenes.intro.style.display = 'none';
      showScene('question');
      typewriter(subtitleEl, 'I promise to make every day special ✨', 55);
    }, 1200);
  }, 3500);
})();

// =====================================================================
//  3. STARFIELD BACKGROUND
// =====================================================================
(function initStars() {
  const ctx = starsCanvas.getContext('2d');
  let stars = [];
  const COUNT = 140;

  function resize() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < COUNT; i++) {
    stars.push({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height,
      r: 0.3 + Math.random() * 1.8,
      alpha: 0.15 + Math.random() * 0.65,
      speed: 0.002 + Math.random() * 0.008,
      phase: Math.random() * Math.PI * 2,
    });
  }

  function draw(t) {
    ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    for (const s of stars) {
      const tw = 0.35 + 0.65 * Math.sin(t * s.speed + s.phase);
      const a = s.alpha * tw * (isDark ? 1 : 0.25);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,220,240,${a})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,180,210,${a * 0.12})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// =====================================================================
//  4. MOUSE / TOUCH HEART TRAIL
// =====================================================================
(function initTrail() {
  const ctx = trailCanvas.getContext('2d');
  let particles = [];
  let mouse = { x: -200, y: -200 };
  let last = 0;

  function resize() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('touchmove', function (e) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }, { passive: true });

  const emojis = ['💖', '✨', '💕', '💗', '✨'];

  function draw(t) {
    ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    if (t - last > 55 && mouse.x > 0) {
      last = t;
      particles.push({
        x: mouse.x + (Math.random() - 0.5) * 12,
        y: mouse.y + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 1.8,
        vy: -1.2 - Math.random() * 2.2,
        life: 1,
        decay: 0.014 + Math.random() * 0.01,
        size: 10 + Math.random() * 12,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      });
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.018; p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life;
      ctx.font = p.size + 'px serif';
      ctx.fillText(p.emoji, p.x, p.y);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// =====================================================================
//  5. AMBIENT HEARTS & ORBS
// =====================================================================
function createAmbientHearts() {
  const c = $('ambient-hearts');
  const h = ['💕', '💗', '💖', '✨', '💘', '💝', '🌸'];
  for (let i = 0; i < 20; i++) {
    const s = document.createElement('span');
    s.className = 'ambient-heart';
    s.textContent = h[Math.floor(Math.random() * h.length)];
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDuration = (10 + Math.random() * 14) + 's';
    s.style.animationDelay = (Math.random() * 14) + 's';
    s.style.fontSize = (0.7 + Math.random() * 1.5) + 'rem';
    c.appendChild(s);
  }
}

function createOrbs() {
  const colors = ['rgba(255,75,122,0.5)', 'rgba(196,77,255,0.4)', 'rgba(255,154,158,0.45)', 'rgba(255,200,220,0.35)'];
  for (let i = 0; i < 10; i++) {
    const o = document.createElement('div');
    o.className = 'orb';
    const sz = 3 + Math.random() * 9;
    o.style.width = sz + 'px'; o.style.height = sz + 'px';
    o.style.background = colors[Math.floor(Math.random() * colors.length)];
    o.style.left = Math.random() * 100 + '%'; o.style.bottom = '-20px';
    o.style.animationDuration = (8 + Math.random() * 18) + 's';
    o.style.animationDelay = (Math.random() * 12) + 's';
    o.style.boxShadow = `0 0 ${sz * 3}px ${o.style.background}`;
    document.body.appendChild(o);
  }
}

// =====================================================================
//  6. SHOOTING STARS
// =====================================================================
function launchShootingStar() {
  const c = $('shooting-stars');
  const star = document.createElement('div');
  star.className = 'shooting-star';
  star.style.top = Math.random() * 50 + '%';
  star.style.left = Math.random() * 60 + '%';
  star.style.animationDuration = (0.6 + Math.random() * 0.8) + 's';
  c.appendChild(star);
  setTimeout(function () { star.remove(); }, 1800);
}

// Launch shooting stars randomly
setInterval(function () {
  if (Math.random() < 0.4) launchShootingStar();
}, 3000);

// =====================================================================
//  7. TYPEWRITER
// =====================================================================
function typewriter(el, text, speed) {
  let i = 0;
  el.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  el.appendChild(cursor);

  function type() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text.charAt(i)), cursor);
      i++;
      setTimeout(type, speed);
    } else {
      setTimeout(function () {
        cursor.style.animation = 'none';
        cursor.style.opacity = '0';
        cursor.style.transition = 'opacity 0.5s';
      }, 1500);
    }
  }
  type();
}

// =====================================================================
//  8. EFFECTS: Sparkle, Ripple, Confetti
// =====================================================================
function createSparkleBurst(cx, cy, count) {
  const colors = ['#ff4b7a', '#ff9a9e', '#ffd1dc', '#fff', '#c44dff', '#ffb6c1'];
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.background = colors[Math.floor(Math.random() * colors.length)];
    const a = Math.random() * Math.PI * 2;
    const d = 20 + Math.random() * 110;
    s.style.left = cx + 'px'; s.style.top = cy + 'px';
    s.style.setProperty('--sx', Math.cos(a) * d + 'px');
    s.style.setProperty('--sy', Math.sin(a) * d + 'px');
    const sz = 3 + Math.random() * 7;
    s.style.width = sz + 'px'; s.style.height = sz + 'px';
    document.body.appendChild(s);
    setTimeout(function () { s.remove(); }, 900);
  }
}

function createRipple(btn, e) {
  const r = document.createElement('span');
  r.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  r.style.width = r.style.height = size + 'px';
  r.style.left = (e.clientX - rect.left - size / 2) + 'px';
  r.style.top = (e.clientY - rect.top - size / 2) + 'px';
  btn.appendChild(r);
  setTimeout(function () { r.remove(); }, 600);
}

function createConfetti(count) {
  const colors = ['#ff4b7a', '#c44dff', '#ff9a9e', '#ffd1dc', '#ffb347', '#87ceeb', '#fff', '#ff6b9d'];
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = (10 + Math.random() * 80) + '%';
    c.style.top = '-10px';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    const sz = 5 + Math.random() * 8;
    c.style.width = sz + 'px'; c.style.height = sz + 'px';
    c.style.animationDuration = (2 + Math.random() * 3) + 's';
    c.style.animationDelay = (Math.random() * 2) + 's';
    document.body.appendChild(c);
    setTimeout(function () { c.remove(); }, 6000);
  }
}

// =====================================================================
//  9. FIREWORKS (canvas-based)
// =====================================================================
(function initFireworks() {
  const ctx = fwCanvas.getContext('2d');
  let particles = [];
  let rockets = [];
  let active = false;

  function resize() { fwCanvas.width = window.innerWidth; fwCanvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  function launch() {
    const x = fwCanvas.width * (0.2 + Math.random() * 0.6);
    rockets.push({
      x: x, y: fwCanvas.height,
      targetY: fwCanvas.height * (0.15 + Math.random() * 0.35),
      vy: -8 - Math.random() * 4,
      color: `hsl(${330 + Math.random() * 60}, 100%, 70%)`,
    });
  }

  function explode(x, y, color) {
    const count = 50 + Math.floor(Math.random() * 30);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 5;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.01 + Math.random() * 0.015,
        color: color,
        size: 2 + Math.random() * 2,
      });
    }
  }

  function draw() {
    if (!active) { requestAnimationFrame(draw); return; }
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
    ctx.globalCompositeOperation = 'lighter';

    // Update rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.y += r.vy;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = r.color;
      ctx.fill();
      if (r.y <= r.targetY) {
        explode(r.x, r.y, r.color);
        rockets.splice(i, 1);
      }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  // Expose
  window.startFireworks = function () {
    active = true;
    let count = 0;
    const iv = setInterval(function () {
      launch(); launch();
      count++;
      if (count > 12) clearInterval(iv);
    }, 500);
    // Turn off after a while
    setTimeout(function () { active = false; }, 10000);
  };
})();

// =====================================================================
//  10. NO BUTTON DODGE
// =====================================================================
// =====================================================================
//  10. NO BUTTON DODGE
// =====================================================================
const noTexts = [
  '😢 No',
  '🥺 Are you sure?',
  '😭 Really?',
  '💔 Think again',
  '😔 Last chance?'
];

function escapeNoButton() {
  if (escapeCount >= 5) {
    btnNo.style.display = 'none';
    return;
  }

  escapeCount++;
  if (!btnNo.classList.contains('escaped')) btnNo.classList.add('escaped');

  const w = btnNo.offsetWidth, h = btnNo.offsetHeight, pad = 24;
  const maxX = window.innerWidth - w - pad, maxY = window.innerHeight - h - pad;
  const nx = pad + Math.random() * maxX, ny = pad + Math.random() * maxY;
  btnNo.style.left = nx + 'px'; btnNo.style.top = ny + 'px';

  // Set the text after escaping
  btnNo.textContent = noTexts[escapeCount - 1];

  const noScale = Math.max(0.5, 1 - escapeCount * 0.04);
  const noOp = Math.max(0.35, 1 - escapeCount * 0.05);
  btnNo.style.transform = 'scale(' + noScale + ')';
  btnNo.style.opacity = noOp;

  yesScale += 0.07;
  btnYes.style.transform = 'scale(' + yesScale + ')';

  dodgeCounter.classList.add('visible');
  dodgeCounter.innerHTML = 'Dodged: <strong>' + escapeCount + '</strong> times';

  createSparkleBurst(nx + w / 2, ny + h / 2, 6);
}

btnNo.addEventListener('mouseenter', escapeNoButton);
btnNo.addEventListener('touchstart', function (e) { e.preventDefault(); escapeNoButton(); }, { passive: false });
btnNo.addEventListener('click', function (e) { e.preventDefault(); escapeNoButton(); });

// =====================================================================
//  11. YES — TRIGGER CELEBRATION + UNLOCK ALL SCENES
// =====================================================================
btnYes.addEventListener('click', function (e) {
  createRipple(btnYes, e);
  yesTimestamp = Date.now();

  setTimeout(function () {
    btnNo.style.display = 'none';
    showScene('success');
    revealPostYesDots();

    // Celebration!
    startHeartRain();
    createConfetti(30);
    createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 25);

    setTimeout(function () { createConfetti(20); }, 1200);
    setTimeout(function () { createConfetti(15); }, 2500);

    // Start countdown
    startCountdown();
  }, 200);
});

// =====================================================================
//  12. HEART RAIN
// =====================================================================
function startHeartRain() {
  const emojis = ['❤️', '💖', '💗', '💕', '💘', '💝', '🥰', '😍', '🎉', '✨', '🌹', '🌸'];
  let spawned = 0;

  function spawnHeart() {
    if (spawned >= 80) return;
    spawned++;
    const h = document.createElement('span');
    h.className = 'rain-heart';
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = Math.random() * 100 + '%';
    h.style.fontSize = (1.2 + Math.random() * 2.4) + 'rem';
    const dur = 2.5 + Math.random() * 3.5;
    h.style.animationDuration = dur + 's';
    heartRain.appendChild(h);
    setTimeout(function () { h.remove(); }, dur * 1000);
    setTimeout(spawnHeart, 50 + Math.random() * 100);
  }
  spawnHeart();

  setInterval(function () {
    const h = document.createElement('span');
    h.className = 'rain-heart';
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = Math.random() * 100 + '%';
    h.style.fontSize = (1 + Math.random() * 1.6) + 'rem';
    const dur = 3 + Math.random() * 4;
    h.style.animationDuration = dur + 's';
    heartRain.appendChild(h);
    setTimeout(function () { h.remove(); }, dur * 1000);
  }, 500);
}

// =====================================================================
//  13. SCENE NAVIGATION BUTTONS
// =====================================================================
$('go-letter').addEventListener('click', function () { showScene('love-letter'); });
$('go-gallery').addEventListener('click', function () { showScene('gallery'); });
$('go-countdown').addEventListener('click', function () { showScene('countdown'); });
$('go-response').addEventListener('click', function () { showScene('response'); });

// =====================================================================
//  14. LOVE LETTER — Staggered paragraph reveal
// =====================================================================
(function () {
  const obs = new MutationObserver(function () {
    const paras = document.querySelectorAll('.letter-body p');
    paras.forEach(function (p, i) {
      p.style.opacity = '0';
      p.style.transform = 'translateY(16px)';
      p.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      p.style.transitionDelay = (1.5 + i * 0.18) + 's'; // Delay until typewriter finishes
      setTimeout(function () {
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
      }, 100);
    });
    
    // Typewriter effect for "My Dearest ❤️"
    setTimeout(function() {
      typewriter($('typewriter-header'), 'My Dearest ❤️', 100);
    }, 400);

    obs.disconnect();
  });

  // Observe when love-letter scene becomes visible
  const target = $('love-letter-scene');
  obs.observe(target, { attributes: true, attributeFilter: ['style'] });
})();

// =====================================================================
//  15. PHOTO GALLERY — Carousel
// =====================================================================
(function initCarousel() {
  const container = $('carousel-container');
  const memories = [
    { caption: 'Our first smile 😊', color: '#ff6b9d' },
    { caption: 'That magical evening 🌅', color: '#c44dff' },
    { caption: 'Adventures together 🗺️', color: '#ff9a9e' },
    { caption: 'Stargazing nights ✨', color: '#6c5ce7' },
    { caption: 'Our favorite place 🏖️', color: '#fd79a8' },
  ];

  memories.forEach(function (m, i) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    // Placeholder image
    const hue1 = 330 + i * 15;
    const hue2 = hue1 + 40;
    slide.innerHTML =
      '<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:4rem; background: linear-gradient(135deg, hsl(' +
      hue1 + ', 80%, 60%), hsl(' + hue2 + ', 70%, 45%));">' +
      ['📸', '🌅', '🗺️', '✨', '🏖️'][i] +
      '</div>' +
      '<div class="caption">' + m.caption + '</div>';
    container.appendChild(slide);
  });

  let currentIndex = 0;
  
  function updateCarousel() {
    container.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
  }

  $('carousel-prev').addEventListener('click', function() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  $('carousel-next').addEventListener('click', function() {
    if (currentIndex < memories.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });
})();

// =====================================================================
//  16. COUNTDOWN TIMER (time since "Yes")
// =====================================================================
function startCountdown() {
  function update() {
    if (!yesTimestamp) return;
    const elapsed = Date.now() - yesTimestamp;
    const secs = Math.floor(elapsed / 1000);
    const mins = Math.floor(secs / 60);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    $('cd-days').textContent = String(days).padStart(2, '0');
    $('cd-hours').textContent = String(hrs % 24).padStart(2, '0');
    $('cd-mins').textContent = String(mins % 60).padStart(2, '0');
    $('cd-secs').textContent = String(secs % 60).padStart(2, '0');
  }
  setInterval(update, 1000);
  update();
}

// =====================================================================
//  17. RESPONSE INPUT
// =====================================================================
$('response-submit').addEventListener('click', async function () {
  const msg = $('response-input').value.trim();
  if (!msg) {
    $('response-input').style.borderColor = '#ff4b7a';
    $('response-input').setAttribute('placeholder', 'Don\'t be shy... type something! 💖');
    return;
  }

  // To receive the messages, go to https://web3forms.com, get a free access key, and paste it below:
  const WEB3FORMS_ACCESS_KEY = '252004f1-d2fd-4fd1-963e-3f7b9db58041'; // <-- PASTE YOUR KEY HERE

  const submitBtn = $('response-submit');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending... 💌';
  submitBtn.disabled = true;

  if (WEB3FORMS_ACCESS_KEY !== 'YOUR_ACCESS_KEY_HERE') {
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'New Love Letter Response! ❤️',
          message: msg
        })
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }

  $('response-form-view').style.display = 'none';
  $('response-thanks').style.display = 'block';
  $('response-message-display').textContent = '"' + msg + '"';

  createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 30);
  createConfetti(30);
});

// Final surprise logic
$('btn-surprise').addEventListener('click', function() {
  $('hidden-surprise').classList.add('show');
  this.style.display = 'none';
  createSparkleBurst(window.innerWidth / 2, window.innerHeight - 50, 20);
});

// =====================================================================
// =====================================================================
//  18. BACKGROUND MUSIC
// =====================================================================
let musicPlaying = false;
let audioCtx = null;
let loopTimeoutId = null;
let isLooping = false;
let loopCount = 0;
const maxLoops = 200;

const notes = [
  { freq: 523.25, dur: 0.5 }, // C5
  { freq: 659.25, dur: 0.5 }, // E5
  { freq: 783.99, dur: 0.75 }, // G5
  { freq: 698.46, dur: 0.5 }, // F5
  { freq: 659.25, dur: 0.5 }, // E5
  { freq: 523.25, dur: 0.75 }, // C5
  { freq: 587.33, dur: 0.5 }, // D5
  { freq: 523.25, dur: 0.5 }, // C5
  { freq: 440.00, dur: 0.75 }, // A4
  { freq: 523.25, dur: 0.5 }, // C5
  { freq: 587.33, dur: 0.5 }, // D5
  { freq: 659.25, dur: 1.0 },  // E5
];

const totalDur = notes.reduce(function (s, n) { return s + n.dur; }, 0);

function playMelody() {
  if (!musicPlaying || loopCount >= maxLoops || !audioCtx) {
    isLooping = false;
    return;
  }
  isLooping = true;
  loopCount++;

  let time = audioCtx.currentTime + 0.1;

  notes.forEach(function (note) {
    // Main oscillator
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = note.freq;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.08, time + 0.05);
    gain.gain.linearRampToValueAtTime(0.06, time + note.dur * 0.6);
    gain.gain.linearRampToValueAtTime(0, time + note.dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + note.dur);

    // Soft harmony (fifth above, very quiet)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = note.freq * 1.498;
    gain2.gain.setValueAtTime(0, time);
    gain2.gain.linearRampToValueAtTime(0.02, time + 0.05);
    gain2.gain.linearRampToValueAtTime(0, time + note.dur);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(time);
    osc2.stop(time + note.dur);

    time += note.dur;
  });

  loopTimeoutId = setTimeout(playMelody, totalDur * 1000 + 500);
}

function startMusic() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  if (!isLooping) {
    playMelody();
  }
}

function stopMusic() {
  if (audioCtx && audioCtx.state === 'running') {
    audioCtx.suspend();
  }
  if (loopTimeoutId) {
    clearTimeout(loopTimeoutId);
    loopTimeoutId = null;
  }
  isLooping = false;
}

musicBtn.addEventListener('click', function () {
  musicPlaying = !musicPlaying;
  musicBtn.classList.toggle('playing', musicPlaying);
  musicBtn.textContent = musicPlaying ? '🎶' : '🎵';

  if (musicPlaying) {
    startMusic();
  } else {
    stopMusic();
  }
});

// =====================================================================
//  19. THEME TOGGLE
// =====================================================================
themeBtn.addEventListener('click', function () {
  isDark = !isDark;
  document.body.classList.toggle('light-theme', !isDark);
  themeBtn.textContent = isDark ? '🌙' : '☀️';
});

// =====================================================================
//  20. INIT
// =====================================================================
createAmbientHearts();
createOrbs();
