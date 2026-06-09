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
// HERO SCROLL SCALE — shrinks hero into a card
// ══════════════════════════════════════════════
const heroScale = document.getElementById('hero-scale');

function updateHeroScale() {
  const heroH = window.innerHeight;
  // progress 0→1 as user scrolls one full viewport height
  const p = Math.max(0, Math.min(window.scrollY / heroH, 1));

  const scale  = 1 - p * 0.09;           // shrinks to 91%
  const radius = p * 24;                  // 0px → 24px border-radius
  const opacity = 1 - p * 0.55;          // fades out

  heroScale.style.transform    = `scale(${scale})`;
  heroScale.style.borderRadius = `${radius}px`;
  heroScale.style.opacity      = opacity;
}

window.addEventListener('scroll', updateHeroScale, { passive: true });
updateHeroScale();

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

  function lerp(a, b, t) { return a + (b - a) * t; }

  (function animateLight() {
    cx = lerp(cx, lx, 0.18);
    cy = lerp(cy, ly, 0.18);
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
// 10. WEBGL SHADER WAVEFORM
//     Gold plasma lines — 6 lines, dark bg
// ══════════════════════════════════════════════
(function () {
  if (prefersReduced) return;

  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;

  // Try WebGL; fall back silently if unavailable
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
  if (!gl) return;

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // ── Vertex shader ──
  const vsSource = `
    attribute vec4 aPos;
    void main() { gl_Position = aPos; }
  `;

  // ── Fragment shader — gold lines, transparent background ──
  const fsSource = `
    precision highp float;
    uniform vec2  iResolution;
    uniform float iTime;

    const float SPEED      = 0.15;
    const float LINE_AMP   = 0.55;
    const float LINE_FREQ  = 0.20;
    const float WARP_SPD   = 0.03;
    const float WARP_FREQ  = 0.50;
    const float WARP_AMP   = 0.70;
    const float OFF_FREQ   = 0.50;
    const float OFF_SPD    = 0.20;
    const float MIN_SPREAD = 0.60;
    const float MAX_SPREAD = 1.80;
    const float MIN_W      = 0.006;
    const float MAX_W      = 0.09;
    const float SMOOTH     = 0.015;

    /* Gold: #c8a055 = rgb(200,160,85) */
    const vec3 GOLD = vec3(0.784, 0.627, 0.333);

    float rng(float t) {
      return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
    }

    float smoothLine(float pos, float hw, float t) {
      return smoothstep(hw, 0.0, abs(pos - t));
    }

    float crispLine(float pos, float hw, float t) {
      return smoothstep(hw + SMOOTH, hw, abs(pos - t));
    }

    float circle(vec2 center, float r, vec2 uv) {
      return smoothstep(r + SMOOTH, r, length(uv - center));
    }

    float plasmaY(float x, float hFade, float offset) {
      return rng(x * LINE_FREQ + iTime * SPEED) * hFade * LINE_AMP + offset;
    }

    void main() {
      vec2 uv    = gl_FragCoord.xy / iResolution.xy;
      float sc   = 5.0;
      vec2 space = (gl_FragCoord.xy - iResolution.xy * 0.5) / iResolution.x * 2.0 * sc;

      float hFade = 1.0 - (cos(uv.x * 6.2832) * 0.5 + 0.5);
      float vFade = 1.0 - (cos(uv.y * 6.2832) * 0.5 + 0.5);

      /* Space warp */
      space.y += rng(space.x * WARP_FREQ + iTime * WARP_SPD)       * WARP_AMP * (0.5 + hFade);
      space.x += rng(space.y * WARP_FREQ + iTime * WARP_SPD + 2.0) * WARP_AMP * hFade;

      vec4 lines = vec4(0.0);

      /* 6 gold lines */
      for (int l = 0; l < 6; l++) {
        float fi     = float(l);
        float offT   = iTime * OFF_SPD;
        float offPos = fi + space.x * OFF_FREQ;
        float rand   = rng(offPos + offT) * 0.5 + 0.5;
        float hw     = mix(MIN_W, MAX_W, rand * hFade) * 0.5;
        float offset = rng(offPos + offT * (1.0 + fi / 6.0)) * mix(MIN_SPREAD, MAX_SPREAD, hFade);

        float lineY  = plasmaY(space.x, hFade, offset);
        float line   = smoothLine(lineY, hw, space.y) * 0.55
                     + crispLine( lineY, hw * 0.15, space.y);

        float cx     = mod(fi + iTime * SPEED, 25.0) - 12.0;
        float dot    = circle(vec2(cx, plasmaY(cx, hFade, offset)), 0.008, space) * 2.5;

        lines += (line + dot) * vec4(GOLD, 1.0) * rand;
      }

      /* Transparent background — site dark color shows through */
      float alpha = clamp(lines.a * hFade * vFade, 0.0, 1.0);
      gl_FragColor = vec4(lines.rgb / max(lines.a, 0.001), alpha);
    }
  `;

  function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compileShader(gl.VERTEX_SHADER,   vsSource));
  gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  const aPos   = gl.getAttribLocation(prog,  'aPos');
  const uRes   = gl.getUniformLocation(prog, 'iResolution');
  const uTime  = gl.getUniformLocation(prog, 'iTime');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

  let raf;
  const t0 = performance.now();

  function draw() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(prog);
    gl.uniform2f(uRes,  canvas.width, canvas.height);
    gl.uniform1f(uTime, (performance.now() - t0) / 1000);

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPos);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(draw);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else draw();
  });

  draw();
})();
