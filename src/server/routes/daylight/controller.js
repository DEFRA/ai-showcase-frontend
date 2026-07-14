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

export const daylightHomeController = {
  handler(_request, h) {
    return h.view('daylight/home', {
      pageTitle: 'AI at Defra',
      caseStudies,
      principles,
      posts,
      roles,
      strategy
    })
  }
}

export const daylightCaseController = {
  handler(_request, h) {
    return h.view('daylight/case', {
      pageTitle: 'Forecasting air quality, street by street',
      outcomes,
      caseFacts
    })
  }
}

export const daylightBlogController = {
  handler(_request, h) {
    return h.view('daylight/blog', {
      pageTitle: 'From the team',
      posts
    })
  }
}

export const daylightHowController = {
  handler(_request, h) {
    return h.view('daylight/how-we-work', {
      pageTitle: 'How we work',
      principles,
      lifecycle
    })
  }
}

export const daylightStrategyController = {
  handler(_request, h) {
    return h.view('daylight/strategy', {
      pageTitle: 'Our plan for AI, 2026 to 2028',
      strategy
    })
  }
}

export const daylightCareersController = {
  handler(_request, h) {
    return h.view('daylight/careers', {
      pageTitle: "Careers with Defra's AI teams",
      roles,
      hiringStages,
      hiringBar
    })
  }
}
