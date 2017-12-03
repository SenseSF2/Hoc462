export default (position, rotation, scale) => new window.CustomEvent(
  'animation-destination-changed', { detail: { position, rotation, scale } }
)
