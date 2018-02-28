import React from "react";
import { observer } from "mobx-react";
import OrbitControls from "./OrbitControls";
import TransformControls from "./TransformControls";
export default observer(
  class Controls extends React.Component {
    state = { isUsingTransformControls: false };
    constructor(props) {
      super(props);
      const { instance } = this.props;
      Promise.all([
        new Promise(resolve => {
          this.orbitControlsInstanceCallback = resolve;
        }),
        new Promise(resolve => {
          this.transformControlsInstanceCallback = resolve;
        })
      ]).then(
        ([
          orbitControls,
          { transformControls, transformControlsAttachedObject }
        ]) =>
          instance({
            orbitControls,
            transformControls,
            transformControlsAttachedObject
          })
      );
    }
    render() {
      const {
        orbitControlsEnabled,
        transformControlsEnabled,
        transformControlsMode,
        camera,
        domElement,
        object,
        view
      } = this.props;
      const { isUsingTransformControls } = this.state;
      const defaultPositionRotationAndScale = {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
      };
      // For brevity, tPosition means transformControls position
      // and cPosition means camera position.
      const {
        position: [tPositionX, tPositionY, tPositionZ],
        rotation: [tRotationX, tRotationY, tRotationZ],
        scale: [tScaleX, tScaleY, tScaleZ]
      } =
        object !== undefined ? object : defaultPositionRotationAndScale;
      const {
        viewPosition: [cPositionX, cPositionY, cPositionZ],
        viewRotation: [cRotationX, cRotationY, cRotationZ]
      } = view;
      return (
        <React.Fragment>
          <OrbitControls
            positionX={cPositionX}
            positionY={cPositionY}
            positionZ={cPositionZ}
            rotationX={cRotationX}
            rotationY={cRotationY}
            rotationZ={cRotationZ}
            enabled={!isUsingTransformControls && orbitControlsEnabled}
            onChange={(
              positionX,
              positionY,
              positionZ,
              rotationX,
              rotationY,
              rotationZ
            ) => {
              view.setView(
                [positionX, positionY, positionZ],
                [rotationX, rotationY, rotationZ]
              );
            }}
            instance={this.orbitControlsInstanceCallback}
            camera={camera}
            domElement={domElement}
          />
          <TransformControls
            positionX={tPositionX}
            positionY={tPositionY}
            positionZ={tPositionZ}
            rotationX={tRotationX}
            rotationY={tRotationY}
            rotationZ={tRotationZ}
            scaleX={tScaleX}
            scaleY={tScaleY}
            scaleZ={tScaleZ}
            enabled={transformControlsEnabled}
            onChange={(
              positionX,
              positionY,
              positionZ,
              rotationX,
              rotationY,
              rotationZ,
              scaleX,
              scaleY,
              scaleZ
            ) => {
              if (object === undefined) return;
              object.setPosition([positionX, positionY, positionZ]);
              object.setRotation([rotationX, rotationY, rotationZ]);
              object.setScale([scaleX, scaleY, scaleZ]);
            }}
            mode={transformControlsMode}
            instance={this.transformControlsInstanceCallback}
            camera={camera}
            domElement={domElement}
            onMouseDown={() => {
              this.setState({ isUsingTransformControls: true });
            }}
            onMouseUp={() => {
              this.setState({ isUsingTransformControls: false });
            }}
          />
        </React.Fragment>
      );
    }
  }
);
