export default (name, id, type) => new window.CustomEvent('object-added', {
  detail: {
    name, id, type, position: [0, 0, 0], rotation: [0, 0, 0], color: '#ffff00'
  }
})
