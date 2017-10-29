import * as THREE from 'three'
import EventBus from '../EventBus'
import styles from './Renderer.css'
import getState from '../store'
import '../vendor/OrbitControls'
import '../vendor/TransformControls'
export default () => {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  const root = document.createElement('div')
  root.classList.add(styles.renderer)
  root.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  )
  const pointLight = new THREE.PointLight(0xffffff)
  pointLight.position.set(1, 1, 2)
  camera.add(pointLight)
  const gridHelper = new THREE.GridHelper(40, 80)
  scene.add(gridHelper)
  const orbitControls = new THREE.OrbitControls(camera, renderer.domElement)
  const transformControls = new THREE.TransformControls(camera, renderer.domElement)
  transformControls.setSpace('world')
  scene.add(transformControls)
  camera.position.z = 5
  scene.add(camera)
  let oldWidth = 0
  let oldHeight = 0
  const animate = () => {
    const newWidth = root.clientWidth
    const newHeight = root.clientHeight
    if (newWidth !== oldWidth || newHeight !== oldHeight) {
      [oldWidth, oldHeight] = [newWidth, newHeight]
      camera.aspect = root.clientWidth / root.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(root.clientWidth, root.clientHeight)
    }
    transformControls.update()
    orbitControls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(animate)
  }
  const objects = new Map()
  // For example: string "#ffffff" is converted to number 0xffffff = 16777215
  const hexColorToDecimal = color => parseInt(color.match(/.(.*)/)[1], 16)
  EventBus.addEventListener(
    'object-added', ({ detail: { type, id, color } }) => {
      const decimalColor = hexColorToDecimal(color)
      const object3d = new THREE.Mesh(
        {
          box: new THREE.BoxGeometry(1, 1, 1),
          circle: new THREE.CircleGeometry(1, 32),
          cylinder: new THREE.CylinderGeometry(1, 1, 3, 32),
          sphere: new THREE.SphereGeometry(1, 32, 32),
          icosahedron: new THREE.IcosahedronGeometry(1, 0),
          torus: new THREE.TorusGeometry(1, 0.5, 16, 100)
        }[type],
        new THREE.MeshPhongMaterial({ color: decimalColor })
      )
      objects.set(id, object3d)
      scene.add(object3d)
    }
  )
  EventBus.addEventListener('object-selected', ({ detail: { id } }) => {
    scene.add(transformControls)
    transformControls.attach(objects.get(id))
  })
  EventBus.addEventListener(
    'object-color-changed', ({ detail: { id, color } }) => {
      const object3d = objects.get(id)
      object3d.material.color.set(hexColorToDecimal(color))
    }
  )
  EventBus.addEventListener(
    'transform-controls-mode-changed', ({ detail: { mode } }) => {
      transformControls.setMode(mode)
    }
  )
  EventBus.addEventListener('object-removed', ({ detail: { id } }) => {
    const object3d = objects.get(id)
    scene.remove(object3d)
    if (getState().selectedObject === id) {
      scene.remove(transformControls)
    }
  })
  animate()
  return root
}
