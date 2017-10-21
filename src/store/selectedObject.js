import EventBus from '../EventBus'
export default ({ getState, setState }) => {
  EventBus.addEventListener('object-selected', ({ detail: { id } }) => {
    setState({ ...getState(), selectedObject: id })
  })
}
