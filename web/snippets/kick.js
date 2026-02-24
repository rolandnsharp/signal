// Kick — punchy drum hit loop
const rate = 2
play('kick', pipe(
  s => {
    const phase = (s.t * rate) % 1
    const pitch = 50 + 200 * Math.exp(-phase * 30)
    const amp = Math.exp(-phase * 8)
    return Math.sin(phase * pitch * 6.28) * amp * 0.6
  },
  signal => lpf(signal, 200, 0.3)
))