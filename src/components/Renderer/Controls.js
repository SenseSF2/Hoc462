import React from 'react'
import * as THREE from 'three'
export default class Controls extends React.Component {
  componentWillMount () {
    const { camera, domElement, instance } = this.props
    this.orbitControls = new THREE.OrbitControls(camera, domElement)
    this.transformControls = new THREE.TransformControls(camera, domElement)
    const { orbitControls, transformControls } = this
    orbitControls.enableKeys = false
    instance({ orbitControls, transformControls })
  }
  render () {
    const {
      selectedObject, orbitControlsEnabled, transformControlsEnabled
    } = this.props
    if (selectedObject !== undefined) {
      this.transformControls.attach(selectedObject)
    }
    this.orbitControls.enabled = orbitControlsEnabled
    if (!transformControlsEnabled) {
      this.transformControls.detach()
    }
    return null
  }
}
