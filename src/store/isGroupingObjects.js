import EventBus from '../EventBus'
export default ({ getState, setState }) => {
  EventBus.addEventListener('started-grouping-objects', () => {
    setState({ ...getState(), isGroupingObjects: true })
  })
  EventBus.addEventListener('finished-grouping-objects', () => {
    setState({ ...getState(), isGroupingObjects: false })
  })
}
