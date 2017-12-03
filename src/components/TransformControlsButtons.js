import EventBus from '../EventBus'
import changeTransformControlsMode from '../actions/changeTransformControlsMode'
import { button } from './Button.css'
export default () => {
  const root = document.createElement('span')
  root.innerHTML = `
    <button class="translate ${button}">Translate</button>
    <button class="rotate ${button}">Rotate</button>
    <button class="scale ${button}">Scale</button>
  `
  const translateButton = root.querySelector('.translate')
  const rotateButton = root.querySelector('.rotate')
  const scaleButton = root.querySelector('.scale')
  translateButton.addEventListener('click', () => {
    EventBus.dispatchEvent(changeTransformControlsMode('translate'))
  })
  rotateButton.addEventListener('click', () => {
    EventBus.dispatchEvent(changeTransformControlsMode('rotate'))
  })
  scaleButton.addEventListener('click', () => {
    EventBus.dispatchEvent(changeTransformControlsMode('scale'))
  })
  return root
}
