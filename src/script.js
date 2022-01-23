import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { Float32BufferAttribute, Mesh, Vector3 } from "three";

//Canvas
const canvas = document.querySelector(".webgl");

//Scene
const scene = new THREE.Scene();

//GUI
const gui = new dat.GUI();

//Textures
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

grassColorTexture.repeat.set(8, 8);
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;

grassAmbientOcclusionTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;

grassNormalTexture.repeat.set(8, 8);
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;

grassRoughnessTexture.repeat.set(8, 8);
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Resize

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});

//Objects

//==================
//House
//==================

const house = new THREE.Group();
scene.add(house);

//Walls
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 1;
house.add(walls);

//Roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(4, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0xb35f45 })
);
roof.position.y = 2.75;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

//Door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    normalMap: doorNormalTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.position.z = 2 + 0.01;
door.position.y = 1;
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
house.add(door);

//Bushes
const bush1 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0x00ff0f })
);
bush1.position.z = 2;
bush1.position.x = 1.5;
bush1.position.y = 0.1;
house.add(bush1);

const bush2 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.3, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0x00ff0f })
);
bush2.position.z = 2;
bush2.position.x = 1;
house.add(bush2);

const bush3 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.4, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0x00ff0f })
);
bush3.position.z = 2;
bush3.position.x = -1.1;
bush3.position.y = 0.1;
house.add(bush3);

const bush4 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.15, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0x00ff0f })
);
bush4.position.z = 2;
bush4.position.x = -1.6;
house.add(bush4);

//Fog
const fog = new THREE.Fog(0x262837, 1, 15);
scene.fog = fog;

//Light
const pointLight = new THREE.PointLight(0xff7d46, 1, 7);
pointLight.position.set(0, 2.4, 2.1);
house.add(pointLight);

//=================
// Graves
//=================

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 1, 0.25);
const graveMaterial = new THREE.MeshStandardMaterial();

for (let i = 0; i < 50; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  const angle = Math.PI * Math.random() * 2;
  const radius = 3 + Math.random() * 6;

  grave.position.x = Math.sin(angle) * radius;
  grave.position.z = Math.cos(angle) * radius;
  //   grave.position.y = Math.random() - 0.5;

  grave.rotation.z = (Math.random() - 0.5) * 0.3;
  grave.rotation.y = (Math.random() - 0.5) * 0.3;

  grave.castShadow = true;

  scene.add(grave);
}

//Ghosts
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
scene.add(ghost1);

const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(ghost3);

const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);

floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

//Lights
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.01);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.01);
gui.add(moonLight.position, "x").min(-10).max(10).step(0.01);
gui.add(moonLight.position, "y").min(-10).max(10).step(0.01);
gui.add(moonLight.position, "z").min(-10).max(10).step(0.01);
scene.add(moonLight);

//Shadows

moonLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(4, 2, 5);
scene.add(camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x262837);
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);

//Tick

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  ghost1.position.x = Math.sin(elapsedTime * Math.PI * 0.3) * 6;
  ghost1.position.z = Math.cos(elapsedTime * Math.PI * 0.3) * 6;

  ghost2.position.x = Math.sin(-elapsedTime * Math.PI * 0.1) * 6;
  ghost2.position.z = Math.cos(-elapsedTime * Math.PI * 0.1) * 6;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  ghost3.position.x = Math.sin(-elapsedTime * Math.PI * 0.2) * 7;
  ghost3.position.z = Math.cos(-elapsedTime * Math.PI * 0.2) * 7;
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
  //Update Camera
  //   camera.lookAt(new THREE.Vector3());
  camera.position.x = Math.sin(elapsedTime * Math.PI * 0.2) * 10;
  camera.position.z = Math.cos(elapsedTime * Math.PI * 0.2) * 10;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
