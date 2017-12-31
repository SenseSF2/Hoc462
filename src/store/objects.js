import EventBus from '../EventBus'
import addObject from '../actions/addObject'
export default ({ getState, setState }) => {
  EventBus.addEventListener(
    'object-added',
    ({ detail: {
      id, name, type, members, position, rotation, scale, color, holeOrSolid
    } }) => {
      setState({
        ...getState(),
        objects: [...getState().objects, {
          id, name, type, members, position, rotation, scale, color, holeOrSolid
        }]
      })
    }
  )
  EventBus.addEventListener(
    'object-texture-changed', ({ detail: { id, url } }) => {
      setState({
        ...getState(),
        objects: getState().objects.map(
          object => object.id === id ? { ...object, url } : object
        )
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
  EventBus.addEventListener(
    'object-color-changed', ({ detail: { id, color } }) => {
      setState({
        ...getState(),
        objects: getState().objects.map(
          object => object.id === id ? { ...object, color } : object
        )
      })
    }
  )
  EventBus.addEventListener(
    'object-turned-into-hole', ({ detail: { id } }) => {
      setState({
        ...getState(),
        objects: getState().objects.map(
          object => object.id === id ? {
            ...object, holeOrSolid: 'hole'
          } : object
        )
      })
    }
  )
  EventBus.addEventListener(
    'object-turned-into-solid', ({ detail: { id } }) => {
      setState({
        ...getState(),
        objects: getState().objects.map(
          object => object.id === id ? {
            ...object, holeOrSolid: 'solid'
          } : object
        )
      })
    }
  )
  EventBus.addEventListener(
    'finished-grouping-objects', ({ detail: { id } }) => {
      const members = getState().objects.filter(
        ({ id }) => getState().objectGroup.includes(id)
      )
      setState({
        ...getState(),
        objects: getState().objects
          .filter(({ id }) => !getState().objectGroup.includes(id))
      })
      EventBus.dispatchEvent(addObject(
        `Group of ${members.length} objects`,
        id, 'group', members
      ))
    }
  )
}
