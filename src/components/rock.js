import * as THREE from "three";
import {
  GLTFLoader,
  GLTFParser,
} from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Rocks {
  constructor(mass, position) {
    this.mass = mass;
    this.position = position;
    this.velocity = new THREE.Vector3(0, 0, 7860);
    this.acceleration = new THREE.Vector3(0, 0, 0);
  }

  getRocksData = function () {
    return {
      position: this.position,
      mass: this.mass,
      radios: this.radios,
    };
  };

  goFar = function (userPosition) {
    this.position.x += userPosition.x;
    this.position.y += userPosition.y;
    this.position.z += userPosition.z;
  };

  goClose = function (userPosition) {
    this.position.x -= userPosition.x;
    this.position.y -= userPosition.y;
    this.position.z -= userPosition.z;
  };

  resetPosition = function () {
    this.position.x = 6400000;
    this.position.y = 0;
    this.position.z = 0;
  };

  draw = () => {
    const object = new THREE.Object3D();
    const loader = new GLTFLoader();

    loader.load(
      "models//rocks2//scene.gltf",
      (gltf) => {
        //scene.add( gltf.scene );
        let rocksModel = gltf.scene.children[0];
        object.add(rocksModel);
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
    object.position.set(this.position.x, this.position.y,this.position.z);
    pivotPoint.add(object);

    return {
      object,
      pivotPoint,
      AmbientLight,
    };
  };
}
