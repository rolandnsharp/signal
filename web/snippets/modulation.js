// Modulation — FM synthesis playground
const modulator = sin(s => 220 * 3.01 + Math.sin(s.t * 0.1) * 20)
play('fm', pipe(
  s => {
    const modDepth = 200 + Math.sin(s.t * 0.15) * 180
    const mod = modulator(s) * modDepth
    return Math.sin(s.t * 6.2831 * (220 + mod)) * 0.15
  },
  signal => reverb(signal, 0.4, 0.5, 0.4),
  signal => pan(signal, s => Math.sin(s.t * 0.3))
))