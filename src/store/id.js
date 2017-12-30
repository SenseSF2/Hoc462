import EventBus from '../EventBus'
export default ({ getState, setState }) => {
  EventBus.addEventListener('new-id-requested', () => {
    setState({ ...getState(), id: getState().id + 1 })
  })
}
