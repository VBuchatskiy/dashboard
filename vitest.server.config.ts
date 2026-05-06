import { resolve } from 'node:path'
import { defineProject } from 'vitest/config'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const appDir = resolve(root, 'app')
const serverDir = resolve(root, 'server')

export default defineProject({
  root,
  resolve: {
    alias: {
      '~': serverDir,
      '@': appDir,
    }
  },
  test: {
    name: 'server',
    environment: 'node',
    globals: true,
    include: ['server/**/*.spec.ts']
  }
})
