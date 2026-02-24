// Haunt — ghostly pad with slow drift
const v1 = sin(s => 220 + Math.sin(s.t * 0.07) * 3)
const v2 = sin(s => 330 + Math.sin(s.t * 0.09) * 4)
const v3 = sin(s => 440 + Math.sin(s.t * 0.11) * 5)
play('haunt', pipe(
  s => (v1(s) + v2(s) + v3(s)) * 0.06,
  signal => reverb(signal, 0.8, 0.7, 0.6),
  signal => lpf(signal, s => 800 + Math.sin(s.t * 0.05) * 400, 0.2),
  signal => pan(signal, s => Math.sin(s.t * 0.13) * 0.7)
))