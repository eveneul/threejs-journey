import * as THREE from 'three';

const canvas = document.querySelector("canvas")
const scene = new THREE.Scene();




const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "red" });
const box = new THREE.Mesh(geometry, material);



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
const tick = () => {
  requestAnimationFrame(tick)
  // 모델링의 애니메이션을 먼저 설정해 주고
  box.rotation.x -= 0.01
  box.rotation.y += 0.01

  // renderer.render()로 다시 랜더링 시켜 주기
  renderer.render(scene, camera)

}

tick();