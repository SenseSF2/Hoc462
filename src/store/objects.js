import EventBus from '../EventBus'
export default ({ getState, setState }) => {
  EventBus.addEventListener(
    'object-added',
    ({ detail: { id, name, type, position, rotation, color } }) => {
      setState({
        ...getState(),
        objects: [...getState().objects, {
          id, name, type, position, rotation, color
        }]
      })
    }
  )
  EventBus.addEventListener(
    'object-cloned', ({ detail: { id, clonedFromId } }) => {
      setState({
        ...getState(),
        objects: [...getState().objects, {
          ...getState().objects.find(({ id }) => id === clonedFromId),
          id
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
  EventBus.addEventListener('object-color-changed', ({ detail: { id, color } }) => {
    setState({
      ...getState(),
      objects: getState().objects.map(
        object => object.id === id ? { ...object, color } : object
      )
    })
  })
}
