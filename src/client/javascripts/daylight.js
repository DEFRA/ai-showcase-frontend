/* global IntersectionObserver, requestAnimationFrame, performance */
/*
 * Variant 3C — Daylight.
 * Generative "plates": a deterministic artwork per case-study title. Four
 * distinct plate types (rings, flow, grid, wave) chosen per canvas via
 * data-plate, so no two sections animate the same way. Canvases are decorative
 * (aria-hidden); with JS off they stay empty and the layout is unaffected.
 */
const doc = document.documentElement
doc.classList.remove('no-js')
doc.classList.add('js-enabled')

const INK = 'rgba(10,22,20,0.5)'
const GREEN = '#17694A'

// Deterministic hash of the seed string (xmur3).
function hash(str) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

// Seeded PRNG (mulberry32).
function rng(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Shared canvas setup. Returns null if the canvas has no measured width yet.
function setup(canvas) {
  const seedStr = canvas.getAttribute('data-seed') || 'defra'
  const DPR = Math.min(window.devicePixelRatio || 1, 2)
  const size = canvas.getBoundingClientRect().width
  if (!size) return null
  if (canvas.width !== size * DPR) {
    canvas.width = size * DPR
    canvas.height = size * DPR
  }
  const ctx = canvas.getContext('2d')
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
  ctx.clearRect(0, 0, size, size)
  return { ctx, size, rnd: rng(hash(seedStr)) }
}

// 1. Rings: concentric contour lines. Growth, land, peat.
function drawRings(canvas, progress) {
  const s = setup(canvas)
  if (!s) return
  const { ctx, size, rnd } = s
  const cx = size / 2
  const cy = size / 2
  const rings = 14 + Math.floor(rnd() * 6)
  const maxR = size * 0.46
  const comps = [
    {
      f: 2 + Math.floor(rnd() * 2),
      a: 0.05 + rnd() * 0.05,
      p: rnd() * Math.PI * 2
    },
    {
      f: 5 + Math.floor(rnd() * 3),
      a: 0.02 + rnd() * 0.03,
      p: rnd() * Math.PI * 2
    },
    {
      f: 9 + Math.floor(rnd() * 5),
      a: 0.008 + rnd() * 0.014,
      p: rnd() * Math.PI * 2
    }
  ]
  const accentEvery = 4 + Math.floor(rnd() * 3)
  const shown = Math.max(1, Math.ceil(rings * progress))
  for (let k = 1; k <= shown; k++) {
    const baseR = (k / rings) * maxR
    const isAccent = k % accentEvery === 0
    ctx.beginPath()
    for (let i = 0; i <= 120; i++) {
      const th = (i / 120) * Math.PI * 2
      let r = baseR
      for (const c of comps) {
        r += Math.sin(th * c.f + c.p + k * 0.35) * c.a * baseR
      }
      const x = cx + Math.cos(th) * r
      const y = cy + Math.sin(th) * r
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = isAccent ? GREEN : INK
    ctx.lineWidth = isAccent ? 1.6 : 1
    ctx.stroke()
  }
}

// 2. Flow: streamlines through a seeded vector field. Air, wind, water.
function drawFlow(canvas, progress) {
  const s = setup(canvas)
  if (!s) return
  const { ctx, size, rnd } = s
  const N = 28 + Math.floor(rnd() * 12)
  const shown = Math.max(1, Math.ceil(N * progress))
  const fa = 0.7 + rnd() * 1.6
  const fb = 0.7 + rnd() * 1.6
  const ph = rnd() * Math.PI * 2
  const seeds = []
  const seedRnd = rng(
    hash((canvas.getAttribute('data-seed') || 'defra') + 'flow')
  )
  for (let n = 0; n < N; n++) seeds.push([seedRnd(), seedRnd()])
  for (let n = 0; n < shown; n++) {
    let x = seeds[n][0] * size
    let y = seeds[n][1] * size
    ctx.beginPath()
    ctx.moveTo(x, y)
    for (let i = 0; i < 26; i++) {
      const a =
        (Math.sin((x / size) * 3 * fa + ph) +
          Math.cos((y / size) * 3 * fb + ph)) *
        Math.PI
      x += Math.cos(a) * size * 0.022
      y += Math.sin(a) * size * 0.022
      ctx.lineTo(x, y)
    }
    ctx.strokeStyle = n % 5 === 0 ? GREEN : INK
    ctx.lineWidth = n % 5 === 0 ? 1.5 : 1
    ctx.stroke()
  }
}

// 3. Grid: a sensor network, nodes linked to nearest neighbour. Monitoring.
function drawGrid(canvas, progress) {
  const s = setup(canvas)
  if (!s) return
  const { ctx, size, rnd } = s
  const N = 16 + Math.floor(rnd() * 10)
  const pts = []
  for (let i = 0; i < N; i++) {
    pts.push([size * (0.1 + rnd() * 0.8), size * (0.1 + rnd() * 0.8)])
  }
  const shown = Math.max(1, Math.ceil(N * progress))
  ctx.strokeStyle = INK
  ctx.lineWidth = 1
  for (let i = 0; i < shown; i++) {
    let best = -1
    let bd = Infinity
    for (let j = 0; j < N; j++) {
      if (j === i) continue
      const d = (pts[i][0] - pts[j][0]) ** 2 + (pts[i][1] - pts[j][1]) ** 2
      if (d < bd) {
        bd = d
        best = j
      }
    }
    if (best >= 0) {
      ctx.beginPath()
      ctx.moveTo(pts[i][0], pts[i][1])
      ctx.lineTo(pts[best][0], pts[best][1])
      ctx.stroke()
    }
  }
  for (let i = 0; i < shown; i++) {
    const accent = i % 4 === 0
    ctx.beginPath()
    ctx.arc(pts[i][0], pts[i][1], accent ? 3.4 : 2, 0, Math.PI * 2)
    ctx.fillStyle = accent ? GREEN : INK
    ctx.fill()
  }
}

// 4. Wave: stacked ridgeline signals. Forecasts, readings over time.
function drawWave(canvas, progress) {
  const s = setup(canvas)
  if (!s) return
  const { ctx, size, rnd } = s
  const lines = 12 + Math.floor(rnd() * 6)
  const shown = Math.max(1, Math.ceil(lines * progress))
  const amp = size * 0.05 * (0.6 + rnd())
  const f1 = 1 + rnd() * 2
  const f2 = 3 + rnd() * 3
  const ph = rnd() * Math.PI * 2
  for (let L = 0; L < shown; L++) {
    const baseY = size * (0.12 + 0.76 * (L / (lines - 1)))
    ctx.beginPath()
    for (let i = 0; i <= 80; i++) {
      const x = size * (i / 80)
      const t = (i / 80) * Math.PI * 2
      const y =
        baseY -
        Math.sin(t * f1 + ph + L * 0.4) * amp -
        Math.sin(t * f2 + ph) * amp * 0.4
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.strokeStyle = L % 4 === 0 ? GREEN : INK
    ctx.lineWidth = L % 4 === 0 ? 1.5 : 1
    ctx.stroke()
  }
}

// 5. Strata: horizontal sediment layers of varying thickness, one green seam.
// Land, geology, ground truth. Reads as Defra terrain, not an abstract signal.
function drawStrata(canvas, progress) {
  const s = setup(canvas)
  if (!s) return
  const { ctx, size, rnd } = s
  const layers = 9 + Math.floor(rnd() * 4)
  const amp = size * 0.028 * (0.5 + rnd())
  const f = 1 + rnd() * 1.4
  const ph = rnd() * Math.PI * 2
  const accent = 2 + Math.floor(rnd() * (layers - 3))
  const weights = []
  for (let i = 0; i <= layers; i++) {
    weights.push(0.5 + rnd())
  }
  const total = weights.reduce((a, b) => a + b, 0)
  let acc = 0
  const ys = weights.map((w) => {
    acc += w
    return size * 0.08 + size * 0.84 * (acc / total)
  })
  const seg = 60
  const edge = (yBase, layerIndex, forward) => {
    for (let k = 0; k <= seg; k++) {
      const i = forward ? k : seg - k
      const x = size * (i / seg)
      const y =
        yBase +
        Math.sin((i / seg) * Math.PI * 2 * f + ph + layerIndex * 0.5) * amp
      if (forward && k === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
  }
  const shown = Math.max(1, Math.ceil(layers * progress))
  for (let L = 0; L < shown; L++) {
    const yTop = L === 0 ? size * 0.08 : ys[L - 1]
    const yBot = ys[L]
    ctx.beginPath()
    edge(yTop, L, true)
    edge(yBot, L + 1, false)
    ctx.closePath()
    if (L === accent) {
      ctx.fillStyle = 'rgba(23,105,74,0.16)'
      ctx.fill()
      ctx.strokeStyle = GREEN
      ctx.lineWidth = 1.5
    } else {
      ctx.strokeStyle = INK
      ctx.lineWidth = 1
    }
    ctx.stroke()
  }
}

const DRAW = {
  rings: drawRings,
  flow: drawFlow,
  grid: drawGrid,
  wave: drawWave,
  strata: drawStrata
}

function drawPlate(canvas, progress) {
  const type = canvas.getAttribute('data-plate') || 'rings'
  ;(DRAW[type] || drawRings)(canvas, progress)
}

const getPlates = () =>
  Array.from(document.querySelectorAll('canvas[data-seed]'))
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let io

function animatePlates() {
  const plates = getPlates()
  if (io) io.disconnect()
  if (!plates.length) return
  if (reduced || !('IntersectionObserver' in window)) {
    plates.forEach((p) => drawPlate(p, 1))
    return
  }
  const drawn = new WeakSet()
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting || drawn.has(e.target)) continue
        drawn.add(e.target)
        const el = e.target
        const t0 = performance.now()
        const ease = (x) => 1 - Math.pow(1 - x, 3)
        const step = (t) => {
          const p = Math.min(1, (t - t0) / 1400)
          drawPlate(el, ease(p))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    },
    { threshold: 0.25 }
  )
  plates.forEach((p) => io.observe(p))
}

let resizeTimer
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(
    () => getPlates().forEach((p) => drawPlate(p, 1)),
    150
  )
})

animatePlates()

// fade-up entrance fallback (content visible by default).
const faders = Array.from(document.querySelectorAll('.day-fade'))
if (faders.length) {
  if (reduced || !('IntersectionObserver' in window)) {
    faders.forEach((el) => el.classList.add('in-view'))
  } else {
    const fio = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in-view')
            obs.unobserve(e.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    faders.forEach((el) => fio.observe(el))
  }
}
