/**
 * Home page = the "AI at Defra" design-review chooser.
 * Lists the three bespoke showcase variants with links. This page deliberately
 * keeps the GOV.UK page layout (it is the review index, not part of the
 * aesthetic test); the variants themselves use their own standalone layouts.
 */
export const homeController = {
  handler(_request, h) {
    return h.view('home/index', {
      pageTitle: 'Design review',
      heading: 'AI at Defra'
    })
  }
}
