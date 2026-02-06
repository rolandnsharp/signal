#!/usr/bin/env bun
// Kanon CLI - Start the live sound surgery engine
import { spawn } from 'bun';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the project root directory
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Check if a session file was provided as an argument
const sessionFile = process.argv[2] || 'live-session.js';

// Run src/index.js with hot-reload, passing the session file as an env var
const proc = spawn(['bun', '--hot', 'src/index.js'], {
  cwd: projectRoot,
  stdio: ['inherit', 'inherit', 'inherit'],
  env: {
    ...process.env,
    KANON_SESSION: sessionFile,
  },
});

await proc.exited;
process.exit(proc.exitCode);
