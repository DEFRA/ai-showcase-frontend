/* global IntersectionObserver, requestAnimationFrame */
/*
 * Variant 3B — Parcels.
 * Progressive enhancement:
 *  - The dotted "public footpath" is drawn by page scroll (primary, JS-driven:
 *    strokeDashoffset via the CSSOM, which CSP style-src does not block). Works
 *    in every browser; no dependency on CSS scroll-timeline.
 *  - fade-up entrance fallback for browsers without animation-timeline: view().
 * Base HTML is complete with JS off: the footpath renders fully drawn (CSS
 * default stroke-dashoffset: 0), and nothing is hidden.
 */
const doc = document.documentElement
doc.classList.remove('no-js')
doc.classList.add('js-enabled')

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Footpath: map page-scroll progress to stroke-dashoffset (top: 1 -> bottom: 0).
// With the fine dotted dash pattern this reads as the path being walked as you
// scroll. Skipped entirely under reduced motion (stays fully drawn).
const footpath = document.querySelector('.par-footpath__line')
if (footpath && !reduced) {
  let ticking = false
  const draw = () => {
    ticking = false
    const el = document.documentElement
    const max = el.scrollHeight - el.clientHeight
    const scrolled = window.scrollY || el.scrollTop || 0
    const progress = max > 0 ? Math.min(1, Math.max(0, scrolled / max)) : 1
    footpath.style.strokeDashoffset = String(1 - progress)
  }
  const onScroll = () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(draw)
    }
  }
  draw()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
}

// fade-up entrance: IntersectionObserver fallback (content visible by default).
const faders = Array.from(document.querySelectorAll('.par-fade'))
if (faders.length) {
  if (reduced || !('IntersectionObserver' in window)) {
    faders.forEach((el) => el.classList.add('in-view'))
  } else {
    const io = new IntersectionObserver(
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
    faders.forEach((el) => io.observe(el))
  }
}
