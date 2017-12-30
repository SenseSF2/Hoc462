export default id => new window.CustomEvent('object-removed-from-group', {
  detail: { id }
})
