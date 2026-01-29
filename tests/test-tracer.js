// tests/test-tracer.js
// ============================================================================
// Test for the Symbolic Tracer
//
// This test verifies that we can correctly convert a user's recipe, written
// with the symbolic library, into a structured Abstract Syntax Tree (AST).
//
// To run: bun tests/test-tracer.js
// ============================================================================

import { trace } from '../src/audio_engine/tracer.js';
import { t, mul, sin, add, literal } from '../src/audio_engine/symbolic.js';
import assert from 'assert';

console.log('Running Tracer Test...');

// 1. Define a recipe using the symbolic library
const myRecipe = t => sin(mul(t, 440));

// 2. Trace the recipe to get the AST
const ast = trace(myRecipe);

// 3. Define the expected AST structure
const expectedAST = {
  type: 'op',
  op: 'sin',
  args: [
    {
      type: 'op',
      op: 'mul',
      args: [
        { type: 'param', name: 't' },
        { type: 'literal', value: 440 }
      ]
    }
  ]
};

// 4. Compare the generated AST with the expected one
try {
  assert.deepStrictEqual(ast, expectedAST, 'AST did not match expected structure.');
  console.log('✅ Tracer test passed!');
  console.log('Generated AST:');
  console.log(JSON.stringify(ast, null, 2));
} catch (error) {
  console.error('❌ Tracer test failed!');
  console.error(error.message);
  console.log('Expected:');
  console.log(JSON.stringify(expectedAST, null, 2));
  console.log('Got:');
  console.log(JSON.stringify(ast, null, 2));
  process.exit(1);
}
