import * as THREE from 'three';

const canvas = document.querySelector("canvas")
const scene = new THREE.Scene();




const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "red" });
const box = new THREE.Mesh(geometry, material);



scene.add(box);

console.log(box.position.length())

// camera 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3

scene.add(camera);

// axes helper
const axesHelper = new THREE.AxesHelper(2); // 2: 선의 길이

scene.add(axesHelper)


const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera)