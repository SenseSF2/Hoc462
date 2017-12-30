import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import EventBus from '../../EventBus'
import styles from './index.css'
import getState from '../../store'
import '../../vendor/OrbitControls'
import '../../vendor/TransformControls'
import '../../vendor/ThreeCSG'
import selectObject from '../../actions/selectObject'
import finishChangingSlideView from '../../actions/finishChangingSlideView'
import unselectAnimation from '../../actions/unselectAnimation'
import cancelAddingAnimation from '../../actions/cancelAddingAnimation'
import Objects from './Objects'
import AnimationsAndViews from './AnimationsAndViews'
import ObjectGroup from './ObjectGroup'
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
  camera.lookAt(gridHelper.position)
  const boundingBox = new THREE.BoxHelper(undefined, 0xffffff)
  // this plane is only used to insert object at the center of the renderer
  // using raycasting
  const raycastingPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
  )
  raycastingPlane.rotation.x = Math.PI / 2
  window.raycastingPlane = raycastingPlane
  const orbitControls = new THREE.OrbitControls(camera, renderer.domElement)
  const transformControls = new THREE.TransformControls(camera, renderer.domElement)
  transformControls.setSpace('world')
  let orbitControlsOriginalEnabledState
  let isObjectSelectionEnabled = true
  transformControls.addEventListener('mouseDown', () => {
    orbitControlsOriginalEnabledState = orbitControls.enabled
    orbitControls.enabled = false
    isObjectSelectionEnabled = false
  })
  transformControls.addEventListener('mouseUp', () => {
    orbitControls.enabled = orbitControlsOriginalEnabledState
    isObjectSelectionEnabled = true
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
    TWEEN.update()
    transformControls.update()
    orbitControls.update()
    boundingBox.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(animate)
  }
  const objects = new Map()
  const objectIds = new Map()
  const mousePosition = (element, rawEvent) => {
    let event
    if (rawEvent.touches !== undefined) {
      event = rawEvent.touches[0]
    } else {
      event = rawEvent
    }
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
  const rendererClickHandler = event => {
    if (getState().isAddingAnimation) return
    if (!isObjectSelectionEnabled) return
    const { webgl: { x, y } } = mousePosition(renderer.domElement, event)
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(x, y)
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(
      [].concat(...[...objects.values()].map(
        object => object.type === 'Group' ? object.children : object
      ))
    )
    if (intersects.length > 0) {
      EventBus.dispatchEvent(selectObject(
        objectIds.get(intersects[0].object) ||
        objectIds.get(intersects[0].object.parent)
      ))
    }
  }
  renderer.domElement.addEventListener('mousedown', rendererClickHandler)
  renderer.domElement.addEventListener('touchstart', rendererClickHandler)
  Objects(
    scene, camera, raycastingPlane, objects,
    objectIds, boundingBox, transformControls
  )
  ObjectGroup(objects, objectIds, scene)
  EventBus.addEventListener(
    'transform-controls-mode-changed', ({ detail: { mode } }) => {
      transformControls.setMode(mode)
    }
  )
  const setCameraPositionAndRotation = (id = getState().selectedSlide) => {
    const slide = getState().slides.find(
      ({ id: currentId }) => currentId === id
    )
    if (slide === undefined) {
      return
    }
    const { view: { position, rotation } } = slide
    camera.position.set(...position)
    camera.rotation.set(...rotation)
  }
  const resetObjectStates = () => {
    const objectStates = getState().objects
    for (let object of objectStates) {
      const object3d = objects.get(object.id)
      object3d.position.set(...object.position)
      object3d.rotation.set(...object.rotation)
      object3d.scale.set(...object.scale)
    }
  }
  const stopAllPendingTasks = () => {
    EventBus.dispatchEvent(cancelAddingAnimation())
    EventBus.dispatchEvent(finishChangingSlideView())
    EventBus.dispatchEvent(unselectAnimation(getState().selectedSlide))
    resetObjectStates()
  }
  const { previewLastAnimationOfPreviousSlide } =
    AnimationsAndViews(
      scene, camera, orbitControls, objects, transformControls,
      stopAllPendingTasks, resetObjectStates, setCameraPositionAndRotation,
      gridHelper, boundingBox
    )
  EventBus.addEventListener('slide-selected', () => {
    stopAllPendingTasks()
    setCameraPositionAndRotation()
    previewLastAnimationOfPreviousSlide()
  })
  EventBus.addEventListener('slide-removed', ({ detail: { id } }) => {
    previewLastAnimationOfPreviousSlide()
    if (id === getState().selectedSlide) {
      stopAllPendingTasks()
    }
  })
  EventBus.addEventListener('drawer-tab-selected', ({ detail: { name } }) => {
    EventBus.dispatchEvent(finishChangingSlideView())
    if (name === 'slide') {
      orbitControls.enabled = false
      setCameraPositionAndRotation()
    } else {
      orbitControls.enabled = true
    }
  })
  EventBus.addEventListener('drawer-tab-selected', ({ detail: { name } }) => {
    if (name === 'world') {
      EventBus.dispatchEvent(cancelAddingAnimation())
      stopAllPendingTasks()
      orbitControls.enabled = true
    }
    if (name === 'slide') {
      transformControls.detach()
    }
  })
  const resetRenderer = () => {
    for (let object of objects.values()) {
      scene.remove(object)
    }
    objects.clear()
    objectIds.clear()
    stopAllPendingTasks()
  }
  EventBus.addEventListener('room-planner-reset', resetRenderer)
  animate()
  return root
}
