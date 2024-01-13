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

/* Texture Loader */
const textureLoader = new THREE.TextureLoader();
const matcapTextuer = textureLoader.load("/textures/matcaps/1.png");
console.log(matcapTextuer, "matcapTextuer");
// matcapTexture.colorSpace = THREE.SRGBColorSpace

/* Font */

const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Marshot", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5, // 둥근 정도, 숫자가 낮으면 각져보인다
    bevelEnabled: true, //

    bevelThickness: 0.03, // 텍스트의 굵기 (z축으로)
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4, // 둥근 부분에 segements, 숫자가 높으면 더 정교함
  });

  /* 처음에 로드되면 텍스트가 중앙에 위치하지 않은데, 중앙에 위치하도록 설정 */
  // 어려운 방법..
  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -textGeometry.boundingBox.max.x * 0.5,
  //   -textGeometry.boundingBox.max.y * 0.5,
  //   -textGeometry.boundingBox.max.z * 0.5
  // );

  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTextuer,
  });
  // textMaterial.wireframe = true;

  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTextuer });
  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;
    donut.rotation.z = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.x = scale;
    donut.scale.y = scale;
    donut.scale.z = scale;

    scene.add(donut);
  }
});

const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
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
