export function initScrollAnimations() {
  gsap.from('.service-card', {
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#services',
      start: 'top 80%',
      once: true,
    },
  });

  gsap.from('.pricing-card', {
    y: 30,
    opacity: 0,
    scale: 0.97,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.pricing-card',
      start: 'top 85%',
      once: true,
    },
  });

  gsap.from('#contact', {
    scale: 0.95,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 80%',
      once: true,
    },
  });

  gsap.fromTo('#cta-float',
    { x: 80, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 3 }
  );
}
