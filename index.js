import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas, antialias : true, alpha: false});
  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  let seMovio = false;
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  window.addEventListener('click', (event) => {
    seMovio = true;
  });
  window.addEventListener('touch-move', (event) => {
    seMovio = true;
  });

  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#00485B');

  {
    const skyColor = 0xFFFFFF;  // light blue
    const groundColor = 0x1002000;  // brownish orange
    const intensity = 1;
    const light = new THREE.AmbientLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
    const color = 0xffffff;
    const intensity = 0.15;
    const light2 = new THREE.PointLight(color, intensity);
    const light3 = new THREE.PointLight(color, intensity);
    const light6 = new THREE.PointLight(color, intensity);
    const light4 = new THREE.PointLight(color, intensity);
    const light1 = new THREE.DirectionalLight(color, 0.1);
    const light5 = new THREE.DirectionalLight(color, 0.1);
    light1.position.set(1.6,9,0);
    light2.position.set(1,1,10);
    
    light3.position.set(-3.7,1,0); // -1.1 0.2 -5
    light4.position.set(3.7,1,0);
   light5.position.set(3.7,1,0);
   light6.position.set(-1.1,0.2,-5);
    scene.add(light1);
    //scene.add(light2);
    //scene.add(light3);
    //scene.add(light4);
    //scene.add(light6);
   scene.add(light5);
   scene.add(light1.target);
  scene.add(light5.target);
}

  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = (new THREE.Vector3())
        .subVectors(camera.position, boxCenter)
        .multiply(new THREE.Vector3(1, 0, 1))
        .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  }

  function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
  }

  let wires;
  let cerebros;
  let domo;
  let cerebro;
  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('resources/Brain_003.gltf', (gltf) => {
      const root = gltf.scene;
      scene.add(root);
      console.log(dumpObject(root).join('\n'));
      domo = root.getObjectByName("BrainDomo");
      wires = root.getObjectByName("BrainWire");
      cerebro = root.getObjectByName("BrainSolid")
      cerebros = root.getObjectByName('Brain');
      domo.visible = false;
      wires.material.transparent = true;
      wires.material.opacity =0.6;
      cerebro.material.transparent = true;
      cerebro.material.opacity = 1;
      cerebro.material.shininess = 0;
      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(cerebros);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      frameArea(boxSize * 0.025, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      controls.target.copy(boxCenter);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.update();
    });
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    if(cerebros && !seMovio){
        cerebros.rotation.y = time/8;
    }


    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
