import EventBus from '../EventBus'
import { button } from './Button.css'
import Card from './Card'
import uniqueId from '../uniqueId'
import startCreatingObject from '../actions/startCreatingObject'
import addObject from '../actions/addObject'
export default () => {
  const root = document.createElement('div')
  root.innerHTML = `
    <select class="add-object ${button}">
      <option disabled selected>Add object</option>
      <option value="plane">Plane</option>
      <option value="box">Box</option>
      <option value="circle">Circle</option>
      <option value="cylinder">Cylinder</option>
      <option value="sphere">Sphere</option>
      <option value="icosahedron">Icosahedron</option>
      <option value="torus">Torus</option>
      <option value="torusknot">TorusKnot</option>
      <option value="lathe">Lathe</option>
      <option value="sprite">Sprite</option>
    </select>
    <div class="objects"></div>
  `
  const addObjectElement = root.querySelector('.add-object')
  addObjectElement.addEventListener('change', ({ target }) => {
    EventBus.dispatchEvent(startCreatingObject(target.value))
    target.selectedIndex = 0
  })
  EventBus.addEventListener('start-creating-object', ({ detail: { type } }) => {
    const objectsElement = root.querySelector('.objects')
    const objectCard = Card()
    objectsElement.appendChild(objectCard)
    objectCard.dispatchEvent(new window.Event('start-renaming'))
    objectCard.addEventListener('name-changed', ({ detail: { name } }) => {
      EventBus.dispatchEvent(addObject(name, uniqueId(), type))
    })
  })
  return root
}