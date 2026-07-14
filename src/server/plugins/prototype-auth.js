import { config } from '#/config/config.js'

/**
 * Design-review password gate.
 *
 * When PROTOTYPE_PASSWORD is set (a CDP environment secret), every request
 * except the CDP health check is challenged with HTTP Basic Auth: any username
 * plus the configured password passes. Leaving the secret unset disables the
 * gate entirely (local dev), so the password never lives in the repo.
 */
export const prototypeAuth = {
  plugin: {
    name: 'prototype-auth',
    register(server) {
      const password = config.get('prototypePassword')

      // No password configured means no gate (e.g. local development).
      if (!password) {
        return
      }

      server.ext('onRequest', (request, h) => {
        // CDP polls /health; gating it would mark the service unhealthy.
        if (request.path === '/health') {
          return h.continue
        }

        const header = request.headers.authorization ?? ''
        if (header.startsWith('Basic ')) {
          const decoded = Buffer.from(header.slice(6), 'base64').toString(
            'utf8'
          )
          const supplied = decoded.slice(decoded.indexOf(':') + 1)
          if (supplied === password) {
            return h.continue
          }
        }

        return h
          .response('Design review access only.')
          .code(401)
          .header(
            'WWW-Authenticate',
            'Basic realm="AI at Defra design review", charset="UTF-8"'
          )
          .takeover()
      })
    }
  }
}
