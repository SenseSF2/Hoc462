export default (id, color) => new window.CustomEvent('object-color-changed', {
  detail: { id, color }
})
