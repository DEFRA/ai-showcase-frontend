import { defineConfig } from 'vite'
import { NodePackageImporter } from 'sass-embedded'

export default defineConfig({
  base: '/public',
  build: {
    outDir: '.public',
    manifest: true,
    rolldownOptions: {
      input: {
        htmlAssets: 'src/client/assets.html',
        application: 'src/client/javascripts/application.js',
        applicationCss: 'src/client/stylesheets/application.scss',
        // Bespoke "AI at Defra" showcase variants (isolated bundles, no GOV.UK chrome)
        showcaseFontsCss: 'src/client/stylesheets/showcase-fonts.scss',
        monumentCss: 'src/client/stylesheets/monument.scss',
        parcelsCss: 'src/client/stylesheets/parcels.scss',
        daylightCss: 'src/client/stylesheets/daylight.scss',
        monument: 'src/client/javascripts/monument.js',
        parcels: 'src/client/javascripts/parcels.js',
        daylight: 'src/client/javascripts/daylight.js'
      }
    },
    sourcemap: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        importers: [new NodePackageImporter(process.cwd())],
        loadPaths: [
          'node_modules',
          'src/client/stylesheets',
          'src/server',
          'src/server/common/components',
          'src/server/common/templates/partials'
        ],
        quietDeps: true,
        sourceMapIncludeSources: true,
        style: 'expanded'
      }
    },
    lightningcss: { errorRecovery: true }
  },
  // Dev server
  server: {}
})
