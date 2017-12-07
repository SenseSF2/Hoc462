export default id => new window.CustomEvent('caption-shown', {
  detail: { id }
})
