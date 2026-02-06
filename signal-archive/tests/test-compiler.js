// tests/test-compiler.js
// ============================================================================
// Test for the AST Compiler
//
// This test verifies that we can compile an AST into a stateful, high-performance
// update function, now adapted for the new compiler API.
// ============================================================================

const { trace } = require('../src/audio_engine/tracer.js');
const { compile } = require('../src/audio_engine/compiler.js');
const { t, mul, sin } = require('../src/audio_engine/symbolic.js');
const assert = require('assert');

// Mock global state and sample rate for testing purposes
globalThis.SAMPLE_RATE = 44100;
globalThis.dt = 1 / globalThis.SAMPLE_RATE;

// Initialize a global state array (Float64Array) for the player states
const MAX_PLAYERS = 1; // We only need one player for this test
const SLOTS_PER_PLAYER = 16; // As per proposal
globalThis.STATE_ARRAY = new Float64Array(new SharedArrayBuffer(MAX_PLAYERS * SLOTS_PER_PLAYER * Float64Array.BYTES_PER_ELEMENT));

console.log('Running Compiler Test...');

// 1. Define and trace a simple sine oscillator recipe
const frequency = 1; // 1Hz for easy verification
const recipe = t => sin(mul(t, frequency));
const ast = trace(recipe);

// Define a base index for this player in the global state array
const baseStateIndex = 0; 

try {
  // 2. Compile the AST
  const statefulUpdate = compile(ast, baseStateIndex);

  // 3. Verify the output
  assert.strictEqual(typeof statefulUpdate, 'function', 'Compiler did not return a function.');
  console.log('✅ Compiler returned a function.');

  // 4. Run the stateful function and check its output
  // The stateful function now expects (globalState, baseIdx, dt)
  console.log('Testing oscillator output for 5 samples (1Hz):');
  const samples = [];
  for (let i = 0; i < 5; i++) {
    // We pass globalThis.STATE_ARRAY, baseStateIndex, and globalThis.dt
    const sample = statefulUpdate(globalThis.STATE_ARRAY, baseStateIndex, globalThis.dt); 
    samples.push(sample);
    console.log(`  Sample ${i}: ${sample.toFixed(4)}`);
  }

  // Check if the wave is behaving like a sine wave (starts at 0, goes up)
  assert.strictEqual(samples[0].toFixed(4), '0.0000', 'First sample should be 0.');
  assert(samples[1] > samples[0], 'Second sample should be greater than the first.');
  assert(samples[2] > samples[1], 'Third sample should be greater than the second.');

  console.log('✅ Oscillator output looks correct.');
  console.log('✅ Compiler test passed!');

} catch (error) {
  console.error('❌ Compiler test failed!');
  console.error(error.message);
  process.exit(1);
}
