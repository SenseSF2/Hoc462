import React from "react";
import ThreeBSP from "../../vendor/ThreeCSG";
import { observer } from "mobx-react";
/* global THREE */
@observer
export default class ObjectGroup extends React.Component {
  itsTimeToStop = false;
  group = new THREE.Group();
  boundingBox = new THREE.BoxHelper(undefined, 0xffffff);
  solids = [];
  holes = [];
  constructor(props) {
    super(props);
    this.boundingBox.setFromObject(this.group);
    this.props.instance(this.group, this.boundingBox);
    const animate = () => {
      if (this.itsTimeToStop) return;
      const object = this.props.object;
      this.boundingBox.update();
      this.boundingBox.visible = this.props.selected;
      this.group.position.set(...object.position.slice());
      this.group.rotation.set(
        ...object.rotation.slice().map(angle => angle / 180 * Math.PI)
      );
      this.group.scale.set(...object.scale.slice());
      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
  }
  componentWillUnmount() {
    this.props.remove(this.group, this.boundingBox);
    this.itsTimeToStop = true;
  }
  recalculateGroup() {
    this.group.remove(...this.group.children);
    const convertToBSP = object3D => {
      const geometry = object3D.geometry.clone();
      object3D.updateMatrix();
      geometry.applyMatrix(object3D.matrix);
      return new ThreeBSP(geometry);
    };
    for (let i = 0; i < this.solids.length; i++) {
      let solidBSP = convertToBSP(this.solids[i]);
      this.holes.map(convertToBSP).forEach(holeBSP => {
        solidBSP = solidBSP.subtract(holeBSP);
      });
      this.group.add(solidBSP.toMesh(this.solids[i].material));
    }
  }
  add = (object3D, isHole) => {
    if (isHole) {
      this.holes.push(object3D);
    } else {
      this.solids.push(object3D);
    }
    this.recalculateGroup();
  };
  update = (object3D, isHole) => {
    if (isHole) {
      if (this.solids.includes(object3D)) {
        this.solids.splice(this.solids.indexOf(object3D), 1);
        this.holes.push(object3D);
      }
    }
    if (!isHole) {
      if (this.holes.includes(object3D)) {
        this.holes.splice(this.holes.indexOf(object3D), 1);
        this.solids.push(object3D);
      }
    }
    this.recalculateGroup();
  };
  remove = object3D => {
    if (this.solids.includes(object3D)) {
      this.solids.splice(this.solids.indexOf(object3D), 1);
    }
    if (this.holes.includes(object3D)) {
      this.holes.splice(this.holes.indexOf(object3D), 1);
    }
    this.recalculateGroup();
  };
  render = () =>
    this.props.children({
      add: this.add,
      update: this.update,
      remove: this.remove
    });
}
