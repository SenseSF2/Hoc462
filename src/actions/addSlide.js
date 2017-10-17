export default (name, id) => new window.CustomEvent('slide-added', {
  detail: { name, id }
})
