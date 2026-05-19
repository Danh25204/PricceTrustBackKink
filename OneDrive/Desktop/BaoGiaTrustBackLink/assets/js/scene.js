import * as THREE from 'https://esm.sh/three@0.169';

const MOBILE_BREAKPOINT = 768;
const PARTICLE_COUNT_DESKTOP = 1000;
const PARTICLE_COUNT_MOBILE = 400; // reserved — init guards on mobile
const GOLD_BRIGHT = '#FFD700';
const GOLD_MID = '#C9A227';
const PIXEL_RATIO_CAP = 1.5;

let scene, camera, renderer, particles, clock;
let origPositions, seeds;
let needsRender = false;

function detectWebGL() {
  const c = document.createElement('canvas');
  const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
  return !!gl;
}

function init(canvasEl) {
  if (window.innerWidth < MOBILE_BREAKPOINT) return;
  if (!detectWebGL()) return;

  scene = new THREE.Scene();
  clock = new THREE.Clock();

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 20;

  renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const count = PARTICLE_COUNT_DESKTOP;
  const geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(count * 3);
  origPositions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  seeds = new Float32Array(count);

  const colorBright = new THREE.Color(GOLD_BRIGHT);
  const colorMid = new THREE.Color(GOLD_MID);

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 30;
    const y = (Math.random() - 0.5) * 30;
    const z = (Math.random() - 0.5) * 20;

    positions[i * 3]     = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    origPositions[i * 3]     = x;
    origPositions[i * 3 + 1] = y;
    origPositions[i * 3 + 2] = z;

    seeds[i] = Math.random() * Math.PI * 2;

    const c = i % 2 === 0 ? colorBright : colorMid;
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));

  const material = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  needsRender = true;

  window.addEventListener('mousemove', () => { needsRender = true; });
}

function resize() {
  if (!renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  needsRender = true;
}

function render() {
  if (!needsRender || !renderer) return;

  const t = clock.getElapsedTime();
  const posAttr = particles.geometry.attributes.position;
  const posArray = posAttr.array;

  for (let i = 0; i < PARTICLE_COUNT_DESKTOP; i++) {
    posArray[i * 3 + 1] = origPositions[i * 3 + 1] + Math.sin(t * 0.5 + seeds[i]) * 0.3;
  }
  posAttr.needsUpdate = true;

  renderer.render(scene, camera);
  needsRender = false;
}

export { init, resize, render };
