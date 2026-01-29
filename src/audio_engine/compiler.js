// src/audio_engine/compiler.js
// ============================================================================
// The "Surgical" Player Generator (AST Compiler)
// ============================================================================

function compile(ast) {
  if (
    ast.type === 'op' &&
    ast.op === 'sin' &&
    ast.args[0]?.type === 'op' &&
    ast.args[0]?.op === 'mul' &&
    ast.args[0]?.args[0]?.type === 'param' &&
    ast.args[0]?.args[0]?.name === 't' &&
    ast.args[0]?.args[1]?.type === 'literal'
  ) {
    console.log('[Compiler] Sine oscillator pattern recognized.');

    const freq = ast.args[0].args[1].value;
    const delta = freq / globalThis.SAMPLE_RATE;
    let phase = 0;

    const statefulUpdate = () => { // Changed to f()
      const val = Math.sin(phase * 2 * Math.PI);
      phase = (phase + delta) % 1.0;
      return val;
    };

    console.log(`[Compiler] Compiled stateful oscillator at ${freq}Hz.`);
    return statefulUpdate;
  }

  throw new Error('Compiler Error: The provided AST does not match any known pattern. This version only supports `sin(mul(t, <frequency>))`.');
}

module.exports = { compile };