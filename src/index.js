// src/index.js
// ============================================================================
// Kanon Core - Symbolic JIT Compiler, Registry, and Engine Orchestration
// ============================================================================

const { Conductor } = require('./audio_engine/engine.js');
const { Player } = require('./audio_engine/player.js');
const { createTransport } = require('./audio_engine/transport.js');
const { trace } = require('./audio_engine/tracer.js');
const { compile } = require('./audio_engine/compiler.js');
const { t } = require('./audio_engine/symbolic.js');

// --- Compiler Cache for memoization ---
const playerCache = new Map(); // Maps recipe.toString() -> Player instance
const idToRecipeString = new Map(); // Maps player ID -> recipe.toString()

// ============================================================================
// CORE KANON FUNCTION (The Symbolic JIT Compiler)
// ============================================================================
function kanon(id, recipe) {
  if (typeof id !== 'string' || id.length === 0) {
    throw new Error('Player ID must be a non-empty string.');
  }
  if (typeof recipe !== 'function') {
    throw new Error('Recipe must be a function f(t).');
  }

  // --- Memoization ---
  const recipeString = recipe.toString();
  let player = playerCache.get(recipeString);

  if (!player) {
    // This recipe is new. Attempt to trace and compile it.
    try {
      // Step 1: Trace the recipe using the symbolic library to get an AST.
      const ast = trace(recipe);

      // Step 2: Compile the AST into a stateful, high-performance update function.
      const statefulUpdate = compile(ast);

      // Step 3: Create a new Player in "stateful" mode.
      player = new Player(statefulUpdate, true, recipe);
      console.log(`[Compiler] Successfully JIT-compiled recipe ID: ${id}`);

    } catch (err) {
      // If tracing or compilation fails, fall back to the original f(t) recipe.
      console.warn(`[Compiler] Could not JIT-compile recipe ID: ${id}. Reason: ${err.message}. Falling back to f(t) mode.`);
      player = new Player(recipe, false, recipe);
    }

    // Cache the newly created player (either stateful or f(t)).
    playerCache.set(recipeString, player);
  } else {
    console.log(`[Compiler] Reusing player from cache for recipe ID: ${id}`);
  }

  idToRecipeString.set(id, recipeString);

  // Tell Conductor to use this player for this ID.
  Conductor.setPlayer(id, player);

  return player.recipe;
}

// ============================================================================
// Make symbolic library available to users
// ============================================================================
kanon.t = t;
kanon.sin = require('./audio_engine/symbolic.js').sin;
kanon.mul = require('./audio_engine/symbolic.js').mul;
kanon.add = require('./audio_engine/symbolic.js').add;
kanon.pow = require('./audio_engine/symbolic.js').pow;
kanon.literal = require('./audio_engine/symbolic.js').literal;

// ============================================================================
// REGISTRY & AUDIO CONTROL (Delegated to Conductor)
// ============================================================================

kanon.boot = function() {
  if (Conductor.status().running) return;
  const transportInstance = createTransport('PUSH', globalThis.SAMPLE_RATE);
  Conductor.start(transportInstance);
};

kanon.list = () => Array.from(Conductor.status().activePlayers.keys());
kanon.remove = (id) => {
  Conductor.removePlayer(id);
  idToRecipeString.delete(id);
};
kanon.clear = () => {
  Conductor.clearPlayers();
  playerCache.clear();
  idToRecipeString.clear();
};
kanon.stopAudio = () => {
  Conductor.stop();
  playerCache.clear();
  idToRecipeString.clear();
};

module.exports = kanon;
