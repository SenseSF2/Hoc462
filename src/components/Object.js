import { button } from './Button.css'
import Renamable from './Renamable'
import styles from './Object.css'
export default () => {
  const root = document.createElement('div')
  root.classList.add(styles.object)
  root.innerHTML = `
    <div class="name"></div>
    <div class="actions">
      <button class="${button} delete">Delete</button>
      <button class="${button} rename">Rename</button>
      <input type="color" class="color-picker">
    </div>
  `
  let newlyCreated = true
  let isRenaming = false
  const nameEl = root.querySelector('.name')
  const renamable = Renamable()
  renamable.classList.add('name')
  nameEl.parentNode.replaceChild(renamable, nameEl)
  const deleteButton = root.querySelector('.delete')
  const renameButton = root.querySelector('.rename')
  const colorPicker = root.querySelector('.color-picker')
  const actionButtons = [deleteButton, renameButton, colorPicker]
  const actionsElement = root.querySelector('.actions')
  deleteButton.addEventListener('click', () => {
    root.dispatchEvent(new window.Event('deleted'))
  })
  colorPicker.addEventListener('change', () => {
    root.dispatchEvent(new window.CustomEvent('color-changed', {
      detail: { color: colorPicker.value }
    }))
  })
  root.addEventListener('click', ({ target }) => {
    if (!actionButtons.includes(target)) {
      root.dispatchEvent(new window.Event('selected'))
    }
  })
  const startRenaming = () => {
    isRenaming = true
    if (newlyCreated) {
      const renameCanceledHandler = () => {
        renamable.removeEventListener('rename-canceled', renameCanceledHandler)
        root.dispatchEvent(new window.Event('deleted'))
      }
      renamable.addEventListener('rename-canceled', renameCanceledHandler)
    }
    renamable.dispatchEvent(new window.Event('start-renaming'))
    actionsElement.style.display = 'none'
  }
  renameButton.addEventListener('click', startRenaming)
  root.addEventListener('start-renaming', startRenaming)
  root.addEventListener('highlighted', () => {
    root.classList.add('highlighted')
  })
  root.addEventListener('unhighlighted', () => {
    root.classList.remove('highlighted')
  })
  root.addEventListener('color-changed', ({ detail: { color } }) => {
    colorPicker.value = color
  })
  root.addEventListener('deleted', () => { root.remove() })
  renamable.addEventListener('renamed', ({ detail: { name } }) => {
    if (isRenaming) {
      isRenaming = false
      if (newlyCreated) {
        newlyCreated = false
      }
      root.dispatchEvent(new window.CustomEvent('name-changed', {
        detail: { name }
      }))
      actionsElement.style.display = ''
    }
    // otherwise, renamable's name is being set by name-changed handler.
    // this event handler will do nothing.
  })
  root.addEventListener('name-changed', ({ detail: { name } }) => {
    renamable.dispatchEvent(
      new window.CustomEvent('renamed', { detail: { name } })
    )
  })
  return root
}
