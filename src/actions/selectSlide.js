export default id => new window.CustomEvent('slide-selected', {
  detail: { id }
})
