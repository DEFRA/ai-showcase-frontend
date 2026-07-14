/* global IntersectionObserver, requestAnimationFrame, performance */
/*
 * Variant 3A — Monument.
 * Generative "plates" per case study, drawn as engraved field-survey plates
 * (parcels, furrows, drill, canopy) in ink with green and harvest-amber
 * accents on the cream, a straight-line woodcut / Ordnance-Survey vocabulary
 * distinct from Daylight's smooth curves.
 * Chosen per canvas via data-plate. Canvases are decorative (aria-hidden);
 * with JS off they fall back to a plain bordered square and the layout holds.
 */
const doc = document.documentElement
doc.classList.remove('no-js')
doc.classList.add('js-enabled')

const INK = 'rgba(30, 42, 22, 0.5)'
const GREEN = '#17683a'
const AMBER = '#b5610f'

function hash(str) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

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

// Parcels: patchwork of field parcels, each hatched at its own angle. One
// parcel is green (the AI plot); one carries an amber marker.
function drawParcels(canvas, progress) {
  const s = setup(canvas)
  if (!s) return
  const { ctx, size, rnd } = s
  const m = size * 0.06
  const rects = [[m, m, size - m, size - m]]
  const target = 9 + Math.floor(rnd() * 4)
  while (rects.length < target) {
    let idx = 0
    let bestA = -1
    for (let i = 0; i < rects.length; i++) {
      const a = (rects[i][2] - rects[i][0]) * (rects[i][3] - rects[i][1])
      if (a > bestA) {
        bestA = a
        idx = i
      }
    }
    const [x0, y0, x1, y1] = rects[idx]
    const w = x1 - x0
    const h = y1 - y0
    const splitVert = w >= h ? rnd() < 0.78 : rnd() < 0.22
    const t = 0.38 + rnd() * 0.24
    rects.splice(idx, 1)
    if (splitVert) {
      const xm = x0 + w * t
      rects.push([x0, y0, xm, y1], [xm, y0, x1, y1])
    } else {
      const ym = y0 + h * t
      rects.push([x0, y0, x1, ym], [x0, ym, x1, y1])
    }
  }
  const angles = [
    0,
    Math.PI / 6,
    Math.PI / 4,
    Math.PI / 3,
    Math.PI / 2,
    -Math.PI / 6,
    -Math.PI / 4
  ]
  const pang = rects.map(() => angles[Math.floor(rnd() * angles.length)])
  const green = Math.floor(rnd() * rects.length)
  let amber = Math.floor(rnd() * rects.length)
  if (amber === green) amber = (amber + 1) % rects.length
  const gap = size * 0.024
  const shown = Math.max(1, Math.ceil(rects.length * progress))
  for (let i = 0; i < shown; i++) {
    const [x0, y0, x1, y1] = rects[i]
    const cx = (x0 + x1) / 2
    const cy = (y0 + y1) / 2
    const diag = Math.hypot(x1 - x0, y1 - y0)
    const ang = pang[i]
    const dx = Math.cos(ang)
    const dy = Math.sin(ang)
    const px = -dy
    const py = dx
    ctx.save()
    ctx.beginPath()
    ctx.rect(x0, y0, x1 - x0, y1 - y0)
    ctx.clip()
    ctx.strokeStyle = i === green ? GREEN : INK
    ctx.lineWidth = i === green ? 1.4 : 1
    const steps = Math.ceil(diag / gap)
    for (let k = -steps; k <= steps; k++) {
      const ox = cx + px * k * gap
      const oy = cy + py * k * gap
      ctx.beginPath()
      ctx.moveTo(ox - dx * diag, oy - dy * diag)
      ctx.lineTo(ox + dx * diag, oy + dy * diag)
      ctx.stroke()
    }
    ctx.restore()
    ctx.strokeStyle = INK
    ctx.lineWidth = 1.2
    ctx.strokeRect(x0, y0, x1 - x0, y1 - y0)
    if (i === amber) {
      ctx.beginPath()
      ctx.arc(cx, cy, size * 0.02, 0, Math.PI * 2)
      ctx.fillStyle = AMBER
      ctx.fill()
    }
  }
}

// Furrows: ploughed rows receding to a horizon in perspective. The amber row
// is the AI pass.
function drawFurrows(canvas, progress) {
  const s = setup(canvas)
  if (!s) return
  const { ctx, size, rnd } = s
  const rows = 14 + Math.floor(rnd() * 5)
  const gamma = 1.5 + rnd() * 0.5
  const yTop = size * 0.16
  const yBot = size * 0.94
  const maxInset = size * (0.16 + rnd() * 0.08)
  const sag = size * (0.01 + rnd() * 0.015)
  const wobble = size * 0.006
  const ph = rnd() * Math.PI * 2
  const accent = 3 + Math.floor(rnd() * (rows - 6))
  const shown = Math.max(1, Math.ceil(rows * progress))
  for (let r = 0; r < shown; r++) {
    const u = r / (rows - 1)
    const y = yTop + (yBot - yTop) * Math.pow(u, gamma)
    const inset = maxInset * (1 - u)
    const xL = inset
    const xR = size - inset
    ctx.beginPath()
    const seg = 40
    for (let i = 0; i <= seg; i++) {
      const xf = i / seg
      const x = xL + (xR - xL) * xf
      const bow = 4 * sag * xf * (1 - xf) * u
      const wob = Math.sin(xf * Math.PI * 3 + ph + r * 0.5) * wobble * u
      const yy = y + bow + wob
      if (i === 0) ctx.moveTo(x, yy)
      else ctx.lineTo(x, yy)
    }
    ctx.strokeStyle = r === accent ? AMBER : INK
    ctx.lineWidth = r === accent ? 2.4 : 1
    ctx.stroke()
  }
}

// Drill: seeds sown in aligned rows. One row is the amber AI pass; one seed is
// ringed green as the AI-chosen plant.
function drawDrill(canvas, progress) {
  const s = setup(canvas)
  if (!s) return
  const { ctx, size, rnd } = s
  const cols = 11 + Math.floor(rnd() * 5)
  const rows = 9 + Math.floor(rnd() * 4)
  const m = size * 0.1
  const gx = (size - 2 * m) / (cols - 1)
  const gy = (size - 2 * m) / (rows - 1)
  const jit = size * 0.006
  const jx = []
  const jy = []
  for (let k = 0; k < cols * rows; k++) {
    jx.push((rnd() - 0.5) * 2 * jit)
    jy.push((rnd() - 0.5) * 2 * jit)
  }
  const amberRow = 2 + Math.floor(rnd() * (rows - 4))
  const greenRow = 1 + Math.floor(rnd() * (rows - 2))
  const greenCol = Math.floor(rnd() * cols)
  const shownRows = Math.max(1, Math.ceil(rows * progress))
  for (let r = 0; r < shownRows; r++) {
    const y0 = m + gy * r
    ctx.strokeStyle = INK
    ctx.lineWidth = 0.6
    ctx.beginPath()
    ctx.moveTo(m, y0)
    ctx.lineTo(size - m, y0)
    ctx.stroke()
    const amberR = r === amberRow
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c
      const x = m + gx * c + jx[idx]
      const y = y0 + jy[idx]
      ctx.beginPath()
      ctx.arc(x, y, amberR ? 2.8 : 1.7, 0, Math.PI * 2)
      ctx.fillStyle = amberR ? AMBER : INK
      ctx.fill()
      if (r === greenRow && c === greenCol) {
        ctx.beginPath()
        ctx.arc(x, y, 4.6, 0, Math.PI * 2)
        ctx.strokeStyle = GREEN
        ctx.lineWidth = 1.6
        ctx.stroke()
      }
    }
  }
}

// Canopy: hachured relief. Contour bands carry short downslope ticks (OS
// hachure), with an amber core at the summit.
function drawCanopy(canvas, progress) {
  const s = setup(canvas)
  if (!s) return
  const { ctx, size, rnd } = s
  const cx = size * (0.42 + rnd() * 0.16)
  const cy = size * (0.42 + rnd() * 0.16)
  const loops = 7 + Math.floor(rnd() * 3)
  const maxR = size * 0.44
  const comps = [
    {
      f: 2 + Math.floor(rnd() * 2),
      a: 0.1 + rnd() * 0.06,
      p: rnd() * Math.PI * 2
    },
    {
      f: 3 + Math.floor(rnd() * 2),
      a: 0.05 + rnd() * 0.03,
      p: rnd() * Math.PI * 2
    }
  ]
  const S = 120
  const shown = Math.max(1, Math.ceil(loops * progress))
  for (let k = 1; k <= shown; k++) {
    const frac = k / loops
    const baseR = frac * maxR
    const pts = []
    for (let i = 0; i <= S; i++) {
      const th = (i / S) * Math.PI * 2
      let rr = baseR
      for (const c of comps) rr += Math.sin(th * c.f + c.p) * c.a * baseR
      pts.push([cx + Math.cos(th) * rr, cy + Math.sin(th) * rr, th])
    }
    ctx.strokeStyle = INK
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let i = 0; i < pts.length; i++) {
      if (i === 0) ctx.moveTo(pts[i][0], pts[i][1])
      else ctx.lineTo(pts[i][0], pts[i][1])
    }
    ctx.stroke()
    const tickLen = size * 0.018 * (0.5 + frac * 0.7)
    ctx.lineWidth = 0.8
    for (let i = 0; i < S; i += 6) {
      const x = pts[i][0]
      const y = pts[i][1]
      const th = pts[i][2]
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + Math.cos(th) * tickLen, y + Math.sin(th) * tickLen)
      ctx.stroke()
    }
  }
  ctx.beginPath()
  ctx.arc(cx, cy, size * 0.022, 0, Math.PI * 2)
  ctx.fillStyle = AMBER
  ctx.fill()
}

const DRAW = {
  parcels: drawParcels,
  furrows: drawFurrows,
  drill: drawDrill,
  canopy: drawCanopy
}

function drawPlate(canvas, progress) {
  const type = canvas.getAttribute('data-plate') || 'furrows'
  ;(DRAW[type] || drawFurrows)(canvas, progress)
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
const faders = Array.from(document.querySelectorAll('.mon-fade'))
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
