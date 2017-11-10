import styles from './Header.css'
export default () => {
  const root = document.createElement('div')
  root.classList.add(styles.header)
  root.innerHTML = `
    <h1>Hoc462 Room Planner</h1>
  `
  return root
}
