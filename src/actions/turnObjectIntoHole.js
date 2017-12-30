export default id => new window.CustomEvent('object-turned-into-hole', {
  detail: { id }
})
