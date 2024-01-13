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

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: "#a9c388" })
);

floor.position.y = 0;
floor.rotation.x = -Math.PI * 0.5;

scene.add(floor);

// House: new THREE.Group <= 크기 조정하면 한 번에 조정되게 그룹핑

const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({ color: "#ac8e82" })
);
walls.position.y = walls.geometry.parameters.height / 2;

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);

roof.position.y =
  walls.geometry.parameters.height + roof.geometry.parameters.height / 2;

roof.rotation.y = Math.PI * 0.25;

house.add(walls, roof);

/* Light */
/* 그림자 영향을 받는 조명: directional, point, shot */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(ambientLight, directionalLight);

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 4;
camera.position.y = 5;
camera.position.x = -2;
camera.lookAt(new THREE.Vector3());

scene.add(camera);

/* Gui Setting */

const guiLightFolder = gui.addFolder("light");
guiLightFolder.add(ambientLight, "intensity").min(0).max(10).step(0.001);
guiLightFolder.add(directionalLight, "intensity").min(0).max(10).step(0.001);

const guiCameraFolder = gui.addFolder("camera");
guiCameraFolder.add(camera.position, "x").min(-5).max(10).step(0.01);
guiCameraFolder.add(camera.position, "y").min(-5).max(10).step(0.01);
guiCameraFolder.add(camera.position, "z").min(-5).max(10).step(0.01);

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

  control.update();

  // renderer.render()로 다시 랜더링 시켜 주기
  renderer.render(scene, camera);

  then = now - (delta % interval);
};

tick();
