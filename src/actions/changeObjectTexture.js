export default (id, blobUrl) => new window.CustomEvent(
  'object-texture-changed', { detail: { id, blobUrl } }
)
