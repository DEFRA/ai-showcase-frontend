import {
  caseStudies,
  principles,
  posts,
  outcomes,
  caseFacts,
  strategy,
  lifecycle,
  roles,
  hiringStages,
  hiringBar
} from '#/server/common/showcase/data.js'

export const parcelsHomeController = {
  handler(_request, h) {
    return h.view('parcels/home', {
      pageTitle: 'Our plan for AI, 2026 to 2028',
      caseStudies,
      principles,
      posts,
      strategy
    })
  }
}

export const parcelsCaseController = {
  handler(_request, h) {
    return h.view('parcels/case', {
      pageTitle: 'Forecasting air quality, street by street',
      outcomes,
      caseFacts
    })
  }
}

export const parcelsBlogController = {
  handler(_request, h) {
    return h.view('parcels/blog', {
      pageTitle: 'From the team',
      posts
    })
  }
}

export const parcelsHowController = {
  handler(_request, h) {
    return h.view('parcels/how-we-work', {
      pageTitle: 'How we work',
      principles,
      lifecycle
    })
  }
}

export const parcelsStrategyController = {
  handler(_request, h) {
    return h.view('parcels/strategy', {
      pageTitle: 'Our plan for AI, 2026 to 2028',
      strategy
    })
  }
}

export const parcelsCareersController = {
  handler(_request, h) {
    return h.view('parcels/careers', {
      pageTitle: "Careers with Defra's AI teams",
      roles,
      hiringStages,
      hiringBar
    })
  }
}
