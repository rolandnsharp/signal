# Kanon Documentation

📖 **Start Here**: [Home.md](Home.md)

## Structure

This is a markdown wiki organized into 7 sections:

1. **[Getting Started](1-getting-started/)** - Quick start, core concepts, why Bun
2. **[API Reference](2-api-reference/)** - Examples, composition styles, patterns
3. **[Synthesis Techniques](3-synthesis-techniques/)** - Delay, pitch, spectral, state
4. **[Generative Music](4-generative-music/)** - Sequences, fractals, Y-combinator
5. **[Mathematical Foundations](5-mathematical-foundations/)** - Fourier, category theory, philosophy
6. **[Advanced Topics](6-advanced-topics/)** - EM fields, Tesla, Steinmetz, JS features
7. **[Implementation](7-implementation/)** - Audio backends, performance, optimization

## Navigation

- All files have breadcrumb navigation at the top
- Related Topics sections link to related docs
- Works in GitHub, GitBook, VS Code, or any markdown viewer

## Old Files

The old ALL-CAPS `.md` files in this directory are the originals before migration. Once you've verified the wiki works, you can delete:
- AUDIO_OPTIONS.md → moved to 7-implementation/Audio-Options.md
- BUN-JACK-IMPLEMENTATION.md → moved to 7-implementation/Bun-Jack.md
- CATEGORY-THEORY-PLOTINUS-MONAD.md → moved to 5-mathematical-foundations/Category-Theory.md
- (and all other CAPS files)

## Files Still Need API Updates

These files are migrated but still contain some old Signal API examples that should be converted to functional kanon style:
- DELAY-AND-FEEDBACK.md
- PITCH-BENDING.md
- EXAMPLES.md

The content is there and readable - just some code examples use the old `.sin().gain()` chaining style instead of pure functions.

## Philosophy

From [Kanon-Flux Duality](5-mathematical-foundations/Kanon-Flux-Duality.md):

> **Kanon** = The eternal blueprint (`f(t)`)
> **Flux** = The living manifestation (`f(state)`)

Sound as a function of time - the Pythagorean approach to synthesis.

---

**Quick Links**:
- [Quick Start](1-getting-started/Quick-Start.md) - Make sound in 5 minutes
- [Core Concepts](1-getting-started/Core-Concepts.md) - Philosophy and API
- [Examples](2-api-reference/Examples.md) - Code patterns
- [Kanon-Flux Duality](5-mathematical-foundations/Kanon-Flux-Duality.md) - The philosophy
