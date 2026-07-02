let audioContext: AudioContext | null = null;
// Cache the decoded AudioBuffer so we only load and decode the file once
let audioBuffer: AudioBuffer | null = null;

/**
 * Safely initializes or retrieves the global AudioContext instance.
 * Ensures compatibility across standard browsers and older WebKit implementations.
 */
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

/**
 * Pre-fetches and decodes the audio clip asset.
 * Calling this early (e.g., when the app or component mounts) ensures
 * the sound plays instantly without a network delay during the trick.
 */
export async function preloadTootSound() {
  const ctx = getAudioContext();
  if (!ctx || audioBuffer) return;

  try {
    // Replace this path with the actual location of your sound file in your public directory
    const response = await fetch("/toot.mp3");
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error("Failed to load or decode toot sound clip:", error);
  }
}

/**
 * Plays the realistic pre-loaded toot audio clip.
 * Uses the Web Audio API BufferSource node for low-latency playback.
 */
export async function playTootSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Web Audio contexts often start suspended due to browser autoplay policies; resume if needed.
  void ctx.resume();

  // If the sound isn't loaded yet (e.g., played before fetch completed), try to load it on the fly.
  if (!audioBuffer) {
    await preloadTootSound();
    // If it still failed to load, abort to avoid runtime crashes.
    if (!audioBuffer) return;
  }

  const now = ctx.currentTime;

  // Create a gain node to govern master volume for this sound instance
  const output = ctx.createGain();
  output.gain.setValueAtTime(0.4, now); // Adjust master volume asset baseline here (0.0 to 1.0)
  output.connect(ctx.destination);

  // Create a buffer source node specifically designed to play back raw PCM data arrays
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;

  // Connect the source to our gain node and play immediately
  source.connect(output);
  source.start(now);
}
