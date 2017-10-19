export default id => new window.CustomEvent('object-selected', {
  detail: { id }
})
