[Home](../Home.md) > [Getting Started](#) > Quick Start

# Quick Start

Get making sound with Kanon in 5 minutes.

## Installation

```bash
npm install @rolandnsharp/kanon
# or
bun add @rolandnsharp/kanon
```

## Your First Sound

Create a file `my-session.js`:

```javascript
const kanon = require('@rolandnsharp/kanon');

// A 440Hz sine wave - the concert A
kanon('sine', t => Math.sin(2 * Math.PI * 440 * t) * 0.3);
```

Run it:

```bash
bun src/runner.js my-session.js
```

You should hear a pure sine tone!

## Live Coding

The magic of Kanon is **hot reloading**. While the runner is active, edit your session file:

```javascript
const kanon = require('@rolandnsharp/kanon');

// Change the frequency - save and hear it instantly!
kanon('sine', t => Math.sin(2 * Math.PI * 554 * t) * 0.3);  // C# instead of A
```

Save the file and the change happens immediately without restarting.

## Multiple Sounds

Register multiple functions:

```javascript
const kanon = require('@rolandnsharp/kanon');

// Bass note
kanon('bass', t => Math.sin(2 * Math.PI * 110 * t) * 0.4);

// Melody note
kanon('melody', t => Math.sin(2 * Math.PI * 440 * t) * 0.2);

// High sparkle
kanon('sparkle', t => Math.sin(2 * Math.PI * 1760 * t) * 0.1);
```

All registered functions mix together automatically.

## Stereo Sound

Return an array `[left, right]` for stereo:

```javascript
// Binaural beats - slightly different frequencies per ear
kanon('binaural', t => [
  Math.sin(2 * Math.PI * 440 * t) * 0.3,  // Left ear: 440Hz
  Math.sin(2 * Math.PI * 445 * t) * 0.3   // Right ear: 445Hz (5Hz beat)
]);
```

## Using Helpers

Import helper modules for common tasks:

```javascript
const kanon = require('@rolandnsharp/kanon');
const { pipe, gain, mix } = require('@rolandnsharp/kanon/src/functional');
const { freq, mtof } = require('@rolandnsharp/kanon/src/melody');
const { step } = require('@rolandnsharp/kanon/src/rhythm');
const scales = require('@rolandnsharp/kanon/src/scales');

// Create a simple melody
kanon('melody', t => {
  const s = step(t, 120, 8);  // 120 BPM, 8th notes
  const degree = [0, 2, 4, 5, 7][s.index % 5];  // Major scale pattern
  const f = freq(440, scales.major, degree);
  const envelope = Math.exp(-5 * s.phase);  // Exponential decay

  return Math.sin(2 * Math.PI * f * t) * envelope * 0.3;
});
```

## The Pattern

Every sound in Kanon follows this pattern:

```
time (t) → function → sample
```

That's it. A function that takes time and returns a number (mono) or `[left, right]` (stereo).

## Stop a Sound

To remove a function from the mix:

```javascript
kanon.remove('bass');  // Remove the bass sound
```

Or clear everything:

```javascript
kanon.clear();  // Silence
```

## Next Steps

- **[Core Concepts](Core-Concepts.md)** - Understand the philosophy and `f(t)` approach
- **[Examples](../2-api-reference/Examples.md)** - More code examples
- **[Composition Styles](../2-api-reference/Composition-Styles.md)** - Different ways to structure your code

## Tips

1. **Start Simple** - One sine wave, then build complexity
2. **Use Low Volumes** - Keep amplitudes around 0.2-0.4 per sound
3. **Experiment** - Change numbers and save to hear results instantly
4. **Read Error Messages** - The runner shows errors without crashing

## Common First Experiments

### Experiment 1: Frequency Sweep
```javascript
kanon('sweep', t => Math.sin(2 * Math.PI * (100 + t * 50) * t) * 0.3);
```

### Experiment 2: Tremolo (Volume Oscillation)
```javascript
kanon('tremolo', t => {
  const carrier = Math.sin(2 * Math.PI * 440 * t);
  const modulator = Math.sin(2 * Math.PI * 5 * t) * 0.5 + 0.5;  // 5Hz, 0-1 range
  return carrier * modulator * 0.3;
});
```

### Experiment 3: Perfect Fifth (3:2 Ratio)
```javascript
kanon('fifth', t => {
  const fundamental = Math.sin(2 * Math.PI * 220 * t);
  const fifth = Math.sin(2 * Math.PI * 220 * 1.5 * t);  // 3:2 ratio
  return (fundamental + fifth) * 0.2;
});
```

Welcome to Kanon. Now go make some eternal geometry audible. 🎵

---

**Next**: [Core Concepts](Core-Concepts.md) | **See Also**: [Examples](../2-api-reference/Examples.md)
