export default id => new window.CustomEvent(
  'started-changing-animation-duration', { detail: { id } }
)
