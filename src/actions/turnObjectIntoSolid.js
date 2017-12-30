export default id => new window.CustomEvent('object-turned-into-solid', {
  detail: { id }
})
