export default (name, id, type) => new window.CustomEvent('object-added', {
  detail: { name, id, type }
})
