import { init, resize, render } from './scene.js';
import { initScrollAnimations } from './animations.js';

function bootstrap() {
  const canvas = document.getElementById('particle-canvas');

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    canvas.classList.add('hidden');
    return;
  }

  init(canvas);
  resize();
  window.addEventListener('resize', resize);

  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.add(render);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    gsap.from('.hero__tagline, .brand-logo, .brand-name', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
    });
    initScrollAnimations();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
