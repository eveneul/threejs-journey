import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

// import gui
const gui = new GUI();

// canvas
const canvas = document.querySelector("canvas");

// scene
const scene = new THREE.Scene();

// obejct
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: "red" })
);
scene.add(mesh);

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
ambientLight.position.set(0, 1, 1);
scene.add(ambientLight);

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.z = 5;
scene.add(camera);

// controller
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

let now, delta;
let then = Date.now();
const interval = 1000 / 60;
const clock = new THREE.Clock();
const animate = () => {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  now = Date.now();
  delta = now - then;

  if (delta < interval) return;

  // 여기에 코드 적기
  control.update();
  renderer.render(scene, camera);

  then = now - (delta % interval);
};

animate();
