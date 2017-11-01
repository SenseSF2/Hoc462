import EventBus from '../EventBus'
import { button } from './Button.css'
import ObjectCard from './Object'
import uniqueId from '../uniqueId'
import getState from '../store'
import changeTransformControlsMode from '../actions/changeTransformControlsMode'
import startCreatingObject from '../actions/startCreatingObject'
import addObject from '../actions/addObject'
import renameObject from '../actions/renameObject'
import selectObject from '../actions/selectObject'
import cloneObject from '../actions/cloneObject'
import changeObjectColor from '../actions/changeObjectColor'
import removeObject from '../actions/removeObject'
export default () => {
  const root = document.createElement('div')
  root.innerHTML = `
    <select class="add-object ${button}">
      <option disabled selected>Add object</option>
      <option value="box">Box</option>
      <option value="circle">Circle</option>
      <option value="cylinder">Cylinder</option>
      <option value="sphere">Sphere</option>
      <option value="icosahedron">Icosahedron</option>
      <option value="torus">Torus</option>
    </select>
    <button class="clone ${button}">Clone</button>
    <button class="translate ${button}">Translate</button>
    <button class="rotate ${button}">Rotate</button>
    <button class="scale ${button}">Scale</button>
    <div class="objects"></div>
  `
  const cloneButton = root.querySelector('.clone')
  cloneButton.addEventListener('click', () => {
    EventBus.dispatchEvent(cloneObject(uniqueId(), getState().selectedObject))
  })
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
  const addObjectElement = root.querySelector('.add-object')
  addObjectElement.addEventListener('change', ({ target }) => {
    EventBus.dispatchEvent(startCreatingObject(target.value))
    target.selectedIndex = 0
  })
  const connectObjectCardToEventBus = (objectCard, object) => {
    const { id, name, color } = object
    objectCard.dispatchEvent(new window.CustomEvent('color-changed', {
      detail: { color }
    }))
    objectCard.dispatchEvent(new window.CustomEvent('name-changed', {
      detail: { name }
    }))
    objectCard.addEventListener('name-changed', ({ detail: { name } }) => {
      EventBus.dispatchEvent(renameObject(name, id))
    })
    objectCard.addEventListener('selected', () => {
      EventBus.dispatchEvent(selectObject(id))
    })
    objectCard.addEventListener('color-changed', ({ detail: { color } }) => {
      EventBus.dispatchEvent(changeObjectColor(id, color))
    })
    objectCard.addEventListener('deleted', () => {
      EventBus.dispatchEvent(removeObject(id))
    })
    EventBus.addEventListener('object-selected', ({ detail }) => {
      if (id === detail.id) {
        objectCard.dispatchEvent(new window.Event('highlighted'))
      } else {
        objectCard.dispatchEvent(new window.Event('unhighlighted'))
      }
    })
  }
  const objectsElement = root.querySelector('.objects')
  EventBus.addEventListener('start-creating-object', ({ detail: { type } }) => {
    const objectCard = ObjectCard()
    objectsElement.appendChild(objectCard)
    objectCard.dispatchEvent(new window.Event('start-renaming'))
    const id = uniqueId()
    const nameChangedHandler = ({ detail: { name } }) => {
      objectCard.removeEventListener('name-changed', nameChangedHandler)
      EventBus.dispatchEvent(addObject(name, id, type))
    }
    const objectCreatedHandler = ({ detail: object }) => {
      EventBus.removeEventListener('object-added', objectCreatedHandler)
      if (object.id === id) {
        connectObjectCardToEventBus(objectCard, object)
      }
    }
    objectCard.addEventListener('name-changed', nameChangedHandler)
    EventBus.addEventListener('object-added', objectCreatedHandler)
  })
  EventBus.addEventListener(
    'object-cloned', ({ detail: { id, clonedFromId } }) => {
      const objectCard = ObjectCard()
      const object = getState().objects.find(
        ({ id: currentId }) => id === currentId
      )
      objectsElement.appendChild(objectCard)
      connectObjectCardToEventBus(objectCard, object)
    }
  )
  return root
}
