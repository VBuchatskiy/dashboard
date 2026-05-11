/**
 * Clean reinstall: removes node_modules and npm lockfile, then pnpm install (or npm install).
 * Mitigates "Cannot find native binding" / optional-deps issues (@parcel/watcher, esbuild, …).
 */
const { existsSync, rmSync, unlinkSync } = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const root = process.cwd()
const nm = path.join(root, 'node_modules')
const lock = path.join(root, 'package-lock.json')

if (existsSync(nm)) rmSync(nm, { recursive: true, force: true })
if (existsSync(lock)) unlinkSync(lock)

const pnpm = spawnSync('pnpm', ['install'], { stdio: 'inherit', cwd: root })
if (pnpm.status === 0) process.exit(0)

const npm = spawnSync('npm', ['install'], { stdio: 'inherit', cwd: root })
process.exit(npm.status ?? 1)
