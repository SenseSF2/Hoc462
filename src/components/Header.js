import EventBus from '../EventBus'
import getState from '../store'
import styles from './Header.css'
import { button } from './Button.css'
import playAllSlides from '../actions/playAllSlides'
import addObject from '../actions/addObject'
import selectObject from '../actions/selectObject'
import translateObject from '../actions/translateObject'
import rotateObject from '../actions/rotateObject'
import scaleObject from '../actions/scaleObject'
import changeObjectColor from '../actions/changeObjectColor'
import changeObjectTexture from '../actions/changeObjectTexture'
import addSlide from '../actions/addSlide'
import editSlideCaption from '../actions/editSlideCaption'
import changeSlideView from '../actions/changeSlideView'
import startAddingAnimation from '../actions/startAddingAnimation'
import changeAnimationDestination from '../actions/changeAnimationDestination'
import changeAnimationDuration from '../actions/changeAnimationDuration'
import finishAddingAnimation from '../actions/finishAddingAnimation'
export default () => {
  const root = document.createElement('div')
  root.classList.add(styles.header)
  root.innerHTML = `
    <h1>
      Hoc462 Room Planner
      <button class="${button} save">Save</button>
      <button class="${button} load">Load</button>
      <button class="${button} slide-show">Slide show</button>
      <input type="file" class="file-picker" style="display: none">
    </h1>
  `
  const saveButton = root.querySelector('.save')
  const loadButton = root.querySelector('.load')
  saveButton.addEventListener('click', () => {
    const blob = new window.Blob(
      [JSON.stringify(getState())], { type: 'text/plain' }
    )
    const aElement = document.createElement('a')
    const downloadUrl = window.URL.createObjectURL(blob)
    aElement.setAttribute('href', downloadUrl)
    aElement.setAttribute('download', 'untitled.hoc462presentation')
    aElement.click()
  })
  const filePickerElement = root.querySelector('.file-picker')
  loadButton.addEventListener('click', () => {
    filePickerElement.click()
  })
  filePickerElement.addEventListener('change', () => {
    const reader = new window.FileReader()
    reader.readAsText(filePickerElement.files[0])
    reader.addEventListener('loadend', () => {
      const state = JSON.parse(reader.result)
      const objects = state.objects
      for (let object of objects) {
        const { name, id, type, position, rotation, scale, color, url } = object
        EventBus.dispatchEvent(addObject(name, id, type))
        EventBus.dispatchEvent(translateObject(id, position))
        EventBus.dispatchEvent(rotateObject(id, rotation))
        EventBus.dispatchEvent(scaleObject(id, scale))
        EventBus.dispatchEvent(changeObjectColor(id, color))
        if (url !== undefined) {
          EventBus.dispatchEvent(changeObjectTexture(id, url))
        }
      }
      const slides = state.slides
      for (let slide of slides) {
        const { name, id, caption, view, animations } = slide
        EventBus.dispatchEvent(addSlide(name, id))
        EventBus.dispatchEvent(editSlideCaption(id, caption))
        EventBus.dispatchEvent(changeSlideView(id, view))
        for (let animation of animations) {
          const {
            target, destination: { position, rotation, scale }, duration
          } = animation
          EventBus.dispatchEvent(selectObject(target))
          EventBus.dispatchEvent(startAddingAnimation())
          EventBus.dispatchEvent(changeAnimationDestination(
            position, rotation, scale
          ))
          EventBus.dispatchEvent(
            changeAnimationDuration(animation.id, duration)
          )
          EventBus.dispatchEvent(finishAddingAnimation(animation.id, slide.id))
        }
      }
    })
  })
  const slideShowButton = root.querySelector('.slide-show')
  slideShowButton.addEventListener('click', () => {
    EventBus.dispatchEvent(playAllSlides())
  })
  return root
}
