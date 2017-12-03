import EventBus from '../EventBus'
export default ({ getState, setState }) => {
  EventBus.addEventListener('started-adding-animation', () => {
    setState({ ...getState(), isAddingAnimation: true })
  })
  EventBus.addEventListener('canceled-adding-animation', () => {
    setState({ ...getState(), isAddingAnimation: false })
  })
  EventBus.addEventListener('finished-adding-animation', () => {
    setState({ ...getState(), isAddingAnimation: false })
  })
}
