import React from 'react'
import { observer } from 'mobx-react'
import * as THREE from 'three'
import {
  BOX, CIRCLE, CYLINDER, SPHERE, ICOSAHEDRON, TORUS, COLOR, IMAGE
} from '../../constants'
const hexColorToDecimal = color => parseInt(color.match(/.(.*)/)[1], 16)
@observer
export default class Object3D extends React.Component {
  itsTimeToStop = false
  constructor (props) {
    super(props)
    const {
      selected,
      positionX, positionY, positionZ,
      rotationX, rotationY, rotationZ,
      scaleX, scaleY, scaleZ
    } = this.props
    this.instance = new THREE.Mesh()
    this.boundingBox = new THREE.BoxHelper(undefined, 0xffffff)
    this.boundingBox.setFromObject(this.instance)
    this.props.instance(this.instance, this.boundingBox)
    this.setType(this.props.type)
    this.setTexture(this.props.textureType, this.props.textureValue)
    this.setPositionRotationAndScale(
      positionX, positionY, positionZ,
      rotationX, rotationY, rotationZ,
      scaleX, scaleY, scaleZ
    )
    this.showHideBoundingBox(selected)
    const animate = () => {
      this.boundingBox.update()
      window.requestAnimationFrame(animate)
    }
    window.requestAnimationFrame(animate)
  }
  componentWillUnmount () {
    this.props.remove(this.instance, this.boundingBox)
  }
  setType (type) {
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
  }
  setTexture (textureType, textureValue) {
    if (textureType === COLOR) {
      this.instance.material.color.setHex(hexColorToDecimal(textureValue))
    } else if (textureType === IMAGE) {
      this.instance.material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(textureValue),
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5
      })
    }
  }
  setPositionRotationAndScale (
    positionX, positionY, positionZ,
    rotationX, rotationY, rotationZ,
    scaleX, scaleY, scaleZ
  ) {
    this.instance.position.set(positionX, positionY, positionZ)
    this.instance.rotation.set(
      ...[rotationX, rotationY, rotationZ].map(angle => angle / 180 * Math.PI)
    )
    this.instance.scale.set(scaleX, scaleY, scaleZ)
  }
  showHideBoundingBox (selected) {
    if (selected) {
      this.boundingBox.visible = true
    } else {
      this.boundingBox.visible = false
    }
  }
  componentWillReceiveProps (nextProps) {
    const {
      textureType, textureValue, type, selected,
      positionX, positionY, positionZ,
      rotationX, rotationY, rotationZ,
      scaleX, scaleY, scaleZ
    } = nextProps
    if (type !== this.props.type) {
      this.setType(type)
    }
    if (
      type !== this.props.type ||
      textureType !== this.props.textureType ||
      textureValue !== this.props.textureValue
    ) {
      this.setTexture(textureType, textureValue)
    }
    this.setPositionRotationAndScale(
      positionX, positionY, positionZ,
      rotationX, rotationY, rotationZ,
      scaleX, scaleY, scaleZ
    )
    this.showHideBoundingBox(selected)
  }
  render () {
    return null
  }
}
