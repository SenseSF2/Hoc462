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
        <input type='text' placeholder='Type name here' />
      </form>
    `
    const form = root.querySelector('form')
    const input = root.querySelector('input')
    input.value = oldName
    window.requestAnimationFrame(() => input.select())
    const submitHandler = event => {
      event.preventDefault()
      if (input.value !== '') {
        root.dispatchEvent(new window.CustomEvent('renamed', {
          detail: { name: input.value }
        }))
        form.removeEventListener('submit', submitHandler)
        input.removeEventListener('focusout', submitHandler)
      } else {
        root.dispatchEvent(new window.Event('rename-canceled'))
      }
    }
    form.addEventListener('submit', submitHandler)
    input.addEventListener('focusout', submitHandler)
  })
  root.addEventListener('renamed', ({ detail: { name } }) => {
    displayName(name)
  })
  return root
}
