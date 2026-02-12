# The Arche of Aether: The Five Paradigms

This document outlines the five fundamental synthesis paradigms of the Aether engine. In ancient Greek philosophy, the **`Arche` (Ἀρχή)** was the "first principle" or fundamental substance from which all things emerge. Our five paradigms are the `Arche` of the Aether universe—the classical elements from which all sound can be composed.

**Critical Understanding**: These five paradigms are **not separate APIs**. They are **expressive styles** that emerge naturally from the single, universal interface: `f(s)`.

This progression is a journey of relinquishing direct control to embrace higher levels of abstraction, moving from a composer of notes to a physicist of virtual worlds.

## The Unified Interface: `f(s)`

**All paradigms use the same signature**: `f(s) → sample`

Where `s` is "the state of the universe":
```javascript
s = {
  t: 0,           // Absolute time in seconds
  dt: 1/48000,    // Time delta for this sample
  sr: 48000,      // Sample rate
  idx: 0,         // Sample index in buffer
  position: {x, y, z},  // Listener position in space
  name: "signal-name",  // Signal's unique identifier
  state: Float64Array(...)  // Signal's sandboxed state memory
}
```

## The Five Expressive Styles

| Paradigm | Element | What You Use from `s` | Core Concept |
| :--- | :--- | :--- | :--- |
| 1. **Kanon** | **Fire** 🔥 | `s.t` only | The Abstract Ideal (Stateless) |
| 2. **Rhythmos** | **Earth** 🌍 | `s.state`, `s.sr` | The Measured Form (Explicit State) |
| 3. **Atomos** | **Air** 💨 | `s.state`, `s.dt` | The Emergent Process |
| 4. **Physis** | **Water** 💧 | `s.state`, `s.dt` | The Physical Flow |
| 5. **Chora** | **Aether** ✨ | `s.position`, `s.t` | The Resonant Medium |

---

### 1. Kanon - The Abstract Ideal (Fire 🔥)

**Style**: Use only `s.t` from the universe state. Ignore everything else.

This paradigm is the platonic ideal of Fire—pure, timeless, and abstract energy. It describes sound as a **stateless mathematical function of time**.

```javascript
// Kanon: Pure function of time
register('pure-sine', s => {
  return Math.sin(2 * Math.PI * 440 * s.t);
});

// FM synthesis in Kanon style
register('fm', s => {
  const modulator = Math.sin(2 * Math.PI * 110 * s.t) * 5;
  return Math.sin(2 * Math.PI * 440 * s.t + modulator);
});
```

-   **Philosophy:** Sound as eternal geometry. The waveform exists timelessly—you're observing it, not simulating it.
-   **Strength:** Mathematically pure, elegant, perfect for exploring harmonic relationships.
-   **Limitation:** Hot-reloading non-periodic functions will cause discontinuities (clicks/pops).

---

### 2. Rhythmos - The Measured Form (Earth 🌍)

**Style**: Use `s.state` and `s.sr` from the universe state. Manage phase explicitly.

This is the solid, foundational, and structural paradigm. It represents the most critical evolutionary step: making state **explicit** for phase-continuous synthesis.

```javascript
// Rhythmos: Explicit state management for phase continuity
register('phase-continuous-sine', s => {
  // s.state is this signal's sandboxed Float64Array
  s.state[0] = (s.state[0] + 440 / s.sr) % 1.0;
  return Math.sin(s.state[0] * 2 * Math.PI);
});

// Change 440 → 550 and save: SMOOTH MORPH, no click!

// Complex waveforms
register('saw', s => {
  s.state[0] = (s.state[0] + 110 / s.sr) % 1.0;
  return (s.state[0] * 2 - 1) * 0.5;  // Sawtooth
});
```

-   **Philosophy:** The monochord that never stops vibrating. State flows continuously through time.
-   **Strength:** Phase-continuous hot-reloading. Change parameters mid-performance without clicks.
-   **Use case:** Traditional synthesis, live performance, any time smoothness matters.

---

### 3. Atomos - The Emergent Process (Air 💨)

**Style**: Use `s.state` and `s.dt` from the universe state. Think in discrete time steps.

This paradigm is less predictable, more chaotic. Like the air, it represents the emergence of complex patterns from simple, discrete interactions.

```javascript
// Atomos: Discrete emergent processes
register('bouncing-particle', s => {
  // State: [position, velocity]
  s.state[0] = s.state[0] || 0;
  s.state[1] = s.state[1] || 1;

  // Update position by velocity (discrete step)
  s.state[0] += s.state[1] * s.dt * 100;

  // Bounce at boundaries
  if (Math.abs(s.state[0]) > 1) {
    s.state[1] *= -0.95;  // Lose energy on bounce
  }

  return s.state[0] * 0.5;
});
```

-   **Philosophy:** The weather, the wind, emergent chaos. Discrete steps create unpredictable beauty.
-   **Strength:** Generative systems, granular synthesis, stochastic processes.
-   **Use case:** When you want emergence, not direct control. Happy accidents.

---

### 4. Physis - The Physical Flow (Water 💧)

**Style**: Use `s.state` and `s.dt` to model physical laws. Let physics create the sound.

This paradigm represents the flow of water—dynamic, reactive, governed by clear physical laws like momentum and inertia.

```javascript
// Physis: Physics simulation
register('spring', s => {
  // State: [position, velocity]
  const k = 100;      // Spring constant
  const damping = 0.1;

  s.state[0] = s.state[0] || 0.1;  // Start displaced
  s.state[1] = s.state[1] || 0;

  // Hooke's law: F = -kx
  const force = -k * s.state[0] - damping * s.state[1];

  // Integrate: v += F*dt, x += v*dt
  s.state[1] += force * s.dt;
  s.state[0] += s.state[1] * s.dt;

  return s.state[0] * 0.5;
});
```

-   **Philosophy:** Virtual objects obeying natural laws. You're a physicist, not a programmer.
-   **Strength:** Organic, realistic, intuitive timbres. Physical modeling synthesis.
-   **Use case:** Plucked strings, blown tubes, struck membranes.

---

### 5. Chora - The Resonant Medium (Aether ✨)

**Style**: Use `s.position` and `s.t` to create spatial wavefields. Space itself is the instrument.

This is the most profound paradigm: the all-pervading medium, the fabric of space itself through which all waves propagate.

```javascript
// Chora: Spatial wavefield
register('propagating-wave', s => {
  const { x, y, z } = s.position;
  const distance = Math.sqrt(x*x + y*y + z*z);
  const waveSpeed = 340;  // Speed of sound in air (m/s)

  // Wave equation: amplitude falls with 1/r, propagates at waveSpeed
  const travelTime = distance / waveSpeed;
  const phase = 2 * Math.PI * 440 * (s.t - travelTime);

  return Math.sin(phase) / (distance + 1);
});

// Move the listener position to hear doppler, distance attenuation
```

-   **Philosophy:** Space itself resonates. Define the medium, not the objects within it.
-   **Strength:** True physical sound phenomena—propagation, reflection, spatial audio.
-   **Use case:** Reverb, room acoustics, 3D audio, wavefield synthesis.

## The Unified Vision

**This is the key**: All five paradigms use the same `f(s)` interface. There are no separate APIs to learn.

The ultimate goal for Aether is to allow all five styles to coexist seamlessly. A live coder can:
-   Create a solid foundation using **Rhythmos** (explicit state)
-   Add an evolving, textural pad using **Atomos** (discrete emergence)
-   Introduce a lead voice using **Physis** (physics modeling)
-   Simulate the resonance in a virtual room using **Chora** (spatial field)
-   Use **Kanon** functions to modulate any of the above

**All in the same session, all using `f(s)`, all composing naturally.**

```javascript
// Mix all five paradigms in one composition
register('kanon-lfo', s => Math.sin(2 * Math.PI * 0.5 * s.t));

register('rhythmos-bass', s => {
  const lfo = Math.sin(2 * Math.PI * 0.5 * s.t);
  const freq = 55 + lfo * 5;
  s.state[0] = (s.state[0] + freq / s.sr) % 1.0;
  return Math.sin(s.state[0] * 2 * Math.PI) * 0.3;
});

register('atomos-texture', s => {
  s.state[0] += (Math.random() - 0.5) * s.dt * 10;
  s.state[0] = Math.max(-1, Math.min(1, s.state[0]));
  return s.state[0] * 0.1;
});

// They all run together, seamlessly
```

By providing this complete hierarchy within a single interface, Aether becomes a powerful instrument for both musical composition and the exploration of entire sonic universes.

---

## Cross-Paradigm Interaction: The Unified Goal

The true power of the Aether engine is not just in providing these five paradigms, but in allowing them to interact. The ultimate vision is to compose complex sonic systems by using simpler, more controlled models to influence more complex, organic ones.

This requires a conceptual shift from traditional signal processing to physics simulation. We do not merely *modify* a signal; we apply a *force* to a virtual object or *excite* a virtual medium and listen to its natural response.

### Conceptual Example 1: Exciting a `Physis` Object

A predictable `Rhythmos` oscillator can act as an external driving force on a `Physis` object, creating a physically modeled resonator.

```javascript
// A slow, predictable sine wave acts as the driving force
const drivingForce = Rhythmos(sin(10));

// A virtual mass-on-a-spring with its own tension and friction
const resonantObject = Physis(/*...defines derivatives...*/);

// The drivingForce continuously "pushes" the resonantObject.
// The sound we hear is the object's physical reaction to this force.
aether('resonator', drive(drivingForce, resonantObject));
```
As the frequency of the `drivingForce` approaches the natural resonant frequency of the `resonantObject`, the system will burst into powerful, organic oscillation—a behavior that emerges from the interaction, rather than being explicitly programmed.

### Conceptual Example 2: Exciting a `Chora` Field

A `Chora` field can be excited by different signals at different points in its virtual space.

```javascript
// An impulsive, percussive sound created with the Atomos paradigm
const pluck = Atomos(/* a sharp click */);

// A continuous sine wave driver
const ebow = Rhythmos(sin(50));

// A virtual guitar string that can be excited at multiple points
const guitarString = Chora('virtual-guitar', (mem) => {
  return {
    // ... a derivatives function defining the wave equation ...
    output: (state) => state.positions[128], // Listen from the middle
    inputs: {
      32: pluck, // "Pluck" the string at point 32
      96: ebow   // Continuously drive the string at point 96
    }
  };
});
```
This allows for the simulation of incredibly complex and realistic sonic events. We would hear the initial "pluck" travel down the string and reflect, while the continuous "ebow" driver would sustain the string's vibration, creating rich, evolving harmonics based on its position.

### A Note on JavaScript as the Medium

It may seem surprising that JavaScript is the ideal language for a project with such a grand, computationally intensive vision, rather than a more "academically pure" language like Haskell, Lisp, or OCaml. However, modern JavaScript engines (like Bun's JavaScriptCore) possess a unique combination of strengths that make them unexpectedly perfect for this task:
-   **First-Class Functions & Closures:** The entire paradigm hierarchy is built on the elegant composition of higher-order functions, a core strength of the language.
-   **JIT Compilation:** Hot-path functions in the audio loop are aggressively optimized by the Just-in-Time compiler, achieving near-native performance for the demanding inner loops of `Atomos`, `Physis`, and `Chora` simulations.
-   **Stateful by Nature:** JavaScript's accessible and flexible object model, combined with a globally accessible state (`globalThis`), makes managing the persistent state required for phase-continuity trivial and intuitive.
-   **Rapid Iteration:** The ecosystem, particularly with tools like Bun, is built for the exact kind of instant feedback and hot-reloading that live coding thrives on.

---

## Composing the Paradigms: An Instrument Builder's Guide

The five paradigms are not just alternatives; they are the fundamental elements for a rich compositional language. Classic synthesis techniques can be understood as compositions using different paradigm styles.

### Subtractive Synthesis
-   **Concept:** Start with a rich sound, then filter it.
-   **Aether Composition:**
    ```javascript
    // Source: Rhythmos sawtooth (rich harmonics)
    const saw = s => {
      s.state[0] = (s.state[0] + 110 / s.sr) % 1.0;
      return (s.state[0] * 2 - 1);
    };

    // Filter: Use a helper (or implement as Physis resonator)
    register('subtractive', pipe(saw, lowpass(800)));
    ```

### Additive Synthesis
-   **Concept:** Build a complex sound by mixing many sine waves.
-   **Aether Composition:**
    ```javascript
    // Mix many Rhythmos sine waves at harmonic ratios
    register('additive', s => {
      let sum = 0;
      const fundamental = 110;
      for (let i = 1; i <= 8; i++) {
        const freq = fundamental * i;
        const amp = 1 / i;  // Amplitude falls with harmonic number
        s.state[i] = (s.state[i] + freq / s.sr) % 1.0;
        sum += Math.sin(s.state[i] * 2 * Math.PI) * amp;
      }
      return sum * 0.1;
    });
    ```

### Frequency Modulation (FM) Synthesis
-   **Concept:** Use one oscillator (Modulator) to modulate the frequency of another (Carrier).
-   **Aether Composition:**
    ```javascript
    // Classic FM using Kanon style for modulator, Rhythmos for carrier
    register('fm', s => {
      const modulator = Math.sin(2 * Math.PI * 110 * s.t) * 50;
      const carrierFreq = 440 + modulator;
      s.state[0] = (s.state[0] + carrierFreq / s.sr) % 1.0;
      return Math.sin(s.state[0] * 2 * Math.PI) * 0.3;
    });

    // Or pure Kanon style
    register('fm-pure', s => {
      const mod = Math.sin(2 * Math.PI * 110 * s.t) * 5;
      return Math.sin(2 * Math.PI * 440 * s.t + mod) * 0.3;
    });
    ```

### The Special Role of the Chora Paradigm

You may notice the `Chora` paradigm is not often used as a primary sound *source* in classic compositions. This is because its role is even more fundamental.

While `Kanon`, `Rhythmos`, `Atomos`, and `Physis` are excellent for creating **instruments**, the `Chora` paradigm is used to create the **virtual acoustic space** in which those instruments exist.

```javascript
// Physically Modeled Reverb using Chora
register('reverb-space', s => {
  // Simulate a 2D room with wave propagation
  const { x, y } = s.position;
  const sourceX = 0, sourceY = 0;
  const dist = Math.sqrt((x - sourceX)**2 + (y - sourceY)**2);

  // Multiple reflections from walls
  let sum = 0;
  for (let reflect = 0; reflect < 5; reflect++) {
    const reflectDist = dist + reflect * 10;  // Each reflection travels further
    const delay = reflectDist / 340;  // Speed of sound
    const amp = 1 / (reflectDist + 1);  // Distance attenuation
    sum += Math.sin(2 * Math.PI * 440 * (s.t - delay)) * amp;
  }
  return sum * 0.2;
});
```

**Key uses:**
-   **Physically Modeled Reverb:** Wave propagation and reflection in virtual spaces
-   **Resonant Body Simulation:** Model drum membranes, guitar bodies
-   **Waveguides:** Flute tubes, brass instruments—inject noise, hear music

Ultimately, the `Chora` paradigm is the final piece of the puzzle, allowing you to move beyond creating just the sound, and start designing the very universe in which the sound exists.