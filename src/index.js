const Speaker = require('speaker');

// Kanon registry for named functions (hot reload support)
const registry = new Map();

// Audio configuration
const SAMPLE_RATE = 48000;
const CHANNELS = 2;  // Stereo
const BIT_DEPTH = 16;

// Global time tracker
let currentTime = 0;

// Speaker instance
let speaker = null;
let isPlaying = false;

// ============================================================================
// CORE KANON FUNCTION
// ============================================================================

function kanon(name, fn) {
  // Auto-start audio on first kanon
  if (!isPlaying) {
    startAudio();
  }

  // Register the function
  registry.set(name, fn);

  return fn;
}

// ============================================================================
// REGISTRY MANAGEMENT
// ============================================================================

kanon.list = function() {
  return Array.from(registry.keys());
};

kanon.remove = function(name) {
  registry.delete(name);
};

kanon.clear = function() {
  registry.clear();
};

// ============================================================================
// AUDIO OUTPUT
// ============================================================================

function startAudio() {
  if (isPlaying) return;

  speaker = new Speaker({
    channels: CHANNELS,
    bitDepth: BIT_DEPTH,
    sampleRate: SAMPLE_RATE
  });

  isPlaying = true;
  currentTime = 0;

  // Generate audio in chunks
  const BUFFER_SIZE = 4096;
  const buffer = Buffer.alloc(BUFFER_SIZE * CHANNELS * (BIT_DEPTH / 8));

  function writeNextBuffer() {
    if (!isPlaying) return;

    fillBuffer(buffer, currentTime);
    currentTime += BUFFER_SIZE / SAMPLE_RATE;

    speaker.write(buffer, writeNextBuffer);
  }

  writeNextBuffer();
}

function fillBuffer(buffer, startTime) {
  const samplesPerChannel = buffer.length / CHANNELS / (BIT_DEPTH / 8);
  const dt = 1 / SAMPLE_RATE;

  for (let i = 0; i < samplesPerChannel; i++) {
    const t = startTime + (i * dt);

    // Mix all registered functions
    let leftSample = 0;
    let rightSample = 0;

    for (const fn of registry.values()) {
      const output = fn(t);

      if (typeof output === 'number') {
        // Mono signal - add to both channels
        leftSample += output;
        rightSample += output;
      } else if (Array.isArray(output)) {
        // Stereo signal [left, right]
        leftSample += output[0];
        rightSample += output[1];
      }
    }

    // Clamp to [-1, 1]
    leftSample = Math.max(-1, Math.min(1, leftSample));
    rightSample = Math.max(-1, Math.min(1, rightSample));

    // Convert to 16-bit integer
    const leftInt = Math.floor(leftSample * 32767);
    const rightInt = Math.floor(rightSample * 32767);

    // Write to buffer (little-endian)
    const offset = i * CHANNELS * (BIT_DEPTH / 8);
    buffer.writeInt16LE(leftInt, offset);
    buffer.writeInt16LE(rightInt, offset + 2);
  }
}

function stopAudio() {
  isPlaying = false;
  if (speaker) {
    speaker.end();
    speaker = null;
  }
}

kanon.stopAudio = stopAudio;

// Handle cleanup on exit
process.on('SIGINT', () => {
  stopAudio();
  process.exit(0);
});

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = kanon;
