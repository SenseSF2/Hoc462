import EventBus from '../EventBus'
import getState from '../store'
import styles from './SlideDrawer.css'
import { button } from './Button.css'
import startChangingView from '../actions/startChangingView'
import finishChangingSlideView from '../actions/finishChangingSlideView'
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
      <ul class="animations">
        <li><button class="${button}">Add animation</button></li>
      </ul>
    </div>
  `
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
    setViewButton.style.display = 'none'
    finishSettingViewButton.style.display = ''
  })
  finishSettingViewButton.addEventListener('click', () => {
    EventBus.dispatchEvent(finishChangingSlideView())
    finishSettingViewButton.style.display = 'none'
    setViewButton.style.display = ''
  })
  return root
}
