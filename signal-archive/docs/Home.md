# Kanon Documentation Wiki

> **Kanon** (κανών): Ancient Greek for "rule" or "measuring rod" — the monochord instrument Pythagoras used to discover that harmony is mathematical ratio.

## Welcome

Kanon is a pure functional audio synthesis library where **sound is a function of time**: `t → sample`

This wiki contains everything from getting started to deep mathematical and philosophical explorations of sound synthesis.

## Philosophy

Kanon embodies the **Pythagorean approach** to sound:
- Sound as eternal geometry that exists timelessly
- Functions of time reveal crystalline structures
- Discover divine proportions: Golden Ratio (φ), perfect ratios (3:2, 4:3)
- "All is Number" - the universe as pre-existing mathematical perfection

## Quick Navigation

### 🚀 Getting Started
- **[Quick Start](1-getting-started/Quick-Start.md)** - Make sound in 5 minutes
- **[Core Concepts](1-getting-started/Core-Concepts.md)** - Understanding `kanon(name, fn)`
- **[Why Bun?](1-getting-started/Why-Bun.md)** - Tail call optimization for infinite recursion

### 📚 API Reference
- **[Examples](2-api-reference/Examples.md)** - Code examples and patterns
- **[Composition Styles](2-api-reference/Composition-Styles.md)** - Different ways to compose functions
- **[Drum Loop Patterns](2-api-reference/Drum-Loop-Patterns.md)** - Rhythm programming

### 🎛️ Synthesis Techniques
- **[Delay and Feedback](3-synthesis-techniques/Delay-And-Feedback.md)** - Echo and feedback loops
- **[Pitch Bending](3-synthesis-techniques/Pitch-Bending.md)** - Frequency modulation
- **[State and Recursion](3-synthesis-techniques/State-And-Recursion.md)** - Stateful synthesis
- **[Spectral Music](3-synthesis-techniques/Spectral-Music.md)** - Frequency domain techniques

### 🌀 Generative Music
- **[Generative Sequences](4-generative-music/Generative-Sequences.md)** - Algorithmic composition
- **[Y-Combinator Music](4-generative-music/Y-Combinator.md)** - Recursion without names
- **[Musical Fractals](4-generative-music/Musical-Fractals.md)** - Self-similar patterns
- **[Constraint-Based Composition](4-generative-music/Constraint-Based.md)** - Rule-based music

### 📐 Mathematical Foundations
- **[Fourier Transform](5-mathematical-foundations/Fourier-Transform.md)** - Spectral processing
- **[Category Theory & Plotinus](5-mathematical-foundations/Category-Theory.md)** - Monads and emanation
- **[Kanon-Flux Duality](5-mathematical-foundations/Kanon-Flux-Duality.md)** - Being vs Becoming
- **[Missing Profound Concepts](5-mathematical-foundations/Missing-Concepts.md)** - Future explorations

### ⚡ Advanced Topics
- **[EM Fields and Music](6-advanced-topics/EM-Fields.md)** - Electromagnetic analogies
- **[Tesla Longitudinal Waves](6-advanced-topics/Tesla-Waves.md)** - Resonance and standing waves
- **[Steinmetz Conjugate Synthesis](6-advanced-topics/Steinmetz.md)** - Complex number approach
- **[JavaScript Features](6-advanced-topics/JavaScript-Features.md)** - Advanced JS techniques

### ⚙️ Implementation
- **[Audio Options](7-implementation/Audio-Options.md)** - Audio backend configuration
- **[Bun JACK Implementation](7-implementation/Bun-Jack.md)** - JACK audio backend
- **[Performance Optimization](7-implementation/Performance.md)** - Speed and efficiency

## Core API

```javascript
const kanon = require('@rolandnsharp/kanon');

// Register a function of time
kanon('sine', t => Math.sin(2 * Math.PI * 440 * t) * 0.3);

// Stereo output
kanon('binaural', t => [
  Math.sin(2 * Math.PI * 440 * t) * 0.3,  // Left
  Math.sin(2 * Math.PI * 445 * t) * 0.3   // Right
]);

// Registry management
kanon.list()        // Get all function names
kanon.remove(name)  // Remove a function
kanon.clear()       // Clear all functions
```

## Learning Paths

### Path 1: Practical Synthesis
1. [Quick Start](1-getting-started/Quick-Start.md)
2. [Examples](2-api-reference/Examples.md)
3. [Composition Styles](2-api-reference/Composition-Styles.md)
4. [Delay and Feedback](3-synthesis-techniques/Delay-And-Feedback.md)
5. [Generative Sequences](4-generative-music/Generative-Sequences.md)

### Path 2: Mathematical Exploration
1. [Core Concepts](1-getting-started/Core-Concepts.md)
2. [Kanon-Flux Duality](5-mathematical-foundations/Kanon-Flux-Duality.md)
3. [Fourier Transform](5-mathematical-foundations/Fourier-Transform.md)
4. [Category Theory](5-mathematical-foundations/Category-Theory.md)
5. [Musical Fractals](4-generative-music/Musical-Fractals.md)

### Path 3: Deep Functional Programming
1. [Why Bun?](1-getting-started/Why-Bun.md)
2. [State and Recursion](3-synthesis-techniques/State-And-Recursion.md)
3. [Y-Combinator Music](4-generative-music/Y-Combinator.md)
4. [JavaScript Features](6-advanced-topics/JavaScript-Features.md)

### Path 4: Experimental & Esoteric
1. [Tesla Longitudinal Waves](6-advanced-topics/Tesla-Waves.md)
2. [EM Fields and Music](6-advanced-topics/EM-Fields.md)
3. [Steinmetz Conjugate Synthesis](6-advanced-topics/Steinmetz.md)
4. [Missing Profound Concepts](5-mathematical-foundations/Missing-Concepts.md)

## Contributing

Found an error or have an improvement? This is a living document that grows with the community's exploration of sound.

## Philosophy Summary

> "In Kanon, we ask: **'What is the perfect number?'**
>
> We contemplate: **'What is a fifth?'**
>
> Kanon without sound is mathematics at rest.
> Kanon with sound is number made audible."

From [Kanon-Flux Duality](5-mathematical-foundations/Kanon-Flux-Duality.md):
- **Kanon** = The eternal blueprint (`f(t)`)
- **Flux** = The living manifestation (`f(state)`)

Welcome to the exploration of eternal harmonic truth. 🎵

---

**Next**: Start with [Quick Start](1-getting-started/Quick-Start.md) to make your first sounds, or dive into [Core Concepts](1-getting-started/Core-Concepts.md) to understand the philosophy.
