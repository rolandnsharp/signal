// src/audio_engine/symbolic.js
// ============================================================================
// The Sacred Ratio Library - Symbolic building blocks for recipes.
// ============================================================================

const t = { type: 'param', name: 't' };

function literal(value) {
  if (typeof value !== 'number') {
    throw new Error('literal() only accepts numbers.');
  }
  return { type: 'literal', value };
}

function add(...args) {
  const processedArgs = args.map(arg => typeof arg === 'number' ? literal(arg) : arg);
  return { type: 'op', op: 'add', args: processedArgs };
}

function mul(...args) {
  const processedArgs = args.map(arg => typeof arg === 'number' ? literal(arg) : arg);
  return { type: 'op', op: 'mul', args: processedArgs };
}

function sin(arg) {
  const processedArg = typeof arg === 'number' ? literal(arg) : arg;
  return { type: 'op', op: 'sin', args: [processedArg] };
}

function pow(base, exponent) {
  const processedBase = typeof base === 'number' ? literal(base) : base;
  const processedExponent = typeof exponent === 'number' ? literal(exponent) : base;
  return { type: 'op', op: 'pow', args: [processedBase, processedExponent] };
}

module.exports = { t, literal, add, mul, sin, pow };