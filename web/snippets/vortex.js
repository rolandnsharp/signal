// Vortex — spiraling stereo feedback
const phi = 1.618
const vort = sin(s => 162 * phi + Math.sin(s.t * 0.3) * 80)
play('vortex', pipe(
  s => vort(s) * 0.1,
  signal => feedback(signal, 1.5, s => 0.3 + Math.sin(s.t * phi * 0.4) * 0.2, 0.7),
  signal => highpass(signal, 30),
  signal => pan(signal, s => Math.sin(s.t * phi * 0.6))
))