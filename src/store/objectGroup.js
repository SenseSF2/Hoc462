import EventBus from '../EventBus'
export default ({ getState, setState }) => {
  EventBus.addEventListener('started-grouping-objects', () => {
    setState({ ...getState(), objectGroup: [] })
  })
  EventBus.addEventListener('object-added-to-group', ({ detail: { id } }) => {
    setState({
      ...getState(),
      objectGroup: [...getState().objectGroup, id]
    })
  })
  EventBus.addEventListener(
    'object-removed-from-group', ({ detail: { id } }) => {
      setState({
        ...getState(),
        objectGroup: getState().objectGroup.filter(
          currentId => currentId !== id
        )
      })
    }
  )
  EventBus.addEventListener('object-removed', ({ detail: { id } }) => {
    setState({
      ...getState(),
      objectGroup: getState().objectGroup.filter(
        currentId => currentId !== id
      )
    })
  })
}
