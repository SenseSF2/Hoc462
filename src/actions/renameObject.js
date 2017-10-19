export default (name, id) => new window.CustomEvent('object-renamed', {
  detail: { name, id }
})
