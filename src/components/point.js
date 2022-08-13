import * as THREE from "three";

export default class Point {
  constructor(x, z) {
    this.x = x;
    this.z = z;
  }

  draw = (scene) => {
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(this.x, 0, this.z));
    var dotMaterial = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: false,
    });
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(dot);
  };
}
