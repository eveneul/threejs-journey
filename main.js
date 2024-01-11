import * as THREE from 'three';
import gsap from 'gsap'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const canvas = document.querySelector("canvas")
const scene = new THREE.Scene();

console.log(gsap)




const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "red" });
const box = new THREE.Mesh(geometry, material);
// box.position.set(1, 1, -2)



scene.add(box);


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

  box.rotation.y = Math.sin(elapsedTime)
  box.rotation.x = Math.cos(elapsedTime)
  control.update()

  // renderer.render()로 다시 랜더링 시켜 주기
  renderer.render(scene, camera)

  then = now - (delta % interval);

}



tick();