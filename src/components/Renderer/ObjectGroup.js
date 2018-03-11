import React from "react";
import ThreeBSP from "../../vendor/ThreeCSG";
import { observer } from "mobx-react";
/* global THREE */
@observer
export default class ObjectGroup extends React.Component {
  group = new THREE.Group();
  solids = [];
  holes = [];
  constructor(props) {
    super(props);
    this.props.instance(this.group);
  }
  recalculateGroup() {
    [...this.group.children].forEach(child => this.group.remove(child));
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
      select: this.props.select,
      add: this.add,
      update: this.update,
      remove: this.remove
    });
}
