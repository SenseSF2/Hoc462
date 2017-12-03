export default (id, duration) => new window.CustomEvent(
  'animation-duration-changed', { detail: { id, duration } }
)
