export default slideId => new window.CustomEvent('animation-selected', {
  detail: { id: undefined, slideId }
})
