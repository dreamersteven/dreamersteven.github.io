// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== Mobile menu =====
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ===== Audio Waveform Canvas =====
(function () {
  const canvas = document.getElementById('waveCanvas');
  const ctx = canvas.getContext('2d');

  let W, H, animId;
  let t = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Multiple layered waves with different params
  const waves = [
    { freq: 0.008, amp: 0.06, speed: 0.018, phase: 0,     color: [124, 106, 245] },
    { freq: 0.012, amp: 0.04, speed: 0.025, phase: 2.1,   color: [79,  163, 247] },
    { freq: 0.006, amp: 0.05, speed: 0.012, phase: 4.2,   color: [160, 100, 255] },
    { freq: 0.018, amp: 0.025,speed: 0.032, phase: 1.0,   color: [79,  163, 247] },
    { freq: 0.005, amp: 0.07, speed: 0.008, phase: 3.5,   color: [124, 106, 245] },
  ];

  // Vertical bar waveform across the bottom
  function drawBars(time) {
    const barCount = Math.floor(W / 6);
    const barW = 2;
    const gap = W / barCount;
    const baseY = H * 0.78;

    for (let i = 0; i < barCount; i++) {
      const x = i * gap;
      const val =
        Math.sin(i * 0.18 + time * 1.4) * 0.4 +
        Math.sin(i * 0.08 + time * 0.9) * 0.3 +
        Math.sin(i * 0.32 + time * 2.1) * 0.15 +
        Math.sin(i * 0.05 + time * 0.5) * 0.15;

      const barH = Math.abs(val) * H * 0.14 + 2;
      const alpha = 0.18 + Math.abs(val) * 0.22;
      const r = 100 + Math.floor(Math.abs(val) * 60);
      const g = 80 + Math.floor(Math.abs(val) * 40);
      const b = 240;

      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fillRect(x, baseY - barH, barW, barH * 2);
    }
  }

  function drawWave(wave, time) {
    const { freq, amp, speed, phase, color: [r, g, b] } = wave;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 2) {
      const y =
        H * 0.45 +
        Math.sin(x * freq + time * speed + phase) * H * amp +
        Math.sin(x * freq * 1.7 + time * speed * 0.6 + phase) * H * amp * 0.4;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }

    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0,   `rgba(${r},${g},${b},0)`);
    grad.addColorStop(0.2, `rgba(${r},${g},${b},0.35)`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b},0.55)`);
    grad.addColorStop(0.8, `rgba(${r},${g},${b},0.35)`);
    grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);

    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Floating particles
  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * 1000,
    y: Math.random() * 1000,
    r: Math.random() * 1.8 + 0.3,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.18,
    alpha: Math.random() * 0.4 + 0.05,
    color: Math.random() > 0.5 ? [124, 106, 245] : [79, 163, 247],
  }));

  function drawParticles() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      const [r, g, b] = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
      ctx.fill();
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Radial glow background
    const radGrad = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, H * 0.7);
    radGrad.addColorStop(0,   'rgba(124,106,245,0.06)');
    radGrad.addColorStop(0.5, 'rgba(79,163,247,0.03)');
    radGrad.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, W, H);

    waves.forEach(w => drawWave(w, t));
    drawBars(t);
    drawParticles();

    t += 0.016;
    animId = requestAnimationFrame(draw);
  }

  // Pause when tab hidden to save CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });

  draw();
})();
