// Tesla — resonant coil discharge
const base = saw(s => 55 + Math.sin(s.t * 0.1) * 10)
const buzz = sin(s => 880 * (1 + Math.sin(s.t * 7) * 0.5))
play('tesla', pipe(
  s => base(s) * 0.3 + buzz(s) * 0.05,
  signal => lpf(signal, s => 600 + Math.sin(s.t * 3) * 400, 0.8),
  signal => fold(signal, 1.2),
  signal => delay(signal, 0.15, 0.15),
  signal => pan(signal, s => Math.sin(s.t * 1.3))
))