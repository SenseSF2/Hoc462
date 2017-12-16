import EventBus from '../EventBus'
export default ({ getState, setState }) => {
  const originalState = getState()
  EventBus.addEventListener('room-planner-reset', () => {
    setState(originalState)
  })
}
