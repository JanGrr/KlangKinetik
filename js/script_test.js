// Initialisiere Three.js und erstelle Szene, Kamera und Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lade das 360° Bild
const texture = new THREE.TextureLoader().load('../images/panorama.jpeg');

// Erstelle eine Kugelgeometrie für das 360° Bild
const geometry = new THREE.SphereGeometry(500, 60, 40);
const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Setze die Kamera-Position
camera.position.set(0, 0, 0.1);
console.log("neuste Version 1");

// Hinzufügen von Gyrosensor-Steuerung
import { DeviceOrientationControls } from '../three.js-r105/examples/jsm/controls/DeviceOrientationControls.js';
const controls = new DeviceOrientationControls(camera);
controls.connect();

// Animations-Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Starte die Animation
animate();