export const getWindowFunction = (length, type) => {
  const window = new Array(length);

  switch (type) {
    case "hanning":
      for (let i = 0; i < length; i++) {
        window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (length - 1)));
      }
      break;
    case "hamming":
      for (let i = 0; i < length; i++) {
        window[i] = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (length - 1));
      }
      break;
    case "triangle":
      for (let i = 0; i < length; i++) {
        window[i] = 1 - Math.abs((i - (length - 1) / 2) / (length / 2));
      }
      break;
    case "rectangular":
    default:
      for (let i = 0; i < length; i++) {
        window[i] = 1;
      }
  }

  return window;
};

const fftRecursive = (x) => {
  const N = x.length;
  if (N <= 1) return [{ re: x[0] || 0, im: 0 }];

  const even = fftRecursive(x.filter((_, i) => i % 2 === 0));
  const odd = fftRecursive(x.filter((_, i) => i % 2 === 1));

  const result = new Array(N);

  for (let k = 0; k < N / 2; k++) {
    const angle = (-2 * Math.PI * k) / N;
    const twiddle = {
      re: Math.cos(angle),
      im: Math.sin(angle),
    };

    const t = {
      re: twiddle.re * odd[k].re - twiddle.im * odd[k].im,
      im: twiddle.re * odd[k].im + twiddle.im * odd[k].re,
    };

    result[k] = {
      re: even[k].re + t.re,
      im: even[k].im + t.im,
    };

    result[k + N / 2] = {
      re: even[k].re - t.re,
      im: even[k].im - t.im,
    };
  }

  return result;
};

export const fft = (signal) => {
  const n = signal.length;
  if (n <= 1) return signal.map((x) => ({ re: x, im: 0 }));

  let N = 1;
  while (N < n) N *= 2;

  const paddedSignal = new Array(N).fill(0);
  for (let i = 0; i < n; i++) {
    paddedSignal[i] = signal[i];
  }

  return fftRecursive(paddedSignal);
};

export const analyzeAudioSegment = (
  audioData,
  startTime,
  segmentDuration,
  sampleRate,
  windowFunction,
) => {
  const startSample = Math.floor((startTime / 1000) * sampleRate);
  const segmentSamples = Math.floor((segmentDuration / 1000) * sampleRate);
  const endSample = Math.min(startSample + segmentSamples, audioData.length);

  const segment = Array.from(audioData.slice(startSample, endSample));
  const N = segment.length;

  const segWave = segment.map((amp, i) => ({
    time: (startTime + (i / sampleRate) * 1000).toFixed(2),
    amplitude: amp,
  }));

  const window = getWindowFunction(N, windowFunction);
  const windowedSegment = segment.map((val, i) => val * window[i]);

  const fftResult = fft(windowedSegment);
  const magnitude = fftResult.map((c) => Math.sqrt(c.re * c.re + c.im * c.im));

  const isEven = N % 2 === 0;
  const halfLength = isEven ? Math.floor(N / 2) + 1 : Math.floor((N + 1) / 2);
  const magnitudeHalf = magnitude.slice(0, halfLength);

  const scaled = magnitudeHalf.map((val, i) => {
    if (isEven) {
      if (i > 0 && i < N / 2) {
        return val * 2;
      }
    } else {
      if (i > 0) {
        return val * 2;
      }
    }
    return val;
  });

  const frequencies = scaled.map((_, i) =>
    ((i * sampleRate) / N).toFixed(2),
  );

  const maxFreqIndex = frequencies.findIndex((f) => parseFloat(f) > 5000);
  const displayLength = maxFreqIndex > 0 ? maxFreqIndex : frequencies.length;

  const spectrum = [];
  for (let i = 0; i < Math.min(displayLength, 500); i++) {
    spectrum.push({
      frequency: parseFloat(frequencies[i]),
      magnitude: scaled[i],
    });
  }

  const peakIndices = [];
  const avgMagnitude = scaled.reduce((sum, val) => sum + val, 0) / scaled.length;
  const threshold = avgMagnitude * 2;

  for (let i = 1; i < scaled.length - 1; i++) {
    if (
      scaled[i] > scaled[i - 1] &&
      scaled[i] > scaled[i + 1] &&
      scaled[i] > threshold
    ) {
      peakIndices.push(i);
    }
  }

  const peaks = peakIndices
    .sort((a, b) => scaled[b] - scaled[a])
    .slice(0, 5)
    .map((i) => ({
      frequency: parseFloat(frequencies[i]),
      magnitude: scaled[i],
    }))
    .sort((a, b) => a.frequency - b.frequency);

  const maxObservedFreq = parseFloat(frequencies[frequencies.length - 1]);

  return {
    segmentWaveform: segWave,
    spectrumData: spectrum,
    analysisResults: {
      segmentLength: N,
      segmentDurationMs: segmentDuration,
      sampleRate: sampleRate,
      windowType: windowFunction,
      dominantPeaks: peaks,
      maxObservedFrequency: maxObservedFreq,
      maxMagnitude: Math.max(...scaled),
    },
  };
};