import EventBus from '../EventBus'
export default ({ getState, setState }) => {
  EventBus.addEventListener(
    'object-added',
    ({ detail: { id, name, type } }) => {
      setState({
        ...getState(),
        objects: [...getState().objects, {
          id, name, type, position: [0, 0, 0], rotation: [0, 0, 0]
        }]
      })
    }
  )
  EventBus.addEventListener('object-removed', ({ detail: { id } }) => {
    setState({
      ...getState(),
      objects: getState().objects.filter(
        ({ id: currentId }) => currentId !== id
      )
    })
  })
  EventBus.addEventListener('object-renamed', ({ detail: { id, name } }) => {
    setState({
      ...getState(),
      objects: getState().objects.map(
        object => object.id === id ? { ...object, name } : object
      )
    })
  })
}
