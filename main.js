import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

const canvas = document.querySelector("canvas");

// scene 생성
const scene = new THREE.Scene();

// texture

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/11.png");

// object 생성
const count = 5000; // 파티클 개수
const positions = new Float32Array(count * 3);
const particlesGeometry = new THREE.BufferGeometry();

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true, //원근감
  alphaMap: particleTexture,
  transparent: true,
  depthTest: false,
});

// particle

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// texture 생성

// light 생성
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// camera 생성
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.z = 5;
camera.lookAt(new THREE.Vector3());
scene.add(camera);

// orbitcontrol

const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

// renderer

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// animate 함수

let now, delta;
let then = Date.now();
const fps = 60;
const interval = 1000 / fps;
const clock = new THREE.Clock();

const animate = () => {
  requestAnimationFrame(animate);
  now = Date.now();
  delta = now - then;
  const time = clock.getElapsedTime();

  if (delta < interval) return;

  renderer.render(scene, camera);
  control.update();

  then = now - (delta % interval);
};

animate();
