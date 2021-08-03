import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.119.1/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/loaders/GLTFLoader.js';

const manager = new THREE.LoadingManager();
manager.onStart = ( url, itemsLoaded, itemsTotal ) => console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
manager.onLoad = ( ) => console.log( 'Loading complete!');
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas, antialias : true, alpha : true});
const contenedorInformacion = document.querySelector('#informacion')
const contenedorMenues = document.querySelector('#menues')
let wires;
let cerebros;
let cerebro;
var movil;
var highlightActivo = "ninguno";
const esferas = [];
const highlights = new Array(7);
const nombres =["A","B","C","D","E","F"];
const raycaster = new THREE.Raycaster();
const gltfLoader = new GLTFLoader(manager);
const mouse = new THREE.Vector2(1,1);
var click = false;
const reloj = new THREE.Clock();
const datosEmpresas = [];
const lineas = [];
var drawCount = 10;
var textureLoader = new THREE.TextureLoader(manager);
var materialNeurona = new THREE.ShaderMaterial( { 
  vertexShader: document.getElementById( 'vertexshader' ).textContent,
  fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
  blending: THREE.MultiplyBlending,
  depthWrite: false,
  side : THREE.DoubleSide,
  depthTest: true,
  transparent: true
});


document.body.appendChild(renderer.domElement);
var rootHighligth;
const particle = new THREE.Object3D();

  ///// CAMARA
  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.01;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(10, 10, 20);
  /////
  const scene = new THREE.Scene(camera);
  scene.background =textureLoader.load("resources/degrade.png")
  ///// MOVIMIENTO
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, -5, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.5;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.minDistance = 8;
  controls.maxDistance = 10;
  controls.enablePan = false;
  controls.minPolarAngle = Math.PI/4;
  controls.maxPolarAngle = 1.9;
  controls.update();
  /////

   ///// LUZ AMBIENTE
    {
    const skyColor = 0xffffff;  // light blue
    const groundColor = 0xffffff;  // brownish orange
    const intensity = 0.3;
    const light = new THREE.HemisphereLight(groundColor,skyColor, intensity);
    scene.add(light);
    }
  /////


   ///// LUCES PUNTO Y DIRECCIONALES
    {
    const color = 0xffffff;
    const intensity = 0.15;
    const light1 = new THREE.DirectionalLight(color, 0.5);
    const light2 = new THREE.PointLight(color, intensity);
    const light3 = new THREE.PointLight(color, intensity);
    light1.position.set(1.6,9,0);
    light2.position.set(1,1,10);
    light3.position.set(-3.7,1,0); 
    scene.add(light1);
    scene.add(light2);
    scene.add(light3);
   }
   //////


function hacerLinea(v1,v2,nombre)
{
  var puntosMaximos = 1000;
  var linea;
  var geometriaLinea = new THREE.BufferGeometry();
  var posicionesLinea = new Float32Array(puntosMaximos*3);
  var tamañosLinea = new Float32Array(puntosMaximos);
  const pos = [v1.x,v1.y,v1.z,v2.x,v2.y,v2.z]
    

    const li = new THREE.Line3(new THREE.Vector3(pos[0],pos[1],pos[2]),new THREE.Vector3(pos[3],pos[4],pos[5]));
    const p = [];
    const tamaños = []
    var posi = new THREE.Vector3();
    for(let i = 0;  i < puntosMaximos;i+= 1)
    {
      
      li.at(i/puntosMaximos,posi);
      tamaños.push(0.1 + Math.pow(i/puntosMaximos,2));
      p.push(posi.x,posi.y,posi.z);
    }
    posicionesLinea.set(p);
    tamañosLinea.set(tamaños);
    geometriaLinea.setAttribute('position', new THREE.BufferAttribute(posicionesLinea,3));
    geometriaLinea.setAttribute('size', new THREE.BufferAttribute(tamañosLinea,1));
    geometriaLinea.setDrawRange(0,0);
    linea = new THREE.Points(geometriaLinea,materialNeurona);
    linea.renderOrder = 1;
    linea.geometry.attributes.position.needsUpdate = true;
    linea.geometry.attributes.size.needsUpdate = true;
    linea.name = nombre;
    //linea.visible = false;
    lineas.push(linea);
    return linea;
}

function cargarLineas()
{
    cerebro.add(hacerLinea(new THREE.Vector3(1.5973891019821167,2.0125176906585693,-0.03765719383955002),new 
    THREE.Vector3(1.5352518558502197,2.0784173011779785,0.5277711153030396),"atrio"));
    cerebro.add(hacerLinea(new THREE.Vector3(1.6467902660369873,1.4805809259414673,0.3312768340110779),new 
    THREE.Vector3(1.5352518558502197,2.0784173011779785,0.5277711153030396),"atrio"));
    cerebro.add(hacerLinea(new THREE.Vector3(1.4117016792297363,1.450126051902771,0.7401993870735168),new 
    THREE.Vector3(1.5352518558502197,2.0784173011779785,0.5277711153030396),"atrio"));
    cerebro.add(hacerLinea(new THREE.Vector3(1.2726730108261108,2.066633939743042,0.5528200268745422),new 
    THREE.Vector3(1.5352518558502197,2.0784173011779785,0.5277711153030396),"atrio"));
    cerebro.add(hacerLinea(new THREE.Vector3(1.3935871124267578,1.8805689811706543,0.6695277094841003),new 
    THREE.Vector3(1.5352518558502197,2.0784173011779785,0.5277711153030396),"atrio"));

    //fundacion
    cerebro.add(hacerLinea(new THREE.Vector3(0.46760958433151245,2.3373422622680664,-1.0832387208938599),new 
    THREE.Vector3(0.42177948355674744,2.2266714572906494,-1.3494890928268433),"fundacion"));
    cerebro.add(hacerLinea(new THREE.Vector3(0.5070222020149231,1.9389396905899048,-1.469927430152893),new 
    THREE.Vector3(0.42177948355674744,2.2266714572906494,-1.3494890928268433),"fundacion"));
    cerebro.add(hacerLinea(new THREE.Vector3(0.03840962424874306,2.2606191635131836,-1.1879698038101196),new 
    THREE.Vector3(0.42177948355674744,2.2266714572906494,-1.3494890928268433),"fundacion"));
    cerebro.add(hacerLinea(new THREE.Vector3(0.7905917167663574,2.07202410697937,-1.0436018705368042),new 
    THREE.Vector3(0.42177948355674744,2.2266714572906494,-1.3494890928268433),"fundacion"));


    //cemdoe
    cerebro.add(hacerLinea(new THREE.Vector3(2.0445218086242676,0.4920673668384552,0.2811475098133087),new 
    THREE.Vector3(2.3061206340789795,0.11670234799385071,0.1014540046453476),"cemdoe"));
    cerebro.add(hacerLinea(new THREE.Vector3(1.7614332437515259,0.28793832659721375,0.18535791337490082),new 
    THREE.Vector3(2.3061206340789795,0.11670234799385071,0.1014540046453476),"cemdoe"));
    cerebro.add(hacerLinea(new THREE.Vector3(2.359876871109009,-0.6742686033248901,0.1872536540031433),new 
    THREE.Vector3(2.3061206340789795,0.11670234799385071,0.1014540046453476),"cemdoe"));
    cerebro.add(hacerLinea(new THREE.Vector3(2.3025527000427246,-0.05049416795372963,0.4632873833179474),new 
    THREE.Vector3(2.3061206340789795,0.11670234799385071,0.1014540046453476),"cemdoe"));
    cerebro.add(hacerLinea(new THREE.Vector3(2.1804606914520264,0.5601081848144531,0.5822124481201172),new 
    THREE.Vector3(2.3061206340789795,0.11670234799385071,0.1014540046453476),"cemdoe"));
    cerebro.add(hacerLinea(new THREE.Vector3(2.027777671813965,-0.10820109397172928,-0.01572643406689167),new 
    THREE.Vector3(2.3061206340789795,0.11670234799385071,0.1014540046453476),"cemdoe"));
    cerebro.add(hacerLinea(new THREE.Vector3(2.167001724243164,-0.5073717832565308,-0.052586425095796585),new 
    THREE.Vector3(2.3061206340789795,0.11670234799385071,0.1014540046453476),"cemdoe"));

    //arium
    cerebro.add(hacerLinea(new THREE.Vector3(-0.06889987736940384,-0.941813051700592,2.757169723510742),new 
    THREE.Vector3(0.46587860584259033,-0.13879349827766418,1.8124727010726929),"arium"));
    cerebro.add(hacerLinea(new THREE.Vector3(-0.06889987736940384,-0.941813051700592,2.757169723510742),new 
    THREE.Vector3(-0.5834723114967346,-0.11224670708179474,1.7812467813491821),"arium"));
    cerebro.add(hacerLinea(new THREE.Vector3(-0.04611355438828468,0.34187862277030945,1.0564467906951904),new 
    THREE.Vector3(0.46587860584259033,-0.13879349827766418,1.8124727010726929),"arium"));
    cerebro.add(hacerLinea(new THREE.Vector3(-0.04611355438828468,0.34187862277030945,1.0564467906951904),new 
    THREE.Vector3(-0.5834723114967346,-0.11224670708179474,1.7812467813491821),"arium"));
  

    //afinis
    cerebro.add(hacerLinea(new THREE.Vector3(-0.05097797140479088,-2.4827380180358887,-0.06569018959999084),new 
    THREE.Vector3(-0.18373939394950867,-2.6539626121520996,-0.4795656204223633),"affinis"));
    cerebro.add(hacerLinea(new THREE.Vector3(-0.35139283537864685,-2.6888515949249268,-0.2940196096897125),new 
    THREE.Vector3(-0.18373939394950867,-2.6539626121520996,-0.4795656204223633),"affinis"));
    cerebro.add(hacerLinea(new THREE.Vector3(-0.9512643218040466,-2.451958179473877,-0.315106064081192),new 
    THREE.Vector3(-0.18373939394950867,-2.6539626121520996,-0.4795656204223633),"affinis"));
    cerebro.add(hacerLinea(new THREE.Vector3(-0.7279337644577026,-2.285250663757324,-0.7158091068267822),new 
    THREE.Vector3(-0.18373939394950867,-2.6539626121520996,-0.4795656204223633),"affinis"));
    cerebro.add(hacerLinea(new THREE.Vector3(-0.1506601870059967,-2.3690030574798584,-0.5677984952926636),new 
    THREE.Vector3(-0.18373939394950867,-2.6539626121520996,-0.4795656204223633),"affinis"));


      
    cerebro.add(hacerLinea(new THREE.Vector3(-1.7776892185211182,0.2768135666847229,0.19461233913898468),new 
    THREE.Vector3(-2.3088932037353516,0.01805860549211502,0.08583687245845795),"allegra"));
    cerebro.add(hacerLinea(new THREE.Vector3(-2.245647430419922,-0.7893467545509338,0.03888602554798126),new 
    THREE.Vector3(-2.3088932037353516,0.01805860549211502,0.08583687245845795),"allegra"));
    cerebro.add(hacerLinea(new THREE.Vector3(-2.1439945697784424,0.3859260678291321,0.32796695828437805),new 
    THREE.Vector3(-2.3088932037353516,0.01805860549211502,0.08583687245845795),"allegra"));
    cerebro.add(hacerLinea(new THREE.Vector3(-2.0276832580566406,-0.1640051305294037,-0.010092661716043949),new 
    THREE.Vector3(-2.3088932037353516,0.01805860549211502,0.08583687245845795),"allegra"));
    cerebro.add(hacerLinea(new THREE.Vector3(-2.3254170417785645,-0.7307484745979309,0.4136829972267151),new 
    THREE.Vector3(-2.3088932037353516,0.01805860549211502,0.08583687245845795),"allegra"));
    cerebro.add(hacerLinea(new THREE.Vector3(-2.3007712364196777,-0.13052760064601898,0.4617513418197632),new 
    THREE.Vector3(-2.3088932037353516,0.01805860549211502,0.08583687245845795),"allegra"));
    cerebro.add(hacerLinea(new THREE.Vector3(-2.179304599761963,0.5281762480735779,0.6159335970878601),new 
    THREE.Vector3(-2.3088932037353516,0.01805860549211502,0.08583687245845795),"allegra"));
}



function cargarHighlight(nombre,index)
{
    const highlight = rootHighligth.getObjectByName("BrainSolid_Light_"+nombre);
    highlight.renderOrder = 1;
    highlight.material.emissiveIntensity = 4;
    highlight.material.opacity = 0.5;
    highlight.position.set(0,0,0);
    highlight.rotation.set(0,0,0);
    switch(nombre)
    {
      case "A":
        nombre = "fundacion";
        break;
      case "B":
        nombre = "atrio";
        break;
      case "C":
        nombre = "cemdoe";
        break;
      case "D":
        nombre = "arium";
        break;
      case "E":
        nombre = "affinis";
        break;
      case "F":
        nombre = "allegra";
        break;
    }
    highlight.name = "highlight_"+nombre;
    highlights[index] = highlight;
    cerebro.add(highlight);
    highlight.visible = false;
}

function hacerEsfera(x,y,z,nombre)
{
  const esfera = new THREE.Mesh(new THREE.SphereGeometry(0.04), new THREE.MeshBasicMaterial({
    depthWrite : true,
    depthTest : true,
    transparent: true,
    opacity: 0.8,
    color: 0xffffff
  }));
  esfera.position.set(x,y,z);
  esfera.renderOrder = 3;
  esfera.name = nombre
  esfera.add(hacerEtiqueta(0,0,0,"PNG1"))
  scene.add(esfera);
  return esfera;
}

function abrirInfo(nombre)
{
  contenedorMenues.style.visibility = `hidden`;
  contenedorInformacion.style.visibility = `visible`;
  contenedorInformacion.querySelector("#infoInternaALLEGRA").style.display = `none`;
  contenedorInformacion.querySelector("#infoInternaCEMDOE").style.display = `none`;
  contenedorInformacion.querySelector("#infoInternaALIVIA").style.display = `none`;
  contenedorInformacion.querySelector("#infoInternaATRIO").style.display = `none`;
  contenedorInformacion.querySelector("#infoInternaARIUM").style.display = `none`;
  contenedorInformacion.querySelector("#infoInternaAFFINIS").style.display = `none`;
  highlightActivo = nombre;
  switch(nombre)
  {
    case "allegra":
      contenedorInformacion.querySelector("#infoInternaALLEGRA").style.display = `contents`;
      break;
    case "cemdoe":
      contenedorInformacion.querySelector("#infoInternaCEMDOE").style.display = `contents`;
      break;
    case "fundacion":
      contenedorInformacion.querySelector("#infoInternaALIVIA").style.display = `contents`;
      break;
    case "atrio":
      contenedorInformacion.querySelector("#infoInternaATRIO").style.display = `contents`;
      break;
    case "arium":
      contenedorInformacion.querySelector("#infoInternaARIUM").style.display = `contents`;
      break;        
    case "affinis":
      contenedorInformacion.querySelector("#infoInternaAFFINIS").style.display = `contents`;
      break;
  }
}
function cargarEsferas()
{
      esferas.push(hacerEsfera(1.6,4.46,2.14,"A"));
      esferas.push(hacerEsfera(0.42,6.4,2.29,"B"));
      esferas.push(hacerEsfera(-0.05,2.8,-0.26,"C"));
      esferas.push(hacerEsfera(2.37,4.94,0.15,"D"));
      esferas.push(hacerEsfera(-2.38,4.95,0.02,"E"))
      esferas.push(hacerEsfera(-0.16,5.52,-2.72,"F"));
}

function cargarEtiquetas()
{
  cerebro.add(hacerEtiqueta(1.650,2.190,0.710,"atrio"));
  cerebro.add(hacerEtiqueta(-0.070,-0.320,2.370,"arium"));
  cerebro.add(hacerEtiqueta(2.530,0.180,-0.170,"cemdoe"));
  cerebro.add(hacerEtiqueta(-0.140,-2.730,-0.710,"afinis"));
  cerebro.add(hacerEtiqueta(-2.510,0.030,-0.170,"allegra"));
  cerebro.add(hacerEtiqueta(0.4,2.260,-1.590,"fundacion"));
  camera.add(hacerEsfera(2,3,0,"F"))

}

function hacerEtiqueta(x,y,z,texto)
{

  const map = textureLoader.load( 'resources/sprites/'+texto+'.png');
  const labelMaterial = new THREE.SpriteMaterial( { map: map} );
  const label = new THREE.Sprite(labelMaterial);
  label.renderOrder = 3;
  label.position.x = x;
  label.position.y = y;
  label.position.z = z;
  label.name = texto
  return label;
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



  ///// MOUSE 
   
  window.addEventListener("mousemove", setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);  
  window.addEventListener('mousedown', clickeado);
  window.addEventListener('mouseup', Noclickeado);
 window.addEventListener('touchstart', (event) => {
   // prevent the window from scrolling
   event.preventDefault();
   setPickPosition(event.touches[0]);
 }, {passive: false});
  
 window.addEventListener('touchmove', (event) => {
   setPickPosition(event.touches[0]);
 });
  
 window.addEventListener('touchend', clearPickPosition);

 function clickeado() {
   click = true;
 }

 function Noclickeado (){
   click = false;
 }


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

function cargarParticulas()
{
  // const mapCero = textureLoader.load('resources/sprites/cero.png')
  // const materialCero = new THREE.SpriteMaterial({map: mapCero}) 
  // const particularCero = new THREE.Sprite(materialCero);
  // scene.add(particularCero)
  scene.add(particle);
  var geometry = new THREE.TetrahedronGeometry(0.05, 0);
  var material = new THREE.MeshPhongMaterial({
    depthTest:true,
    transparent:true,
    depthWrite:true,
    blending: THREE.AdditiveBlending,
    color: 0x1fc2a7,
  });
  for (var i = 0; i < 1000; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder= 0;
    mesh.position.set(Math.random()*20-7, Math.random()*20, Math.random()*20-7);
    //mesh.position.multiplyScalar(Math.random() * 5,Math.random() * 5,Math.random() * 5);
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    particle.add(mesh);
  }
}

function render(tiempo) {
  tiempo /= 1000;
  var delta = reloj.getDelta();
  ///// RAYCASTER
  raycaster.setFromCamera(mouse, camera);
  const intersecados = raycaster.intersectObjects(scene.children);
  highlights.forEach((highlight) => 
  {
    if(highlight.visible === true)
    {
       reloj.start()
      highlight.visible = false
    }
  });

      
  esferas.forEach((esfera) => {
    esfera.children.forEach((llamador) => {
      var tamaño = llamador.scale;
      llamador.scale.set(tamaño.x+delta,tamaño.y+delta,tamaño.z+delta)
      if (llamador.material.opacity < 0 )
      {
        llamador.material.opacity = 1;
        llamador.scale.set(0.42,0.42,0.42);
      }
      llamador.material.opacity -= delta;
    } )
  })

  if (contenedorInformacion.style.cssText === "visibility: visible;")
  {
    controls.autoRotate = false;
    particle.rotation.y -= 0.001;
  }
  else if ( controls.autoRotate === false)
    {
       particle.rotation.y += 0.01;
       controls.autoRotate = true;
       highlightActivo = "ninguno"
    }


  lineas.forEach((linea) => {
    if (linea.name !=  highlightActivo)
    {
      linea.visible = false;
    }

    //console.log(linea)
    drawCount = ( drawCount + 1 ) % 1000;
    linea.geometry.setDrawRange(drawCount - 200, drawCount );
    linea.geometry.attributes.position.needsUpdate = true;
    linea.geometry.attributes.size.needsUpdate = true;
  });


    if (intersecados.length && tiempo > 2)
    {
      for (let intersecado of intersecados)
      {
        if(nombres.includes(intersecado.object.name) && intersecados[0].object == intersecado.object)
        {console.log(highlightActivo);
            switch(intersecado.object.name)
            {
              
              case "A":
                  highlights[1].visible = true;
                  controls.autoRotate = false;
                  lineas.forEach((linea) => {
                    if (linea.name === "atrio")
                    {
                      linea.visible = true
                    }
                  })
                if(click || (reloj.getElapsedTime() > 1  && movil))
                {
                  console.log("A")
                  abrirInfo("atrio");
                  
                }
                break;
              case "B":
                  highlights[0].visible = true;
                  controls.autoRotate = false;
                  lineas.forEach((linea) => {
                    if (linea.name === "fundacion")
                    {
                      linea.visible = true
                    }
                  })
                if(click ||(reloj.getElapsedTime() > 1  && movil))
                {
                  console.log("B")
                  abrirInfo("fundacion");
                }
                break;
              case "C":
                  highlights[3].visible = true;
                  controls.autoRotate = false;
                  lineas.forEach((linea) => {
                    if (linea.name === "arium")
                    {
                      linea.visible = true
                    }
                  })
                if(click ||(reloj.getElapsedTime() > 1  && movil))
                {
                  console.log("C")
                  abrirInfo("arium");
                }
                break;
              case "D":
                  highlights[2].visible = true;
                  controls.autoRotate = false;
                  lineas.forEach((linea) => {
                    if (linea.name === "cemdoe")
                    {
                      linea.visible = true
                    }
                  })

                if(click ||(reloj.getElapsedTime() > 1  && movil))
                {

                  console.log("D")
                  abrirInfo("cemdoe");
                }
                break;
              case "E":

                  highlights[5].visible = true;
                  controls.autoRotate = false;
                  lineas.forEach((linea) => {
                    if (linea.name === "allegra")
                    {
                      linea.visible = true
                    }
                  })

                if(click || (reloj.getElapsedTime() > 1  && movil)) 
                {
                  console.log("E")
                  abrirInfo("allegra");
                }
                  break;
              case "F":
                  highlights[4].visible = true;
                  controls.autoRotate = false;
                  lineas.forEach((linea) => {
                    if (linea.name === "affinis")
                    {
                      linea.visible = true
                    }
                  })

                if(click ||(reloj.getElapsedTime() > 1  && movil))
                {
                  console.log("F")
                  abrirInfo("affinis");
                }
                break;
                                  
            }
        }
      }
    }

    highlights.forEach((highlight) => 
    {
      if(highlight.name === "highlight_"+highlightActivo)
      {
        highlight.visible = true;
      }
    });

  if (resizeRendererToDisplaySize(renderer)) { 
    const canvas = renderer.domElement;
    if (canvas.clientWidth < 681)
    {
      movil = true;
      controls.minDistance = 5.5 + canvas.clientWidth*0.015;
    }
    else {
      movil = false;
      controls.minDistance = 8;
    }
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  //particle.rotation.x += 0.0000;
  particle.rotation.y += 0.005;
  controls.update()
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function iniciar()
{
  gltfLoader.load('resources/models/Brain.gltf', (gltf) => {
    const root = gltf.scene;

    wires = root.getObjectByName("BrainWire");
    cerebro = root.getObjectByName("BrainSolid")
    cerebros = root.getObjectByName('Brain');
    cerebros.visible = false;
    scene.add(cerebro);
    scene.add(wires);

    wires.transparent = false;
    cerebro.material.depthWrite = true;
    cerebro.material.opacity = 0.7;

    gltfLoader.load('resources/models/Brain_light.gltf' , (gltf) => {
      rootHighligth = gltf.scene;
      cargarHighlight("A",0);
      cargarHighlight("B",1);
      cargarHighlight("C",2);
      cargarHighlight("D",3);
      cargarHighlight("E",4);
      cargarHighlight("F",5);
    });    
  
    cargarParticulas();
    cargarEsferas();
    cargarEtiquetas();
    cargarLineas();
    
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

function main()
 {

  iniciar()
  
  requestAnimationFrame(render);
}

main();
