export default (id, url) => new window.CustomEvent(
  'object-texture-changed', { detail: { id, url } }
)
