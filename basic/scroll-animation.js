import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import gsap from "gsap";

// import gui
const gui = new GUI();

// canvas
const canvas = document.querySelector("canvas");

// size
let size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// scene
const scene = new THREE.Scene();

// textures
const textureLoader = new THREE.TextureLoader();
const gradient = textureLoader.load("/textures/gradients/3.jpg");
gradient.magFilter = THREE.NearestFilter;

// obejct

const parameters = {
  color: "#ffeded",
};

const objectsDistance = 4;

const material = new THREE.MeshToonMaterial({
  color: parameters.color,
  gradientMap: gradient,
});

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

// particles

const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 10; // x
  positions[i * 3 + 1] =
    objectsDistance * 0.4 - Math.random() * objectsDistance * 3; // y
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
}

const particlesGeomatry = new THREE.BufferGeometry();
particlesGeomatry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.color,
  sizeAttenuation: true,
  size: 0.03,
});

const particles = new THREE.Points(particlesGeomatry, particlesMaterial);
scene.add(particles);

// light
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(1, 1, 0);
scene.add(light);

// camera

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(
  35,
  size.width / size.height,
  0.1,
  100
);
camera.position.z = 6;
// scene.add(camera);
cameraGroup.add(camera);

// gui
gui.addColor(parameters, "color").onChange(() => {
  material.color.set(parameters.color);
  particlesMaterial.color.set(parameters.color);
});

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
});

renderer.setSize(size.width, size.height);
renderer.render(scene, camera);

/**
 * Scroll
 */

let scrollY = window.scrollY;
let currentSection = 0;
window.addEventListener("scroll", (event) => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / size.height);

  if (newSection != currentSection) {
    currentSection = newSection;

    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    });
  }
});

/**
 * Cursor
 */

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / size.width - 0.5;
  cursor.y = event.clientY / size.height - 0.5;
});

let now, delta;
let then = Date.now();
const interval = 1000 / 60;
const clock = new THREE.Clock();
let prevTime = 0;
const animate = () => {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  const deltaTime = time - prevTime;
  prevTime = time;

  now = Date.now();
  delta = now - then;

  if (delta < interval) return;

  // 여기에 코드 적기

  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  camera.position.y = (-scrollY / size.height) * objectsDistance;

  const parallaxX = cursor.x;
  const parallaxY = -cursor.y;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * deltaTime * 2;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * deltaTime * 2;

  //
  renderer.render(scene, camera);

  then = now - (delta % interval);
};

animate();

window.addEventListener("resize", () => {
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});
