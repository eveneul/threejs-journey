import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import gsap from "gsap";
import CANNON from "cannon";

const canvas = document.querySelector("canvas");

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

const scene = new THREE.Scene();

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
  })
);

sphere.castShadow = true;
sphere.position.y = 0.5;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: 0x777777,
    metalness: 0.3,
    roughness: 0.4,
  })
);

floor.rotation.x = -Math.PI * 0.5;
floor.receiveShadow = true;

scene.add(sphere, floor);

/**
 * Physics
 */

const world = new CANNON.World();

// 중력 추가
world.gravity.set(0, -9.82, 0);

// body 만들기
const sphereShape = new CANNON.Sphere(0.5);
const sphereBody = new CANNON.Body({
  mass: 1, //질량
  position: new CANNON.Vec3(0, 3, 0),
  shape: sphereShape,
});

world.add(sphereBody);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);

directionalLight.castShadow = true;
directionalLight.position.set(5, 5, 5);

scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.set(-3, 3, 3);
scene.add(camera);

const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const clock = new THREE.Clock();
let oldTime = 0;

const tick = () => {
  const time = clock.getElapsedTime();
  const delta = time - oldTime;
  oldTime = time;

  // Update Physics world
  world.step(
    1 / 60, // 고정된 시간(60 프레임으로 실행시키기)
    delta,
    3
  );
  // sphere.position.x = sphereBody.position.x;
  // sphere.position.y = sphereBody.position.y;
  // sphere.position.z = sphereBody.position.z;
  sphere.position.copy(sphereBody.position);

  control.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.updateProjectionMatrix();
});
