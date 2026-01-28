const kanon = require('../src/index');
const { sequence, during, mix, gain, loop } = require('../src/functional');
const { mtof } = require('../src/melody');

// ============================================================================
// INSTRUMENTS
// ============================================================================

const sine = freq => t => Math.sin(2 * Math.PI * freq * t);

const sawtooth = freq => t => {
  const x = t * freq;
  return 2 * (x - Math.floor(x + 0.5));
};

// ============================================================================
// SECTION 1 (0s - 12s)
// ============================================================================

const melodyMotif = sequence(
  [sine(mtof(60)), 0.25], [sine(mtof(62)), 0.25],
  [sine(mtof(64)), 0.25], [sine(mtof(65)), 0.25],
  [sine(mtof(67)), 0.5]
);

const bassMotif = sequence(
  [sine(mtof(48)), 0.75], [sine(mtof(50)), 0.75]
);

const section1 = mix(
  gain(0.4, loop(8, 1.5, melodyMotif)),
  gain(0.5, loop(8, 1.5, bassMotif)),
  gain(0.2, during(0, 12, sine(mtof(36)))) // Pad for this section
);

// ============================================================================
// SECTION 2 (12s - 24s)
// ============================================================================

const arpeggioMotif = sequence(
  [sawtooth(mtof(72)), 0.125], [sawtooth(mtof(76)), 0.125],
  [sawtooth(mtof(79)), 0.125], [sawtooth(mtof(84)), 0.125]
);

const newBassMotif = sequence(
  [sine(mtof(52)), 0.75], [sine(mtof(55)), 0.75]
);

const section2 = mix(
  gain(0.4, loop(24, 0.5, arpeggioMotif)), // 24 * 0.5s = 12s
  gain(0.5, loop(8, 1.5, newBassMotif))   // 8 * 1.5s = 12s
);

// ============================================================================
// FINAL COMPOSITION
// ============================================================================

const finalPiece = mix(
  during(0, 12, section1),
  during(12, 24, section2)
);

// Register the final composition with Kanon to be played
kanon('first-piece', finalPiece);

console.log("Composition 'first-piece' is now playing.");
console.log("This piece has two sections and will play for 24 seconds.");
console.log("You can stop it by pressing Ctrl+C.");