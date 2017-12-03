export default id => new window.CustomEvent('animation-moved-left', {
  detail: { id }
})
