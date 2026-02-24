// Lorenz — chaotic attractor mapped to audio
play('lorenz', s => {
  const dt = 0.0001
  // store x, y, z in state slots
  if (s.state[0] === 0 && s.state[1] === 0) {
    s.state[0] = 0.1   // x
    s.state[1] = 0      // y
    s.state[2] = 0      // z
  }
  const sigma = 10, rho = 28, beta = 8 / 3
  for (let i = 0; i < 8; i++) {
    const x = s.state[0], y = s.state[1], z = s.state[2]
    s.state[0] += sigma * (y - x) * dt
    s.state[1] += (x * (rho - z) - y) * dt
    s.state[2] += (x * y - beta * z) * dt
  }
  const L = s.state[0] * 0.01
  const R = s.state[1] * 0.01
  return [Math.tanh(L), Math.tanh(R)]
})