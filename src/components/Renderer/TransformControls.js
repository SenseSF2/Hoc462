import React from "react";
import { TRANSLATE, ROTATE, SCALE } from "../../constants";
/* global THREE */
export default class TransformControls extends React.Component {
  constructor(props) {
    super(props);
    const { camera, domElement, instance } = this.props;
    this.instance = new THREE.TransformControls(camera, domElement);
    this.instance.setSpace("world");
    this.transformControlsAttachedObject = new THREE.Mesh();
    instance({
      transformControls: this.instance,
      transformControlsAttachedObject: this.transformControlsAttachedObject
    });
    this.instance.addEventListener("change", () => {
      const {
        position,
        rotation,
        scale
      } = this.transformControlsAttachedObject;
      this.props.onChange(
        position.x,
        position.y,
        position.z,
        ...[rotation.x, rotation.y, rotation.z].map(
          angle => angle / Math.PI * 180
        ),
        scale.x,
        scale.y,
        scale.z
      );
      this.update();
    });
    this.instance.addEventListener("mouseUp", () => this.props.onMouseUp());
    this.instance.addEventListener("mouseDown", () => this.props.onMouseDown());
  }
  update() {
    const {
      positionX,
      positionY,
      positionZ,
      rotationX,
      rotationY,
      rotationZ,
      scaleX,
      scaleY,
      scaleZ,
      enabled
    } = this.props;
    if (enabled) {
      this.instance.attach(this.transformControlsAttachedObject);
    } else {
      this.instance.detach();
    }
    const { position, rotation, scale } = this.transformControlsAttachedObject;
    position.set(positionX, positionY, positionZ);
    rotation.set(
      ...[rotationX, rotationY, rotationZ].map(angle => angle / 180 * Math.PI)
    );
    scale.set(scaleX, scaleY, scaleZ);
  }
  componentWillReceiveProps(nextProps) {
    const { mode } = nextProps;
    if (mode !== this.props.mode) {
      this.instance.setMode(
        {
          [TRANSLATE]: "translate",
          [ROTATE]: "rotate",
          [SCALE]: "scale"
        }[mode]
      );
      // When mode is set to "scale", space is AUTOMATICALLY set to "local".
      // If I set it to "world" when mode is "scale", TransformControls won't work.
      // So I am resetting mode to "world" when previous mode is SCALE and current mode is not SCALE.
      if (mode !== SCALE && this.props.mode === SCALE) {
        this.instance.setSpace("world");
      }
    }
  }
  render() {
    this.update();
    return null;
  }
}
