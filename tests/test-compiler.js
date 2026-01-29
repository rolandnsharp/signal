// tests/test-compiler.js
// ============================================================================
// Test for the AST Compiler
//
// This test verifies that we can compile an AST into a stateful, high-performance
// update function.
//
// To run: bun tests/test-compiler.js
// ============================================================================

import { trace } from '../src/audio_engine/tracer.js';
import { compile } from '../src/audio_engine/compiler.js';
import { t, mul, sin } from '../src/audio_engine/symbolic.js';
import assert from 'assert';

// Mock the global sample rate for testing purposes
globalThis.SAMPLE_RATE = 44100;

console.log('Running Compiler Test...');

// 1. Define and trace the recipe
const recipe = t => sin(mul(t, 1)); // Use 1Hz for easy-to-read output
const ast = trace(recipe);

try {
  // 2. Compile the AST
  const statefulUpdate = compile(ast);

  // 3. Verify the output
  assert.strictEqual(typeof statefulUpdate, 'function', 'Compiler did not return a function.');

  console.log('✅ Compiler returned a function.');

  // 4. Run the stateful function and check its output
  // It should produce a sine wave, proving it's a stateful oscillator.
  console.log('Testing oscillator output for 5 samples:');
  const samples = [];
  for (let i = 0; i < 5; i++) {
    // Note: we pass a dummy `t` value, which the stateful function should ignore.
    const sample = statefulUpdate(i); 
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
