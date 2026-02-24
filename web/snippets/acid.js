// Acid — squelchy 303-style line
const note = s => {
  const seq = [130.81, 164.81, 196, 130.81, 246.94, 196, 164.81, 130.81]
  const step = Math.floor(s.t * 4) % seq.length
  return seq[step]
}
const osc = saw(note)
play('acid', pipe(
  s => osc(s) * 0.3,
  signal => lpf(signal, s => 300 + 2000 * Math.pow(Math.max(0, 1 - (s.t * 4 % 1) * 2), 3), 0.85),
  signal => delay(signal, 0.4, 0.375),
  signal => gain(signal, 0.7)
))