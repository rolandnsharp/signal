// Phosphor CRT oscilloscope — Y-T and X-Y (Lissajous) modes.

let mode = 'yt'; // 'yt' | 'xy'
let ctx, canvas, analyserL, analyserR, bufferL, bufferR;
let animId = null;

function draw() {
  animId = requestAnimationFrame(draw);
  const w = canvas.width / devicePixelRatio;
  const h = canvas.height / devicePixelRatio;

  // Phosphor persistence fade — dark green, not black
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = 'rgba(0, 6, 0, 0.18)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  // Fetch data
  analyserL.getFloatTimeDomainData(bufferL);
  if (analyserR) analyserR.getFloatTimeDomainData(bufferR);

  const len = bufferL.length;

  // Build path
  ctx.beginPath();
  for (let i = 0; i < len; i++) {
    let x, y;
    if (mode === 'yt') {
      x = (i / len) * w;
      y = (1 - bufferL[i] * 1.5) * h / 2;
    } else {
      x = (1 + bufferL[i] * 1.5) * w / 2;
      y = (1 - bufferR[i] * 1.5) * h / 2;
    }
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  // Phosphor bloom — multiple passes, fat and fuzzy
  const passes = [
    { color: 'rgba(0, 80, 0, 0.04)',  width: 40, blur: 100 },
    { color: 'rgba(0, 120, 0, 0.06)', width: 24, blur: 60  },
    { color: 'rgba(0, 180, 0, 0.1)',  width: 14, blur: 35  },
    { color: 'rgba(0, 255, 0, 0.3)',  width: 6,  blur: 15  },
    { color: 'rgba(200,255,200,0.7)', width: 3,  blur: 4   },
    { color: '#ffffff',               width: 1,  blur: 0   },
  ];
  for (const p of passes) {
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.width;
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = p.blur;
    ctx.stroke();
  }

  // Graticule — dark lines drawn ON TOP of glow so they only
  // appear as cuts where the phosphor beam passes over them
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(0, 3, 0, 0.55)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let i = 1; i < 10; i++) {
    const x = (w / 10) * i;
    ctx.moveTo(x, 0); ctx.lineTo(x, h);
  }
  for (let i = 1; i < 8; i++) {
    const y = (h / 8) * i;
    ctx.moveTo(0, y); ctx.lineTo(w, y);
  }
  ctx.stroke();
  // Center cross slightly more visible
  ctx.strokeStyle = 'rgba(0, 3, 0, 0.7)';
  ctx.beginPath();
  ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
  ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
  ctx.stroke();
}

function resize(container) {
  const dpr = devicePixelRatio || 1;
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/**
 * @param {AnalyserNode} aL — left channel analyser
 * @param {AnalyserNode} aR — right channel analyser
 * @param {HTMLElement} container — #scope-canvas-wrap
 */
export function initScope(aL, aR, container) {
  analyserL = aL;
  analyserR = aR;
  bufferL = new Float32Array(aL.frequencyBinCount);
  bufferR = new Float32Array(aR.frequencyBinCount);

  canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  container.appendChild(canvas);
  ctx = canvas.getContext('2d');

  new ResizeObserver(() => resize(container)).observe(container);
  resize(container);

  // Mode toggle
  const btn = document.getElementById('scope-mode-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      mode = mode === 'yt' ? 'xy' : 'yt';
      btn.textContent = mode === 'yt' ? 'Y-T' : 'X-Y';
    });
  }

  // Start render loop
  if (!animId) draw();
}
