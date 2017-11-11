import * as THREE from 'three'
import EventBus from '../EventBus'
import styles from './Renderer.css'
import getState from '../store'
import '../vendor/OrbitControls'
import '../vendor/TransformControls'
import selectObject from '../actions/selectObject'
import translateObject from '../actions/translateObject'
import rotateObject from '../actions/rotateObject'
import scaleObject from '../actions/scaleObject'
import changeSlideView from '../actions/changeSlideView'
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
  transformControls.addEventListener('change', () => {
    const { object } = transformControls
    const id = objectIds.get(object)
    EventBus.dispatchEvent(translateObject(id, object.position.toArray()))
    EventBus.dispatchEvent(rotateObject(id, object.rotation.toArray()))
    EventBus.dispatchEvent(scaleObject(id, object.scale.toArray()))
  })
  transformControls.addEventListener('mouseDown', () => {
    orbitControls.enabled = false
  })
  transformControls.addEventListener('mouseUp', () => {
    orbitControls.enabled = true
  })
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
  const objectIds = new Map()
  // For example: string "#ffffff" is converted to number 0xffffff = 16777215
  const hexColorToDecimal = color => parseInt(color.match(/.(.*)/)[1], 16)
  EventBus.addEventListener(
    'object-added', ({ detail: { type, id, color } }) => {
      const decimalColor = hexColorToDecimal(color)
      let object3d
      if (type === 'circle') {
        object3d = new THREE.Mesh(
          new THREE.CircleGeometry(1, 32),
          new THREE.MeshBasicMaterial({
            color: decimalColor,
            side: THREE.DoubleSide
          })
        )
      } else {
        object3d = new THREE.Mesh(
          {
            box: new THREE.BoxGeometry(1, 1, 1),
            cylinder: new THREE.CylinderGeometry(1, 1, 3, 32),
            sphere: new THREE.SphereGeometry(1, 32, 32),
            icosahedron: new THREE.IcosahedronGeometry(1, 0),
            torus: new THREE.TorusGeometry(1, 0.5, 16, 100)
          }[type],
          new THREE.MeshPhongMaterial({
            color: decimalColor,
            side: THREE.DoubleSide
          })
        )
      }
      objects.set(id, object3d)
      objectIds.set(object3d, id)
      scene.add(object3d)
      EventBus.dispatchEvent(selectObject(id))
    }
  )
  EventBus.addEventListener('object-selected', ({ detail: { id } }) => {
    transformControls.attach(objects.get(id))
  })
  const mousePosition = (element, event) => {
    const rect = element.getBoundingClientRect()
    const normal = {
      x: (event.clientX - rect.left) / rect.width * element.width,
      y: (event.clientY - rect.top) / rect.height * element.height
    }
    const webgl = {
      x: (normal.x / rect.width) * 2 - 1,
      y: -(normal.y / rect.height) * 2 + 1
    }
    return { normal, webgl }
  }
  renderer.domElement.addEventListener('click', event => {
    const { webgl: { x, y } } = mousePosition(renderer.domElement, event)
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(x, y)
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects([...objects.values()])
    if (intersects.length > 0) {
      EventBus.dispatchEvent(selectObject(objectIds.get(intersects[0].object)))
    }
  })
  EventBus.addEventListener(
    'object-color-changed', ({ detail: { id, color } }) => {
      const object3d = objects.get(id)
      object3d.material = object3d.material.clone()
      object3d.material.color.set(hexColorToDecimal(color))
    }
  )
  EventBus.addEventListener(
    'object-texture-changed', ({ detail: { id, blobUrl } }) => {
      const object3d = objects.get(id)
      object3d.material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(blobUrl),
        side: THREE.DoubleSide
      })
    }
  )
  EventBus.addEventListener(
    'object-translated', ({ detail: { id, position } }) => {
      const object3d = objects.get(id)
      object3d.position.set(...position)
    }
  )
  EventBus.addEventListener(
    'object-rotated', ({ detail: { id, rotation } }) => {
      const object3d = objects.get(id)
      object3d.rotation.set(...rotation)
    }
  )
  EventBus.addEventListener(
    'object-scaled', ({ detail: { id, scale } }) => {
      const object3d = objects.get(id)
      object3d.scale.set(...scale)
    }
  )
  EventBus.addEventListener(
    'transform-controls-mode-changed', ({ detail: { mode } }) => {
      transformControls.setMode(mode)
    }
  )
  EventBus.addEventListener(
    'object-cloned', ({ detail: { id, clonedFromId } }) => {
      const object3d = objects.get(clonedFromId)
      const clonedObject = object3d.clone()
      scene.add(clonedObject)
      objects.set(id, clonedObject)
      objectIds.set(clonedObject, id)
      EventBus.dispatchEvent(selectObject(id))
    }
  )
  EventBus.addEventListener('object-removed', ({ detail: { id } }) => {
    const object3d = objects.get(id)
    objects.delete(id)
    objectIds.delete(object3d)
    scene.remove(object3d)
    if (getState().selectedObject === id) {
      transformControls.detach()
    }
  })
  EventBus.addEventListener('slide-selected', ({ detail: { id } }) => {
    const slide = getState().slides.find(
      ({ id: currentId }) => currentId === id
    )
    const { view: { position, rotation } } = slide
    camera.position.set(...position)
    camera.rotation.set(...rotation)
  })
  EventBus.addEventListener('drawer-tab-selected', ({ detail: { name } }) => {
    if (name === 'slide') {
      orbitControls.enabled = false
    } else {
      orbitControls.enabled = true
    }
  })
  orbitControls.addEventListener('change', () => {
    EventBus.dispatchEvent(changeSlideView(getState().selectedSlide, {
      position: camera.position.toArray(),
      rotation: camera.rotation.toArray()
    }))
  })
  EventBus.addEventListener('start-changing-view', () => {
    orbitControls.enabled = true
  })
  EventBus.addEventListener('finished-changing-slide-view', () => {
    orbitControls.enabled = false
  })
  animate()
  return root
}
