import { spawn } from 'node:child_process'

const processes = [
  spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1'], { stdio: 'inherit' }),
  spawn(process.execPath, ['server/index.js'], { stdio: 'inherit' }),
]

function shutdown() {
  for (const child of processes) child.kill('SIGTERM')
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
process.on('exit', shutdown)
