const Speaker = require('speaker');

// Signal registry for named signals (hot reload support)
const activeSignals = new Map();

// Audio configuration
const SAMPLE_RATE = 48000;
const CHANNELS = 2;  // Stereo
const BIT_DEPTH = 16;

// Global time tracker
let currentTime = 0;

// ============================================================================
// SIGNAL CLASS
// ============================================================================

class Signal {
  constructor(fns, registryName = null) {
    // Accept single function or array of functions (for multi-channel)
    this.channels = Array.isArray(fns) ? fns : [fns];
    this.isActive = true;  // Auto-start by default
    this.isFading = false;
    this.fadeStartTime = 0;
    this.fadeDuration = 0;
    this._registryName = registryName;  // Track name for re-registration
  }

  // Evaluate signal at time t
  eval(t) {
    const values = this.channels.map(fn => fn(t));
    // Return single value for mono, {left, right} for stereo
    return values.length === 1 ? values[0] : { left: values[0], right: values[1] };
  }

  // Helper to update registry and return self
  _register() {
    if (this._registryName) {
      activeSignals.set(this._registryName, this);
    }
    return this;
  }

  // Play/stop signal
  play() {
    this.isActive = true;
    this.isFading = false;
    return this;
  }

  stop(fadeTime) {
    if (fadeTime === undefined || fadeTime <= 0) {
      // Instant stop
      this.isActive = false;
      this.isFading = false;
    } else {
      // Fade out over fadeTime seconds
      this.isFading = true;
      this.fadeStartTime = currentTime;
      this.fadeDuration = fadeTime;
    }
    return this;
  }

  // ============================================================================
  // CHAINABLE METHODS
  // ============================================================================

  gain(amount) {
    return new Signal(
      this.channels.map(fn => t => fn(t) * amount),
      this._registryName
    )._register();
  }

  offset(amount) {
    return new Signal(
      this.channels.map(fn => t => fn(t) + amount),
      this._registryName
    )._register();
  }

  clip(threshold) {
    return new Signal(
      this.channels.map(fn => t => {
        const sample = fn(t);
        return Math.max(-threshold, Math.min(threshold, sample));
      }),
      this._registryName
    )._register();
  }

  fold(threshold) {
    return new Signal(
      this.channels.map(fn => t => {
        let sample = fn(t);
        while (sample > threshold) sample = 2 * threshold - sample;
        while (sample < -threshold) sample = -2 * threshold - sample;
        return sample;
      }),
      this._registryName
    )._register();
  }

  modulate(other) {
    return new Signal(
      this.channels.map((fn, i) => {
        const otherFn = other.channels[i] || other.channels[0];
        return t => fn(t) * otherFn(t);
      }),
      this._registryName
    )._register();
  }

  fx(effectFn) {
    return new Signal(
      this.channels.map(fn => t => {
        const sample = fn(t);
        return effectFn.length === 1 ? effectFn(sample) : effectFn(sample, t);
      }),
      this._registryName
    )._register();
  }

  mix(...signals) {
    return new Signal(
      this.channels.map((fn, i) => t => {
        let sum = fn(t);
        for (const sig of signals) {
          const sigFn = sig.channels[i] || sig.channels[0];
          sum += sigFn(t);
        }
        return sum;
      }),
      this._registryName
    )._register();
  }

  delay(delayTime) {
    return new Signal(
      this.channels.map(fn => t => t < delayTime ? 0 : fn(t - delayTime)),
      this._registryName
    )._register();
  }

  feedback(delayTime, feedbackAmount) {
    return new Signal(
      this.channels.map(fn => {
        const cache = new Map();
        const output = t => {
          const key = Math.round(t * SAMPLE_RATE);
          if (cache.has(key)) return cache.get(key);
          if (t < delayTime) {
            const result = fn(t);
            cache.set(key, result);
            return result;
          }
          const result = fn(t) + output(t - delayTime) * feedbackAmount;
          cache.set(key, result);
          return result;
        };
        return output;
      }),
      this._registryName
    )._register();
  }

  reverb(roomSize = 0.5, decay = 0.5, mix = 0.3) {
    const baseTimes = [0.0297, 0.0371, 0.0411, 0.0437, 0.0050, 0.0017];
    const feedback = decay * 0.7;

    return new Signal(
      this.channels.map((fn, channelIdx) => {
        // Slightly offset delay times for stereo width
        const timeMultiplier = channelIdx === 0 ? 1.0 : 1.03;
        const combFilters = baseTimes.map(baseTime => {
          const delayTime = baseTime * (0.5 + roomSize * 1.5) * timeMultiplier;
          const cache = new Map();
          const filter = t => {
            const key = Math.round(t * SAMPLE_RATE);
            if (cache.has(key)) return cache.get(key);
            if (t < delayTime) {
              const result = fn(t);
              cache.set(key, result);
              return result;
            }
            const result = fn(t) + filter(t - delayTime) * feedback;
            cache.set(key, result);
            return result;
          };
          return filter;
        });

        return t => {
          const dry = fn(t);
          const wet = combFilters.reduce((sum, f) => sum + f(t), 0) / combFilters.length;
          return dry * (1 - mix) + wet * mix;
        };
      }),
      this._registryName
    )._register();
  }

  stereo(right) {
    return new Signal(
      [this.channels[0], right.channels[0]],
      this._registryName
    )._register();
  }
}

// ============================================================================
// SIGNAL BUILDER CLASS
// ============================================================================

class SignalBuilder {
  constructor(name) {
    this.name = name;
  }

  // Custom function
  fn(signalFn) {
    const sig = new Signal(signalFn);
    activeSignals.set(this.name, sig);
    return sig;
  }

  // Helper generators
  sin(freq) {
    const sig = new Signal(t => Math.sin(2 * Math.PI * freq * t), this.name);
    activeSignals.set(this.name, sig);
    return sig;
  }

  square(freq) {
    const sig = new Signal(t => {
      const phase = (freq * t) % 1;
      return phase < 0.5 ? 1 : -1;
    }, this.name);
    activeSignals.set(this.name, sig);
    return sig;
  }

  saw(freq) {
    const sig = new Signal(t => {
      const phase = (freq * t) % 1;
      return 2 * phase - 1;
    }, this.name);
    activeSignals.set(this.name, sig);
    return sig;
  }

  tri(freq) {
    const sig = new Signal(t => {
      const phase = (freq * t) % 1;
      return 2 * Math.abs(2 * phase - 1) - 1;
    }, this.name);
    activeSignals.set(this.name, sig);
    return sig;
  }

  noise() {
    const sig = new Signal(() => Math.random() * 2 - 1, this.name);
    activeSignals.set(this.name, sig);
    return sig;
  }
}

// ============================================================================
// MAIN SIGNAL FUNCTION
// ============================================================================

function signal(nameOrFn, fn) {
  // signal('name') - returns SignalBuilder for chaining
  if (typeof nameOrFn === 'string' && fn === undefined) {
    // Auto-start audio on first signal
    if (!isPlaying) {
      startAudio();
    }
    return new SignalBuilder(nameOrFn);
  }

  // Auto-start audio on first signal (for other signatures)
  if (!isPlaying) {
    startAudio();
  }

  // signal('name', Signal) - accepts Signal objects directly
  if (typeof nameOrFn === 'string' && fn instanceof Signal) {
    activeSignals.set(nameOrFn, fn);
    return fn;
  }

  // signal('name', t => ...)
  if (typeof nameOrFn === 'string' && typeof fn === 'function') {
    const sig = new Signal(fn);
    activeSignals.set(nameOrFn, sig);
    return sig;
  }

  // signal('name', { left: ..., right: ... })
  if (typeof nameOrFn === 'string' && typeof fn === 'object' && fn.left && fn.right) {
    const sig = new Signal([fn.left, fn.right]);
    activeSignals.set(nameOrFn, sig);
    return sig;
  }

  // signal(t => ...) - unnamed signal
  if (typeof nameOrFn === 'function') {
    return new Signal(nameOrFn);
  }

  throw new Error('Invalid signal() arguments');
}

// ============================================================================
// HELPER GENERATORS
// ============================================================================

signal.sin = function(freq) {
  return new Signal(t => Math.sin(2 * Math.PI * freq * t));
};

signal.square = function(freq) {
  return new Signal(t => {
    const phase = (freq * t) % 1;
    return phase < 0.5 ? 1 : -1;
  });
};

signal.saw = function(freq) {
  return new Signal(t => {
    const phase = (freq * t) % 1;
    return 2 * phase - 1;
  });
};

signal.tri = function(freq) {
  return new Signal(t => {
    const phase = (freq * t) % 1;
    return 2 * Math.abs(2 * phase - 1) - 1;
  });
};

signal.noise = function() {
  return new Signal(() => Math.random() * 2 - 1);
};

// ============================================================================
// MODULE-LEVEL FUNCTIONS
// ============================================================================

signal.mix = function(...signals) {
  return new Signal(t => {
    let sum = 0;
    for (const sig of signals) {
      sum += sig.fn(t);
    }
    return sum;
  });
};

signal.stereo = function(left, right) {
  return new Signal([left.channels[0], right.channels[0]]);
};

// ============================================================================
// AUDIO OUTPUT
// ============================================================================

let speaker = null;
let isPlaying = false;

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

  for (let i = 0; i < samplesPerChannel; i++) {
    const t = startTime + (i / SAMPLE_RATE);

    // Mix all active signals
    let leftSample = 0;
    let rightSample = 0;

    for (const sig of activeSignals.values()) {
      // Skip if signal is stopped
      if (!sig.isActive && !sig.isFading) continue;

      // Calculate fade envelope if fading
      let fadeGain = 1.0;
      if (sig.isFading) {
        const fadeElapsed = t - sig.fadeStartTime;
        if (fadeElapsed >= sig.fadeDuration) {
          // Fade complete - stop the signal
          sig.isActive = false;
          sig.isFading = false;
          continue;
        }
        // Linear fade from 1 to 0
        fadeGain = 1.0 - (fadeElapsed / sig.fadeDuration);
      }

      const output = sig.eval(t);

      if (typeof output === 'number') {
        // Mono signal - add to both channels
        leftSample += output * fadeGain;
        rightSample += output * fadeGain;
      } else {
        // Stereo signal - add to respective channels
        leftSample += output.left * fadeGain;
        rightSample += output.right * fadeGain;
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

// ============================================================================
// REGISTRY MANAGEMENT
// ============================================================================

signal.clear = function() {
  activeSignals.clear();
};

signal.remove = function(name) {
  activeSignals.delete(name);
};

signal.list = function() {
  return Array.from(activeSignals.keys());
};


// ============================================================================
// EXPORTS
// ============================================================================

const rhythm = require('./rhythm');
const melody = require('./melody');
const envelopes = require('./envelopes');
const scales = require('./scales');
const functional = require('./functional');

module.exports = signal;
module.exports.Signal = Signal;
module.exports.SignalBuilder = SignalBuilder;
module.exports.startAudio = startAudio;
module.exports.stopAudio = stopAudio;

// Export rhythm utilities
module.exports.step = rhythm.step;
module.exports.euclidean = rhythm.euclidean;

// Export melody utilities
module.exports.freq = melody.freq;
module.exports.mtof = melody.mtof;
module.exports.ftom = melody.ftom;

// Export envelope utilities
module.exports.env = envelopes.env;

// Export scales
module.exports.scales = scales;

// Export functional utilities (Y-combinator, pipe, compose, etc.)
module.exports.Y = functional.Y;
module.exports.pipe = functional.pipe;
module.exports.compose = functional.compose;
module.exports.curry = functional.curry;
module.exports.fp = functional;  // Export all functional utilities
