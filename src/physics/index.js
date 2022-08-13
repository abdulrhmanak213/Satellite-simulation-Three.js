import * as THREE from "three";

export default class Physics {
  constructor(earth, satellite) {
    this.gravity = new THREE.Vector3();
    this.totalForce = new THREE.Vector3(0, 0, 0);
    this.earth = earth;
    this.radios = 0;
    this.th = 0;
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.satellite = satellite;
    this.Fr_rad = 1400000;
    this.C = 0.001;
    this.D = 1.2;
  }

  //////////////////////////////////////////// execute func //////////////////////////////
  execute = function () {
    const dt = 2;

    this.radios = this.calcRadios();
    this.gravity = this.calcGravity(this.radios);
    let totalForce = this.calcTotalForce(this.gravity);
    let acceleration = this.calcAcceleration(totalForce);
    this.velocity = this.calcVelocity(acceleration, dt);
    this.satellite.position.x += this.velocity.x * dt;
    this.satellite.position.z += this.velocity.z * dt;
    let v = this.currentVelocity(this.velocity);
    return {
      satellite: this.satellite.position,
      radios: this.radios,
      v,
      FR: this.Fr_rad,
    };
  };

  //////////////////////////////////////// calc Func ///////////////////////////////
  calcRadios = () => {
    return Math.sqrt(
      Math.pow(this.satellite.position.x, 2) +
        Math.pow(this.satellite.position.z, 2)
    );
  };

  calcGravity = (radios) => {
    const G = 6.673 * Math.pow(10, -11);
    let grav = -(
      (this.earth.mass * G * this.satellite.mass) /
      Math.pow(radios, 2)
    );

    this.th = Math.atan2(this.satellite.position.z, this.satellite.position.x);
    this.gravity.x = grav * Math.cos(this.th);
    this.gravity.z = grav * Math.sin(this.th);

    return this.gravity;
  };

  currentG = (gravity) => {
    return Math.sqrt(gravity.x * gravity.x + gravity.z * gravity.z);
  };

  calcTotalForce = (gravity) => {
    this.totalForce.x = gravity.x;
    this.totalForce.z = gravity.z;
    if (this.radios - 6400000 <= this.Fr_rad) {
      let y = this.calcFr(this.C, this.D);
      this.totalForce.x += y.x;
      this.totalForce.z += y.z;
    }
    return this.totalForce;
  };
  calcFr = (C, D) => {
    let Fr = new THREE.Vector3(
      -1 * Math.PI * C * D * this.velocity.x,
      0,
      -1 * Math.PI * C * D * this.velocity.z
    );
    return Fr;
  };

  calcAcceleration = (totalForce) => {
    this.satellite.acceleration.x = totalForce.x / this.satellite.mass;
    this.satellite.acceleration.z = totalForce.z / this.satellite.mass;

    return this.satellite.acceleration;
  };

  calcVelocity = (acceleration, dt) => {
    this.satellite.velocity.x += acceleration.x * dt;
    this.satellite.velocity.z += acceleration.z * dt;
    return this.satellite.velocity;
  };

  updateRadios = (newRadios) => {
    this.radios = newRadios;
    let rx = this.radios * Math.cos(this.th);
    let rz = this.radios * Math.sin(this.th);
    this.satellite.position.x = rx;
    this.satellite.position.z = rz;
  };

  calcE = () => {
    let Ek =
      (this.satellite.mass * Math.pow(this.currentVelocity(this.velocity), 2)) /
      2;
    2;
    let Ep = this.satellite.mass * this.currentG(this.gravity) * this.radios;
    let E = Ek + Ep;
    return {
      E,
      Ep,
      Ek,
    };
  };

  check = () => {
    if (this.radios < this.earth.radios + 50000) {
      return true;
    }
    return false;
  };
  currentVelocity = (velocity) => {
    return Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
  };
  updateVelocity = (vel) => {
    let thz = Math.acos(
      this.velocity.z /
        Math.sqrt(
          this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z
        )
    );
    let thx = Math.acos(
      this.velocity.x /
        Math.sqrt(
          this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z
        )
    );
    this.velocity.x = vel * Math.cos(thx);
    this.velocity.z = vel * Math.cos(thz);
  };
  updateFr = (currentFr) => {
    this.Fr_rad += currentFr;
  };
  collision = (mass2,velocity2) => {
    
    let newV = ((this.satellite.mass * this.currentVelocity(this.velocity)) + (mass2 * velocity2)) / (mass2  + this.satellite.mass);
    this.updateVelocity(newV);  
  };

}
