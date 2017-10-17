export default name => new window.CustomEvent('drawer-tab-selected', {
  detail: { name }
})
