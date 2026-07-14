import {
  principles,
  posts,
  strategy,
  lifecycle,
  roles,
  hiringStages,
  hiringBar
} from '#/server/common/showcase/data.js'

export const monumentHomeController = {
  handler(_request, h) {
    return h.view('monument/home', {
      pageTitle: 'AI in the field',
      principles,
      posts,
      strategy
    })
  }
}

export const monumentCaseController = {
  handler(_request, h) {
    return h.view('monument/case', {
      pageTitle: 'Tractors that work the field on their own'
    })
  }
}

export const monumentBlogController = {
  handler(_request, h) {
    return h.view('monument/blog', {
      pageTitle: 'From the team',
      posts
    })
  }
}

export const monumentHowController = {
  handler(_request, h) {
    return h.view('monument/how-we-work', {
      pageTitle: 'How we work',
      principles,
      lifecycle
    })
  }
}

export const monumentStrategyController = {
  handler(_request, h) {
    return h.view('monument/strategy', {
      pageTitle: 'Our plan for AI, 2026 to 2028',
      strategy
    })
  }
}

export const monumentCareersController = {
  handler(_request, h) {
    return h.view('monument/careers', {
      pageTitle: "Careers with Defra's AI teams",
      roles,
      hiringStages,
      hiringBar
    })
  }
}
