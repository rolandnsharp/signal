# Aither (αἰθήρ)

> *"One interface. Five paradigms. Infinite expression."*

**Aither** is a live coding audio synthesis engine with a unified `f(s)` interface that supports five expressive paradigms, from pure mathematics to spatial sound fields.

## Philosophy

The five paradigms aren't separate APIs—they're **expressive styles** that emerge from a single universal interface:

```javascript
f(s) → sample
```

Where `s` is the universe state containing everything a signal needs: time, sample rate, persistent state, and spatial position.

## The Five Paradigms

| Paradigm | Element | Uses | Style |
|----------|---------|------|-------|
| **Kanon** | Fire 🔥 | `s.t` | Pure time functions |
| **Rhythmos** | Earth 🌍 | `s.state`, `s.sr` | Explicit state (oscillators) |
| **Atomos** | Air 💨 | `s.state`, `s.dt` | Discrete processes (granular) |
| **Physis** | Water 💧 | `s.dt` | Physics simulation (springs) |
| **Chora** | Aither ✨ | `s.position`, `s.t` | Spatial synthesis (fields) |

All five work together seamlessly because they share the same signature.

## Quick Start

```bash
# Install dependencies
bun install

# Link globally (one-time)
bun link

# Start the server
aither start

# In another terminal, open the REPL
aither repl

# Or send a file
aither send snippet.js
```

## Basic Examples

### Kanon (Fire 🔥) - Pure Time

```javascript
// Pure sine wave - only uses time
play('pure', s => Math.sin(2 * Math.PI * 440 * s.t) * 0.3);
```

### Rhythmos (Earth 🌍) - Explicit State

```javascript
// Phase accumulation oscillator
play('osc', s => {
  s.state[0] = (s.state[0] + 440 / s.sr) % 1.0;
  return Math.sin(s.state[0] * 2 * Math.PI) * 0.3;
});
```

### Using DSP Helpers

```javascript
// Compose with helpers
play('filtered',
  pipe(
    s => Math.sin(2 * Math.PI * 440 * s.t),
    lowpass(_, 800),
    tremolo(_, 5, 0.8),
    gain(_, 0.5)
  )
);
```

### Chora (Aither ✨) - Spatial Synthesis

```javascript
// Sound that changes with position in space
play('spatial', s => {
  const { x, y, z } = s.position;
  const distance = Math.sqrt(x*x + y*y + z*z);
  const amplitude = 1 / (distance + 1);
  return Math.sin(2 * Math.PI * 440 * s.t) * amplitude * 0.3;
});

// Move through the field
setPosition({ x: 2, y: 1, z: 0 });
```

## Commands

### Server
```bash
aither start              # Start audio server
```

### REPL
```bash
aither repl               # Interactive REPL
aither send file.js       # Send file to server
aither help               # Show help
```

### Core API
```javascript
play(name, signal)        // Start a signal (alias: register)
stop(name)                // Stop a signal (alias: unregister)
clear()                   // Stop all signals
setPosition({x, y, z})    // Set listener position (for Chora)
```

### DSP Helpers
```javascript
// All helpers work on any paradigm!
pipe(...fns)              // Compose functions left-to-right
mix(...signals)           // Mix multiple signals
lowpass(signal, cutoff)   // Lowpass filter
tremolo(sig, rate, depth) // Amplitude modulation
delay(sig, maxTime, time) // Delay line
feedback(sig, max, time, fb) // Feedback delay
gain(signal, amount)      // Amplification
pan(signal, position)     // Stereo panning (-1 to 1)
```

## The Universe State (`s`)

Every signal receives the universe state:

```javascript
s = {
  t: 0,              // Absolute time (seconds)
  dt: 1/48000,       // Time delta (1/sampleRate)
  sr: 48000,         // Sample rate
  idx: 0,            // Sample index in buffer
  position: {x,y,z}, // Listener position (Chora)
  name: "signal",    // Signal name (for state keys)
  state: Float64Array(128) // Persistent state memory
}
```

## Architecture

```
┌─────────────────────────────────────┐
│  aither CLI                         │  Commands: start, repl, send
├─────────────────────────────────────┤
│  server.js                          │  Audio engine + REPL server
│  ├─ Signal registry                │  Manages active signals
│  ├─ REPL server (UDP)              │  Port 41234
│  └─ Audio generation loop          │  Calls f(s) for each sample
├─────────────────────────────────────┤
│  dsp.js                             │  Universal helpers
│  ├─ expand() pattern               │  Stride-agnostic multichannel
│  └─ Implicit state management      │  Automatic persistence
├─────────────────────────────────────┤
│  speaker.js                         │  Audio output (speaker module)
└─────────────────────────────────────┘
```

## Key Features

✨ **Unified Interface** - One `f(s)` signature for all paradigms
🎯 **Universal Helpers** - Same DSP works on pure functions, physics, spatial fields
🔥 **Zero-GC Hot Path** - No allocations in real-time audio loop
🌊 **Phase Continuity** - State persists across live edits
🎚️ **Stride-Agnostic** - Mono, stereo, N-channel automatic
💨 **REPL-Driven** - Surgical code injection while running
✨ **Spatial Synthesis** - True wavefield synthesis (Chora paradigm)

## Live Coding Workflow

### 1. Start the server
```bash
aither start
```

### 2. Connect with REPL
```bash
aither repl
```

### 3. Live code!
```javascript
aither> play('test', s => Math.sin(2 * Math.PI * 440 * s.t) * 0.3)
aither> stop('test')
aither> clear()
```

### 4. Or send files
```bash
aither send my-session.js
```

## File Structure

```
aither/
├── src/
│   ├── cli.js          # Command-line interface
│   ├── server.js       # Audio engine + REPL server
│   ├── dsp.js          # DSP helpers (filters, effects)
│   ├── speaker.js      # Audio output
│   ├── repl.js         # Interactive REPL client
│   └── send-repl.js    # File sender client
├── docs/               # Documentation
│   ├── CORE_VISION.md  # Fundamental principles
│   ├── HELPERS.md      # DSP helper guide
│   └── ...
├── live-session.js     # Example startup script
└── package.json
```

## Examples Repository

Check out `live-session.js` for working examples:
- Simple oscillators
- Filtered signals
- Tremolo effects
- Panning and stereo
- Composable signal chains

## Advanced: Mixing Paradigms

The power of Aither is mixing all five paradigms in one composition:

```javascript
play('hybrid',
  mix(
    // Kanon (Fire) - Pure time
    s => Math.sin(2 * Math.PI * 440 * s.t),

    // Rhythmos (Earth) - Stateful oscillator
    s => {
      s.state[0] = (s.state[0] + 220 / s.sr) % 1.0;
      return Math.sin(s.state[0] * 2 * Math.PI);
    },

    // Chora (Aither) - Spatial field
    s => {
      const { x, y, z } = s.position;
      const d = Math.sqrt(x*x + y*y + z*z);
      return Math.sin(2 * Math.PI * 110 * s.t) / (d + 1);
    }
  )
);
```

Then apply the same helper to all of them:

```javascript
play('filtered-hybrid',
  pipe(
    mix(kanon, rhythmos, chora),
    lowpass(_, 1200),
    gain(_, 0.3)
  )
);
```

## Documentation

- **[CORE_VISION.md](docs/CORE_VISION.md)** - The f(s) interface and three unbreakable rules
- **[HELPERS.md](docs/HELPERS.md)** - Complete DSP helper guide
- **[STATE_OBJECT.md](docs/STATE_OBJECT.md)** - Understanding the `s` object
- **[COMPARISON.md](docs/COMPARISON.md)** - How Aither relates to SuperCollider, TidalCycles
- **[spatial-synthesis.md](docs/paradigms/chora/spatial-synthesis.md)** - Chora paradigm deep dive

## Technical Specs

- **Runtime**: Bun (fast JavaScript)
- **Sample Rate**: 48kHz
- **Bit Depth**: 32-bit float
- **Channels**: Stereo (stride-agnostic design)
- **Buffer Size**: 1024 frames
- **State Memory**: Float64Array (128 slots per signal)
- **Helper Memory**: Float64Array (65536 slots shared)
- **REPL Protocol**: UDP on port 41234

## Inspired By

- **SuperCollider** - Live coding pioneer
- **TidalCycles** - Pattern-based live coding
- **Faust** - Functional audio DSP
- **Pure Data** - Dataflow paradigm
- **Ancient Greek Philosophy** - The five elements

## Why "Aither"?

**Aither** (αἰθήρ) is the authentic Greek transliteration of the fifth element—the pure upper air that fills the cosmos. It's the substance that unifies the other four elements, just as our `f(s)` interface unifies the five paradigms.

The spelling "Aither" (not "Aether") matches the Greek paradigm names: Kanon, Rhythmos, Atomos, Physis, Chora.

## License

MIT

---

*"The universe state flows through all paradigms, like aither through the cosmos."*
