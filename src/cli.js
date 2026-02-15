#!/usr/bin/env bun
// Aither CLI - Main entry point

const [, , command, ...args] = process.argv;

const commands = {
  start: './server.js',
  repl: './repl/client.js',
  send: './repl/send.js',
};

function showHelp() {
  console.log(`
Aither - Live Coding Audio Synthesis Engine

Usage:
  aither start              Start the audio server
  aither repl               Open interactive REPL client
  aither send <code>        Send code to running server
  aither help               Show this help

Examples:
  aither start              # Start the server
  aither repl               # Connect and live code
  aither send "play('test', s => Math.sin(s.t * 440 * Math.PI * 2))"
`);
}

if (!command || command === 'help' || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

if (!commands[command]) {
  console.error(`Unknown command: ${command}`);
  console.error(`Run 'aether help' for usage.`);
  process.exit(1);
}

// Rewrite process.argv so the subcommand sees correct arguments
// Original: ['bun', '/path/to/cli.js', 'send', 'snippet.js']
// Rewrite to: ['bun', '/path/to/send-repl.js', 'snippet.js']
const subcommandPath = new URL(commands[command], import.meta.url).pathname;
process.argv = [process.argv[0], subcommandPath, ...args];

// Dynamic import and run the command
const modulePath = new URL(commands[command], import.meta.url);
import(modulePath.href);
