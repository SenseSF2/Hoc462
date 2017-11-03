export default (id, position) => new window.CustomEvent('object-translated', {
  detail: { id, position }
})
