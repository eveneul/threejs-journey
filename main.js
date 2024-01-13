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
const meterial = new THREE.MeshStandardMaterial({
  roughness: 0.4,
  color: 0xffffff,
});
const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), meterial);
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), meterial);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  meterial
);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(16, 16),
  new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
);

sphere.position.x = 1.5;
torus.position.x = -1.5;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(cube, sphere, torus, plane);

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// light

// ambientLight(컬러, 빛의 세기), 모든 위치에서 조명을 비춤
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// DirectionalLight: 명암? 그림자를 지게 하는 코드, ambientLight와 같이 색상과 세기를 받음 위치를 지정할 수 있음
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(1, 0.25, 0);
// scene.add(directionalLight);

// hemisphereLight(color, groundColor, 빛의 세기), 빛이 쐬는 방향에 색깔과 빛이 닿지 않는 곳에 색깔을 지정할 수 있음
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x000ff, 0.9);
// scene.add(hemisphereLight);

// pointLight: 거리와 감쇠를 나타냄, 세 번째 매개변수로
const pointLight = new THREE.PointLight(0xff9000, 1, 10);
pointLight.position.set(1, -0.5, 1);
// scene.add(pointLight);

// rectAreaLight(color, 강도, width, height), 스튜디오 조명 같은 효과
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 3, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
// scene.add(rectAreaLight);

// spotLight(color, 강도, 거리, 각도, 블러효과(0-1), 은은한 정도)
const spotLight = new THREE.SpotLight(
  0x78ff00,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

console.log(spotLight);

// gui.add(변수, 변수에서 조정할 값)

gui.add(spotLight, "intensity").min(0).max(3).step(0.001);
gui.add(spotLight, "distance").min(0).max(20).step(0.1);
gui.add(spotLight, "penumbra").min(0).max(1).step(0.001);
gui.add(spotLight, "decay").min(0).max(3).step(0.001);

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

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

  cube.rotation.x = 0.5 * elapsedTime;
  cube.rotation.y = 0.5 * elapsedTime;
  sphere.rotation.x = 0.5 * elapsedTime;
  sphere.rotation.y = 0.5 * elapsedTime;
  torus.rotation.x = 0.5 * elapsedTime;
  torus.rotation.y = 0.5 * elapsedTime;

  control.update();

  // renderer.render()로 다시 랜더링 시켜 주기
  renderer.render(scene, camera);

  then = now - (delta % interval);
};

tick();
