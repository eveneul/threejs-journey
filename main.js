import * as THREE from 'three';
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GUI from 'lil-gui';
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader" // 배경 추가



/* GUI (Debug) 설정 */
const gui = new GUI()

const canvas = document.querySelector("canvas")
const scene = new THREE.Scene();



/* Texture */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg")
const doorAlphaColorTexture = textureLoader.load("/textures/door/alpha.jpg")
const doorAmbientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg")
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg")
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg")
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg")
const matcapTexture = textureLoader.load("/textures/matcaps/1.png")
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg")

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

/* Object */

// MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial({
//   // map: doorColorTexture,
//   // color: "green"
  
// })

// material.color = "green" <= 작동하지 않음
// material.color = new THREE.Color("green") <= 클래스로 보내 줘야 함
// material.wireframe = true

// opacity는 alpha를 조절해야 하기 때문에 transparent를 추가해 줘야 함
// material.transparent = true
// material.opacity = 0.5
// material.alphaMap = doorColorTexture

// material.side = THREE.DoubleSide // 오브젝트 앞뒷면 둘다 보이게

// MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial()
// material.side = THREE.DoubleSide // 오브젝트 앞뒷면 둘다 보이게
// material.flatShading = true // 둥근 부분을 평평하게 (각지게)

// MeshMatcapMaterial: 색상의 명암을 나타내 줄 수 있음/빛이 있는 것마냥 (조명이 필요없음)
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture 

// MeshDepthMaterial: 카메라를 가까이하면 보이고, 멀리하면 안 보임
// const material = new THREE.MeshDepthMaterial()

// // MeshLambertMaterial: 조명이 필요함 
// const material = new THREE.MeshLambertMaterial();
// material.side = THREE.DoubleSide;

// MeshPhongMaterial: 곡선 부분을 더 부드럽게
// const material = new THREE.MeshPhongMaterial();
// material.side = THREE.DoubleSide;
// material.shininess = 100; // 반짝이는 정도
// material.specular = new THREE.Color(0x1188ff) // 반짝이는 컬러

// // MeshToonMaterial: 카툰 효과 (예: 젤다)
// const material = new THREE.MeshToonMaterial();

// MeshStandardMaterial: 옵션이 많아서 자주 쓰임
// const material = new THREE.MeshStandardMaterial({
//   metalness: 0.7,
//   roughness: 0.2,
//   map: doorColorTexture,
//   aoMap: doorAmbientOcclusionTexture,
//   aoMapIntensity: 1,
//   displacementMap: doorHeightTexture,
//   wireframe: false,
//   displacementScale: 0.1
  
// });

// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture // 빛에 반응

const material = new THREE.MeshPhysicalMaterial();
  material.metalness =  0;
  material.roughness =  0;
//   material.map =  doorColorTexture;
//   material.aoMap =  doorAmbientOcclusionTexture;
//   material.aoMapIntensity =  1;
//   material.displacementMap =  doorHeightTexture;
//   material.wireframe =  false;
//   material.displacementScale = 0.1
// // material.alphaMap = doorAlphaColorTexture;
//   material.transparent = true


//   // Clearcoat 
// material.clearcoat = 1;
// material.clearcoatRoughness = 0
material.ior = 1.5
material.thickness = 0.5
material.transmission = 1



gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);


material.side = THREE.DoubleSide;

/* Light */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;

// scene.add(ambientLight)
// scene.add(pointLight)

/* background map loader */
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2k.hdr", (map) => {
  map.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = map;
  scene.environment = map
})


/* Object */

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  material
)

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  material
)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32), material
)

sphere.position.x = 1.5;
torus.position.x = -1.5;

scene.add(sphere, plane, torus)


// camera 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3



scene.add(camera);

// axes helper
const axesHelper = new THREE.AxesHelper(2); // 2: 선의 길이

scene.add(axesHelper)


const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// animation

let now, delta;
let then = Date.now();
const interval = 1000 / 60

const clock = new THREE.Clock();


// control
const control = new OrbitControls(camera, canvas);
control.enableDamping = true

// requestAnimationFrame


const tick = () => {

  //elapsed time: 경과시간
  const elapsedTime = clock.getElapsedTime();


  requestAnimationFrame(tick)
  now = Date.now();
  delta = now - then;
  if (delta < interval) return;
  // 모델링의 애니메이션을 먼저 설정해 주고
  // Update object
  // sphere.rotation.y = 0.1 * elapsedTime
  // plane.rotation.y = 0.1 * elapsedTime
  // torus.rotation.y = 0.1 * elapsedTime

  // sphere.rotation.x = -0.15 * elapsedTime
  // plane.rotation.x = -0.15 * elapsedTime
  // torus.rotation.x = -0.15 * elapsedTime

  control.update()

  // renderer.render()로 다시 랜더링 시켜 주기
  renderer.render(scene, camera)

  then = now - (delta % interval);

}



tick();