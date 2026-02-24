// Scope — oscilloscope art via signal processing
// Switch the scope to X-Y mode to see Lissajous geometry
const fA = 120, fB = fA * 4 / 3  // 3:4 ratio
const xBase = sin(s => fA)
const yBase = sin(s => fB + 1)    // +1 Hz detune → slow rotation
const xHarm = tri(s => fA * 2)
const yHarm = saw(s => fB * 3)
const morph = sin(s => 0.07)
play('scope', s => {
  const m = morph(s) * 0.3
  const L = xBase(s) * 0.7 + xHarm(s) * m
  const R = yBase(s) * 0.7 + yHarm(s) * m
  return [L, R]
})