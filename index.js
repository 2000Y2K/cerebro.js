import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';
//import {RectAreaLightUniformsLib} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/lights/RectAreaLightUniformsLib.js';
//import {RectAreaLightHelper} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/helpers/RectAreaLightHelper.js';
import {GUI} from './dat.gui.module.js';

function main() {
  const canvas = document.querySelector('#c');
  
  const renderer = new THREE.WebGLRenderer({canvas, antialias : true, alpha: true});
  //RectAreaLightUniformsLib.init();
  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.01;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  let seMovio = false;
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, -5, 0);
  controls.minDistance = 8;
  window.addEventListener('click', (event) => {
    seMovio = true;
  });
  window.addEventListener('touchstart', (event) => {
    seMovio = true;
  });
//   class DegRadHelper {
//     constructor(obj, prop) {
//       this.obj = obj;
//       this.prop = prop;
//     }
//     get value() {
//       return THREE.MathUtils.radToDeg(this.obj[this.prop]);
//     }
//     set value(v) {
//       this.obj[this.prop] = THREE.MathUtils.degToRad(v);
//     }
//   }



  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }


  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#00485B'); // 00485B

  {
    const skyColor = 0xffffff;  // light blue
    const groundColor = 0xffffff;  // brownish orange
    const intensity = 0.3;
    const light = new THREE.HemisphereLight(groundColor,skyColor, intensity);
    scene.add(light);
  }

  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
  }



  {
    const color = 0xffffff;
    const intensity = 0.15;
    const light2 = new THREE.PointLight(color, intensity);
    const light3 = new THREE.PointLight(color, intensity);
    const light6 = new THREE.PointLight(color, intensity);
    const light4 = new THREE.PointLight(color, intensity);
    const light1 = new THREE.DirectionalLight(color, 0.5);
    const light5 = new THREE.DirectionalLight(color, 0.5);
    light1.position.set(1.6,9,0);
    light2.position.set(1,1,10);
    
    light3.position.set(-3.7,1,0); // -1.1 0.2 -5
    light4.position.set(3.7,1,0);
   light5.position.set(-9.820,9,0);
   light6.position.set(-1.1,0.2,-5);
  //   scene.add(light1);
  //   scene.add(light2);
  //   scene.add(light3);
  //   scene.add(light4);
  //   scene.add(light6);
  //  scene.add(light5);
  //  scene.add(light1.target);
  // scene.add(light5.target);
}

  // {
  //   const color = 0xFFFFFF;
  //   const intensity = 5;
  //   const width = 12;
  //   const height = 12;
  //   const light = new THREE.RectAreaLight(color, intensity, width, height);
  //   light.position.set(0, 10, 0);
  //   light.rotation.x = THREE.MathUtils.degToRad(-90);
  //   scene.add(light);

  //   const helper = new RectAreaLightHelper(light);
  //   light.add(helper);

  //   const gui = new GUI();
  //   gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
  //   gui.add(light, 'intensity', 0, 10, 0.01);
  //   gui.add(light, 'width', 0, 20);
  //   gui.add(light, 'height', 0, 20);
  //   gui.add(new DegRadHelper(light.rotation, 'x'), 'value', -180, 180).name('x rotation');
  //   gui.add(new DegRadHelper(light.rotation, 'y'), 'value', -180, 180).name('y rotation');
  //   gui.add(new DegRadHelper(light.rotation, 'z'), 'value', -180, 180).name('z rotation');

  //   makeXYZGUI(gui, light.position, 'position');
  // }







// 
//   const gui = new GUI();
//   gui.addColor(new ColorGUIHelper(light1, 'color'), 'value').name('color');

//   const helper = new THREE.DirectionalLightHelper(light1);
//   scene.add(helper);
//   gui.add(light1, 'intensity', 0, 2, 0.01);
//   function updateLight() {
//     light1.target.updateMatrixWorld();
//     helper.update();
//   }
//   updateLight();
//   makeXYZGUI(gui, light1.position, 'position', updateLight);
//   makeXYZGUI(gui, light1.target.position, 'target', updateLight);

//  



  // scene.add(light2.target); 
  


  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = (new THREE.Vector3())
        .subVectors(camera.position, boxCenter)
        .multiply(new THREE.Vector3(100, 0, 100))
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
  let puntoA;
  let puntoB;
  let puntoC;
  let puntoD;
  let puntoE;
  let puntoF;
  let puntoG;
  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('resources/Brain.gltf', (gltf) => {
      const root = gltf.scene;

      console.log(dumpObject(root).join('\n'),root);
      wires = root.getObjectByName("BrainWire");
      cerebro = root.getObjectByName("BrainSolid")
      cerebros = root.getObjectByName('Brain');
      scene.add(cerebros);
    

      gltfLoader.load('resources/IPoint A.gltf', (gltf) => {
        const root = gltf.scene;
        puntoA = root.getObjectByName("IPoint_A");
        puntoB = puntoA.clone();
        puntoC = puntoA.clone();
        puntoD = puntoA.clone();
        puntoE = puntoA.clone();
        puntoF = puntoA.clone();
        console.log(dumpObject(root).join('\n'),root);
        puntoA.position.set(0.250,4.840,-0.250);
        puntoB.position.set(-0.950,6.820,-0.130);
        puntoC.position.set(-1.440,3.210,-2.780);
        puntoD.position.set(0.990,5.370,-2.260);
        puntoE.position.set(-3.770,5.370,-2.390);
        puntoF.position.set(-1.550,5.910,-5.160);
        puntoA.renderOrder = 1;
        puntoB.renderOrder = 1;
        puntoC.renderOrder = 1;
        puntoD.renderOrder = 1;
        puntoE.renderOrder = 1;
        puntoF.renderOrder = 1;
        cerebros.add(puntoA);
        cerebros.add(puntoB);
        cerebros.add(puntoC);
        cerebros.add(puntoD);
        cerebros.add(puntoE);
        cerebros.add(puntoF);
    });


      // const material = new THREE.MeshPhongMaterial({
      //   color: 0x84BD00,    // red (can also use a CSS color string here)
      //   flatShading: true,
      //   transparent: true,
      //   opacity: 1
      // });

      wires.material.transparent = false;
      //cerebro.material = material;
      //wires.visible = false;
      wires.transparent = true;
      cerebro.material.transparent = true;
      cerebro.material.opacity = 0.5;
      //cerebro.material.dithering = true;
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
    if (needResize) 
    {
      renderer.setSize(width, height, false);
    }

    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      if (canvas.clientWidth < 681)
      {
        controls.minDistance = 8 + canvas.clientWidth*0.015;
      }
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    if(cerebros && !seMovio){
      cerebros.rotation.y = time/8;
      //puntoA.rotation.y = time/8;
    }


    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
