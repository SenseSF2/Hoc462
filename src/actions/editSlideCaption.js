export default (id, caption) => new window.CustomEvent('slide-caption-edited', {
  detail: { id, caption }
})
