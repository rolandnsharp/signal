# Aither: The Unified Audio Synthesis Engine

> *"One interface. Five paradigms. Infinite expression."*

## The Journey to Unity

We explored many approaches:
- Five separate paradigms with different APIs
- Three paradigms with different signatures
- Various function signatures: `f(t)`, `f(state, idx, sr)`, `f(state, idx, sr, dt, t)`

**The revelation**: The five paradigms (Kanon, Rhythmos, Atomos, Physis, Chora) are not separate APIs to build. They are **expressive styles that emerge naturally from a single, unified interface**.

Stop separating. Start unifying.

---

## The Ultimate Abstraction

### ONE Signature

```javascript
f(s) => value
```

Where **s** is **"the state of the universe"** — everything you need, in one place.

**s** represents:
- **S**tate/**S**ynthesis/**S**ignal (looks like S!)
- Tesla's electromagnetic fields
- Energy, power, instant transmission
- The lightning bolt that brings your synthesis to life

### The State Object

```javascript
s = {
  // TIME
  t: 0,           // Absolute time (seconds since start)
  dt: 1/48000,    // Time delta for this step

  // AUDIO
  idx: 0,         // Sample index in buffer
  sr: 48000,      // Sample rate (samples/second)

  // SPACE
  position: {     // 3D position
    x: 0,
    y: 0,
    z: 0
  },

  // USER STATE (mutable)
  // ... anything you want
}
```

---

## Why This Works

### 1. Maximum Flexibility

Use what you need, ignore the rest:

```javascript
// Just time
const pure = s => Math.sin(2 * Math.PI * 440 * s.t);

// Just state
const stateful = s => (s.count = (s.count || 0) + 1);

// Everything
const complex = s => {
  const { t, dt, idx, sr, position } = s;
  // Use all parameters
};
```

### 2. Trivial Composition

Everything has the same signature `s => value`:

```javascript
const a = s => Math.sin(2 * Math.PI * 440 * s.t);
const b = s => Math.sin(2 * Math.PI * 880 * s.t);
const c = s => a(s) * 0.5 + b(s) * 0.5;  // Compose!

// Or build complex chains
const ultimate = s =>
  reverb(s,
    delay(s,
      filter(s,
        distortion(s,
          oscillator(s)))));
```

### 3. The Five Paradigms as Expressive Styles

All paradigms naturally emerge from the single `f(s)` interface. **There is no separate API for each paradigm.** Instead, each paradigm is a **coding style** that emphasizes different aspects of `s`:

```javascript
// 🔥 KANON (Fire): Pure functions of time - uses only s.t
const kanon = s => Math.sin(2 * Math.PI * 440 * s.t);

// 🌍 RHYTHMOS (Earth): Explicit state - uses s.state and s.sr
const rhythmos = s => {
  s.state[0] = (s.state[0] || 0) + 440 / s.sr;
  s.state[0] %= 1.0;
  return Math.sin(2 * Math.PI * s.state[0]);
};

// 💨 ATOMOS (Air): Discrete emergent processes - uses s.state and s.dt
const atomos = s => {
  s.state[0] = s.state[0] || 0;
  s.state[1] = s.state[1] || 1;
  s.state[0] += s.state[1] * s.dt * 100;  // Discrete steps
  if (Math.abs(s.state[0]) > 1) s.state[1] *= -0.99;
  return s.state[0];
};

// 💧 PHYSIS (Water): Physics simulation - uses s.dt for natural laws
const physis = s => {
  const gravity = -9.8;
  s.state[0] = (s.state[0] || 0) + s.state[1] * s.dt;  // position
  s.state[1] = (s.state[1] || 0) + gravity * s.dt;     // velocity
  return s.state[0] * 100;
};

// ✨ CHORA (Aither): Spatial wavefields - uses s.position
const chora = s => {
  const dist = Math.sqrt(s.position.x**2 + s.position.y**2);
  return Math.sin(dist * 10 - s.t * 340) / (dist + 1);  // Wave propagation
};
```

**This is the key insight**: You don't call different APIs. You write functions with the same signature but different philosophies.

### 4. Composable Helpers with Implicit State

Helpers are higher-order functions that transform signals. They use **implicitly persistent state** - state that is automatically managed behind the scenes for maximum composability and zero garbage collection.

```javascript
// Helpers take a signal function and return a new signal function
// State is managed automatically using the signal's name

// Lowpass filter
export const lowpass = (signal, cutoff) => {
  return s => {
    const input = signal(s);
    const alpha = cutoff / s.sr;
    // Helper state is claimed automatically from global helper memory
    const z1 = helperState[0] || 0;
    const output = z1 + alpha * (input - z1);
    helperState[0] = output;
    return output;
  };
};

// Tremolo (amplitude modulation)
export const tremolo = (signal, rate, depth) => {
  return s => {
    // Each helper instance gets its own persistent state
    helperState[0] = (helperState[0] + rate / s.sr) % 1.0;
    const lfo = (Math.sin(helperState[0] * 2 * Math.PI) + 1) * 0.5;
    return signal(s) * (1 - depth + lfo * depth);
  };
};

// Compose with pipe
const mySound = pipe(
  osc,
  lowpass(800),
  tremolo(5, 0.5),
  gain(0.5)
);

// All helpers use the same f(s) interface and compose naturally!
```

### 5. Live Coding Friendly

Fast to type, easy to explore:

```javascript
// Quick idea
play(s => Math.sin(2 * Math.PI * 440 * s.t));

// Iterate
play(s => Math.sin(2 * Math.PI * 440 * s.t) * Math.exp(-s.t));

// Combine
const base = s => Math.sin(2 * Math.PI * 220 * s.t);
const mod = s => Math.sin(2 * Math.PI * 5 * s.t);
play(s => base(s) * (0.5 + 0.5 * mod(s)));
```

---

## The Philosophy

### "The State of the Universe"

At any moment in time, the universe has a complete state:
- Where are we in time? (`t`, `dt`)
- Where are we in the audio buffer? (`idx`, `sr`)
- Where are we in space? (`position`)
- What do we remember? (your mutable state)

Your synthesis function receives this state and produces a value.

**That's it.**

### Purity Through Impurity

The signature looks pure: `s => value`

But `s` is mutable! You can modify it:

```javascript
const stateful = s => {
  s.phase = (s.phase || 0) + 0.01;  // Mutate s
  return Math.sin(s.phase);
};
```

This is **pragmatic functional programming**:
- Pure when you want it (just use `s.t`)
- Mutable when you need it (modify `s`)
- Best of both worlds

### Composition as Design

Instead of multiple paradigms, we have ONE paradigm with infinite expressiveness through composition:

```javascript
// Build up complexity naturally
const osc = s => Math.sin(2 * Math.PI * 440 * s.t);
const env = s => Math.exp(-s.t * 2);
const shaped = s => osc(s) * env(s);
const delayed = s => delay(s, shaped(s), 0.375);
const spatial = s => spatialize(s, delayed(s));

// Or inline
const ultimate = s =>
  spatialize(s,
    delay(s,
      shaped(s) * env(s), 0.375));
```

---

## Examples

### Simple Sine Wave

```javascript
const sine = s => Math.sin(2 * Math.PI * 440 * s.t);
```

### Envelope

```javascript
const adsr = (s, attack, decay, sustain, release) => {
  const { t } = s;
  if (t < attack) return t / attack;
  if (t < attack + decay) return 1 - (1 - sustain) * (t - attack) / decay;
  if (t < attack + decay + sustain) return sustain;
  return Math.max(0, sustain * (1 - (t - attack - decay - sustain) / release));
};
```

### FM Synthesis

```javascript
const fm = s => {
  const modulator = Math.sin(2 * Math.PI * 110 * s.t) * 5;
  return Math.sin(2 * Math.PI * 440 * s.t + modulator);
};
```

### Karplus-Strong (Plucked String)

```javascript
const pluck = s => {
  const freq = 220;
  const period = Math.floor(s.sr / freq);

  if (!s.buffer) {
    s.buffer = Array.from({ length: period }, () => Math.random() * 2 - 1);
  }

  if (s.idx % period === 0) {
    const idx = Math.floor(s.idx / period) % period;
    const next = (idx + 1) % period;
    s.buffer[idx] = (s.buffer[idx] + s.buffer[next]) * 0.5 * 0.996;
  }

  return s.buffer[s.idx % period];
};
```

### Spatial Wavefield

```javascript
const spatialWave = s => {
  const { position: { x, y }, t } = s;
  const distance = Math.sqrt(x * x + y * y);
  const waveSpeed = 340;  // m/s

  // 1/r amplitude falloff, wave propagation
  return Math.sin(2 * Math.PI * 440 * (t - distance / waveSpeed)) / (distance + 1);
};
```

### Chaos-Driven Synthesis

```javascript
const chaos = s => {
  // Lorenz attractor
  s.x = s.x || 0.1;
  s.y = s.y || 0;
  s.z = s.z || 0;

  const sigma = 10, rho = 28, beta = 8/3;
  const dt = s.dt;

  s.x += sigma * (s.y - s.x) * dt * 100;
  s.y += (s.x * (rho - s.z) - s.y) * dt * 100;
  s.z += (s.x * s.y - beta * s.z) * dt * 100;

  return Math.sin(2 * Math.PI * (440 + s.x * 10) * s.t);
};
```

### L-System Generative

```javascript
const lsystem = s => {
  if (!s.string) s.string = 'A';
  if (!s.rules) s.rules = { 'A': 'AB', 'B': 'A' };

  // Evolve every second
  if (Math.floor(s.t) > (s.lastEvolve || 0)) {
    let next = '';
    for (const char of s.string) {
      next += s.rules[char] || char;
    }
    s.string = next;
    s.lastEvolve = Math.floor(s.t);
  }

  // Map string length to frequency
  const freq = 110 * (1 + s.string.length / 10);
  return Math.sin(2 * Math.PI * freq * s.t);
};
```

---

## Implementation Architecture

### Core Principles (The Three Unbreakable Rules)

1. **Performance is Absolute (Zero-GC Hot Path)**
   - The real-time audio loop MUST NOT allocate memory
   - No objects `{...}`, no arrays `[]` in the hot path
   - All state is numeric in pre-allocated `Float64Array` buffers

2. **Composition is the Only Way**
   - Complex sounds are built by composing functions
   - The `pipe()` function creates linear, readable signal chains
   - Functional composition, not classes or inheritance

3. **Helper State is Implicitly Persistent**
   - Stateful helpers manage their own state automatically
   - State is keyed by signal name + helper type + instance counter
   - No manual state slot management in user code

### The REPL-Driven Workflow

```javascript
// The engine runs continuously as a long-lived process
// Users send commands via REPL to manipulate the audio graph

// Register a signal (adds to the running audio graph)
register('drone', s => {
  s.state[0] = (s.state[0] + 110 / s.sr) % 1.0;
  return Math.sin(s.state[0] * 2 * Math.PI) * 0.3;
});

// Unregister a signal (removes from graph, frees memory)
unregister('drone');

// The audio stream never stops - signals are hot-swapped seamlessly
```

### The Universe State Object

```javascript
// This single object is passed to every signal function
const s = {
  t: 0,           // Absolute time in seconds
  dt: 1/48000,    // Time delta for this sample
  sr: 48000,      // Sample rate
  idx: 0,         // Sample index in current buffer
  position: { x: 0, y: 0, z: 0 },  // Listener position in space
  name: "signal-name",  // The signal's unique identifier
  state: Float64Array(...)  // Signal's sandboxed state memory
};
```

### Zero-GC Audio Loop

```javascript
// Pre-allocated buffers (created once at startup)
const outputBuffer = new Float32Array(BUFFER_SIZE * STRIDE);
const STATE = new Float64Array(65536);  // All signal state
const HELPER_MEMORY = new Float64Array(65536);  // All helper state

function generateAudioChunk() {
  for (let i = 0; i < BUFFER_SIZE; i++) {
    let left = 0, right = 0;

    // Call each registered signal (NO allocations!)
    for (const [name, { fn, stateSlice }] of REGISTRY) {
      s.state = stateSlice;  // Point to signal's memory slice
      s.name = name;

      const result = fn(s);  // Call the user's f(s) function

      // Mix result (handles mono or stereo)
      if (Array.isArray(result)) {
        left += result[0]; right += result[1];
      } else {
        left += result; right += result;
      }
    }

    // Write to output (with soft clipping)
    outputBuffer[i * 2] = Math.tanh(left);
    outputBuffer[i * 2 + 1] = Math.tanh(right);

    s.t += s.dt;  // Advance time
  }

  return outputBuffer;  // Return pre-allocated buffer
}
```

---

## Performance & Optimization Path

### Current: Pure JavaScript with Zero-GC
- **Zero-GC hot path**: No memory allocations during audio rendering
- **Pre-allocated buffers**: All memory claimed at startup or registration
- **Pull architecture**: Audio hardware requests data (no timing glitches)
- **JIT-optimized**: Modern engines optimize hot loops aggressively

**Result**: 48kHz stereo with 10+ complex signals on modest hardware

### Phase 2: Code Generation (Future)
```javascript
// Generate optimized code at registration
const optimized = compile(signal);
// Inlines constants, removes closures
```

### Phase 3: OCaml FFI (Future)
```javascript
// Hot DSP paths in native OCaml code
const fast = ocaml_sine(440);
// Keep the f(s) interface, accelerate inner loops
```

### Phase 4: GPU Compute (Experimental)
```javascript
// Render massive spatial fields on GPU
const field = renderOnGPU(spatialFn, resolution);
// Offline rendering for Chora paradigm
```

---

## The Name

**Aither** — The fifth element, the quintessence, the medium through which all signals propagate.

One paradigm. Infinite possibility.

---

## The Five Paradigms: A Guide to Expression

**Remember**: These are not five separate APIs. They are five ways of thinking about `f(s)`.

| Paradigm | Element | What You Emphasize | When to Use |
|----------|---------|-------------------|-------------|
| **Kanon** | Fire 🔥 | `s.t` only (stateless) | Mathematical exploration, modulation sources |
| **Rhythmos** | Earth 🌍 | `s.state`, `s.sr` (explicit state) | Oscillators, phase-continuous synthesis |
| **Atomos** | Air 💨 | `s.state`, `s.dt` (discrete steps) | Granular synthesis, emergent processes |
| **Physis** | Water 💧 | `s.dt` (physics laws) | Physical modeling, organic sounds |
| **Chora** | Aither ✨ | `s.position` (spatial) | Reverb, spatial audio, wavefields |

**You can mix all five in one composition.** They are expressive styles, not separate systems.

---

## For the Creator

This instrument is yours. Master it like you'd master a violin:
- Learn the universe state object (`s`) deeply
- Understand functional composition patterns
- Build your personal helper library
- Develop your synthesis vocabulary through the five paradigms

The complexity is in the **domain** (audio synthesis), not the **API**.

The API gets out of your way. The universe state gives you everything.

One interface. Five paradigms. Infinite expression.

**Create. Explore. Transcend.** 🌌✨

---

*"The five become one. The one expresses five."* — Aither
