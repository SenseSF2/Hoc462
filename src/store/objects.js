import EventBus from '../EventBus'
export default ({ getState, setState }) => {
  EventBus.addEventListener(
    'object-added',
    ({ detail: { id, name, type, position, rotation, scale, color } }) => {
      setState({
        ...getState(),
        objects: [...getState().objects, {
          id, name, type, position, rotation, scale, color
        }]
      })
    }
  )
  EventBus.addEventListener(
    'object-translated', ({ detail: { id, position } }) => {
      setState({
        ...getState(),
        objects: getState().objects.map(
          object => object.id === id ? { ...object, position } : object
        )
      })
    }
  )
  EventBus.addEventListener(
    'object-rotated', ({ detail: { id, rotation } }) => {
      setState({
        ...getState(),
        objects: getState().objects.map(
          object => object.id === id ? { ...object, rotation } : object
        )
      })
    }
  )
  EventBus.addEventListener(
    'object-scaled', ({ detail: { id, scale } }) => {
      setState({
        ...getState(),
        objects: getState().objects.map(
          object => object.id === id ? { ...object, scale } : object
        )
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
