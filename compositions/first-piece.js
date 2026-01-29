// compositions/first-piece.js
// ============================================================================
// A simple, JIT-compilable sine wave to test the new Phase 2 engine.
// ============================================================================

const kanon = require('../src/index');
const { mtof } = require('../src/melody');

// Import the symbolic functions from the main kanon object
const { t, sin, mul } = kanon;

// Define a pure f(t) recipe using the symbolic library.
// This is the pattern our V1 compiler knows how to optimize.
const simpleTone = t => sin(mul(t, 440));

// Register the recipe. The engine will now attempt to JIT-compile it.
kanon('simple-tone', simpleTone);

// For comparison, let's also register a non-compilable recipe.
// This uses raw Math.sin, so it will fall back to f(t) mode.
const nonCompilableTone = t => Math.sin(t * 220 * 2 * Math.PI) * 0.5;
kanon('fallback-tone', nonCompilableTone);


console.log("Registered 'simple-tone' (should be JIT-compiled) and 'fallback-tone' (should run in f(t) mode).");
console.log("You should hear a mix of two sine waves.");
console.log("Check the console logs to confirm which mode each is running in.");
