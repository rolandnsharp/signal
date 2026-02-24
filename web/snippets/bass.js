// Bass — thick sub with overtone movement
const sub = sin(s => 42)
const mid = saw(s => 84)
play('bass', pipe(
  s => sub(s) * 0.4 + mid(s) * 0.15,
  signal => lpf(signal, s => 120 + Math.sin(s.t * 0.2) * 60, 0.4),
  signal => gain(signal, 0.8)
))