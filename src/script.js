import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const form1 = document.querySelector(".e");
const form2 = document.querySelector(".s");
const start = document.querySelector(".cta");
const playPause = document.querySelector(".playpause");
const values_menu = document.querySelector(".values-menu");

///////////////////////////////////// Local imports /////////////////////////////////
import Physics from "./physics/index";
import Earth from "./components/earth";
import Satellite from "./components/satellite";
import Rocks from "./components/rock";
import Point from "./components/point";
import Landing from "./components/landingPage";

/////////////////////////////////// Defining some variables //////////////////////////////////
let paused = false;
let orbitControls;
let renderer;

let auto = false;

//////////////////////////////////// Main Scene object //////////////////////////////////////
const scene = new THREE.Scene();

//////////////////////////////////// taking values from main interface ////////////////////////////
const getValues = () => {
  const air_density = document.querySelector(".air_density").value;
  const velocity = document.querySelector(".velocity").value;
  const radios = document.querySelector(".radios").value;
  const satellite_mass = document.querySelector(".satellite_mass").value;
  const earth_mass = document.querySelector(".earth_mass").value;
  const air_resistance_distance = document.querySelector(
    ".air_resistance_distance"
  ).value;

  return {
    air_density,
    velocity,
    radios,
    satellite_mass,
    earth_mass,
    air_resistance_distance,
  };
};

//////////////////////////////// Axes Helper TO Add Three Axes (X,Y,Z) ///////////////////////////////////
const axesHelper = new THREE.AxesHelper(10);

//////////////////////////////////////////// Sizes //////////////////////////////////////////
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

//////////////////////////////////////// Camera ///////////////////////////////////////
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  10000
);

///////////////////////////////////// Main Canvas ////////////////////////////////////
const canvas = document.getElementById("webgl");
renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

let earth, eDraw, satellite, sDraw, physics, rock, rocksObject, rockdraw;

const passValues = (values) => {
  /////////////////////////////// Earth Object ///////////////////////////////////////////
  earth = new Earth(values.earth_mass, 6400000, 1);
  eDraw = earth.draw();

  /////////////////////////////// rocks Object ///////////////////////////////////////////
  rock = new Rocks(2500, new THREE.Vector3(-13.390235, 0, -4.503092));
  rocksObject = new THREE.Object3D();
  rockdraw = rock.draw(new THREE.Vector3(-13.271078, 0, -4.692192));



  ///////////////////////////////// Satellite Object ///////////////////////////////////////
  satellite = new Satellite(
    parseFloat(values.satellite_mass),
    new THREE.Vector3(parseFloat(values.radios), 0, 0)
  );
  satellite.velocity.z = parseFloat(values.velocity);
  sDraw = satellite.draw(new THREE.Vector3(12, 0, 0));

  ///////////////////////////////////// Physics Object /////////////////////////////////////
  physics = new Physics(earth, satellite);
  physics.Fr_rad = values.air_resistance_distance;
  physics.D = values.air_density;
};

//////////////////////////////////////////// init function ///////////////////////////////
const init = () => {
  //////////////// drawing the earth ////////////
  scene.add(eDraw.sphere);
  scene.add(eDraw.aSphere);
  scene.add(eDraw.A1sphere);
  scene.add(eDraw.A2sphere);


  ////////////////////// renderer ///////////////////////////////
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });


  scene.add(sDraw.pivotPoint);
  scene.add(sDraw.AmbientLight);

  ////////////// drawing the rocks ///////////
  scene.add(rockdraw.object);
  scene.add(rockdraw.AmbientLight);

  ///////////// drawing the axes helper for the earth //////////////
  // scene.add(axesHelper);

  //////////////////////// resizing the window /////////////////////////
  window.addEventListener("resize", () => {
    //update sizes
    sizes.width = innerWidth;
    sizes.height = innerHeight;
    //update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    //update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  });

  ////////////////////////// adding the camera ///////////////////
  camera.position.z = 15;
  scene.add(camera);

  ////////////////////////////////////// Defining Camera Controls ///////////////////////////////////
  orbitControls = new OrbitControls(camera, renderer.domElement);

  //////////////////// drawing the scene //////////////////////////
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);

  ////////////////// orbit controls /////////////////////////
  orbitControls.enableDamping = true;
  orbitControls.update();

  //////////////////// drawing the space //////////////////////////
  const textureLoader = new THREE.TextureLoader();
  const SpaceTexture = textureLoader.load(
    "/textures/galaxy_starfield.png",
    () => {
      const space = new THREE.WebGLCubeRenderTarget(SpaceTexture.image.height);
      space.fromEquirectangularTexture(renderer, SpaceTexture);
      scene.background = space.texture;
    }
  );
};

////////////// stop scene and open menu ///////////////
const control_menu = document.querySelector(".control-menu");

const toggleMenu = document.querySelector(".v");
toggleMenu.addEventListener("click", () => {
  if (paused) {
    paused = false;
    orbitControls.enabled = true;
    control_menu.style.display = "none";
    values_menu.style.display = "grid";
    tick();
  } else if (!paused) {
    orbitControls.enabled = false;
    control_menu.style.display = "grid";
    values_menu.style.display = "none";

    paused = true;
  }
});

//////////////////////////////////////////// control menu ////////////////////////////////////
const plus_radios = document.querySelector(".plus-radios");
const minus_radios = document.querySelector(".minus-radios");
const plus_velocity = document.querySelector(".plus-velocity");
const minus_velocity = document.querySelector(".minus-velocity");

const num_radios = document.querySelector(".num-radios");
const num_velocity = document.querySelector(".num-velocity");

const nr = document.querySelector(".nr");
const nv = document.querySelector(".nv");

const updateRadios = (radios) => {
  num_radios.innerText =
    radios < 50000000 && radios > 6400000 ? `${radios}` : radios;
};

const updateVelocity = (velocity) => {
  num_velocity.innerText =
    velocity < 20000 && velocity > 0 ? `${velocity}` : velocity;
};

///////////////////////////////////////////////// Movement ////////////////////////////////////////////////////////////////
let boolean = false;
let boolean2 = true;

const rock_mass = document.querySelector(".rock_mass");
const rock_velocity = document.querySelector(".rock_velocity");

const tick = () => {
  let a = Math.ceil(physics.execute().satellite.x) / 1000000;
  let b = Math.ceil(physics.execute().satellite.z) / 1000000;

  eDraw.sphere.rotation.y += 0.002;
  eDraw.aSphere.rotation.y += 0.001;
  eDraw.A1sphere.rotation.y += 0.003;
  eDraw.A2sphere.rotation.y += 0.001;


  const d = Math.pow(10, 9);
  const auto_rotate = document.querySelector('.num-auto');
  auto_rotate.addEventListener("click", () => {
    if (auto) {
      orbitControls.autoRotate = false;
      orbitControls.autoRotateSpeed = 2;
      auto = false;
    }

    else {
      orbitControls.autoRotate = true;
      orbitControls.autoRotateSpeed = 2;
      auto = true
    }
  })


  let current_radios = parseInt(physics.execute().radios);
  let current_velocity = parseInt(physics.execute().v);

  nr.innerText = `${current_radios}`;
  nv.innerText = `${current_velocity}`;
  0
  if (paused) {
    num_radios.innerText = `${current_radios}`;
    num_velocity.innerText = `${current_velocity}`;

    plus_radios.addEventListener("click", () => {
      updateRadios((current_radios += 300000));
      physics.updateRadios(current_radios);
    });

    minus_radios.addEventListener("click", () => {
      updateRadios((current_radios -= 300000));
      physics.updateRadios(current_radios);
    });

    plus_velocity.addEventListener("click", () => {
      updateVelocity((current_velocity += 200));
      physics.updateVelocity(current_velocity);
    });

    minus_velocity.addEventListener("click", () => {
      updateVelocity((current_velocity -= 200));
      physics.updateVelocity(current_velocity);
    });
  }

  sDraw.object.position.x = a;
  sDraw.object.position.z = b;

  

  if ((parseInt(a) == parseInt(rockdraw.object.position.x)) && (parseInt(b) == parseInt(rockdraw.object.position.z)) && boolean2) {
    physics.collision(parseInt(rock_mass.value), parseInt(rock_velocity.value));
    console.log(rock_mass.value +" "+ rock_velocity.value)
    boolean = true
  }
  
  if (boolean) {
    rockdraw.object.position.x = a;
    rockdraw.object.position.z = b;
    boolean2 = false;
  }


  const point = new Point(a, b);
  point.draw(scene);

  orbitControls.update(0.1);
  renderer.render(scene, camera);

  let req;
  if (!paused) {
    req = requestAnimationFrame(tick);
  } else if (paused) cancelAnimationFrame(req);
  if (physics.check()) {
    const tot = document.getElementById("tudo");
    tot.style.display = "block";
    cancelAnimationFrame(req);
  }
};

////////////////////////////////////// start functionality //////////////////////////////////////

start.addEventListener("click", () => {
  passValues(getValues());

  init();
  tick();
  canvas.style.display = "block";
  canvas1.style.display = "none";
  canvas2.style.display = "none";
  form1.style.display = "none";
  form2.style.display = "none";
  start.style.display = "none";
  playPause.style.display = "block";
  values_menu.style.display = "grid";
});

//////////////////////////////////////// Landing Page //////////////////////////////////////////
let renderer1, renderer2;
const camera1 = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  10000
);

const camera2 = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  10000
);

const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();

const landing_satellite = new Landing(10, "satellite");
const sDraw1 = landing_satellite.draw(new THREE.Vector3(17.5, 7.5, 0));

const landing_earth = new Landing(1, "earth");
const eDraw1 = landing_earth.draw(new THREE.Vector3(-2.5, 7.5, 0));

const canvas1 = document.getElementById("re");
renderer1 = new THREE.WebGLRenderer({
  canvas: canvas1,
  alpha: true,
});

const init1 = () => {
  renderer1 = new THREE.WebGLRenderer({
    canvas: canvas1,
  });

  scene1.add(sDraw1.pivotPoint);
  scene1.add(sDraw1.AmbientLight);

  sDraw1.object.scale.set(2.5, 2.5, 2.5);
  eDraw1.object.scale.set(0.02, 0.02, 0.02);

  ////////////////////////// adding the camera ///////////////////
  camera1.position.z = 15;
  scene1.add(camera1);

  //////////////////// drawing the scene //////////////////////////
  renderer1.setClearColor(0xffffff, 0);
  document.body.appendChild(renderer1.domElement);
  renderer1.setSize(sizes.width, sizes.height);
  renderer1.render(scene1, camera1);
};

const tick1 = () => {
  renderer1.render(scene1, camera1);
  sDraw1.object.rotation.y += 0.01;
  sDraw1.object.rotation.z += 0.01;
  eDraw1.object.rotation.y += 0.01;
  eDraw1.object.rotation.z += 0.01;
  requestAnimationFrame(tick1);
};

init1();
tick1();

const canvas2 = document.getElementById("req");
renderer2 = new THREE.WebGLRenderer({
  canvas: canvas2,
  alpha: true,
});

const init2 = () => {
  renderer2 = new THREE.WebGLRenderer({
    canvas: canvas2,
  });

  scene2.add(eDraw1.pivotPoint);
  scene2.add(eDraw1.AmbientLight);

  eDraw1.object.scale.set(0.02, 0.02, 0.02);

  ////////////////////////// adding the camera ///////////////////
  camera2.position.z = 15;
  scene2.add(camera2);

  //////////////////// drawing the scene //////////////////////////
  renderer2.setClearColor(0xffffff, 0);
  document.body.appendChild(renderer2.domElement);
  renderer2.setSize(sizes.width, sizes.height);
  renderer2.render(scene2, camera2);
};

const tick2 = () => {
  renderer2.render(scene2, camera2);
  eDraw1.object.rotation.y += 0.01;
  eDraw1.object.rotation.z += 0.01;
  requestAnimationFrame(tick2);
};

init2();
tick2();

const yes = document.querySelector(".yes");
yes.addEventListener("click", () => {
  location.reload();
});
