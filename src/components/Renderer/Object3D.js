import React from 'react'
import { observer } from 'mobx-react'
import * as THREE from 'three'
import {
  BOX, CIRCLE, CYLINDER, SPHERE, ICOSAHEDRON, TORUS, COLOR, IMAGE
} from '../../constants'
const hexColorToDecimal = color => parseInt(color.match(/.(.*)/)[1], 16)
@observer
export default class Object3D extends React.Component {
  componentWillMount () {
    this.instance = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff00ff })
    )
    this.props.instance(this.instance)
  }
  componentWillUnmount () {
    this.props.remove(this.instance)
  }
  render () {
    const {
      texture, type, positionX, positionY, positionZ,
      rotationX, rotationY, rotationZ,
      scaleX, scaleY, scaleZ
    } = this.props
    if (type === CIRCLE) {
      this.instance.geometry = new THREE.CircleGeometry(1, 32)
      this.instance.material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide
      })
    } else {
      this.instance.geometry = ({
        [BOX]: new THREE.BoxGeometry(1, 1, 1),
        [CYLINDER]: new THREE.CylinderGeometry(1, 1, 3, 32),
        [SPHERE]: new THREE.SphereGeometry(1, 32, 32),
        [ICOSAHEDRON]: new THREE.IcosahedronGeometry(1, 0),
        [TORUS]: new THREE.TorusGeometry(1, 0.5, 16, 100)
      })[type]
      this.instance.material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide
      })
    }
    if (texture.type === COLOR) {
      this.instance.material.color.setHex(hexColorToDecimal(texture.value))
    } else if (texture.type === IMAGE) {
      this.instance.material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(texture.value),
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5
      })
    }
    this.instance.position.set(positionX, positionY, positionZ)
    this.instance.rotation.set(
      ...[rotationX, rotationY, rotationZ].map(angle => angle / 180 * Math.PI)
    )
    this.instance.scale.set(scaleX, scaleY, scaleZ)
    return null
  }
}
