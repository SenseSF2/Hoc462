export default id => new window.CustomEvent('slide-removed', {
  detail: { id }
})
