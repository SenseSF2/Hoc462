import EventBus, { getEvents } from '../EventBus'
import styles from './Header.css'
import { button } from './Button.css'
import playAllSlides from '../actions/playAllSlides'
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
      [JSON.stringify(getEvents())], { type: 'text/plain' }
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
      const events = JSON.parse(reader.result)
      for (let event of events) {
        EventBus.dispatchEvent(
          new window.CustomEvent(event.type, { detail: event.detail })
        )
      }
    })
  })
  const slideShowButton = root.querySelector('.slide-show')
  slideShowButton.addEventListener('click', () => {
    EventBus.dispatchEvent(playAllSlides())
  })
  return root
}
