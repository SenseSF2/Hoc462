export default id => new window.CustomEvent('object-added-to-group', {
  detail: { id }
})
