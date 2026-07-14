import {
  parcelsHomeController,
  parcelsCaseController,
  parcelsBlogController,
  parcelsHowController,
  parcelsStrategyController,
  parcelsCareersController
} from './controller.js'

/**
 * Variant 3B — Parcels. Irregular field-parcel grid with a scroll-drawn footpath.
 */
export const parcels = {
  plugin: {
    name: 'parcels',
    register(server) {
      server.route([
        { method: 'GET', path: '/parcels', ...parcelsHomeController },
        {
          method: 'GET',
          path: '/parcels/air-quality',
          ...parcelsCaseController
        },
        { method: 'GET', path: '/parcels/blog', ...parcelsBlogController },
        {
          method: 'GET',
          path: '/parcels/how-we-work',
          ...parcelsHowController
        },
        {
          method: 'GET',
          path: '/parcels/strategy',
          ...parcelsStrategyController
        },
        {
          method: 'GET',
          path: '/parcels/careers',
          ...parcelsCareersController
        }
      ])
    }
  }
}
