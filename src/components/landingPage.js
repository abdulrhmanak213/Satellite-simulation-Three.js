import * as THREE from "three";
import {
  GLTFLoader,
  GLTFParser,
} from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Landing {
  constructor(light, type) {
    this.light = light;
    this.type = type;
  }

  draw = (location) => {
    const object = new THREE.Object3D();
    const loader = new GLTFLoader();

    loader.load(
      `models//${this.type}//scene.gltf`,
      (gltf) => {
        //scene.add( gltf.scene );
        let model = gltf.scene.children[0];
        object.add(model);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    const AmbientLight = new THREE.AmbientLight(0xffffff, this.light);
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
