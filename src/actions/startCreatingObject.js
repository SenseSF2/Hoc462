export default type => new window.CustomEvent('started-creating-object', {
  detail: { type }
})
