// Ping — rhythmic metallic pings
const rate = 3
play('ping', pipe(
  s => {
    const phase = (s.t * rate) % 1
    const amp = Math.exp(-phase * 12)
    const f = 1200 + Math.sin(s.t * 0.5) * 400
    return Math.sin(phase * f * 6.28) * amp * 0.3
  },
  signal => hpf(signal, 400, 0.3),
  signal => delay(signal, 0.2, 0.166),
  signal => pan(signal, s => Math.sin(s.t * rate * 6.28) * 0.8)
))