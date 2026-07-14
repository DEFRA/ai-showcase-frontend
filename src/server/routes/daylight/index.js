import {
  daylightHomeController,
  daylightCaseController,
  daylightBlogController,
  daylightHowController,
  daylightStrategyController,
  daylightCareersController
} from './controller.js'

/**
 * Variant 3C — Daylight. Light editorial rows with generative growth-ring plates.
 */
export const daylight = {
  plugin: {
    name: 'daylight',
    register(server) {
      server.route([
        { method: 'GET', path: '/daylight', ...daylightHomeController },
        {
          method: 'GET',
          path: '/daylight/air-quality',
          ...daylightCaseController
        },
        { method: 'GET', path: '/daylight/blog', ...daylightBlogController },
        {
          method: 'GET',
          path: '/daylight/how-we-work',
          ...daylightHowController
        },
        {
          method: 'GET',
          path: '/daylight/strategy',
          ...daylightStrategyController
        },
        {
          method: 'GET',
          path: '/daylight/careers',
          ...daylightCareersController
        }
      ])
    }
  }
}
