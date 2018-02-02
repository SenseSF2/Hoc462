import React from 'react'
import * as THREE from 'three'
import { TRANSLATE, ROTATE, SCALE } from '../../constants'
export default class Controls extends React.Component {
  constructor (props) {
    super(props)
    const { camera, domElement, instance, transformControlsChange } = this.props
    this.orbitControls = new THREE.OrbitControls(camera, domElement)
    this.transformControls = new THREE.TransformControls(camera, domElement)
    this.transformControls.addEventListener('change', () => {
      transformControlsChange(
        this.transformControlsAttachedObject.position.x,
        this.transformControlsAttachedObject.position.y,
        this.transformControlsAttachedObject.position.z,
        this.transformControlsAttachedObject.rotation.x / Math.PI * 180,
        this.transformControlsAttachedObject.rotation.y / Math.PI * 180,
        this.transformControlsAttachedObject.rotation.z / Math.PI * 180,
        this.transformControlsAttachedObject.scale.x,
        this.transformControlsAttachedObject.scale.y,
        this.transformControlsAttachedObject.scale.z
      )
      this.updateTransformControls()
      this.transformControls.update()
    })
    this.transformControlsAttachedObject = new THREE.Mesh()
    const {
      orbitControls, transformControls, transformControlsAttachedObject
    } = this
    orbitControls.enableKeys = false
    instance({
      orbitControls, transformControls, transformControlsAttachedObject
    })
  }
  updateTransformControls () {
    const {
      positionX, positionY, positionZ, rotationX, rotationY, rotationZ,
      scaleX, scaleY, scaleZ
    } = this.props
    this.transformControlsAttachedObject.position.set(
      positionX, positionY, positionZ
    )
    this.transformControlsAttachedObject.rotation.set(
      ...[rotationX, rotationY, rotationZ].map(angle => angle / 180 * Math.PI)
    )
    this.transformControlsAttachedObject.scale.set(scaleX, scaleY, scaleZ)
  }
  render () {
    this.updateTransformControls()
    const {
      selectedObject, orbitControlsEnabled, transformControlsEnabled,
      transformControlsMode
    } = this.props
    this.transformControls.attach(this.transformControlsAttachedObject)
    this.orbitControls.enabled = orbitControlsEnabled
    if (!transformControlsEnabled) {
      this.transformControls.detach()
    }
    this.transformControls.setMode(({
      [TRANSLATE]: 'translate', [ROTATE]: 'rotate', [SCALE]: 'scale'
    })[transformControlsMode])
    return null
  }
}
