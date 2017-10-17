import styles from './Sidebar.css'
import Slides from './Slides.js'
export default () => {
  const root = document.createElement('div')
  root.classList.add(styles.sidebar)
  root.appendChild(Slides())
  return root
}
