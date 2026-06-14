import { useEffect, useRef } from 'react';

const fragmentShader = `
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

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Shader error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl');
    if (!canvas || !gl) return;

    const vertexShader = compileShader(
      gl,
      gl.VERTEX_SHADER,
      'attribute vec4 aPos; void main() { gl_Position = aPos; }',
    );
    const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertexShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'aPos');
    const uRes = gl.getUniformLocation(program, 'iResolution');
    const uTime = gl.getUniformLocation(program, 'iTime');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    let frame = 0;
    const start = performance.now();

    const draw = () => {
      const time = (performance.now() - start) / 1000;
      gl.clearColor(0.031, 0.031, 0.031, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aPos);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      frame = requestAnimationFrame(draw);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
      } else {
        draw();
      }
    };

    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragShader);
    };
  }, []);

  return <canvas ref={canvasRef} id="waveCanvas" aria-hidden="true" />;
}
