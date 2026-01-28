'use strict';

// ============================================================================
// FUNCTIONAL PROGRAMMING UTILITIES FOR KANON
// ============================================================================
//
// Pure functional tools for recursive and generative synthesis.
// Requires Bun with strict mode for proper tail call optimization.

// ============================================================================
// Y-COMBINATOR
// ============================================================================
//
// The Y-combinator enables anonymous recursion - functions that call themselves
// without being named. Essential for pure functional programming.
//
// Classic Y (doesn't work in strict evaluation):
//   Y = λf.(λx.f(x x))(λx.f(x x))
//
// Z-combinator (Y for strict evaluation with eta-expansion):
//   Z = λf.(λx.f(λv.x x v))(λx.f(λv.x x v))

const Y = f => (x => x(x))(x => f((...args) => x(x)(...args)));

// ============================================================================
// PIPE / COMPOSE
// ============================================================================

// Left-to-right function composition
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

// Right-to-left function composition
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

// ============================================================================
// CURRYING
// ============================================================================

// Curry a function (manual)
const curry = fn => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) {
      return fn(...args);
    }
    return (...more) => curried(...args, ...more);
  };
};

// ============================================================================
// KANON UTILITIES
// ============================================================================

// Higher-order function transformations (curried)
const gain = curry((amt, fn) => t => fn(t) * amt);
const offset = curry((amt, fn) => t => fn(t) + amt);
const mix = (...fns) => t => fns.reduce((sum, fn) => sum + fn(t), 0);

// ============================================================================
// COMPOSITION HELPERS (EXPERIMENTAL)
// ============================================================================
//
// NOTE: These helpers are candidates for a future, higher-level composition
// library (e.g., `kanon-compose`).
//
// A more advanced API would likely involve a "Clip" object that bundles a
// sound function with its duration (e.g., `{ play: t => ..., duration: 1.5 }`),
// allowing for more elegant and less error-prone composition.

// Plays a function `fn` only during the time interval [start, end).
// The time passed to `fn` is relative to the start of the interval.
const during = curry((start, end, fn) => t => {
  if (t >= start && t < end) {
    return fn(t - start);
  }
  return 0; // Silence outside the interval
});

// Plays a sequence of [sound, duration] pairs one after another.
const sequence = (...pairs) => t => {
  let accumulatedTime = 0;
  for (const [fn, duration] of pairs) {
    if (t >= accumulatedTime && t < accumulatedTime + duration) {
      return fn(t - accumulatedTime);
    }
    accumulatedTime += duration;
  }
  return 0; // Silence after the sequence ends
};

// Loops a sound function `count` times, with each loop having a `duration`.
const loop = curry((count, duration, fn) => t => {
  if (t < 0 || t >= count * duration) return 0;
  const localTime = t % duration;
  return fn(localTime);
});

// Delay (pure functional - look backwards in time)
const delay = curry((delayTime, fn) => t => {
  if (t < delayTime) return 0;
  return fn(t - delayTime);
});

// Feedback with memoization (for efficiency)
const feedback = curry((delayTime, feedbackAmt, fn, sampleRate = 48000) => {
  const cache = new Map();

  const output = t => {
    const key = Math.round(t * sampleRate);
    if (cache.has(key)) return cache.get(key);

    if (t < delayTime) {
      const result = fn(t);
      cache.set(key, result);
      return result;
    }

    const dry = fn(t);
    const wet = output(t - delayTime) * feedbackAmt;
    const result = dry + wet;
    cache.set(key, result);
    return result;
  };

  return output;
});

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  Y,
  pipe,
  compose,
  curry,
  gain,
  offset,
  mix,
  during,
  sequence,
  loop,
  delay,
  feedback
};
