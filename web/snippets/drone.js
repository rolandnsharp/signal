// Drone — deep evolving texture
const o1 = saw(s => 55)
const o2 = saw(s => 55.1)
const o3 = sin(s => 110.3)
const sub = sin(s => 27.5)
play('drone', pipe(
  s => (o1(s) + o2(s)) * 0.1 + o3(s) * 0.08 + sub(s) * 0.15,
  signal => lpf(signal, s => 200 + Math.sin(s.t * 0.03) * 120, 0.5),
  signal => feedback(signal, 0.8, 0.4, 0.6),
  signal => pan(signal, s => Math.sin(s.t * 0.07) * 0.5)
))