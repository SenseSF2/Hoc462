import EventBus from '../EventBus'
export default ({ getState, setState }) => {
  EventBus.addEventListener(
    'transform-controls-mode-changed', ({ detail: { mode } }) => {
      setState({ ...getState(), transformControlsMode: mode })
    }
  )
}
