import React from "react";
import * as THREE from "three";
export default class OrbitControls extends React.Component {
  changeEventEmittedWithinComponent = false;
  constructor(props) {
    super(props);
    const { camera, domElement, instance } = this.props;
    this.instance = new THREE.OrbitControls(camera, domElement);
    instance(this.instance);
    this.instance.enableKeys = false;
    this.instance.addEventListener("change", () => {
      const { position, rotation } = camera;
      if (!this.changeEventEmittedWithinComponent) {
        this.props.onChange(
          position.x,
          position.y,
          position.z,
          ...[rotation.x, rotation.y, rotation.z].map(
            angle => angle / Math.PI * 180
          )
        );
      }
      this.changeEventEmittedWithinComponent = false;
    });
  }
  update() {
    const {
      positionX,
      positionY,
      positionZ,
      rotationX,
      rotationY,
      rotationZ,
      enabled,
      camera
    } = this.props;
    this.instance.enabled = enabled;
    const { position, rotation } = camera;
    position.set(positionX, positionY, positionZ);
    rotation.set(
      ...[rotationX, rotationY, rotationZ].map(angle => angle / 180 * Math.PI)
    );
    this.changeEventEmittedWithinComponent = true;
    this.instance.update();
  }
  render() {
    this.update();
    return null;
  }
}
