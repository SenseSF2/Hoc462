import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
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
import finishChangingSlideView from '../actions/finishChangingSlideView'
import changeAnimationDestination from '../actions/changeAnimationDestination'
import changeTransformControlsMode from '../actions/changeTransformControlsMode'
import unselectAnimation from '../actions/unselectAnimation'
import cancelAddingAnimation from '../actions/cancelAddingAnimation'
import showDrawer from '../actions/showDrawer'
import hideDrawer from '../actions/hideDrawer'
import showCaption from '../actions/showCaption'
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
  transformControls.addEventListener('change', () => {
    if (getState().selectedDrawerTab !== 'world') return
    const { object } = transformControls
    const id = objectIds.get(object)
    EventBus.dispatchEvent(translateObject(id, object.position.toArray()))
    EventBus.dispatchEvent(rotateObject(id, object.rotation.toArray()))
    EventBus.dispatchEvent(scaleObject(id, object.scale.toArray()))
  })
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
      // move the object to the center of renderer by raycasting
      const raycaster = new THREE.Raycaster()
      const centerOfRenderer = new THREE.Vector2(0, 0)
      raycaster.setFromCamera(centerOfRenderer, camera)
      const intersects = raycaster.intersectObjects([raycastingPlane])
      if (intersects.length > 0) {
        EventBus.dispatchEvent(
          translateObject(id, intersects[0].point.toArray())
        )
      }
    }
  )
  EventBus.addEventListener('object-selected', ({ detail: { id } }) => {
    const object3d = objects.get(id)
    boundingBox.setFromObject(object3d)
    scene.add(boundingBox)
    if (getState().selectedDrawerTab === 'world') {
      transformControls.attach(object3d)
    }
  })
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
    const intersects = raycaster.intersectObjects([...objects.values()])
    if (intersects.length > 0) {
      EventBus.dispatchEvent(selectObject(objectIds.get(intersects[0].object)))
    }
  }
  renderer.domElement.addEventListener('mousedown', rendererClickHandler)
  renderer.domElement.addEventListener('touchstart', rendererClickHandler)
  EventBus.addEventListener(
    'object-color-changed', ({ detail: { id, color } }) => {
      const object3d = objects.get(id)
      object3d.material = object3d.material.clone()
      object3d.material.color.set(hexColorToDecimal(color))
    }
  )
  EventBus.addEventListener(
    'object-texture-changed', ({ detail: { id, url } }) => {
      const object3d = objects.get(id)
      object3d.material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(url),
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
      scene.remove(boundingBox)
      transformControls.detach()
    }
  })
  const setCameraPositionAndRotation = () => {
    const slide = getState().slides.find(
      ({ id: currentId }) => currentId === getState().selectedSlide
    )
    if (slide === undefined) {
      return
    }
    const { view: { position, rotation } } = slide
    camera.position.set(...position)
    camera.rotation.set(...rotation)
  }
  const stopAllPendingTasks = () => {
    EventBus.dispatchEvent(cancelAddingAnimation())
    EventBus.dispatchEvent(finishChangingSlideView())
    EventBus.dispatchEvent(unselectAnimation(getState().selectedSlide))
    resetObjectStates()
  }
  const previewLastAnimationOfPreviousSlide = () => {
    const selectedSlide = getState().slides.find(
      ({ id }) => id === getState().selectedSlide
    )
    const isAnAnimationSelected =
      selectedSlide !== undefined &&
      selectedSlide.animations.some(
        ({ id }) => id === selectedSlide.selectedAnimation
      )
    if (isAnAnimationSelected) return
    const previousSlideIndex = getState().slides.indexOf(selectedSlide) - 1
    const previousSlide = getState().slides[previousSlideIndex]
    if (previousSlide !== undefined) {
      const lastAnimationIndex = previousSlide.animations.length - 1
      const lastAnimation = previousSlide.animations[lastAnimationIndex]
      previewAnimation(lastAnimation.id, previousSlide.id)
    }
  }
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
  orbitControls.addEventListener('change', () => {
    if (getState().isSlideViewChanging) {
      EventBus.dispatchEvent(changeSlideView(getState().selectedSlide, {
        position: camera.position.toArray(),
        rotation: camera.rotation.toArray()
      }))
    }
  })
  EventBus.addEventListener('start-changing-view', () => {
    orbitControls.enabled = true
  })
  EventBus.addEventListener('finished-changing-slide-view', () => {
    orbitControls.enabled = false
  })
  EventBus.addEventListener('started-adding-animation', () => {
    orbitControls.enabled = true
    const object3d = objects.get(getState().selectedObject)
    const clone = object3d.clone()
    clone.material = new THREE.MeshBasicMaterial(
      { color: 0xff0000, side: THREE.DoubleSide }
    )
    scene.add(clone)
    transformControls.attach(clone)
    const transformControlsChangeHandler = () => {
      const position = clone.position.toArray()
      const rotation = clone.rotation.toArray()
      const scale = clone.scale.toArray()
      EventBus.dispatchEvent(
        changeAnimationDestination(position, rotation, scale)
      )
    }
    transformControls.addEventListener('change', transformControlsChangeHandler)
    const cleanUp = () => {
      scene.remove(clone)
      transformControls.removeEventListener(
        'change', transformControlsChangeHandler
      )
      transformControls.detach()
      orbitControls.enabled = false
      setCameraPositionAndRotation()
      EventBus.dispatchEvent(changeTransformControlsMode('translate'))
    }
    const finishedAddingAnimationHandler = () => {
      EventBus.removeEventListener(
        'finished-adding-animation', finishedAddingAnimationHandler
      )
      cleanUp()
    }
    const canceledAddingAnimationHandler = () => {
      EventBus.removeEventListener(
        'canceled-adding-animation', canceledAddingAnimationHandler
      )
      cleanUp()
    }
    EventBus.addEventListener(
      'finished-adding-animation', finishedAddingAnimationHandler
    )
    EventBus.addEventListener(
      'canceled-adding-animation', canceledAddingAnimationHandler
    )
  })
  const resetObjectStates = () => {
    const objectStates = getState().objects
    for (let object of objectStates) {
      const object3d = objects.get(object.id)
      object3d.position.set(...object.position)
      object3d.rotation.set(...object.rotation)
      object3d.scale.set(...object.scale)
    }
  }
  const previewAnimation = (id, slideId) => {
    resetObjectStates()
    const slide = getState().slides.find(
      ({ id: currentId }) => slideId === currentId
    )
    const animations = slide.animations
    for (let animation of animations) {
      const currentTarget = objects.get(animation.target)
      currentTarget.position.set(...animation.destination.position)
      currentTarget.rotation.set(...animation.destination.rotation)
      currentTarget.scale.set(...animation.destination.scale)
      if (animation.id === id) break
    }
  }
  EventBus.addEventListener(
    'animation-selected', ({ detail: { id, slideId } }) => {
      previewAnimation(id, slideId)
    }
  )
  EventBus.addEventListener(
    'animation-removed', ({ detail: { id, slideId } }) => {
      const isSelectedAnimationRemoved = id === getState().slides.find(
        ({ id: currentId }) => slideId === currentId
      ).selectedAnimation
      if (isSelectedAnimationRemoved) {
        resetObjectStates()
      }
    }
  )
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
  const playSlideAnimations = async id => {
    resetObjectStates()
    const slide = getState().slides.find(
      ({ id: currentId }) => currentId === id
    )
    const animations = slide.animations
    for (let animation of animations) {
      const object3d = objects.get(animation.target)
      const destination = object3d.clone()
      destination.position.set(...animation.destination.position)
      destination.rotation.set(...animation.destination.rotation)
      destination.scale.set(...animation.destination.scale)
      const promises = []
      for (let attribute of ['position', 'rotation', 'scale']) {
        let resolvePromise
        const promise = new Promise(resolve => { resolvePromise = resolve })
        promises.push(promise)
        new TWEEN.Tween(object3d[attribute])
          .to({
            x: destination[attribute].x,
            y: destination[attribute].y,
            z: destination[attribute].z
          }, animation.duration)
          .onComplete(resolvePromise)
          .start()
      }
      await Promise.all(promises)
    }
  }
  EventBus.addEventListener('slide-played', async ({ detail: { id } }) => {
    EventBus.dispatchEvent(hideDrawer())
    await playSlideAnimations(id)
    EventBus.dispatchEvent(showDrawer())
  })
  EventBus.addEventListener('all-slides-played', async () => {
    for (let slide of getState().slides) {
      EventBus.dispatchEvent(showCaption(slide.id))
      await playSlideAnimations(slide.id)
    }
  })
  animate()
  return root
}
