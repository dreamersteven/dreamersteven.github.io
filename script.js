'use strict';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ══════════════════════════════════════════════
// 1. SCROLL PROGRESS BAR
// ══════════════════════════════════════════════
const progressBar = document.getElementById('scroll-progress');

function updateProgress() {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${scrolled / total})`;
}

window.addEventListener('scroll', updateProgress, { passive: true });

// ══════════════════════════════════════════════
// 2. NAVBAR — scroll state + active section
// ══════════════════════════════════════════════
const navbar  = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id], div[id]');

function updateNav() {
  navbar.classList.toggle('scrolled', window.scrollY > 16);

  // Active section indicator
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });

  navLinks.forEach(a => {
    const matches = a.getAttribute('href') === `#${current}`;
    a.classList.toggle('active', matches);
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ══════════════════════════════════════════════
// 3. MOBILE NAV
// ══════════════════════════════════════════════
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

navToggle.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ══════════════════════════════════════════════
// 4. THREE-TRACK RESUME SWITCHER
// ══════════════════════════════════════════════
const trackData = {
  hw: { label: 'Hardware Resume', file: 'Hanlong Liu_resume_2026_hardware.pdf' },
  sw: { label: 'Software Resume', file: 'Hanlong Liu_resume_2026_software.pdf' },
  pm: { label: 'Product Resume',  file: 'Hanlong Liu_resume_2026_Product Manager.pdf' },
};

const resumeBtn   = document.getElementById('resumeBtn');
const resumeLabel = document.getElementById('resumeLabel');
const trackBtns   = document.querySelectorAll('.track-btn');
const trackDescs  = document.querySelectorAll('.track-desc');

trackBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const track = btn.dataset.track;

    trackBtns.forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', String(b === btn));
    });

    trackDescs.forEach(d => {
      d.classList.toggle('active', d.dataset.track === track);
    });

    const data = trackData[track];
    resumeBtn.href            = data.file;
    resumeBtn.download        = data.file;
    resumeLabel.textContent   = data.label;
  });
});

// ══════════════════════════════════════════════
// 5. SCROLL REVEAL
// ══════════════════════════════════════════════
const revealEls = document.querySelectorAll('.reveal');

if (prefersReduced) {
  revealEls.forEach(el => el.classList.add('visible'));
} else {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  revealEls.forEach(el => revealObs.observe(el));
}

// ══════════════════════════════════════════════
// 6. STAT COUNT-UP
// ══════════════════════════════════════════════
const statEls = document.querySelectorAll('.stat-val');

const statTargets = {
  '4.0': { value: 4.0, decimals: 1 },
  '2':   { value: 2,   decimals: 0 },
  '4':   { value: 4,   decimals: 0 },
};

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateStat(el) {
  const key  = el.textContent.trim();
  const cfg  = statTargets[key];
  if (!cfg || prefersReduced) return;

  const duration = 1100;
  const start    = performance.now();

  el.classList.add('counting');

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = easeOutCubic(progress);
    const val      = eased * cfg.value;
    el.textContent = cfg.decimals ? val.toFixed(cfg.decimals) : Math.round(val).toString();
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = cfg.decimals ? cfg.value.toFixed(cfg.decimals) : cfg.value.toString();
      el.classList.remove('counting');
    }
  }
  requestAnimationFrame(tick);
}

const statObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStat(entry.target);
      statObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statEls.forEach(el => statObs.observe(el));

// ══════════════════════════════════════════════
// 7. CURSOR AMBIENT LIGHT
//    Soft gold glow follows cursor globally
// ══════════════════════════════════════════════
if (!prefersReduced) {
  const cursorLight = document.getElementById('cursor-light');
  let lx = window.innerWidth  / 2;
  let ly = window.innerHeight / 2;
  let cx = lx, cy = ly;

  document.addEventListener('mousemove', e => {
    lx = e.clientX;
    ly = e.clientY;
  });

  // Lerp for smooth lag — feels organic, not instant
  function lerp(a, b, t) { return a + (b - a) * t; }

  (function animateLight() {
    cx = lerp(cx, lx, 0.072);
    cy = lerp(cy, ly, 0.072);
    cursorLight.style.left = cx + 'px';
    cursorLight.style.top  = cy + 'px';
    requestAnimationFrame(animateLight);
  })();

  // Fade out when cursor leaves window
  document.addEventListener('mouseleave', () => {
    cursorLight.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorLight.style.opacity = '1';
  });
}

// ══════════════════════════════════════════════
// 8. CARD SPOTLIGHT
//    Radial gold glow tracks cursor inside each card
// ══════════════════════════════════════════════
if (!prefersReduced) {
  const spotlightCards = document.querySelectorAll('.expertise-card, .project-card');

  spotlightCards.forEach(card => {
    // Inject spotlight div
    const spot = document.createElement('div');
    spot.className = 'card-spotlight';
    card.prepend(spot);

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spot.style.left = x + 'px';
      spot.style.top  = y + 'px';
    });
  });
}

// ══════════════════════════════════════════════
// 9. MAGNETIC BUTTON PULL
//    Buttons gently attract toward cursor
// ══════════════════════════════════════════════
if (!prefersReduced && window.innerWidth > 768) {
  const magnetBtns = document.querySelectorAll('.btn-primary, .btn-ghost');
  const STRENGTH   = 0.28;   // 0 = none, 1 = full follow
  const RADIUS     = 90;     // px — activation distance

  magnetBtns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect   = btn.getBoundingClientRect();
      const bx     = rect.left + rect.width  / 2;
      const by     = rect.top  + rect.height / 2;
      const dx     = e.clientX - bx;
      const dy     = e.clientY - by;
      const dist   = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        const pull = (1 - dist / RADIUS) * STRENGTH;
        btn.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ══════════════════════════════════════════════
// 10. SUBTLE WAVEFORM CANVAS
//     Two slow gold sine waves — whisper only
// ══════════════════════════════════════════════
(function () {
  if (prefersReduced) return;

  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, raf;
  let t = 0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

  const waves = [
    { freq: 0.006, amp: 0.05,  speed: 0.009,  phase: 0 },
    { freq: 0.010, amp: 0.032, speed: 0.0145,  phase: 2.6 },
  ];

  function drawWave(w) {
    ctx.beginPath();
    for (let x = 0; x <= W; x += 3) {
      const y = H * 0.5
        + Math.sin(x * w.freq + t * w.speed + w.phase) * H * w.amp
        + Math.sin(x * w.freq * 1.7 + t * w.speed * 0.5 + w.phase) * H * w.amp * 0.28;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    const g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0,    'rgba(200,160,85,0)');
    g.addColorStop(0.22, 'rgba(200,160,85,0.22)');
    g.addColorStop(0.5,  'rgba(200,160,85,0.34)');
    g.addColorStop(0.78, 'rgba(200,160,85,0.22)');
    g.addColorStop(1,    'rgba(200,160,85,0)');
    ctx.strokeStyle = g;
    ctx.lineWidth   = 1.1;
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    waves.forEach(drawWave);
    t += 0.011;
    raf = requestAnimationFrame(draw);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else draw();
  });

  draw();
})();
