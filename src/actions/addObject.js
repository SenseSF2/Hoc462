export default (name, id, type, members) => new window.CustomEvent('object-added', {
  detail: {
    name,
    id,
    type,
    members, // if type === 'group'
    position: [0, 0, 0],
    rotation: [0, 0, 0, 'XYZ'],
    scale: [1, 1, 1],
    holeOrSolid: 'solid',
    color: '#ffff00'
  }
})
