// lel/helpers.js - Universal Signal Processors

/**
 * ============================================================================
 * The "Implicitly Persistent" State Model for Helpers
 * ============================================================================
 *
 * GOAL:
 * To allow for a beautifully terse and expressive live-coding experience,
 * while ensuring that stateful helpers are fully composable, persistent
 * across hot-reloads, and safe to use with a REPL.
 *
 *   // The desired user experience (terse and expressive):
 *   register('my-signal', tremolo(lowpass(tremolo(osc, 0.5))));
 *
 *
 * THE CHALLENGE:
 * How does each stateful helper in a composition chain get its own, unique,
 * and *persistent* state slot in the `s.state` Float64Array without forcing
 * the user to manually pass indices?
 *
 *
 * THE SOLUTION: A Persistent, Name-Based Key
 *
 * 1. A global, persistent map (`slotMap`) stores the state slot index for
 *    every stateful helper instance. This map lives on `globalThis` to
 *    survive hot-reloads.
 *
 * 2. Each helper instance needs a unique, *stable* key to look up its
 *    slot in the map. This key must be the same on every hot-reload.
 *
 * 3. We create this key by combining the top-level signal's `name` (which
 *    the engine provides in `s.name`) with a per-signal `helperCounter`.
 *
 * 4. The `helperCounter` is a simple integer that is incremented every time
 *    a stateful helper is declared within a single `register` call. This
 *    gives each helper a stable index within its composition chain (0, 1, 2...).
 *
 * 5. This counter MUST be reset before each top-level `register` call to
 *    ensure the indices are stable. This is the purpose of `resetHelperCounter()`.
 *
 *
 * THE RESULT:
 *
 *   - `tremolo(lowpass(osc))` becomes...
 *   - key: "my-signal_lowpass_0" -> gets slot 1
 *   - key: "my-signal_tremolo_1" -> gets slot 2
 *
 * On the next hot-reload, the keys are identical, so the helpers retrieve
 * the same state slots, preserving their state perfectly. This model is
 * also REPL-safe, as a new signal registered via the REPL will have its
 * own unique `name` and thus its own non-conflicting set of keys.
 *
 * The `resetHelperCounter()` is a piece of temporary boilerplate that would
 * ideally be hidden by a higher-level API or REPL in the future.
 */

// This object holds the persistent state for the helpers themselves.
// It survives hot-reloads because it's attached to the global object.
globalThis.LEL_HELPER_STATE ??= {
    nextSlot: 0,
    slotMap: new Map()
};

// This is the per-signal-chain counter. It is NOT persistent.
let helperCounter = 0;

/**
 * Resets the per-signal helper counter. This MUST be called immediately
 * before every `register()` call in `live-session.js` to ensure stable
 * keys for stateful helpers.
 */
export function resetHelperCounter() {
    helperCounter = 0;
}

// ============================================================================
// FUNCTIONAL COMPOSITION
// ============================================================================

/**
 * Pipes a value through a sequence of functions, from left to right.
 * e.g., pipe(x, f, g, h) is equivalent to h(g(f(x))).
 * This is used to transform a deeply nested signal chain into a clean,
 * linear sequence.
 * @param {any} x The initial value (e.g., the base signal function).
 * @param  {...Function} fns The functions to apply in sequence.
 * @returns {any} The final result after all functions have been applied.
 */
export const pipe = (x, ...fns) => fns.reduce((v, f) => f(v), x);


// ============================================================================
// STATEFUL HELPERS
// ============================================================================

/**
 * Tremolo (Amplitude LFO). A stateful helper.
 * This helper implicitly claims a persistent state slot.
 */
export const tremolo = (signal, rate, depth = 0.5) => {
    // 1. Claim a stable index within the current registration chain.
    const helperIndex = helperCounter++;

    // 2. Return the real-time audio function.
    return s => {
        // 3. Create the unique, persistent key for this helper instance.
        const helperKey = `${s.name}_tremolo_${helperIndex}`;

        // 4. On first run, allocate a new slot from the global pool.
        //    On subsequent runs, this retrieves the already-allocated slot.
        if (!globalThis.LEL_HELPER_STATE.slotMap.has(helperKey)) {
            globalThis.LEL_HELPER_STATE.slotMap.set(helperKey, globalThis.LEL_HELPER_STATE.nextSlot++);
        }
        const phaseSlot = globalThis.LEL_HELPER_STATE.slotMap.get(helperKey);

        // 5. Perform the DSP using the persistent state slot.
        s.state[phaseSlot] = (s.state[phaseSlot] + rate / s.sr) % 1.0;
        const lfo = (Math.sin(s.state[phaseSlot] * 2 * Math.PI) + 1) * 0.5;

        return signal(s) * (1 - depth + lfo * depth);
    };
};

/**
 * One-pole Lowpass Filter. A stateful helper.
 * This helper implicitly claims a persistent state slot.
 */
export const lowpass = (signal, cutoff) => {
    const helperIndex = helperCounter++;
    const cutoffFn = typeof cutoff === 'function' ? cutoff : () => cutoff;

    return s => {
        const helperKey = `${s.name}_lowpass_${helperIndex}`;
        if (!globalThis.LEL_HELPER_STATE.slotMap.has(helperKey)) {
            globalThis.LEL_HELPER_STATE.slotMap.set(helperKey, globalThis.LEL_HELPER_STATE.nextSlot++);
        }
        const z1Slot = globalThis.LEL_HELPER_STATE.slotMap.get(helperKey);

        const alpha = cutoffFn(s) / s.sr;
        const input = signal(s);
        s.state[z1Slot] = s.state[z1Slot] + alpha * (input - s.state[z1Slot]);
        return s.state[z1Slot];
    };
};

// ============================================================================
// STATELESS HELPERS
// ============================================================================
// These are simple and do not require the complex state machinery.

export const gain = (signal, amount) => {
  const gainFn = typeof amount === 'function' ? amount : () => amount;
  return s => signal(s) * gainFn(s);
};

export const pan = (signal, position) => {
  const posFn = typeof position === 'function' ? position : () => position;
  return s => {
    const value = signal(s);
    const pos = Math.max(-1, Math.min(1, posFn(s))); 
    const angle = (pos * Math.PI) / 4; 
    return [
      value * Math.cos(angle + Math.PI / 4),
      value * Math.sin(angle + Math.PI / 4)
    ];
  };
};
