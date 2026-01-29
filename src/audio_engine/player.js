// src/audio_engine/player.js
// ============================================================================
// Player Class - Wraps a recipe and manages its playback state.
// It can handle both pure f(t) recipes and compiled, stateful update functions.
// ============================================================================

class Player {
  /**
   * @param {function} updateFn - The function to be called for each sample. Can be stateful (f()) or stateless (f(t)).
   * @param {boolean} isStateful - A flag indicating the type of update function.
   * @param {function} originalRecipe - The original f(t) recipe, stored for memoization purposes.
   */
  constructor(updateFn, isStateful = false, originalRecipe = null) {
    if (typeof updateFn !== 'function') {
      throw new Error('Player update function must be a function.');
    }
    this.updateFn = updateFn;
    this.isStateful = isStateful;
    this.recipe = originalRecipe || updateFn; // Store original recipe for inspection/memoization

    this.crossfadeVolume = 1.0;
    this.fadeStartTime = -1;
    this.targetVolume = 1.0;
  }

  /**
   * Called by the Conductor for each sample.
   * @param {number} t - The current time from the global CHRONOS clock.
   * @returns {number|Array} A single sample value or a stereo pair.
   */
  update(t) {
    // Call the update function with or without the time argument based on whether it's stateful.
    const output = this.isStateful ? this.updateFn() : this.updateFn(t);

    if (typeof output === 'number') {
      return output * this.crossfadeVolume;
    } else if (Array.isArray(output)) {
      // Assuming stereo, apply volume to both channels
      return [output[0] * this.crossfadeVolume, output[1] * this.crossfadeVolume];
    }
    return 0; // Default to silence
  }

  setCrossfadeVolume(volume) {
    this.crossfadeVolume = Math.max(0, Math.min(1, volume));
  }
}

module.exports = { Player };
