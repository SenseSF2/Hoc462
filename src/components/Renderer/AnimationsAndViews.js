import TWEEN from '@tweenjs/tween.js'
import EventBus from '../../EventBus'
import getState from '../../store'
import changeSlideView from '../../actions/changeSlideView'
import changeAnimationDestination from
  '../../actions/changeAnimationDestination'
import changeTransformControlsMode from
  '../../actions/changeTransformControlsMode'
import hideDrawer from '../../actions/hideDrawer'
import showDrawer from '../../actions/showDrawer'
import hideCaption from '../../actions/hideCaption'
import showCaption from '../../actions/showCaption'
import selectDrawerTab from '../../actions/selectDrawerTab'
import lockCurrentDrawerTab from '../../actions/lockCurrentDrawerTab'
import unlockCurrentDrawerTab from '../../actions/unlockCurrentDrawerTab'
export default (
  scene, camera, orbitControls, objects, transformControls, stopAllPendingTasks,
  resetObjectStates, setCameraPositionAndRotation, gridHelper, boundingBox
) => {
  const previewLastAnimationOfPreviousSlide = (
    id = getState().selectedSlide
  ) => {
    resetObjectStates()
    const selectedSlide = getState().slides.find(
      ({ id: currentId }) => id === currentId
    )
    const previousSlideIndex = getState().slides.indexOf(selectedSlide) - 1
    const previousSlide = getState().slides[previousSlideIndex]
    if (previousSlide !== undefined) {
      const lastAnimationIndex = previousSlide.animations.length - 1
      const lastAnimation = previousSlide.animations[lastAnimationIndex]
      if (lastAnimation !== undefined) {
        previewAnimation(lastAnimation.id, previousSlide.id)
      }
    }
  }
  orbitControls.addEventListener('change', () => {
    if (getState().isSlideViewChanging) {
      EventBus.dispatchEvent(changeSlideView(getState().selectedSlide, {
        position: camera.position.toArray(),
        rotation: camera.rotation.toArray()
      }))
    }
  })
  EventBus.addEventListener('started-changing-view', () => {
    orbitControls.enabled = true
  })
  EventBus.addEventListener('finished-changing-slide-view', () => {
    orbitControls.enabled = false
  })
  EventBus.addEventListener('started-adding-animation', () => {
    orbitControls.enabled = true
    const object3d = objects.get(getState().selectedObject)
    const clone = object3d.clone()
    scene.remove(object3d)
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
      scene.add(object3d)
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
  const playSlideAnimations = async id => {
    previewLastAnimationOfPreviousSlide(id)
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
    scene.remove(gridHelper)
    scene.remove(boundingBox)
    await playSlideAnimations(id)
    scene.add(gridHelper)
    scene.add(boundingBox)
    EventBus.dispatchEvent(showDrawer())
    stopAllPendingTasks()
    setCameraPositionAndRotation()
    previewLastAnimationOfPreviousSlide()
  })
  EventBus.addEventListener('all-slides-played', async () => {
    EventBus.dispatchEvent(selectDrawerTab('caption'))
    EventBus.dispatchEvent(lockCurrentDrawerTab())
    scene.remove(gridHelper)
    scene.remove(boundingBox)
    for (let slide of getState().slides) {
      setCameraPositionAndRotation(slide.id)
      EventBus.dispatchEvent(showCaption(slide.id))
      await playSlideAnimations(slide.id)
    }
    EventBus.dispatchEvent(unlockCurrentDrawerTab())
    EventBus.dispatchEvent(selectDrawerTab('slide'))
    EventBus.dispatchEvent(hideCaption())
    scene.add(gridHelper)
    scene.add(boundingBox)
    stopAllPendingTasks()
    setCameraPositionAndRotation()
    previewLastAnimationOfPreviousSlide()
  })
  return { resetObjectStates, previewLastAnimationOfPreviousSlide }
}
