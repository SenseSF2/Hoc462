export default (id, slideId) => new window.CustomEvent('animation-selected', {
  detail: { id, slideId }
})
