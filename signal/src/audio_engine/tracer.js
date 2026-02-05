// src/audio_engine/tracer.js
// ============================================================================
// Recipe Tracer - Converts a recipe function into an AST.
// ============================================================================

const { t } = require('./symbolic.js');

function trace(recipe) {
  if (typeof recipe !== 'function') {
    throw new Error('Recipe must be a function.');
  }
  return recipe(t);
}

module.exports = { trace };