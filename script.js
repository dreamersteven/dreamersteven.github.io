'use strict';

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 16);
}, { passive: true });

// ── Mobile nav ──
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

// ── Three-track resume switcher ──
const trackData = {
  hw: { label: 'Hardware Resume', file: 'resume-hw.pdf' },
  sw: { label: 'Software Resume', file: 'resume-sw.pdf' },
  pm: { label: 'Product Resume',  file: 'resume-pm.pdf' },
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
    resumeBtn.href       = data.file;
    resumeBtn.download   = data.file;
    resumeLabel.textContent = data.label;
  });
});

// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReduced) {
  revealEls.forEach(el => el.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

// ── Subtle waveform canvas ──
// Two slow sine waves — thematically relevant to audio work, visually quiet
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

  const resizeObs = new ResizeObserver(resize);
  resizeObs.observe(canvas);

  const waves = [
    { freq: 0.007, amp: 0.055, speed: 0.010, phase: 0 },
    { freq: 0.011, amp: 0.035, speed: 0.016, phase: 2.4 },
  ];

  function drawWave(w) {
    ctx.beginPath();
    for (let x = 0; x <= W; x += 3) {
      const y = H * 0.5
        + Math.sin(x * w.freq + t * w.speed + w.phase) * H * w.amp
        + Math.sin(x * w.freq * 1.6 + t * w.speed * 0.5 + w.phase) * H * w.amp * 0.3;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    const g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0,   'rgba(200,160,85,0)');
    g.addColorStop(0.25,'rgba(200,160,85,0.18)');
    g.addColorStop(0.5, 'rgba(200,160,85,0.28)');
    g.addColorStop(0.75,'rgba(200,160,85,0.18)');
    g.addColorStop(1,   'rgba(200,160,85,0)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    waves.forEach(drawWave);
    t += 0.012;
    raf = requestAnimationFrame(draw);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      draw();
    }
  });

  draw();
})();
