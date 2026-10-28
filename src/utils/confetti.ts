/**
 * Lightweight dynamic loader for canvas-confetti.
 * Prevents bundling canvas-confetti in the initial critical JavaScript payload.
 */
export async function fireConfetti(options?: import('canvas-confetti').Options): Promise<void> {
  try {
    const confettiModule = await import('canvas-confetti');
    const confetti = (confettiModule.default || confettiModule) as typeof import('canvas-confetti');
    confetti(options);
  } catch (err) {
    console.debug('Confetti effect skipped:', err);
  }
}
