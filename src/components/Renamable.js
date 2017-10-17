export default name => {
  const root = document.createElement('span')
  const displayName = name => {
    root.textContent = name
    root.setAttribute('title', name)
    root.scrollTo(0, 0)
  }
  displayName(name)
  root.addEventListener('start-renaming', () => {
    const oldName = root.textContent
    root.innerHTML = `
      <form>
        <input type='text' />
      </form>
    `
    const form = root.querySelector('form')
    const input = root.querySelector('input')
    input.value = oldName
    window.requestAnimationFrame(() => input.select())
    form.addEventListener('submit', event => {
      event.preventDefault()
      root.dispatchEvent(new window.CustomEvent('renamed', {
        detail: { name: input.value }
      }))
    })
    input.addEventListener('focusout', () => {
      root.dispatchEvent(new window.CustomEvent('renamed', {
        detail: { name: input.value }
      }))
    })
  })
  root.addEventListener('renamed', ({ detail: { name } }) => {
    displayName(name)
  })
  return root
}
