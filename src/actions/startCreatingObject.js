export default type => new window.CustomEvent('start-creating-object', {
  detail: { type }
})
