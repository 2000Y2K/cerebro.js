import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.119.1/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/loaders/GLTFLoader.js';
//import {GUI} from './dat.gui.module.js';




function main() {
  const canvas = document.querySelector('#c');
  
  const renderer = new THREE.WebGLRenderer({canvas, antialias : true, alpha : false});

  let wires;
  let cerebros;
  let cerebro;
  const esferas = [];
  const highlights = [];
  const nombreEsferas =["a","b","c","d","e","f"];
  const tempV = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const posicionCamara = new THREE.Vector3();
  const camaraAPunto = new THREE.Vector3();
  const matrizNormalizada = new THREE.Matrix3();
  const gltfLoader = new GLTFLoader();
  const mouse = new THREE.Vector2(1,1);
  document.body.appendChild(renderer.domElement);



  function cargarHighlight(nombre)
  {
    gltfLoader.load('resources/Brain '+nombre+'.gltf' , (gltf) => {
      const root = gltf.scene;
      const highlight = root.getObjectByName("BrainSolid_Light_"+nombre);
      highlight.material.emissiveIntensity = 3;
      highlight.position.set(0,0,0);
      highlight.rotation.set(0,0,0);
      highlight.name = "highlight_"+nombre;
      cerebro.add(highlight);
      highlight.visible = false;
      highlights.push(highlight);
    });
  }

  function cargarEsferas()
  {
          gltfLoader.load('resources/IPoint A.gltf', (gltf) => {
        const root = gltf.scene;
        const esfera = root.getObjectByName("IPoint_A");
        esferas.push(hacerEsfera(esfera,0.250,4.840,-0.250,"a"));
        esferas.push(hacerEsfera(esfera,-0.950,6.820,-0.130,"b"));
        esferas.push(hacerEsfera(esfera,-1.440,3.210,-2.780,"c"));
        esferas.push(hacerEsfera(esfera,0.990,5.370,-2.260,"d"));
        esferas.push(hacerEsfera(esfera,-3.770,5.370,-2.390,"e"))
        esferas.push(hacerEsfera(esfera,-1.550,5.910,-5.160,"f"));
    });
  }

  function cargarEtiquetas()
  {
    cerebro.add(hacerEtiqueta(1.650,2.190,0.710,"atrio"));
    cerebro.add(hacerEtiqueta(-0.070,-0.320,2.370,"arium"));
    cerebro.add(hacerEtiqueta(2.530,0.180,-0.170,"cemdoe"));
    cerebro.add(hacerEtiqueta(-0.140,-2.730,-0.710,"afinis"));
    cerebro.add(hacerEtiqueta(-2.510,0.030,-0.170,"allegra"));
    cerebro.add(hacerEtiqueta(0.4,2.260,-1.690,"fundacion"));

  }

  function hacerEtiqueta(x,y,z,texto)
  {

    const map = new THREE.TextureLoader().load( 'resources/'+texto+'.png');
    const labelMaterial = new THREE.SpriteMaterial( { map: map} );
    const label = new THREE.Sprite(labelMaterial);
    label.renderOrder = 3;
    label.position.x = x;
    label.position.y = y;
    label.position.z = z;
    console.log(label.position);
    return label;
  }


  ///// CAMARA
  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.01;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(10, 10, 20);
  /////


  ///// MOVIMIENTO
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, -5, 0);
  controls.autoRotate = false;
  controls.autoRotateSpeed = 1;
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.minDistance = 8;
  controls.maxDistance = 10;
  controls.enablePan = false;
  controls.update();
  /////

  ///// MOUSE 
   
   window.addEventListener("mousemove", setPickPosition);
   window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);
 // (event) =>
  // {
  //   mouse.x = (event.clientX /window.innerWidth) * 2 - 1;
  //   mouse.y = -(event.clientY/window.innerHeight)  * 2 + 1 ;
  //  // console.log("x ",mouse.x," y ",mouse.y);
  // })
  

  window.addEventListener('touchstart', (event) => {
    // prevent the window from scrolling
    event.preventDefault();
    setPickPosition(event.touches[0]);
  }, {passive: false});
   
  window.addEventListener('touchmove', (event) => {
    setPickPosition(event.touches[0]);
  });
   
  window.addEventListener('touchend', clearPickPosition);


  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width  / rect.width,
      y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
  }
   
  function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    mouse.x = (pos.x / canvas.width ) *  2 - 1;
    mouse.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
  }
   
  function clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    mouse.x = -100000;
    mouse.y = -100000;
  }
  ////

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#00485B'); // 00485B

  { ///// LUZ AMBIENTE
    const skyColor = 0xffffff;  // light blue
    const groundColor = 0xffffff;  // brownish orange
    const intensity = 0.3;
    const light = new THREE.HemisphereLight(groundColor,skyColor, intensity);
    scene.add(light);
  }/////


  { ///// LUCES PUNTO Y DIRECCIONALES
    const color = 0xffffff;
    const intensity = 0.15;
    const light2 = new THREE.PointLight(color, intensity);
    const light3 = new THREE.PointLight(color, intensity);
    // const light6 = new THREE.PointLight(color, intensity);
    // const light4 = new THREE.PointLight(color, intensity);
    const light1 = new THREE.DirectionalLight(color, 0.5);
    // const light5 = new THREE.DirectionalLight(color, 0.5);
    light1.position.set(1.6,9,0);
    light2.position.set(1,1,10);
    light3.position.set(-3.7,1,0); // -1.1 0.2 -5
  //   light4.position.set(3.7,1,0);
  //  light5.position.set(-9.820,9,0);
  //  light6.position.set(-1.1,0.2,-5);
    scene.add(light1);
    scene.add(light2);
    scene.add(light3);
  //   scene.add(light4);
  //   scene.add(light6);
  //  scene.add(light5);
  //  scene.add(light1.target);
  // scene.add(light5.target);
} //////


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

  function hacerEsfera(mesh,x,y,z,nombre)
  {
    const esfera = mesh.clone();
    esfera.position.set(x,y,z);
    esfera.renderOrder = 1;
    esfera.material.depthWrite = true;
    esfera.name = nombre

    //console.log("posicion esfera",x,y,z);

    scene.add(esfera);

    return esfera;
  }

  {
    gltfLoader.load('resources/Brain.gltf', (gltf) => {
      const root = gltf.scene;

      wires = root.getObjectByName("BrainWire");
      cerebro = root.getObjectByName("BrainSolid")
      cerebros = root.getObjectByName('Brain');
      cerebros.visible = false;
      scene.add(cerebro);
      scene.add(wires);

      cargarEsferas();
      cargarEtiquetas();
      cargarHighlight("A");
      cargarHighlight("B");
      cargarHighlight("C");
      // cargarHighlight("D");
      cargarHighlight("E");
    


    //cerebro.material.transparent = false;
      //cerebro.material = material;
      //wires.visible = false;
      wires.transparent = false;
      cerebro.material.depthWrite = true;
      cerebro.material.opacity = 0.7;
      
      //cerebro.material.dithering = true;
      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(cerebro);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      frameArea(boxSize * 0.025, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      controls.target.copy(boxCenter);
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

    ///// RAYCASTER

    raycaster.setFromCamera(mouse, camera);
    const intersecados = raycaster.intersectObjects(scene.children);


    if (intersecados.length)
    {
      for (let intersecado of intersecados)
      {
        if(nombreEsferas.includes(intersecado.object.name) && intersecados[0].object == intersecado.object)
        {
           // console.log("si",intersecado.object.name);
            //intersecado.object.visible = false; 
            //setTimeout(() => intersecado.object.visible = true, 500);
            switch(intersecado.object.name)
            {
              case 'a':
                highlights[0].visible = true;
                setTimeout(() => highlights[0].visible = false,5000);
            }
        }
      }
    }
  
    /////


    if (resizeRendererToDisplaySize(renderer)) { 
      const canvas = renderer.domElement;
      if (canvas.clientWidth < 681)
      {
        controls.minDistance = 5.5 + canvas.clientWidth*0.015;
      }
      else {
        controls.minDistance = 8;
      }
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }


    controls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
