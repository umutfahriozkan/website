import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import { execSync } from 'node:child_process'
import pkg from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  hmr: {
    overlay: true
  },
  define: {
    GIT_COMMIT_HASH: JSON.stringify(
      execSync('git rev-parse HEAD').toString().trim()
    ),
    PACKAGE_VERSION: JSON.stringify(pkg.version),
    BUILT_AT: JSON.stringify(Date.now()),
  }
})
