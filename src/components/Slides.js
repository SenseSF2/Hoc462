import EventBus from '../EventBus'
import styles from './Slides.css'
import { button } from './Button.css'
import Renamable from './Renamable'
import uniqueId from '../uniqueId'
import startCreatingSlide from '../actions/startCreatingSlide'
import addSlide from '../actions/addSlide'
import selectSlide from '../actions/selectSlide'
import renameSlide from '../actions/renameSlide'
import removeSlide from '../actions/removeSlide'
import selectDrawerTab from '../actions/selectDrawerTab'
const Item = name => {
  const root = document.createElement('li')
  root.innerHTML = `
    <span class="name"></span>
    <span class="actions">
      <button class="${button} delete">Delete</button>
      <button class="${button} rename">Rename</button>
    </span>
  `
  const nameElement = root.querySelector('.name')
  const renamable = Renamable()
  nameElement.parentNode.replaceChild(renamable, nameElement)
  renamable.addEventListener('renamed', ({ detail: { name, fromEventBus } }) => {
    if (!fromEventBus) {
      root.dispatchEvent(new window.CustomEvent('renamed', {
        detail: { name }
      }))
    }
  })
  const renameButton = root.querySelector('.rename')
  const deleteButton = root.querySelector('.delete')
  const startRenaming = () => {
    renamable.dispatchEvent(new window.Event('started-renaming'))
    renameButton.style.display = 'none'
  }
  startRenaming()
  renameButton.addEventListener('click', startRenaming)
  deleteButton.addEventListener('click', () => {
    root.dispatchEvent(new window.Event('deleted'))
  })
  root.addEventListener('selected', () => { root.classList.add('selected') })
  root.addEventListener('unselected', () => {
    root.classList.remove('selected')
  })
  root.addEventListener('renamed', ({ detail: { name } }) => {
    renameButton.style.display = ''
    renamable.dispatchEvent(new window.CustomEvent('renamed', {
      detail: { name, fromEventBus: true }
    }))
  })
  root.addEventListener('deleted', () => { root.remove() })
  return root
}
export default () => {
  const root = document.createElement('div')
  root.classList.add(styles.slides)
  root.innerHTML = `
    <span>Slides</span>
    <button class="${button} create">Create new</button>
    <ul class="list"></ul>
  `
  const createButton = root.querySelector('.create')
  createButton.addEventListener('click', () => {
    EventBus.dispatchEvent(startCreatingSlide())
  })
  const listElement = root.querySelector('.list')
  EventBus.addEventListener('room-planner-reset', () => {
    listElement.innerHTML = ''
  })
  EventBus.addEventListener('started-creating-slide', () => {
    const ghost = Item()
    listElement.appendChild(ghost)
    const id = uniqueId()
    const renamedHandler = ({ detail: { name } }) => {
      ghost.removeEventListener('renamed', renamedHandler)
      EventBus.dispatchEvent(addSlide(name, id))
      ghost.dispatchEvent(new window.Event('deleted'))
    }
    ghost.addEventListener('renamed', renamedHandler)
  })
  EventBus.addEventListener('slide-added', ({ detail: { name, id } }) => {
    const newItem = Item()
    newItem.dispatchEvent(new window.CustomEvent(
      'renamed', { detail: { name } }
    ))
    newItem.addEventListener('click', () => {
      EventBus.dispatchEvent(selectSlide(id))
    })
    EventBus.addEventListener(
      'slide-selected',
      ({ detail: { id: selectedId } }) => {
        if (selectedId === id) {
          newItem.dispatchEvent(new window.Event('selected'))
        } else {
          newItem.dispatchEvent(new window.Event('unselected'))
        }
      }
    )
    EventBus.dispatchEvent(selectSlide(id))
    newItem.addEventListener('renamed', ({ detail: { name } }) => {
      EventBus.dispatchEvent(renameSlide(name, id))
    })
    newItem.addEventListener('deleted', () => {
      EventBus.dispatchEvent(removeSlide(id))
    })
    listElement.appendChild(newItem)
  })
  EventBus.addEventListener('slide-selected', () => {
    EventBus.dispatchEvent(selectDrawerTab('slide'))
  })
  EventBus.addEventListener('current-drawer-tab-locked', () => {
    root.classList.add('hidden')
  })
  EventBus.addEventListener('drawer-hidden', () => {
    root.classList.add('hidden')
  })
  EventBus.addEventListener('current-drawer-tab-unlocked', () => {
    root.classList.remove('hidden')
  })
  EventBus.addEventListener('drawer-shown', () => {
    root.classList.remove('hidden')
  })
  return root
}
