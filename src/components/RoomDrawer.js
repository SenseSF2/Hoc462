import EventBus from '../EventBus'
import { button } from './Button.css'
import ObjectCard from './Object'
import TransformControlsButtons from './TransformControlsButtons'
import uniqueId from '../uniqueId'
import getState from '../store'
import startCreatingObject from '../actions/startCreatingObject'
import addObject from '../actions/addObject'
import renameObject from '../actions/renameObject'
import selectObject from '../actions/selectObject'
import cloneObject from '../actions/cloneObject'
import changeObjectColor from '../actions/changeObjectColor'
import changeObjectTexture from '../actions/changeObjectTexture'
import translateObject from '../actions/translateObject'
import rotateObject from '../actions/rotateObject'
import scaleObject from '../actions/scaleObject'
import removeObject from '../actions/removeObject'
import turnObjectIntoHole from '../actions/turnObjectIntoHole'
import turnObjectIntoSolid from '../actions/turnObjectIntoSolid'
import startGroupingObjects from '../actions/startGroupingObjects'
import finishGroupingObjects from '../actions/finishGroupingObjects'
import lockCurrentDrawerTab from '../actions/lockCurrentDrawerTab'
import unlockCurrentDrawerTab from '../actions/unlockCurrentDrawerTab'
import addObjectToGroup from '../actions/addObjectToGroup'
import removeObjectFromGroup from '../actions/removeObjectFromGroup'
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
    <div class="transform-controls-buttons"></div>
      <button class="${button} turn-object-into-hole">
        Turn object into a hole
      </button>
      <button class="${button} turn-object-into-solid">
        Turn object into a solid
      </button>
      <button class="${button} group-objects">Group objects</button>
      <button class="${button} finish-grouping-objects">
        Done grouping objects (<span class="number-of-objects"></span>)
      </button>
    <div class="objects"></div>
  `
  const transformControlsButtons = root.querySelector(
    '.transform-controls-buttons'
  )
  transformControlsButtons.replaceWith(TransformControlsButtons())
  const addObjectElement = root.querySelector('.add-object')
  addObjectElement.addEventListener('change', ({ target }) => {
    EventBus.dispatchEvent(startCreatingObject(target.value))
    target.selectedIndex = 0
  })
  const connectObjectCardToEventBus = (objectCard, object) => {
    const { id, name, color, position, rotation, scale } = object
    EventBus.addEventListener('object-selected', ({ detail }) => {
      if (id === detail.id) {
        objectCard.dispatchEvent(new window.Event('highlighted'))
      } else {
        objectCard.dispatchEvent(new window.Event('unhighlighted'))
      }
    })
    objectCard.dispatchEvent(new window.Event('highlighted'))
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
    objectCard.addEventListener('cloned', () => {
      EventBus.dispatchEvent(cloneObject(uniqueId(), id))
    })
    objectCard.addEventListener(
      'position-changed', ({ detail: { position, fromEventBus } }) => {
        if (!fromEventBus) {
          EventBus.dispatchEvent(translateObject(id, position))
        }
      }
    )
    objectCard.addEventListener(
      'rotation-changed', ({ detail: { rotation, fromEventBus } }) => {
        if (!fromEventBus) {
          EventBus.dispatchEvent(rotateObject(id, rotation))
        }
      }
    )
    objectCard.addEventListener(
      'scale-changed', ({ detail: { scale, fromEventBus } }) => {
        if (!fromEventBus) {
          EventBus.dispatchEvent(scaleObject(id, scale))
        }
      }
    )
    EventBus.addEventListener(
      'object-translated', ({ detail: { position, id: currentId } }) => {
        if (id === currentId) {
          objectCard.dispatchEvent(new window.CustomEvent('position-changed', {
            detail: { position, fromEventBus: true }
          }))
        }
      }
    )
    EventBus.addEventListener(
      'object-rotated', ({ detail: { rotation, id: currentId } }) => {
        if (id === currentId) {
          objectCard.dispatchEvent(new window.CustomEvent('rotation-changed', {
            detail: { rotation, fromEventBus: true }
          }))
        }
      }
    )
    EventBus.addEventListener(
      'object-scaled', ({ detail: { scale, id: currentId } }) => {
        if (id === currentId) {
          objectCard.dispatchEvent(new window.CustomEvent('scale-changed', {
            detail: { scale, fromEventBus: true }
          }))
        }
      }
    )
    EventBus.addEventListener('finished-grouping-objects', () => {
      if (getState().objectGroup.includes(id)) {
        objectCard.remove()
      }
    })
    objectCard.dispatchEvent(new window.CustomEvent('position-changed', {
      detail: { position }
    }))
    objectCard.dispatchEvent(new window.CustomEvent('rotation-changed', {
      detail: { rotation }
    }))
    objectCard.dispatchEvent(new window.CustomEvent('scale-changed', {
      detail: { scale }
    }))
    objectCard.addEventListener('color-changed', ({ detail: { color } }) => {
      EventBus.dispatchEvent(changeObjectColor(id, color))
    })
    objectCard.addEventListener(
      'texture-changed', ({ detail: { url } }) => {
        EventBus.dispatchEvent(changeObjectTexture(id, url))
      }
    )
    objectCard.addEventListener('deleted', () => {
      EventBus.dispatchEvent(removeObject(id))
    })
  }
  const objectsElement = root.querySelector('.objects')
  EventBus.addEventListener('room-planner-reset', () => {
    objectsElement.innerHTML = ''
  })
  EventBus.addEventListener('started-creating-object', ({ detail: { type } }) => {
    const objectCard = ObjectCard()
    objectsElement.appendChild(objectCard)
    objectCard.dispatchEvent(new window.Event('started-renaming'))
    const id = uniqueId()
    const nameChangedHandler = ({ detail: { name } }) => {
      objectCard.removeEventListener('name-changed', nameChangedHandler)
      objectCard.remove()
      EventBus.dispatchEvent(addObject(name, id, type))
    }
    objectCard.addEventListener('name-changed', nameChangedHandler)
  })
  EventBus.addEventListener('object-added', ({ detail: { id } }) => {
    const objectCard = ObjectCard()
    const object = getState().objects.find(
      ({ id: currentId }) => id === currentId
    )
    objectsElement.appendChild(objectCard)
    connectObjectCardToEventBus(objectCard, object)
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
  const turnObjectIntoHoleButton = root.querySelector('.turn-object-into-hole')
  const turnObjectIntoSolidButton = root.querySelector(
    '.turn-object-into-solid'
  )
  turnObjectIntoHoleButton.addEventListener('click', () => {
    EventBus.dispatchEvent(
      turnObjectIntoHole(getState().selectedObject)
    )
  })
  turnObjectIntoSolidButton.addEventListener('click', () => {
    EventBus.dispatchEvent(
      turnObjectIntoSolid(getState().selectedObject)
    )
  })
  const showHideHoleSolidButtons = () => {
    const object = getState().objects.find(
      ({ id }) => id === getState().selectedObject
    )
    if (object === undefined) {
      turnObjectIntoHoleButton.style.display = 'none'
      turnObjectIntoSolidButton.style.display = 'none'
      return
    }
    if (object.holeOrSolid === 'hole') {
      turnObjectIntoHoleButton.style.display = 'none'
      turnObjectIntoSolidButton.style.display = ''
    }
    if (object.holeOrSolid === 'solid') {
      turnObjectIntoSolidButton.style.display = 'none'
      turnObjectIntoHoleButton.style.display = ''
    }
  }
  EventBus.addEventListener('object-selected', showHideHoleSolidButtons)
  EventBus.addEventListener('object-removed', showHideHoleSolidButtons)
  EventBus.addEventListener('object-turned-into-hole', showHideHoleSolidButtons)
  EventBus.addEventListener(
    'object-turned-into-solid', showHideHoleSolidButtons
  )
  showHideHoleSolidButtons()
  const groupObjectsButton = root.querySelector('.group-objects')
  const finishGroupingObjectsButton = root.querySelector(
    '.finish-grouping-objects'
  )
  const showHideObjectGroupingButtons = () => {
    if (getState().isGroupingObjects) {
      groupObjectsButton.style.display = 'none'
      finishGroupingObjectsButton.style.display = ''
    } else {
      groupObjectsButton.style.display = ''
      finishGroupingObjectsButton.style.display = 'none'
    }
  }
  EventBus.addEventListener(
    'started-grouping-objects', showHideObjectGroupingButtons
  )
  EventBus.addEventListener(
    'finished-grouping-objects', showHideObjectGroupingButtons
  )
  showHideObjectGroupingButtons()
  groupObjectsButton.addEventListener('click', () => {
    EventBus.dispatchEvent(startGroupingObjects())
    EventBus.dispatchEvent(lockCurrentDrawerTab())
  })
  finishGroupingObjectsButton.addEventListener('click', () => {
    EventBus.dispatchEvent(finishGroupingObjects(uniqueId()))
    EventBus.dispatchEvent(unlockCurrentDrawerTab())
  })
  const numberOfObjectsElement = root.querySelector('.number-of-objects')
  const updateObjectCount = () => {
    numberOfObjectsElement.textContent = getState().objectGroup.length
  }
  EventBus.addEventListener('started-grouping-objects', () => {
    updateObjectCount()
    const objectSelectedHandler = ({ detail: { id } }) => {
      if (getState().objectGroup.includes(id)) {
        EventBus.dispatchEvent(removeObjectFromGroup(id))
      } else {
        EventBus.dispatchEvent(addObjectToGroup(id))
      }
      updateObjectCount()
    }
    EventBus.addEventListener('object-selected', objectSelectedHandler)
    EventBus.addEventListener('object-removed', updateObjectCount)
    const finishedGroupingObjectsHandler = () => {
      EventBus.removeEventListener(
        'finished-grouping-objects', finishedGroupingObjectsHandler
      )
      EventBus.removeEventListener('object-selected', objectSelectedHandler)
      EventBus.removeEventListener('object-removed', updateObjectCount)
    }
    EventBus.addEventListener(
      'finished-grouping-objects', finishedGroupingObjectsHandler
    )
  })
  return root
}
