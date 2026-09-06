import { useEffect } from 'react';

/**
 * useAnimatedFavicon
 * Dynamically animates the browser tab favicon featuring Mishuk Babu's photo
 * surrounded by a rotating, pulsing radiant neon halo ring.
 */
export function useAnimatedFavicon(avatarSrc: string = '/favicon.png') {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    let link: HTMLLinkElement | null = document.getElementById('dynamic-favicon') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.id = 'dynamic-favicon';
      link.rel = 'icon';
      link.type = 'image/png';
      document.head.appendChild(link);
    }

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = avatarSrc;

    let angle = 0;
    let animId: number | null = null;
    let lastTime = 0;
    const fpsInterval = 1000 / 12; // 12 FPS is smooth for favicons while extremely lightweight

    const render = (time: number) => {
      animId = requestAnimationFrame(render);

      // Pause when tab is not active to conserve CPU & battery
      if (document.hidden) return;

      if (time - lastTime < fpsInterval) return;
      lastTime = time;

      angle = (angle + 0.08) % (Math.PI * 2);

      ctx.clearRect(0, 0, 64, 64);

      // 1. Draw outer animated rotating ring
      ctx.save();
      ctx.translate(32, 32);
      ctx.rotate(angle);

      const grad = ctx.createLinearGradient(-32, -32, 32, 32);
      grad.addColorStop(0, '#06b6d4'); // Cyan
      grad.addColorStop(0.5, '#3b82f6'); // Blue
      grad.addColorStop(1, '#f59e0b'); // Amber

      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = grad;
      ctx.stroke();
      ctx.restore();

      // 2. Draw user photo circular clipped
      ctx.save();
      ctx.beginPath();
      ctx.arc(32, 32, 25, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 7, 7, 50, 50);
      } else {
        // Fallback placeholder while image loads
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 64, 64);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MB', 32, 32);
      }
      ctx.restore();

      // 3. Inner border for crisp contrast
      ctx.beginPath();
      ctx.arc(32, 32, 25, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.stroke();

      // 4. Update favicon href
      if (link) {
        link.href = canvas.toDataURL('image/png');
      }
    };

    img.onload = () => {
      animId = requestAnimationFrame(render);
    };

    // If already loaded from cache
    if (img.complete) {
      animId = requestAnimationFrame(render);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [avatarSrc]);
}
