export default mode =>
  new window.CustomEvent('transform-controls-mode-changed', {
    detail: { mode }
  }
)
