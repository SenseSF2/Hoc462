import React from 'react'
import * as THREE from 'three'
export default class OrbitControls extends React.Component {
  constructor (props) {
    super(props)
    const {
      camera, domElement, instance, onChange
    } = this.props
    this.instance = new THREE.OrbitControls(camera, domElement)
    instance(this.instance)
    this.instance.enableKeys = false
    this.instance.addEventListener('change', () => {
      const { position, rotation } = camera
      onChange(
        position.x, position.y, position.z,
        ...[rotation.x, rotation.y, rotation.z].map(
          angle => angle / Math.PI * 180
        )
      )
      this.update()
    })
  }
  update () {
    const {
      positionX, positionY, positionZ,
      rotationX, rotationY, rotationZ,
      enabled, camera
    } = this.props
    this.instance.enabled = enabled
    // OrbitControls ignores current camera position, rotation and scale
    // while enabled.
    if (enabled) return
    const { position, rotation } = camera
    position.set(positionX, positionY, positionZ)
    rotation.set(...[rotationX, rotationY, rotationZ].map(
      angle => angle / 180 * Math.PI
    ))
  }
  render () {
    this.update()
    return null
  }
}
