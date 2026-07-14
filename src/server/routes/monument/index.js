import {
  monumentHomeController,
  monumentCaseController,
  monumentBlogController,
  monumentHowController,
  monumentStrategyController,
  monumentCareersController
} from './controller.js'

/**
 * Variant 3A — Monument. Dark, poster-scale typographic case-study index.
 */
export const monument = {
  plugin: {
    name: 'monument',
    register(server) {
      server.route([
        { method: 'GET', path: '/monument', ...monumentHomeController },
        {
          method: 'GET',
          path: '/monument/autonomous-tractors',
          ...monumentCaseController
        },
        { method: 'GET', path: '/monument/blog', ...monumentBlogController },
        {
          method: 'GET',
          path: '/monument/how-we-work',
          ...monumentHowController
        },
        {
          method: 'GET',
          path: '/monument/strategy',
          ...monumentStrategyController
        },
        {
          method: 'GET',
          path: '/monument/careers',
          ...monumentCareersController
        }
      ])
    }
  }
}
