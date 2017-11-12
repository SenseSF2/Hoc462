export default (name, id) => new window.CustomEvent('slide-added', { detail: {
  name,
  id,
  view: {
    // Three.js doesn't like [0, 0, 0].
    position: [0, 0, -1],
    rotation: [0, 0, 0, 'XYZ']
  },
  caption: '',
  animations: []
} })
