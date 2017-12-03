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
import finishAddingAnimation from '../actions/finishAddingAnimation'
import lockCurrentDrawerTab from '../actions/lockCurrentDrawerTab'
import unlockCurrentDrawerTab from '../actions/unlockCurrentDrawerTab'
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
        <div class="transform-controls-buttons"></div>
        <button class="${button} finish-adding-animation">
          Finish adding animation
        </button>
        <div class="no-object-selected">
          Please select an object to add animation.
        </div>
      </div>
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
  const addAnimationButton = root.querySelector('.add-animation')
  const finishAddingAnimationButton = root.querySelector(
    '.finish-adding-animation'
  )
  const noObjectSelectedElement = root.querySelector('.no-object-selected')
  const showHideAnimationButtons = () => {
    transformControlsButtons.style.display = 'none'
    if (isAnObjectSelected()) {
      addAnimationButton.style.display = ''
      finishAddingAnimationButton.style.display = 'none'
      noObjectSelectedElement.style.display = 'none'
    } else {
      addAnimationButton.style.display = 'none'
      finishAddingAnimationButton.style.display = 'none'
      noObjectSelectedElement.style.display = ''
    }
    if (getState().isAddingAnimation) {
      addAnimationButton.style.display = 'none'
      finishAddingAnimationButton.style.display = ''
      transformControlsButtons.style.display = ''
    }
  }
  showHideAnimationButtons()
  EventBus.addEventListener('object-selected', showHideAnimationButtons)
  EventBus.addEventListener('object-removed', showHideAnimationButtons)
  addAnimationButton.addEventListener('click', () => {
    EventBus.dispatchEvent(startAddingAnimation())
  })
  finishAddingAnimationButton.addEventListener('click', () => {
    EventBus.dispatchEvent(finishAddingAnimation(
      uniqueId(), getState().selectedSlide
    ))
  })
  EventBus.addEventListener('started-adding-animation', () => {
    EventBus.dispatchEvent(lockCurrentDrawerTab())
    showHideAnimationButtons()
  })
  EventBus.addEventListener('finished-adding-animation', () => {
    EventBus.dispatchEvent(unlockCurrentDrawerTab())
    showHideAnimationButtons()
  })
  return root
}
