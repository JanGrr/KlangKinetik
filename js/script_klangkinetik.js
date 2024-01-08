// setup for 360° image of stage that turns by turning phone
// first idea was to use a 360 video instead of an static image, but sadly I couldnt find a single good 360° festival video

// adjust values for X- & Y-Axis in DeviceOrientationControls.js, so it just moves in Z-Axis

// start with initialising Three.js creating a scene, camera and renderer
import { DeviceOrientationControls } from '../three.js-r105/examples/jsm/controls/DeviceOrientationControls.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.7);
document.getElementById('stage-container').appendChild(renderer.domElement);

// load the 360° image
const texture = new THREE.TextureLoader().load('../images/stage.jpg');

// create Spheregeometry for the 360° image
const geometry = new THREE.SphereGeometry(500, 60, 40);  // 500, 60, 40 can be adjusted, but seems fine for now
const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// set camera-position
camera.position.set(0, 0, 0);

// add gyrosensor-movement
// Did some Changed in three.js-r105/examples/jsm/controls/DeviceOrientationControls.js
const controls = new DeviceOrientationControls(camera);
controls.connect();

// animation-loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// start animation
animate();

// to reload and adjust the page when switching from portrait to landscape format or vice versa
window.addEventListener("orientationchange", function() {
    location.reload();
});