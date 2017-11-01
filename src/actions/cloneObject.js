export default (id, clonedFromId) => new window.CustomEvent('object-cloned', {
  detail: { id, clonedFromId }
})
