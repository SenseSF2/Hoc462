import React from 'react'
import { observer } from 'mobx-react'
import * as THREE from 'three'
import '../../vendor/OrbitControls'
import '../../vendor/ThreeCSG'
import '../../vendor/TransformControls'
import styles from './index.css'
import Controls from './Controls'
import Object3D from './Object3D'
@observer
export default class Renderer extends React.Component {
  itsTimeToStop = false
  componentWillMount () {
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
    // this plane is only used to insert object at the center of the renderer
    // using raycasting
    const raycastingPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
    )
    raycastingPlane.rotation.x = Math.PI / 2
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
    const { objects } = this.props
    return (
      <React.Fragment>
        <div
          className={styles.renderer} ref={element => { this.root = element }}
        />
        <Controls
          camera={this.camera}
          domElement={this.domElement}
          orbitControlsEnabled transformControlsEnabled
          instance={() => {}}
        />
        {objects.items.map(object =>
          <Object3D
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
            instance={instance => this.scene.add(instance)}
            remove={instance => this.scene.remove(instance)}
          />
        )}
      </React.Fragment>
    )
  }
}
