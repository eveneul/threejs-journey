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

/* Texture */
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

// 잔디 모양을 작게 만들기
grassColorTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

// 잔디 모양 작게 만든 후 해야 할 오류 수정
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/* Object */

const grass = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    normalMap: grassNormalTexture,
    aoMap: grassAmbientOcclusionTexture,
    roughnessMap: grassRoughnessTexture,
  })
);

grass.position.y = 0;
grass.rotation.x = -Math.PI * 0.5;

scene.add(grass);

// House: new THREE.Group <= 크기 조정하면 한 번에 조정되게 그룹핑

const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    normalMap: bricksNormalTexture,
    aoMap: bricksAmbientOcclusionTexture,
    roughnessMap: bricksRoughnessTexture,
    transparent: true,
  })
);
walls.position.y = walls.geometry.parameters.height / 2;

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);

roof.position.y =
  walls.geometry.parameters.height + roof.geometry.parameters.height / 2;

roof.rotation.y = Math.PI * 0.25;

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    transparent: true,
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);

door.position.y = door.geometry.parameters.height / 2;
door.position.z = door.geometry.parameters.height + 0.01;

const bushesGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushesMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushesGeometry, bushesMaterial);
const bush2 = new THREE.Mesh(bushesGeometry, bushesMaterial);
const bush3 = new THREE.Mesh(bushesGeometry, bushesMaterial);
const bush4 = new THREE.Mesh(bushesGeometry, bushesMaterial);

bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.7, 0.1, 2.2);

bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(walls, roof, door, bush1, bush2, bush3, bush4);

// 무덤
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  grave.castShadow = true;
  grave.position.set(x, graveGeometry.parameters.height / 2, z);
  graves.add(grave);
}

/* Light */
/* 그림자 영향을 받는 조명: directional, point, shot */

const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);

const directionalLight = new THREE.DirectionalLight("#b9d5ff", 0.26);
scene.add(ambientLight, directionalLight);

const doorLight = new THREE.PointLight("#ff7d46", 3, 7);
doorLight.position.set(0, 2.2, 2.8);
house.add(doorLight);

/* 유령 */
const ghost1 = new THREE.PointLight("#ff00ff", 6, 3);
const ghost2 = new THREE.PointLight("#00ffff", 6, 3);
const ghost3 = new THREE.PointLight("#ffff00", 6, 3);

scene.add(ghost1, ghost2, ghost3);

/* 안개 */
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

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

/**
 * Shadow
 */

ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
directionalLight.castShadow = true;
doorLight.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

grass.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

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
renderer.setClearColor("#262837");
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
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

  // Update ghost
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(ghost1Angle * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(ghost2Angle * 3);

  const ghost3Angle = -elapsedTime * 0.17;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime) * 0.32);
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime) * 0.5);
  ghost3.position.y = Math.sin(ghost3Angle * 2);
  control.update();

  // renderer.render()로 다시 랜더링 시켜 주기
  renderer.render(scene, camera);

  then = now - (delta % interval);
};

tick();