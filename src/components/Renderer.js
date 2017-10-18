import * as THREE from 'three'
import EventBus from '../EventBus'
import styles from './Renderer.css'
require('../vendor/TransformControls')
export default () => {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  const root = document.createElement('div')
  root.classList.add(styles.renderer)
  root.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  )
  const transformControls = new THREE.TransformControls(camera, renderer.domElement)
  console.log(transformControls)
  scene.add(transformControls)
  camera.position.z = 5
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  )
  scene.add(box)
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
    renderer.render(scene, camera)
    window.requestAnimationFrame(animate)
  }
  const objects = new Map()
  EventBus.addEventListener('object-added', ({ detail: { type, id } }) => {
    /*
    const geometries = {
      plane: THREE.PlaneGeometry,
      box: THREE.BoxGeometry,
      circle: THREE.CircleGeometry,
      cylinder: THREE.CylinderGeometry,
      sphere: THREE.SphereGeometry,
      icosahedron: THREE.IcosahedronGeometry,
      torus: THREE.TorusGeometry,
      torusknot: THREE.TorusKnotGeometry,
      lathe: THREE.LatheGeometry,
      sprite: new Error("No, this object doesn't")
    }
    */
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    )
    objects.set(id, mesh)
    scene.add(mesh)
    transformControls.attach(mesh)
    scene.add(transformControls)
  })
  EventBus.addEventListener('object-removed', ({ detail: { id } }) => {
    const object3d = objects.get(id)
    scene.remove(object3d)
    scene.remove(transformControls)
  })
  animate()
  return root
}
