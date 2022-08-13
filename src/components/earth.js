import * as THREE from "three";

export default class Earth {
  constructor(mass, radios, D) {
    this.mass = mass;
    this.radios = radios;
    this.D = D;
    this.textureLoader = new THREE.TextureLoader();
    this.EarthTexture = this.textureLoader.load("/textures/earth3.jpg");
    this.AEarthTexture = this.textureLoader.load("/textures/earthcloudmap.jpg");
    this.A1EarthTexture = this.textureLoader.load(
      "/textures/earthcloudmaptrans.jpg"
    );
    this.A2EarthTexture = this.textureLoader.load("/textures/earthbump1k.jpg");
  }

  getEarthData = function () {
    return {
      mass: this.mass,
      radios: this.radios,
      D: this.D,
    };
  };
  draw = function () {
    const geometry = new THREE.SphereBufferGeometry(6, 64, 32);
    const material = new THREE.MeshBasicMaterial({
      map: this.EarthTexture,
      wireframe: false,
    });
    const sphere = new THREE.Mesh(geometry, material);

    const aGeometry = new THREE.SphereBufferGeometry(6.1, 64, 32);
    const aMaterial = new THREE.MeshBasicMaterial({
      map: this.AEarthTexture,
      wireframe: false,
      transparent: true,
      opacity: 0.3,
    });
    const aSphere = new THREE.Mesh(aGeometry, aMaterial);

    const A1geometry = new THREE.SphereBufferGeometry(6.07, 64, 32);
    const A1material = new THREE.MeshBasicMaterial({
      map: this.A1EarthTexture,
      wireframe: false,
      transparent: true,
      opacity: 0.3,
    });
    const A1sphere = new THREE.Mesh(A1geometry, A1material);

    const A2geometry = new THREE.SphereBufferGeometry(6.05, 64, 32);
    const A2material = new THREE.MeshBasicMaterial({
      map: this.A2EarthTexture,
      wireframe: false,
      transparent: true,
      opacity: 0.3,
    });
    const A2sphere = new THREE.Mesh(A2geometry, A2material);

    return {
      sphere,
      aSphere,
      A1sphere,
      A2sphere,
    };
  };
}
