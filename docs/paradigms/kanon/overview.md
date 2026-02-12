# Kanon Paradigm (Fire 🔥)

> *"All is Number."* — Pythagoras

## Philosophy

**Kanon** (κανών) - Ancient Greek for "rule" or "measuring rod" - was the monochord instrument Pythagoras used to discover that harmony is mathematical ratio.

In Aether, **Kanon** represents the **pure functional paradigm**: sound as a stateless function that uses only time.

### The Pythagorean View

Kanon treats sound as **eternal geometry** that exists timelessly. When you write a Kanon signal, you're not simulating a process—you're **observing a crystalline structure** that exists in its entirety.

- Sound waves are **timeless blueprints**
- Harmony is **mathematical ratio** (3:2, 4:3, φ)
- The universe is a **pre-existing block of perfection**
- The Music of the Spheres doesn't *happen*—it simply **is**

---

## The Unified Interface

**Like all Aether paradigms**, Kanon uses the universal signature:

```javascript
f(s) → sample
```

**The Kanon style**: Use only `s.t` from the universe state. Ignore everything else.

```javascript
// Kanon style - pure function of time
register('sine', s => Math.sin(2 * Math.PI * 440 * s.t));
```

Where:
- `s.t` = absolute time (seconds)
- `sample` = audio value at that moment

**Pure function**: No state, no history, just pure mathematics.

---

## Use Cases

✅ **Perfect for:**
- Mathematical demonstrations
- Teaching harmonic relationships
- Modulation sources for other paradigms
- Compositions with absolute time coordinates
- Exploring divine proportions and ratios

⚠️ **Not ideal for:**
- Smooth hot-reload (will pop on non-periodic changes)
- Feedback or IIR filters (need recursion/memoization)
- State-dependent synthesis

---

## Quick Example

```javascript
// Pure functions of time using s.t
register('sine440', s => Math.sin(2 * Math.PI * 440 * s.t));
register('sine660', s => Math.sin(2 * Math.PI * 660 * s.t));

// Perfect fifth harmony (3:2 ratio) with composition
register('harmony', s => {
  const a = Math.sin(2 * Math.PI * 440 * s.t);
  const b = Math.sin(2 * Math.PI * 660 * s.t);
  return (a + b) * 0.5;
});

// Or using helpers
register('harmony-piped',
  pipe(
    s => Math.sin(2 * Math.PI * 440 * s.t) + Math.sin(2 * Math.PI * 660 * s.t),
    gain(0.5)
  )
);
```

---

## Core Principles

### 1. Purity

Every Kanon function is **referentially transparent**:
```javascript
f(5.0) === f(5.0)  // Always!
```

No hidden state, no side effects. Just pure math.

### 2. Timelessness

The entire signal exists **eternally**. You can evaluate any point:
```javascript
const signal = t => Math.sin(2 * Math.PI * 440 * t);

signal(0.0);    // Beginning
signal(5.0);    // 5 seconds in
signal(100.0);  // 100 seconds in

// All exist simultaneously in the eternal Now
```

### 3. Composability

Functions compose beautifully:
```javascript
const fundamental = t => Math.sin(2 * Math.PI * 220 * t);
const fifth = t => Math.sin(2 * Math.PI * 330 * t);  // 3:2 ratio

const harmony = t => fundamental(t) + fifth(t);
```

---

## Trade-offs

### ✅ Advantages

- **Mathematical purity**: Elegant, beautiful, educational
- **Random access**: Can evaluate any time point independently
- **Composability**: Functions combine naturally
- **Reproducible**: Same input always gives same output
- **Platform-independent**: Pure functions work anywhere

### ⚠️ Limitations

- **Hot-reload pops**: Non-periodic functions will have discontinuities
- **No phase memory**: Can't do smooth frequency changes without analysis
- **Performance**: Naive recursion can be expensive (use memoization)

---

## When to Use Kanon vs Rhythmos

Both paradigms use `f(s)`, but emphasize different parts:

Use **Kanon style** (`s.t` only) when:
- Exploring mathematical relationships
- Teaching concepts
- Creating modulation sources
- You don't care about hot-reload discontinuities
- Purity matters more than smoothness

Use **Rhythmos style** (`s.state`, `s.sr`) when:
- Performing live with hot-reload
- Need smooth parameter changes
- Building production instruments
- Phase continuity is essential

**Or use both in the same signal!**

```javascript
register('kanon-rhythmos-mix', s => {
  // Kanon: Pure modulation
  const lfo = Math.sin(2 * Math.PI * 0.5 * s.t);

  // Rhythmos: Phase-continuous carrier
  const freq = 440 + lfo * 20;
  s.state[0] = (s.state[0] + freq / s.sr) % 1.0;
  return Math.sin(s.state[0] * 2 * Math.PI) * 0.3;
});
```

---

## Advanced Topics

### Recursive Functions

Kanon supports recursion + memoization for complex patterns:

```javascript
// Feedback using memoization
export const feedback = curry((delayTime, feedbackAmt, fn, sampleRate = 48000) => {
  const cache = new Map();

  const output = t => {
    const key = Math.round(t * sampleRate);
    if (cache.has(key)) return cache.get(key);

    if (t < delayTime) {
      return fn(t);
    }

    const dry = fn(t);
    const wet = output(t - delayTime) * feedbackAmt;
    return dry + wet;
  };

  return output;
});
```

### Y-Combinator

Anonymous recursion without self-reference:

```javascript
export const Y = makeRecursive => {
  const wrapper = recursiveFunc => makeRecursive(
    (...args) => recursiveFunc(recursiveFunc)(...args)
  );
  return wrapper(wrapper);
};

// Use for generative patterns, fractals, L-systems
```

See [Y-Combinator Music](generative/y-combinator.md) for deep dive.

### Time-Based Composition

```javascript
// Play function during time interval
export const during = curry((start, end, fn) => t => {
  if (t >= start && t < end) {
    return fn(t - start);
  }
  return 0;
});

// Sequence functions
export const sequence = (...pairs) => t => {
  let accumulatedTime = 0;
  for (const [fn, duration] of pairs) {
    if (t >= accumulatedTime && t < accumulatedTime + duration) {
      return fn(t - accumulatedTime);
    }
    accumulatedTime += duration;
  }
  return 0;
});
```

---

## Working with Kanon

### Registration

```javascript
// Register a Kanon-style signal (uses only s.t)
register('my-kanon-signal', s => {
  return Math.sin(2 * Math.PI * 440 * s.t);
});
```

### Composition with Helpers

All Aether helpers work with Kanon signals since everything uses `f(s)`:

```javascript
// Compose with pipe
register('composed',
  pipe(
    s => Math.sin(2 * Math.PI * 440 * s.t),
    gain(0.5),
    lowpass(800)
  )
);

// Or manually
register('manual', s => {
  const osc = Math.sin(2 * Math.PI * 440 * s.t);
  // Apply helpers inline
  return osc * 0.5;
});
```

### Common Kanon Patterns

```javascript
// Modulation source (LFO)
const lfo = s => Math.sin(2 * Math.PI * 0.5 * s.t);

// FM synthesis
register('fm', s => {
  const modulator = Math.sin(2 * Math.PI * 110 * s.t) * 5;
  return Math.sin(2 * Math.PI * 440 * s.t + modulator) * 0.3;
});

// Harmonic series
register('harmonics', s => {
  let sum = 0;
  for (let i = 1; i <= 8; i++) {
    sum += Math.sin(2 * Math.PI * 220 * i * s.t) / i;
  }
  return sum * 0.1;
});

// Time-based envelope
register('envelope', s => {
  const envelope = Math.exp(-s.t * 2);
  const osc = Math.sin(2 * Math.PI * 440 * s.t);
  return osc * envelope * 0.5;
});
```

---

## Further Reading

- **[Quick Start](quick-start.md)** - Your first Kanon signals
- **[Pure Functions](pure-functions.md)** - Deep dive into functional programming
- **[Composition](composition.md)** - Function composition techniques
- **[Generative Music](generative/)** - Y-combinator, fractals, L-systems
- **[State vs Recursion](../../advanced/state-vs-recursion.md)** - Pure functional approaches

---

## The Beautiful Truth

> "Kanon without Rhythmos is mathematics without music.
> Rhythmos without Kanon is sound without soul."

Use Kanon to **discover the eternal forms**.

Use Rhythmos to **breathe life into them**.

---

**Next**: [Quick Start Guide](quick-start.md) | [Philosophy](../../PHILOSOPHY.md)
