import * as THREE from "three";
import {
  GLTFLoader,
  GLTFParser,
} from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Satellite {
  constructor(mass, position) {
    this.mass = mass;
    this.position = position;
    this.velocity = new THREE.Vector3(0, 0, 7860);
    this.acceleration = new THREE.Vector3(0, 0, 0);
  }

  draw = (location) => {
    const object = new THREE.Object3D();
    const loader = new GLTFLoader();

    loader.load(
      "models//satellite//scene.gltf",
      (gltf) => {
        //scene.add( gltf.scene );
        let satelliteModel = gltf.scene.children[0];
        object.add(satelliteModel);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    const AmbientLight = new THREE.AmbientLight(0xffffff, 10);
    AmbientLight.position.set(
      object.position.x,
      object.position.y,
      object.position.z
    );

    AmbientLight.castShadow = true;
    const pivotPoint = new THREE.Object3D();
    object.rotation.z = 90;
    object.rotation.x = -40;
    object.position.set(location.x, location.y, location.z);
    pivotPoint.add(object);

    return {
      object,
      pivotPoint,
      AmbientLight,
    };
  };
}
