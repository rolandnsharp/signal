# Aither — Doof-Ready Roadmap

What's needed to take Aither from "working engine" to bush doof ready.

## DSP

- [x] Resonant SVF filters (lpf, hpf, bpf, notch)
- [ ] Compressor / limiter — protect ears and speakers
- [ ] Distortion / saturation — waveshaping beyond fold
- [ ] Chorus / flanger — short modulated delay
- [ ] Phaser — allpass chain with LFO
- [ ] Bitcrusher — sample rate and bit depth reduction
- [ ] EQ — parametric bands built on SVF

## Sequencing & Timing

- [ ] Swing — shuffle timing on phasor
- [ ] Euclidean rhythms — spread N hits over M steps
- [ ] Pattern chaining — queue next pattern without click
- [ ] Tap tempo — derive BPM from REPL taps
- [ ] Global clock sync — all signals share one master phasor

## Engine

- [ ] Deno port — drop Bun quirks, get stable TCP half-close
- [ ] JACK adapter — low-latency pro audio output via FFI
- [ ] Sample playback — load and play WAV/MP3 buffers
- [ ] Record to disk — capture output to WAV file
- [ ] CPU meter — show DSP load percentage in REPL
- [ ] Signal-level meters — peak/RMS per voice

## Live Performance

- [ ] MIDI input — CC mapping to signal parameters
- [ ] OSC input — receive from external controllers
- [ ] Scene snapshots — save/restore entire signal state
- [ ] Crossfade between scenes
- [ ] Panic button — instant silence with fade

## Reliability

- [ ] Watchdog — catch NaN/Infinity in output, auto-mute
- [ ] Graceful error recovery — bad signal doesn't kill engine
- [ ] Pre-flight check — verify audio output before first play
- [ ] Memory usage tracking — warn when helper memory is getting full

## Stretch

- [ ] Browser target — WebAudio AudioWorklet
- [ ] Multi-channel output — surround / spatial
- [ ] Network sync — multiple Aither instances locked together
- [ ] Visual scope — waveform / spectrum display in terminal
