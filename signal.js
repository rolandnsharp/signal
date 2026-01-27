// signal.js - KANON Live-Coding Interface
// ============================================================================
// LIVE CODING: Edit this file while audio is playing for instant updates!
// ============================================================================

// ============================================================================
// PATTERN 2: STATEFUL (JavaScript state - TRUE LIVE SURGERY!)
// ============================================================================
// Return {graph, update} where update() manages persistent state.
// Phase/state survives edits = ZERO CLICKS when changing parameters!

wave('live-drone', (t, state) => {
  return {
    graph: mul(0, t),  // Dummy graph (we generate samples in update)
    update: () => {
      // === LIVE EDIT THESE PARAMETERS ===
      const baseFreq = 796;   // Try: 110, 220, 330, 440 (no clicks!)
      const detune = 2;       // Try: 0.5, 2, 5, 10, 20 (chorus width)
      const lfoRate = 0.3;    // Try: 0.1, 0.5, 1.0, 2.0 (pulsing speed)

      // Voice frequencies with detuning
      const freq1 = baseFreq;
      const freq2 = baseFreq + detune;
      const freq3 = baseFreq - (detune * 1.5);
      const freq4 = baseFreq + (detune * 2.2);

      // === VOICE 1 (state slot 0) ===
      let phase1 = state[0] || 0;
      phase1 = (phase1 + freq1 / 44100) % 1.0;
      state[0] = phase1;
      const osc1 = Math.sin(phase1 * 2 * Math.PI);

      // === VOICE 2 (state slot 1) ===
      let phase2 = state[1] || 0;
      phase2 = (phase2 + freq2 / 44100) % 1.0;
      state[1] = phase2;
      const osc2 = Math.sin(phase2 * 2 * Math.PI);

      // === VOICE 3 (state slot 2) ===
      let phase3 = state[2] || 0;
      phase3 = (phase3 + freq3 / 44100) % 1.0;
      state[2] = phase3;
      const osc3 = Math.sin(phase3 * 2 * Math.PI);

      // === VOICE 4 (state slot 3) ===
      let phase4 = state[3] || 0;
      phase4 = (phase4 + freq4 / 44100) % 1.0;
      state[3] = phase4;
      const osc4 = Math.sin(phase4 * 2 * Math.PI);

      // Mix the 4 voices
      const mix = (osc1 + osc2 + osc3 + osc4) * 0.25;

      // === LFO for amplitude modulation (state slot 10) ===
      let lfoPhase = state[10] || 0;
      lfoPhase = (lfoPhase + lfoRate / 44100) % 1.0;
      state[10] = lfoPhase;
      const lfo = Math.sin(lfoPhase * 2 * Math.PI);

      // LFO range: 0.5 to 1.0 (pulsing, never silent)
      const lfoAmt = lfo * 0.25 + 0.75;

      // Apply LFO and output gain
      return mix * lfoAmt * 0.4;
    }
  };
});


// ============================================================================
// PATTERN 1: SIMPLE (Pure genish - fast, but phase resets on edit)
// ============================================================================
// Just return a genish graph. Best for effects, filters, static patches.
// Phase resets when you edit, but changes are instant.

// Try uncommenting this for fast genish-compiled sine:
// wave('fast-sine', (t) => mul(cycle(440), 0.5));


// ============================================================================
// STATE BUFFER ORGANIZATION (Float32Array[128])
// ============================================================================
// Organize your state slots to avoid conflicts:
//
//   0-19:   Oscillator phases (carriers, subs, leads)
//   20-39:  LFO phases, modulators
//   40-59:  Envelopes, smoothers
//   60-69:  Beat clocks, sequencer positions
//   70-89:  Filter history (y[n-1], y[n-2], etc.)
//   90-109: Delay/reverb buffers (when using JavaScript)
//   110-127: User experiments
//
// The state buffer persists across all code changes, enabling true live surgery!
// ============================================================================
