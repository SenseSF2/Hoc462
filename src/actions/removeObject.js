export default id => new window.CustomEvent('object-removed', {
  detail: { id }
})
