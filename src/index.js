#!/usr/bin/env bun
// index.js - Main Entry Point for Kanon Engine
// ============================================================================
// Run with: bun --hot index.js
// ============================================================================

import { start, stop, status } from './engine.js';
import { kanon, clear } from './kanon.js';
import { pipe, sin, saw, tri, square, lfo, gain, pan, stereo, mix, am, softClip, feedback } from './helpers.js';
import dgram from 'dgram';

const PORT = 41234;
const HOST = '127.0.0.1';

// ============================================================================
// Initialize
// ============================================================================
console.log('='.repeat(60));
console.log('KANON - Live Coding REPL Server');
console.log('='.repeat(60));
console.log('');

// Start the engine
start();

// Create a UDP socket to listen for code
const server = dgram.createSocket('udp4');

server.on('listening', () => {
  const address = server.address();
  console.log(`[REPL] Ready and listening on ${address.address}:${address.port}`);
  console.log('[REPL] Send code from another terminal with the `send.js` script.');
  console.log('');
});

server.on('message', (msg, rinfo) => {
  const code = msg.toString();
  console.log(`[REPL] Received ${msg.length} bytes. Evaluating...`);
  try {
    // Evaluate the received code in the current scope,
    // making `kanon()` and `clear()` available to it.
    eval(code);
    console.log('[REPL] Evaluation successful.');
  } catch (e) {
    console.error('[REPL] Evaluation error:', e.message);
  }
});

server.on('error', (err) => {
  console.error(`[REPL] Server error:\n${err.stack}`);
  server.close();
});

server.bind(PORT, HOST);

// Log status after 1 second
setTimeout(() => {
  // ... (status logging remains the same)
}, 1000);

// Keep process alive
setInterval(() => {
  // Heartbeat
}, 5000);
