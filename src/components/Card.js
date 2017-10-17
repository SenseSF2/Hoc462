import { button } from './Button.css'
import Renamable from './Renamable'
import styles from './Card.css'
export default () => {
  const root = document.createElement('div')
  root.classList.add(styles.card)
  root.innerHTML = `
    <div class="image"></div>
    <div class="name"></div>
    <div>
      <button class="${button} delete">Delete</button>
      <button class="${button} rename">Rename</button>
    </div>
  `
  const imageEl = root.querySelector('.image')
  const nameEl = root.querySelector('.name')
  const renamable = Renamable()
  renamable.classList.add('name')
  nameEl.parentNode.replaceChild(renamable, nameEl)
  const deleteButton = root.querySelector('.delete')
  const renameButton = root.querySelector('.rename')
  deleteButton.addEventListener('click', () => {
    root.dispatchEvent(new window.Event('deleted'))
    root.remove()
  })
  renameButton.addEventListener('click', () => {
    renamable.dispatchEvent(new window.Event('start-renaming'))
  })
  root.addEventListener('image-changed', ({ details: { domElement } }) => {
    imageEl.innerHTML = ''
    imageEl.appendChild(domElement)
  })
  root.addEventListener('name-changed', ({ details: { name } }) => {
    nameEl.textContent = name
  })
  return root
}
