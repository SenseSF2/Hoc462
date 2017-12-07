import EventBus from '../EventBus'
import getState from '../store'
import uniqueId from '../uniqueId'
import styles from './SlideDrawer.css'
import { button } from './Button.css'
import TransformControlsButtons from './TransformControlsButtons'
import Animations from './Animations'
import startChangingView from '../actions/startChangingView'
import finishChangingSlideView from '../actions/finishChangingSlideView'
import startAddingAnimation from '../actions/startAddingAnimation'
import cancelAddingAnimation from '../actions/cancelAddingAnimation'
import finishAddingAnimation from '../actions/finishAddingAnimation'
import removeAnimation from '../actions/removeAnimation'
import lockCurrentDrawerTab from '../actions/lockCurrentDrawerTab'
import unlockCurrentDrawerTab from '../actions/unlockCurrentDrawerTab'
import editSlideCaption from '../actions/editSlideCaption'
export default () => {
  const root = document.createElement('div')
  root.classList.add(styles.slideDrawer)
  root.innerHTML = `
    <h1 class="notice">No slides selected</h1>
    <div class="slide-details">
      <h2>
        View:
        <button class="${button} set-view">Set view</button>
        <button class="${button} finish-setting-view">I am done</button>
      </h2>
      <h2>Animations: </h2>
      <div class="animations">
        <button class="${button} add-animation">Add animation</button>
        <button class="${button} remove-animation">Remove animation</button>
        <div class="transform-controls-buttons"></div>
        <button class="${button} cancel-adding-animation">
          Cancel adding animation
        </button>
        <button class="${button} finish-adding-animation">
          Finish adding animation
        </button>
        <div class="no-object-selected">
          Please select an object to add animation.
        </div>
      </div>
      <h2>Slide caption: </h2>
      <textarea class="caption" contenteditable></textarea>
    </div>
  `
  let transformControlsButtons = root.querySelector(
    '.transform-controls-buttons'
  )
  transformControlsButtons.replaceWith(
    transformControlsButtons = TransformControlsButtons()
  )
  const animationsElement = root.querySelector('.animations')
  animationsElement.appendChild(Animations())
  const notice = root.querySelector('.notice')
  EventBus.addEventListener('slide-selected', ({ detail: { id } }) => {
    notice.textContent = 'Selected slide: ' + getState().slides.find(
      ({ id: currentId }) => id === currentId
    ).name
    root.classList.add('slide-selected')
  })
  EventBus.addEventListener('slide-removed', ({ detail: { id } }) => {
    if (getState().selectedSlide === id) {
      notice.textContent = 'No slides selected'
      root.classList.remove('slide-selected')
    }
  })
  const setViewButton = root.querySelector('.set-view')
  const finishSettingViewButton = root.querySelector('.finish-setting-view')
  finishSettingViewButton.style.display = 'none'
  setViewButton.addEventListener('click', () => {
    EventBus.dispatchEvent(startChangingView())
  })
  finishSettingViewButton.addEventListener('click', () => {
    EventBus.dispatchEvent(finishChangingSlideView())
  })
  EventBus.addEventListener('start-changing-view', () => {
    setViewButton.style.display = 'none'
    finishSettingViewButton.style.display = ''
    EventBus.dispatchEvent(lockCurrentDrawerTab())
  })
  EventBus.addEventListener('finished-changing-slide-view', () => {
    finishSettingViewButton.style.display = 'none'
    setViewButton.style.display = ''
    EventBus.dispatchEvent(unlockCurrentDrawerTab())
  })
  const isAnObjectSelected = () => getState().objects.some(
    ({ id }) => id === getState().selectedObject
  )
  const selectedSlide =
    () => getState().slides.find(({ id }) => id === getState().selectedSlide)
  const isAnAnimationSelected = () =>
    selectedSlide() !== undefined &&
    selectedSlide().animations.some(
      ({ id }) => id === selectedSlide().selectedAnimation
    )
  const addAnimationButton = root.querySelector('.add-animation')
  const removeAnimationButton = root.querySelector('.remove-animation')
  const cancelAddingAnimationButton = root.querySelector(
    '.cancel-adding-animation'
  )
  const finishAddingAnimationButton = root.querySelector(
    '.finish-adding-animation'
  )
  const noObjectSelectedElement = root.querySelector('.no-object-selected')
  const showHideAnimationButtons = () => {
    transformControlsButtons.style.display = 'none'
    cancelAddingAnimationButton.style.display = 'none'
    finishAddingAnimationButton.style.display = 'none'
    removeAnimationButton.style.display = 'none'
    if (isAnObjectSelected()) {
      addAnimationButton.style.display = ''
      noObjectSelectedElement.style.display = 'none'
    } else {
      addAnimationButton.style.display = 'none'
      noObjectSelectedElement.style.display = ''
    }
    if (isAnAnimationSelected()) {
      removeAnimationButton.style.display = ''
    } else {
      removeAnimationButton.style.display = 'none'
    }
    if (getState().isAddingAnimation) {
      addAnimationButton.style.display = 'none'
      cancelAddingAnimationButton.style.display = ''
      finishAddingAnimationButton.style.display = ''
      transformControlsButtons.style.display = ''
    }
  }
  showHideAnimationButtons()
  EventBus.addEventListener('object-selected', showHideAnimationButtons)
  EventBus.addEventListener('object-removed', showHideAnimationButtons)
  EventBus.addEventListener('animation-selected', showHideAnimationButtons)
  EventBus.addEventListener('animation-removed', showHideAnimationButtons)
  addAnimationButton.addEventListener('click', () => {
    EventBus.dispatchEvent(startAddingAnimation())
  })
  cancelAddingAnimationButton.addEventListener('click', () => {
    EventBus.dispatchEvent(cancelAddingAnimation())
  })
  finishAddingAnimationButton.addEventListener('click', () => {
    EventBus.dispatchEvent(finishAddingAnimation(
      uniqueId(), getState().selectedSlide
    ))
  })
  removeAnimationButton.addEventListener('click', () => {
    EventBus.dispatchEvent(removeAnimation(
      selectedSlide().selectedAnimation, selectedSlide().id
    ))
  })
  EventBus.addEventListener('started-adding-animation', () => {
    EventBus.dispatchEvent(lockCurrentDrawerTab())
    showHideAnimationButtons()
  })
  EventBus.addEventListener('canceled-adding-animation', () => {
    EventBus.dispatchEvent(unlockCurrentDrawerTab())
    showHideAnimationButtons()
  })
  EventBus.addEventListener('finished-adding-animation', () => {
    EventBus.dispatchEvent(unlockCurrentDrawerTab())
    showHideAnimationButtons()
  })
  const captionElement = root.querySelector('.caption')
  captionElement.addEventListener('input', () => {
    EventBus.dispatchEvent(
      editSlideCaption(getState().selectedSlide, captionElement.value)
    )
  })
  const updateCaptionElement = () => {
    captionElement.value = selectedSlide().caption
  }
  EventBus.addEventListener('slide-selected', updateCaptionElement)
  EventBus.addEventListener('slide-removed', updateCaptionElement)
  return root
}
