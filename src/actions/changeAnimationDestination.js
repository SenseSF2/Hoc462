export default (position, rotation, scale, id, slideId) =>
new window.CustomEvent(
  'animation-destination-changed', {
    detail: { position, rotation, scale, id, slideId }
  }
)
