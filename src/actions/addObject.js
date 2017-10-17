export default (name, id, object3d) => new window.CustomEvent('object-added', {
  detail: { name, id, object3d }
})
