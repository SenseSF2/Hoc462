export default id => new window.CustomEvent('finished-grouping-objects', {
  detail: { id }
})
