export default (id, scale) => new window.CustomEvent('object-scaled', {
  detail: { id, scale }
})
