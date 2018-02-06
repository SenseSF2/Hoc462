import React from 'react'
import { observer } from 'mobx-react'
import * as THREE from 'three'
import '../../vendor/OrbitControls'
import '../../vendor/ThreeCSG'
import '../../vendor/TransformControls'
import styles from './index.css'
import Controls from './Controls'
import Object3D from './Object3D'
import onObject3DClick from './onObject3DClick'
@observer
export default class Renderer extends React.Component {
  itsTimeToStop = false
  constructor (props) {
    super(props)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    this.domElement = renderer.domElement
    const scene = this.scene = new THREE.Scene()
    const camera = this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    )
    const pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(1, 1, 2)
    camera.add(pointLight)
    const gridHelper = new THREE.GridHelper(40, 80)
    scene.add(gridHelper)
    camera.position.z = 5
    camera.lookAt(gridHelper.position)
    scene.add(camera)
    const boundingBox = new THREE.BoxHelper(undefined, 0xffffff)
    this.onObject3DClick = onObject3DClick(camera, renderer.domElement)
    let oldWidth = 0
    let oldHeight = 0
    const animate = () => {
      if (this.itsTimeToStop) return
      const newWidth = this.root.clientWidth
      const newHeight = this.root.clientHeight
      if (newWidth !== oldWidth || newHeight !== oldHeight) {
        [oldWidth, oldHeight] = [newWidth, newHeight]
        camera.aspect = this.root.clientWidth / this.root.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(this.root.clientWidth, this.root.clientHeight)
      }
      renderer.render(scene, camera)
      window.requestAnimationFrame(animate)
    }
    window.requestAnimationFrame(animate)
  }
  componentDidMount () {
    this.root.appendChild(this.domElement)
  }
  componentWillUnmount () {
    this.itsTimeToStop = true
  }
  render () {
    const { objects, selectedSlide, uiState } = this.props
    const { transformControlsMode } = uiState
    const isAnObjectSelected = objects.selected !== undefined
    const defaultPositionRotationAndScale = {
      position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1]
    }
    // For brevity, tPosition means transformControls position
    // and cPosition means camera position.
    const {
      position: [tPositionX, tPositionY, tPositionZ],
      rotation: [tRotationX, tRotationY, tRotationZ],
      scale: [tScaleX, tScaleY, tScaleZ]
    } = objects.selected !== undefined
      ? objects.selected
      : defaultPositionRotationAndScale
    const {
      viewPosition: [cPositionX, cPositionY, cPositionZ],
      viewRotation: [cRotationX, cRotationY, cRotationZ]
    } = selectedSlide !== undefined ? selectedSlide : uiState
    return (
      <React.Fragment>
        <div
          className={styles.renderer} ref={element => { this.root = element }}
        />
        <Controls
          camera={this.camera}
          domElement={this.domElement}
          orbitControlsEnabled
          transformControlsEnabled={objects.selected !== undefined}
          instance={() => {}}
          {...{
            tPositionX, tPositionY, tPositionZ,
            tRotationX, tRotationY, tRotationZ,
            tScaleX, tScaleY, tScaleZ,
            cPositionX, cPositionY, cPositionZ,
            cRotationX, cRotationY, cRotationZ
          }}
          instance={
            ({ transformControls, transformControlsAttachedObject }) =>
              this.scene.add(transformControls, transformControlsAttachedObject)
          }
          transformControlsChange={(
            positionX, positionY, positionZ,
            rotationX, rotationY, rotationZ,
            scaleX, scaleY, scaleZ
          ) => {
            if (objects.selected === undefined) return
            objects.selected.setPosition([positionX, positionY, positionZ])
            objects.selected.setRotation([rotationX, rotationY, rotationZ])
            objects.selected.setScale([scaleX, scaleY, scaleZ])
          }}
          orbitControlsChange={(
            positionX, positionY, positionZ,
            rotationX, rotationY, rotationZ
          ) => {
            if (selectedSlide !== undefined) {
              selectedSlide.setView(
                [positionX, positionY, positionZ],
                [rotationX, rotationY, rotationZ]
              )
            } else {
              uiState.setView(
                [positionX, positionY, positionZ],
                [rotationX, rotationY, rotationZ]
              )
            }
          }}
          transformControlsMode={transformControlsMode}
        />
        {objects.items.map(object => {
          let clickHandler
          return <Object3D
            key={object.id}
            textureType={object.texture.type}
            textureValue={object.texture.value}
            type={object.type}
            positionX={object.position[0]}
            positionY={object.position[1]}
            positionZ={object.position[2]}
            rotationX={object.rotation[0]}
            rotationY={object.rotation[1]}
            rotationZ={object.rotation[2]}
            scaleX={object.scale[0]}
            scaleY={object.scale[1]}
            scaleZ={object.scale[2]}
            instance={instance => {
              this.scene.add(instance)
              this.onObject3DClick.onClick(
                instance, clickHandler = () => objects.select(object)
              )
            }}
            remove={instance => {
              this.scene.remove(instance)
              this.onObject3DClick.removeClickHandler(instance, clickHandler)
            }}
          />
        })}
      </React.Fragment>
    )
  }
}
