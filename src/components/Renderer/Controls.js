import React from 'react'
import OrbitControls from './OrbitControls'
import TransformControls from './TransformControls'
export default class Controls extends React.Component {
  constructor (props) {
    super(props)
    const { instance } = this.props
    Promise.all([
      new Promise(resolve => { this.orbitControlsInstanceCallback = resolve }),
      new Promise(resolve => {
        this.transformControlsInstanceCallback = resolve
      })
    ]).then(([
      orbitControls, { transformControls, transformControlsAttachedObject }
    ]) =>
      instance({
        orbitControls, transformControls, transformControlsAttachedObject
      })
    )
  }
  render () {
    const {
      orbitControlsEnabled, transformControlsEnabled, transformControlsMode,
      cPositionX, cPositionY, cPositionZ, cRotationX, cRotationY, cRotationZ,
      tPositionX, tPositionY, tPositionZ, tRotationX, tRotationY, tRotationZ,
      tScaleX, tScaleY, tScaleZ, orbitControlsChange, transformControlsChange,
      camera, domElement
    } = this.props
    return (
      <React.Fragment>
        <OrbitControls
          positionX={cPositionX} positionY={cPositionY} positionZ={cPositionZ}
          rotationX={cRotationX} rotationY={cRotationY} rotationZ={cRotationZ}
          enabled={orbitControlsEnabled} onChange={orbitControlsChange}
          instance={this.orbitControlsInstanceCallback}
          camera={camera} domElement={domElement}
        />
        <TransformControls
          positionX={tPositionX} positionY={tPositionY} positionZ={tPositionZ}
          rotationX={tRotationX} rotationY={tRotationY} rotationZ={tRotationZ}
          scaleX={tScaleX} scaleY={tScaleY} scaleZ={tScaleZ}
          enabled={transformControlsEnabled} onChange={transformControlsChange}
          mode={transformControlsMode}
          instance={this.transformControlsInstanceCallback}
          camera={camera} domElement={domElement}
        />
      </React.Fragment>
    )
  }
}
