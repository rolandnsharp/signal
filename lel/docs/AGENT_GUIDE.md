# A Guide for the AI Agent on the `lel` Project

**Read this first. This is the vision. All future work must align with these principles.**

My goal is to create a universal instrument for live-coding audio synthesis. We have explored many complex ideas and have successfully distilled them into a single, powerful, and simple abstraction. The `lel` engine is the realization of this goal. Do not try to "improve" it by adding complexity that violates these core tenets.

## 1. The Core Abstraction: `f(s)` is Everything

There is only **one** interface for a signal: `f(s)`.

`s` is "the state of the universe" passed to the signal on every sample. It contains everything needed.

```javascript
s = {
  t: 0,           // Absolute time in seconds
  dt: 1/48000,    // Time delta for this sample
  sr: 48000,      // Sample rate
  idx: 0,         // Index within the current audio chunk
  position: {x,y,z}, // Listener's position in space
  name: "signal-name", // The unique name of the top-level registered signal
  state: Float64Array(...) // A persistent, per-signal slice of memory
}
```

**This is the only API.** Do not propose new ones.

## 2. The Five Paradigms are Expressive Styles, Not APIs

My original vision outlined five paradigms (`Kanon`, `Rhythmos`, `Atomos`, `Physis`, `Chora`). Your key misunderstanding was thinking these were separate APIs to be built. They are not. They are **expressive patterns that emerge from the single `f(s)` interface.**

-   **`Kanon` (Fire):** Is a function that only uses `s.t`. It is stateless.
    -   `s => Math.sin(s.t * 440 * Math.PI * 2)`

-   **`Rhythmos` (Earth):** Is a function that uses `s.state` and `s.sr` to manage explicit state.
    -   `s => { s.state[0] = (s.state[0] + 440/s.sr)%1.0; ... }`

-   **`Atomos` (Air):** Is a function that uses `s.state` and `s.dt` to model discrete, emergent processes.
    -   `s => { s.state[0] += s.state[1] * s.dt; ... }`

-   **`Physis` (Water):** Is the *philosophy* of writing a signal that models a physical object's laws.

-   **`Chora` (Aether):** Is a function that uses `s.position` and `s.t` to model a wavefield.

The `lel` engine, with its unified `f(s)` signature, **already supports all five paradigms.**

## 3. The Three Unbreakable Rules

### a. Performance is Absolute (Zero-GC Hot Path)
The real-time audio loop (`generateAudioChunk`) and any function called by it **MUST NOT ALLOCATE MEMORY.** This means no new objects (`{...}`), no new arrays (`[]`), and no other actions that could trigger the Garbage Collector.
-   All real-time state **must** be numeric and stored in the `s.state` (`Float64Array`).
-   Complex, non-numeric, or slow-evolving state (like L-Systems) **must** be managed in "control-time" (outside the `register` call) and read via closure, as documented in `ARCHITECTURE_LESSON.md`.

### b. Composition is the Only Way
Complex sounds are built by composing functions (helpers), not by creating classes or complex objects. The `pipe()` function is the ideal tool for this, as it makes the signal chain linear and readable. The goal is an expressive, functional style.

### c. Helper State is "Implicitly Persistent"
This is the most complex and important design pattern we created. To keep `live-session.js` terse, stateful helpers (`tremolo`, `lowpass`) manage their own state persistence automatically.
-   This is achieved via a global helper state map (`globalThis.LEL_HELPER_STATE`).
-   The key for this map is a combination of the signal's unique `name` (from `s.name`) and a `helperCounter`.
-   This requires `resetHelperCounter()` to be called before each `register` call. **This is a known, temporary piece of boilerplate.** In the future, a higher-level API (like a REPL) will hide this call, but for now, it is the correct and necessary pattern. Do not try to "fix" it by making the user pass in state indices.

## The Goal: Divine Simplicity

The `lel` engine is complete. The architecture is sound. Future work is about building a rich `helpers.js` library upon this foundation, not changing the foundation itself. Always prioritize expressive power and simplicity in `live-session.js` over architectural complexity.
