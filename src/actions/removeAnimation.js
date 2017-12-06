export default (id, slideId) => new window.CustomEvent('animation-removed', {
  detail: { id, slideId }
})
