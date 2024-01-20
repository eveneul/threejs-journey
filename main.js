import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

const canvas = document.querySelector("canvas");

// gui
const gui = new GUI();

// scene 생성
const scene = new THREE.Scene();

// texture

// const textureLoader = new THREE.TextureLoader();
// const particleTexture = textureLoader.load("/textures/particles/1.png");

// object 생성

/**
 * parameter
 */

const parameter = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPow: 3,
  insideColor: "#ff6030",
  outsideColor: "#1b3984",
};

/*
우주
*/
// gui로 parameter를 변경하면 기존에 생성된 오브젝트를 파괴하지 않으려고 하기에 지역변수를 전역변수로 변경한다

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
  geometry = new THREE.BufferGeometry();

  if (points !== null) {
    // 해당 변수를 할당하기 전 해당 변수가 먼저 존재하는지 테스트
    // 그리고 이미 mesh가 존재한다면 기존 것을 파괴해 버리고 gui로 설정한 값을 따르게 함
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  const position = new Float32Array(parameter.count * 3); // x, y, z
  const colors = new Float32Array(parameter.count * 3);
  const insideColor = new THREE.Color(parameter.insideColor);
  const outsideColor = new THREE.Color(parameter.outsideColor);

  for (let i = 0; i < parameter.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameter.radius;
    const spinAngle = radius * parameter.spin;
    const branchAngle =
      ((i % parameter.branches) / parameter.branches) * Math.PI * 2;

    // 랜덤

    const randomX =
      Math.pow(Math.random(), parameter.randomnessPow) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameter.randomnessPow) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameter.randomnessPow) *
      (Math.random() < 0.5 ? 1 : -1);

    if (i < 10) {
      console.log(randomX, randomY, randomZ);
    }

    position[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    position[i3 + 1] = randomY;
    position[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = insideColor.clone();
    mixedColor.lerp(outsideColor, radius / parameter.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }

  material = new THREE.PointsMaterial({
    size: parameter.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

// gui

gui
  .add(parameter, "count")
  .min(100)
  .max(300000)
  .step(1)
  .onFinishChange(generateGalaxy); // 값을 변경하면 바로바로 변경이 안 되기 때문에 mesh를 만든 해당 함수를 업데이트 해 주어야 함

gui
  .add(parameter, "size")
  .min(0.01)
  .max(10)
  .step(0.01)
  .onFinishChange(generateGalaxy);

gui
  .add(parameter, "spin")
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy);

gui
  .add(parameter, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);

gui
  .add(parameter, "randomnessPow")
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy);
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
camera.position.y = 2;
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
  // particles.rotation.y = time * 0.2;

  renderer.render(scene, camera);
  control.update();

  then = now - (delta % interval);
};

animate();
