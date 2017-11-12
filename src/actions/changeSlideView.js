export default (id, view) => new window.CustomEvent('slide-view-changed', {
  detail: { id, view }
})
