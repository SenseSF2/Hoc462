export default (name, id, type) => new window.CustomEvent('object-added', {
  detail: {
    name,
    id,
    type,
    position: [0, 0, 0],
    rotation: [0, 0, 0, 'XYZ'],
    scale: [1, 1, 1],
    color: '#ffff00'
  }
})
