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
    cx = lerp(cx, lx, 0.08);
    cy = lerp(cy, ly, 0.08);
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
// 10. WEBGL SHADER WAVEFORM — gold plasma lines
// ══════════════════════════════════════════════
(function () {
  if (prefersReduced) return;

  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl');
  if (!gl) return;

  const vsSource = `
    attribute vec4 aPos;
    void main() { gl_Position = aPos; }
  `;

  // Gold plasma lines on site-matched dark background
  // #080808 = vec3(0.031, 0.031, 0.031)
  // gold    = vec3(0.784, 0.627, 0.333)  (#c8a055)
  const fsSource = `
    precision highp float;
    uniform vec2  iResolution;
    uniform float iTime;

    const float SPEED    = 0.15;
    const float AMP      = 0.55;
    const float FREQ     = 0.20;
    const float WRP_SPD  = 0.03;
    const float WRP_FREQ = 0.50;
    const float WRP_AMP  = 0.70;
    const float OFF_FREQ = 0.50;
    const float OFF_SPD  = 0.20;
    const float MIN_SPR  = 0.60;
    const float MAX_SPR  = 1.80;
    const float MIN_W    = 0.006;
    const float MAX_W    = 0.09;
    const float SM       = 0.015;
    const vec3  GOLD     = vec3(0.784, 0.627, 0.333);
    const vec3  BG       = vec3(0.031, 0.031, 0.031);

    float rng(float t) {
      return (cos(t) + cos(t*1.3+1.3) + cos(t*1.4+1.4)) / 3.0;
    }
    float sLine(float p, float hw, float t) {
      return smoothstep(hw, 0.0, abs(p - t));
    }
    float cLine(float p, float hw, float t) {
      return smoothstep(hw + SM, hw, abs(p - t));
    }
    float dot2(vec2 c, float r, vec2 p) {
      return smoothstep(r + SM, r, length(p - c));
    }
    float py(float x, float hf, float off) {
      return rng(x * FREQ + iTime * SPEED) * hf * AMP + off;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / iResolution.xy;
      vec2 sp = (gl_FragCoord.xy - iResolution.xy*0.5) / iResolution.x * 10.0;

      float hf = 1.0 - (cos(uv.x * 6.2832)*0.5 + 0.5);
      float vf = 1.0 - (cos(uv.y * 6.2832)*0.5 + 0.5);

      sp.y += rng(sp.x*WRP_FREQ + iTime*WRP_SPD)       * WRP_AMP*(0.5+hf);
      sp.x += rng(sp.y*WRP_FREQ + iTime*WRP_SPD + 2.0) * WRP_AMP*hf;

      vec3 lines = vec3(0.0);

      for (int l = 0; l < 6; l++) {
        float fi  = float(l);
        float op  = fi + sp.x*OFF_FREQ;
        float r   = rng(op + iTime*OFF_SPD)*0.5 + 0.5;
        float hw  = mix(MIN_W, MAX_W, r*hf)*0.5;
        float off = rng(op + iTime*OFF_SPD*(1.0+fi/6.0)) * mix(MIN_SPR,MAX_SPR,hf);

        float ly  = py(sp.x, hf, off);
        float ln  = sLine(ly,hw,sp.y)*0.6 + cLine(ly,hw*0.15,sp.y);

        float cx  = mod(fi + iTime*SPEED, 20.0) - 10.0;
        float dk  = dot2(vec2(cx, py(cx,hf,off)), 0.015, sp)*3.0;

        lines += (ln + dk) * GOLD * r;
      }

      vec3 col = BG*vf + lines*hf*vf;
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `;

  function makeShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('Shader error:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const vs = makeShader(gl.VERTEX_SHADER,   vsSource);
  const fs = makeShader(gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog,  'aPos');
  const uRes = gl.getUniformLocation(prog, 'iResolution');
  const uT   = gl.getUniformLocation(prog, 'iTime');

  // Use window dimensions — reliable even for absolute-positioned canvas
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  let raf;
  const t0 = performance.now();

  function draw() {
    const t = (performance.now() - t0) / 1000;
    gl.clearColor(0.031, 0.031, 0.031, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(prog);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uT, t);

    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
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
