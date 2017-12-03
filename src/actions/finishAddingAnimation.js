export default (id, slideId) => new window.CustomEvent(
  'finished-adding-animation', { detail: { id, slideId, duration: 1000 } }
)
