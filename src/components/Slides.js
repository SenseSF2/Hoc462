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
  renamable.addEventListener('renamed', ({ detail: { name } }) => {
    root.dispatchEvent(new window.CustomEvent('renamed', {
      detail: { name }
    }))
  })
  const renameButton = root.querySelector('.rename')
  const deleteButton = root.querySelector('.delete')
  const startRenaming = () => {
    renamable.dispatchEvent(new window.Event('start-renaming'))
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
  root.addEventListener('renamed', () => {
    renameButton.style.display = ''
  })
  root.addEventListener('deleted', () => { root.remove() })
  return root
}
export default () => {
  const root = document.createElement('div')
  root.classList.add(styles.slides)
  root.innerHTML = `
    <span>Slides <button class="${button} create">Create new</button></span>
    <ul class="list"></ul>
  `
  root.querySelector('.create').addEventListener('click', () => {
    EventBus.dispatchEvent(startCreatingSlide())
  })
  EventBus.addEventListener('start-creating-slide', () => {
    const newItem = Item()
    root.querySelector('.list').appendChild(newItem)
    const whenCreated = ({ detail: { name } }) => {
      const id = uniqueId()
      newItem.removeEventListener('renamed', whenCreated)
      EventBus.dispatchEvent(addSlide(name, id))
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
      newItem.addEventListener('renamed', ({ detail: { name } }) => {
        EventBus.dispatchEvent(renameSlide(name, id))
      })
      newItem.addEventListener('deleted', () => {
        EventBus.dispatchEvent(removeSlide(id))
      })
    }
    newItem.addEventListener('renamed', whenCreated)
  })
  return root
}
