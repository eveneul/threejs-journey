import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"; // 배경 추가
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json"; // font import
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

/* GUI (Debug) 설정 */
const gui = new GUI();

const canvas = document.querySelector("canvas");

const scene = new THREE.Scene();

/* Object */

const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), material);
const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), material);
sphere.position.y = 0.5;
sphere.castShadow = true; // 그림자를 만들 객체에 castShadow
box.position.set(-2, 0, -3);
box.castShadow = true;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;
plane.receiveShadow = true; // 그림자를 받을 객체에 receiveShadow
scene.add(sphere, plane, box);

/* Light */
/* 그림자 영향을 받는 조명: directional, point, shot */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 3, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

console.log(directionalLight.shadow, directionalLight);

scene.add(directionalLight);

gui.add(directionalLight, "intensity").min(1).max(10).step(0.01);
gui.add(directionalLight.position, "x").min(0).max(10).step(0.1);
gui.add(directionalLight.position, "y").min(0).max(10).step(0.1);
gui.add(directionalLight.position, "z").min(0).max(10).step(0.1);
gui.add(directionalLight.shadow.mapSize, "x").min(100).max(1000).step(1);
gui.add(directionalLight.shadow.mapSize, "y").min(100).max(1000).step(1);
gui.add(directionalLight.shadow.mapSize, "width").min(100).max(2048).step(1);
gui.add(directionalLight.shadow.mapSize, "height").min(100).max(2048).step(1);
gui.add(directionalLight.shadow.camera, "near").min(0.1).max(10).step(0.001);
gui.add(directionalLight.shadow.camera, "far").min(0.1).max(1000).step(0.001);
gui.add(directionalLight.shadow, "radius").min(0.1).max(1000).step(0.001);

// const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(lightHelper);

const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
helper.visible = false;
scene.add(helper);

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;
camera.position.y = 5;
camera.position.x = -5;
camera.lookAt(new THREE.Vector3());

scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true; // 렌더러에게 섀도우 맵을 처리하라고 지시
renderer.shadowMap.type = THREE.PCFShadowMap; // 그림자 가장자리가 더 자연스러워지게 블러처리..?

// animation

let now, delta;
let then = Date.now();
const interval = 1000 / 60;

const clock = new THREE.Clock();

// control
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

// requestAnimationFrame

const tick = () => {
  //elapsed time: 경과시간
  const elapsedTime = clock.getElapsedTime();

  requestAnimationFrame(tick);
  now = Date.now();
  delta = now - then;
  if (delta < interval) return;
  // 모델링의 애니메이션을 먼저 설정해 주고

  box.rotation.x = 0.5 * elapsedTime;
  box.rotation.y = 0.5 * elapsedTime;
  box.rotation.z = 0.5 * elapsedTime;

  control.update();

  // renderer.render()로 다시 랜더링 시켜 주기
  renderer.render(scene, camera);

  then = now - (delta % interval);
};

tick();
