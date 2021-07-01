import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';
//import {RectAreaLightUniformsLib} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/lights/RectAreaLightUniformsLib.js';
//import {RectAreaLightHelper} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/helpers/RectAreaLightHelper.js';
import {GUI} from './dat.gui.module.js';

function main() {
  const canvas = document.querySelector('#c');
  
  const renderer = new THREE.WebGLRenderer({canvas, antialias : true, alpha : true});
  //RectAreaLightUniformsLib.init();
  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.01;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(10, 10, 20);
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
    scene.add(light1);
    scene.add(light2);
    scene.add(light3);
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

  function hacerEsfera(mesh,x,y,z)
  {
    const esfera = mesh.clone();
    esfera.position.set(x,y,z);
    esfera.renderOrder = 1;
    esfera.material.depthWrite = true;
    cerebros.add(esfera);
    return esfera;
  }

  let wires;
  let cerebros;
  let cerebro;
  const esferas = [];
  const gltfLoader = new GLTFLoader();
  {
    gltfLoader.load('resources/Brain.gltf', (gltf) => {
      const root = gltf.scene;

      console.log(dumpObject(root).join('\n'),root);
      wires = root.getObjectByName("BrainWire");
      cerebro = root.getObjectByName("BrainSolid")
      cerebros = root.getObjectByName('Brain');
      scene.add(cerebros);
      //console.log(scene);



      gltfLoader.load('resources/IPoint A.gltf', (gltf) => {
        const root = gltf.scene;
        const esfera = root.getObjectByName("IPoint_A");
        esferas.push(hacerEsfera(esfera,0.250,4.840,-0.250));
        esferas.push(hacerEsfera(esfera,-0.950,6.820,-0.130));
        esferas.push(hacerEsfera(esfera,-1.440,3.210,-2.780));
        esferas.push(hacerEsfera(esfera,0.990,5.370,-2.260));
        esferas.push(hacerEsfera(esfera,-3.770,5.370,-2.390))
        esferas.push(hacerEsfera(esfera,-1.550,5.910,-5.160));
    });
    
      //cerebro.material.transparent = false;
      //cerebro.material = material;
      //wires.visible = false;
      wires.transparent = false;
      cerebro.material.depthWrite = true;
      cerebro.material.opacity = 0.7;
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

  const tempV = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const posicionCamara = new THREE.Vector3();
  const camaraAPunto = new THREE.Vector3();
  const matrizNormalizada = new THREE.Matrix3();
  //const anguloMax;

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
      //controls.autoRotate = false;
    }

    matrizNormalizada.getNormalMatrix(camera.matrixWorldInverse);
    camera.getWorldPosition(posicionCamara);

    for (const esfera of esferas){

      const posicion = new THREE.Vector3();
      esfera.getWorldPosition(posicion);
      //console.log(posicion);
      tempV.copy(posicion);
      tempV.applyMatrix3(matrizNormalizada).normalize();

    camaraAPunto.copy(posicion);
     camaraAPunto.applyMatrix4(camera.matrixWorldInverse).normalize();

     const productoPunto = tempV.dot(camaraAPunto);
     const distancia = camaraAPunto.manhattanLength();



     esfera.updateWorldMatrix(true,false);
     esfera.getWorldPosition(tempV);

     // tempV.project(camera);

      // raycaster.setFromCamera(tempV,camera);
      // const objetosIntersecados = raycaster.intersectObjects(scene);
      // //setTimeout(() => {console.log(objetosIntersecados.length,objetosIntersecados);}, 5000)
      // //const mostrar = objetosIntersecados.length && esfera === objetosIntersecados[0].object;


      // if( productoPunto < -0.2 || productoPunto < 0.4  )//|| distancia > 1.6)
      // {
      //   //console.log("hola!");
      //   esfera.visible = true;
      //   setTimeout(() => {console.log("distancia",distancia,"producto punto",productoPunto)}, 5000);
      // }
      // else {

      //   //console.log("malo");
      //   //console.log("este entro",productoPunto)

      //   esfera.visible = false;
        
      //   //esfera.geometry.scale = 1.5
      // }
    }


    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
