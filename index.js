import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.119.1/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from './dat.gui.module.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';




function main() {

  var TEXTURES = {};
  var textureLoader = new THREE.TextureLoader( );
  textureLoader.load( 'resources/sprites/electric.png', function ( tex ) {
  
    TEXTURES.electric = tex;
  
  } );



var OBJ_MODELS = {};
const OBJloader = new OBJLoader();
OBJloader.load( 'resources/models/brain_vertex_low.obj', function ( model ) {
  var materialNeurona = new THREE.PointsMaterial( { 
    map: TEXTURES.electric,
    size: 0.08,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    transparent: true
  });
	OBJ_MODELS.brain = model.children[ 0 ];
  OBJ_MODELS.brain.scale.set(0.027,0.027,0.027);
  OBJ_MODELS.brain.position.set(0,5.160,-0.32)
  OBJ_MODELS.brain.renderOrder = 2;
  //OBJ_MODELS.brain.position.z = -0.32;
  OBJ_MODELS.brain.material = materialNeurona
  console.log(OBJ_MODELS.brain);
  scene.add(OBJ_MODELS.brain)
  OBJ_MODELS.brain.geometry.drawRange.count = 0;
  OBJ_MODELS.brain.geometry.drawRange.start = 0;
} );



function animarNeuronas(tiempo)
{

}

/////////////////////////////////
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas, antialias : true, alpha : false});

  let wires;
  let cerebros;
  let cerebro;
  const esferas = [];
  const highlights = new Array(7);
  const nombres =["A","B","C","D","E","F"];
  const tempV = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const posicionCamara = new THREE.Vector3();
  const camaraAPunto = new THREE.Vector3();
  const matrizNormalizada = new THREE.Matrix3();
  const gltfLoader = new GLTFLoader();
  const mouse = new THREE.Vector2(1,1);
  const chispas = [];
  const reloj = new THREE.Clock();
  var neuronasActivas = false;
  //const pos=[-2.209542989730835,-0.20527023077011108,-0.3194902241230011,-1.5498987436294556,1.518546462059021,1.1377387046813965]

  document.body.appendChild(renderer.domElement);

  function randomEntre(min, max) {
    return Math.random() * (max - min) + min;
  }

  function crearNumeros() {
    var geom = new THREE.Geometry();
    const cero = new THREE.TextureLoader().load('resources/cero.png');
    var materialCero = new THREE.PointsMaterial( { 
          map: cero,
          size: 0.3,
          blending: THREE.AdditiveBlending,
          depthWrite: true,
          depthTest: true,
          transparent: true
        });
    for( let i = 0; i < 300; i++)        
    {
      var particle = new THREE.Vector3(randomEntre(-5,5),randomEntre(2,5),randomEntre(0,5));
      particle.velocityY = 0.1 + Math.random() / 5;
      particle.velocityX = (Math.random() - 0.5) / 3;
      particle.velocityZ = (Math.random() - 0.5) / 3;
      particle.sizeAttenuation = true;
      //particle.scale.set(0.1,0.1,0.1)
      geom.vertices.push(particle);
      geom.colors.push(new THREE.Color(Math.random() * 0xffffff));
      var cloud = new THREE.Points(geom, materialCero);
      cloud.renderOrder = 2;
    }
    scene.add(cloud);
    }

  function cargarHighlight(nombre,index)
  {
    gltfLoader.load('resources/models/Brain_light.gltf' , (gltf) => {
      const root = gltf.scene;
      const highlight = root.getObjectByName("BrainSolid_Light_"+nombre);
      highlight.material.emissiveIntensity = 4;
      console.log(highlight,nombre)
      highlight.material.opacity = 0.5;
      highlight.position.set(0,0,0);
      highlight.rotation.set(0,0,0);
      highlight.name = "highlight_"+nombre;
      highlights[index] = highlight;
      cerebro.add(highlight);
      highlight.visible = false;
    });
  }

  function cargarEsferas()
  {
          gltfLoader.load('resources/models/IPoint A.gltf', (gltf) => {
        const root = gltf.scene;
        const esfera = root.getObjectByName("IPoint_A");
        esferas.push(hacerEsfera(esfera,0.250,4.840,-0.250,"A"));
        esferas.push(hacerEsfera(esfera,-0.950,6.820,-0.130,"B"));
        esferas.push(hacerEsfera(esfera,-1.440,3.210,-2.780,"C"));
        esferas.push(hacerEsfera(esfera,0.990,5.370,-2.260,"D"));
        esferas.push(hacerEsfera(esfera,-3.770,5.370,-2.390,"E"))
        esferas.push(hacerEsfera(esfera,-1.550,5.910,-5.160,"F"));
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
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(10, 10, 20);
  /////


  ///// MOVIMIENTO
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, -5, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.4;
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.minDistance = 8;
  controls.maxDistance = 10;
  controls.enablePan = true;
  controls.minPolarAngle = Math.PI/4;
  controls.maxPolarAngle = 1.9;
  controls.update();
  /////

  ///// MOUSE 
   
   window.addEventListener("mousemove", setPickPosition);
   window.addEventListener('mouseout', clearPickPosition);
   window.addEventListener('mouseleave', clearPickPosition);  

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
    camera.far = boxSize * 3;

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
    scene.add(esfera);

    return esfera;
  }

  {
    gltfLoader.load('resources/models/Brain.gltf', (gltf) => {
      const root = gltf.scene;

      wires = root.getObjectByName("BrainWire");
      cerebro = root.getObjectByName("BrainSolid")
      cerebros = root.getObjectByName('Brain');
      cerebros.visible = false;
      scene.add(cerebro);
      scene.add(wires);

      cargarEsferas();
      cargarEtiquetas();
      cargarHighlight("A",0);
      cargarHighlight("B",1);
      cargarHighlight("C",2);
      cargarHighlight("D",3);
      cargarHighlight("E",4);
      cargarHighlight("F",5);
      //crearNumeros();


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
        if(nombres.includes(intersecado.object.name) && intersecados[0].object == intersecado.object && !neuronasActivas)
        {
            switch(intersecado.object.name)
            {
              case "A":
                if(!neuronasActivas)
                {
                  neuronasActivas = true;
                  OBJ_MODELS.brain.geometry.drawRange.count = Math.random() * 5000;
                  OBJ_MODELS.brain.geometry.drawRange.start = Math.random() * 3000;
                }
                highlights[1].visible = true;
                //console.log(time);
                setTimeout(() =>
                {
                  highlights[1].visible = false;
                  neuronasActivas = false;
                  OBJ_MODELS.brain.geometry.drawRange.count = 0;
                  OBJ_MODELS.brain.geometry.drawRange.start = 0;
                } ,3000);
                break;
              case "B":
                if(!neuronasActivas)
                {
                  neuronasActivas = true;
                  OBJ_MODELS.brain.geometry.drawRange.count = Math.random() * 5000;
                  OBJ_MODELS.brain.geometry.drawRange.start = Math.random() * 3000;
                }
                highlights[0].visible = true;
                //console.log(time);
                setTimeout(() =>
                {
                  highlights[0].visible = false;
                  neuronasActivas = false;
                  OBJ_MODELS.brain.geometry.drawRange.count = 0;
                  OBJ_MODELS.brain.geometry.drawRange.start = 0;
                } ,3000);
                break;
              case "C":
                if(!neuronasActivas)
                {
                  neuronasActivas = true;
                  OBJ_MODELS.brain.geometry.drawRange.count = Math.random() * 5000;
                  OBJ_MODELS.brain.geometry.drawRange.start = Math.random() * 3000;
                }
                highlights[3].visible = true;
                //console.log(time);
                setTimeout(() =>
                {
                  highlights[3].visible = false;
                  neuronasActivas = false;
                  OBJ_MODELS.brain.geometry.drawRange.count = 0;
                  OBJ_MODELS.brain.geometry.drawRange.start = 0;
                } ,3000);
                break;
              case "D":
                if(!neuronasActivas)
                {
                  neuronasActivas = true;
                  OBJ_MODELS.brain.geometry.drawRange.count = Math.random() * 5000;
                  OBJ_MODELS.brain.geometry.drawRange.start = Math.random() * 3000;
                }
                highlights[2].visible = true;
                //console.log(time);
                setTimeout(() =>
                {
                  highlights[2].visible = false;
                  neuronasActivas = false;
                  OBJ_MODELS.brain.geometry.drawRange.count = 0;
                  OBJ_MODELS.brain.geometry.drawRange.start = 0;
                } ,3000);
                break;
              case "E":
                if(!neuronasActivas)
                {
                  neuronasActivas = true;
                  OBJ_MODELS.brain.geometry.drawRange.count = Math.random() * 5000;
                  OBJ_MODELS.brain.geometry.drawRange.start = Math.random() * 3000;
                }
                highlights[5].visible = true;
                //console.log(time);
                setTimeout(() =>
                {
                  highlights[5].visible = false;
                  neuronasActivas = false;
                  OBJ_MODELS.brain.geometry.drawRange.count = 0;
                  OBJ_MODELS.brain.geometry.drawRange.start = 0;
                } ,3000);
                break;
              case "F":
                if(!neuronasActivas)
                {
                  neuronasActivas = true;
                  OBJ_MODELS.brain.geometry.drawRange.count = Math.random() * 5000;
                  OBJ_MODELS.brain.geometry.drawRange.start = Math.random() * 3000;
                }
                highlights[4].visible = true;
                //console.log(time);
                setTimeout(() =>
                {
                  highlights[4].visible = false;
                  neuronasActivas = false;
                  OBJ_MODELS.brain.geometry.drawRange.count = 0;
                  OBJ_MODELS.brain.geometry.drawRange.start = 0;
                } ,3000);
                break;
                                  
            }
        }
      }
    }
  



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
