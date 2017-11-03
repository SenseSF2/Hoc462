export default (id, rotation) => new window.CustomEvent('object-rotated', {
  detail: { id, rotation }
})
