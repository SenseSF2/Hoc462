import EventBus from '../EventBus'
import getState from '../store'
import Renamable from './Renamable'
import { button } from './Button.css'
import styles from './Animations.css'
import changeAnimationDuration from '../actions/changeAnimationDuration'
import startChangingAnimationDuration from
  '../actions/startChangingAnimationDuration'
import moveAnimationLeft from '../actions/moveAnimationLeft'
import moveAnimationRight from '../actions/moveAnimationRight'
import selectAnimaton from '../actions/selectAnimation'
export default () => {
  const root = document.createElement('div')
  root.classList.add(styles.animations)
  root.innerHTML = `
    <div class="animations"></div>
    <div class="actions">
      <button class="${button} move-animation-left">
        Move animation left
      </button>
      <button class="${button} move-animation-right">
        Move animation right
      </button>
      <button class="${button} change-animation-duration">
        Change animation duration
      </button>
    </div>
    <div class="animation-player">
      <input type="range">
      <button class="${button}">Play</button>
      <button class="${button}">Pause</button>
      <button class="${button}">Stop</button>
    </div>
  `
  const displayScale = 50 / 1000
  const animationsElement = root.querySelector('.animations')
  const randomColors = []
  for (let i = 0; i < 100; i++) {
    randomColors.push('#' + (Math.random() * 0xffffff | 0).toString(16))
  }
  const selectedSlide =
    () => getState().slides.find(({ id }) => id === getState().selectedSlide)
  const isAnAnimationSelected = () =>
    selectedSlide() !== undefined &&
    selectedSlide().animations.some(
      ({ id }) => id === selectedSlide().selectedAnimation
    )
  const createAnimationElement = (id, slideId) => {
    const animation = () => getState()
      .slides.find(({ id }) => id === slideId)
      .animations.find(({ id: currentId }) => currentId === id)
    const animationElement = Renamable(
      animation().duration / 1000, 'number', ''
    )
    animationElement.classList.add('animation')
    animationElement.style.background = randomColors[id % randomColors.length]
    const displayDuration = () => {
      animationElement.style.width =
        animation().duration * displayScale + 'px'
    }
    displayDuration()
    animationElement.addEventListener('click', () => {
      EventBus.dispatchEvent(selectAnimaton(id, slideId))
    })
    EventBus.addEventListener(
      'animation-duration-changed', ({ detail: { id: currentId } }) => {
        if (id === currentId) { displayDuration() }
      }
    )
    EventBus.addEventListener(
      'started-changing-animation-duration',
      ({ detail: { id: currentId } }) => {
        if (id === currentId) {
          animationElement.dispatchEvent(new window.Event('start-renaming'))
          const input = animationElement.querySelector('input')
          input.style.width = animation().duration * displayScale + 'px'
          input.setAttribute('step', 0.01)
          const renamedHandler = ({ detail: { name: seconds } }) => {
            EventBus.dispatchEvent(
              changeAnimationDuration(id, +seconds * 1000)
            )
            animationElement.removeEventListener('renamed', renamedHandler)
          }
          animationElement.addEventListener('renamed', renamedHandler)
        }
      }
    )
    EventBus.addEventListener(
      'animation-moved-left', ({ detail: { id: currentId } }) => {
        if (id === currentId) {
          animationsElement.insertBefore(
            animationElement, animationElement.previousElementSibling
          )
        }
      }
    )
    EventBus.addEventListener(
      'animation-moved-right', ({ detail: { id: currentId } }) => {
        if (id === currentId) {
          animationsElement.insertBefore(
            animationElement,
            animationElement.nextElementSibling.nextElementSibling
          )
        }
      }
    )
    EventBus.addEventListener(
      'animation-selected', ({ detail: { id: currentId } }) => {
        if (id === currentId) {
          animationElement.classList.add('highlighted')
        } else {
          animationElement.classList.remove('highlighted')
        }
      }
    )
    EventBus.addEventListener(
      'animation-removed', ({ detail: { id: currentId } }) => {
        if (id === currentId) {
          animationElement.remove()
        }
      }
    )
    if (animation().id === selectedSlide().selectedAnimation) {
      animationElement.classList.add('highlighted')
    }
    return animationElement
  }
  const showAnimations = () => {
    animationsElement.innerHTML = ''
    const slide = selectedSlide()
    if (slide === undefined) return
    slide.animations.forEach(({ id }) => {
      animationsElement.appendChild(createAnimationElement(id, slide.id))
    })
  }
  showAnimations()
  EventBus.addEventListener('slide-selected', showAnimations)
  EventBus.addEventListener(
    'finished-adding-animation', ({ detail: { id, slideId } }) => {
      if (slideId !== getState().selectedSlide) return
      const animationElement = createAnimationElement(id, slideId)
      if (isAnAnimationSelected()) {
        const selectedAnimationElement = animationsElement.querySelector(
          '.highlighted'
        )
        animationsElement.insertBefore(
          animationElement, selectedAnimationElement.nextElementSibling
        )
      } else {
        animationsElement.appendChild(animationElement)
      }
    }
  )
  const actionButtons = root.querySelector('.actions')
  const showHideAnimationReorderButtons = () => {
    if (isAnAnimationSelected()) {
      actionButtons.style.display = ''
    } else {
      actionButtons.style.display = 'none'
    }
  }
  showHideAnimationReorderButtons()
  EventBus.addEventListener(
    'animation-selected', showHideAnimationReorderButtons
  )
  EventBus.addEventListener(
    'animation-removed', showHideAnimationReorderButtons
  )
  EventBus.addEventListener('slide-selected', showHideAnimationReorderButtons)
  const moveAnimationLeftButton = root.querySelector('.move-animation-left')
  const moveAnimationRightButton = root.querySelector('.move-animation-right')
  moveAnimationLeftButton.addEventListener('click', () => {
    EventBus.dispatchEvent(moveAnimationLeft(selectedSlide().selectedAnimation))
  })
  moveAnimationRightButton.addEventListener('click', () => {
    EventBus.dispatchEvent(
      moveAnimationRight(selectedSlide().selectedAnimation)
    )
  })
  const changeAnimationDurationButton = root.querySelector(
    '.change-animation-duration'
  )
  changeAnimationDurationButton.addEventListener('click', () => {
    EventBus.dispatchEvent(startChangingAnimationDuration(
      selectedSlide().selectedAnimation
    ))
  })
  return root
}
