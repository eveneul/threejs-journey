import * as THREE from 'three';
import gsap from 'gsap'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

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
const material = new THREE.MeshNormalMaterial()
material.side = THREE.DoubleSide // 오브젝트 앞뒷면 둘다 보이게
// material.flatShading = true // 둥근 부분을 평평하게 (각지게)

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
  sphere.rotation.y = 0.1 * elapsedTime
  plane.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = -0.15 * elapsedTime
  plane.rotation.x = -0.15 * elapsedTime
  torus.rotation.x = -0.15 * elapsedTime

  control.update()

  // renderer.render()로 다시 랜더링 시켜 주기
  renderer.render(scene, camera)

  then = now - (delta % interval);

}



tick();