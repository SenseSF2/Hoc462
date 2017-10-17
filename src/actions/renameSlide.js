export default (name, id) => new window.CustomEvent('slide-renamed', {
  detail: { name, id }
})
