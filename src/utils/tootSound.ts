let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;

  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextClass) return null;

  audioContext ??= new AudioContextClass();
  return audioContext;
}

export function playTootSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  void ctx.resume();

  const now = ctx.currentTime;
  const output = ctx.createGain();
  output.gain.setValueAtTime(0.0001, now);
  output.gain.exponentialRampToValueAtTime(0.3, now + 0.045);
  output.gain.setValueAtTime(0.28, now + 0.38);
  output.gain.exponentialRampToValueAtTime(0.0001, now + 1.35);
  output.connect(ctx.destination);

  const lowTone = ctx.createOscillator();
  lowTone.type = "sawtooth";
  lowTone.frequency.setValueAtTime(118, now);
  lowTone.frequency.exponentialRampToValueAtTime(58, now + 1.18);
  lowTone.connect(output);
  lowTone.start(now);
  lowTone.stop(now + 1.38);

  const wobble = ctx.createOscillator();
  const wobbleGain = ctx.createGain();
  wobble.type = "square";
  wobble.frequency.setValueAtTime(7, now);
  wobbleGain.gain.setValueAtTime(0.0001, now);
  wobbleGain.gain.exponentialRampToValueAtTime(18, now + 0.08);
  wobbleGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
  wobble.connect(wobbleGain);
  wobbleGain.connect(lowTone.frequency);
  wobble.start(now);
  wobble.stop(now + 1.2);

  const squeak = ctx.createOscillator();
  const squeakGain = ctx.createGain();
  squeak.type = "triangle";
  squeak.frequency.setValueAtTime(290, now + 0.16);
  squeak.frequency.exponentialRampToValueAtTime(145, now + 0.55);
  squeakGain.gain.setValueAtTime(0.0001, now);
  squeakGain.gain.exponentialRampToValueAtTime(0.07, now + 0.2);
  squeakGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);
  squeak.connect(squeakGain);
  squeakGain.connect(output);
  squeak.start(now + 0.14);
  squeak.stop(now + 0.66);

  const noiseBuffer = ctx.createBuffer(
    1,
    ctx.sampleRate * 0.86,
    ctx.sampleRate,
  );
  const samples = noiseBuffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) {
    const progress = index / samples.length;
    const envelope = Math.sin(progress * Math.PI) * (1 - progress * 0.35);
    samples[index] = (Math.random() * 2 - 1) * envelope;
  }

  const noise = ctx.createBufferSource();
  const noiseGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(520, now);
  filter.frequency.exponentialRampToValueAtTime(180, now + 0.9);
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.18, now + 0.09);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.06);
  noise.buffer = noiseBuffer;
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(output);
  noise.start(now + 0.02);
  noise.stop(now + 1.08);
}
