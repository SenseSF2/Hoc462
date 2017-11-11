import EventBus from '../EventBus'
export default ({ getState, setState }) => {
  EventBus.addEventListener('start-changing-view', () => {
    setState({ ...getState(), isSlideViewChanging: true })
  })
  EventBus.addEventListener('finished-changing-slide-view', () => {
    setState({ ...getState(), isSlideViewChanging: false })
  })
}
