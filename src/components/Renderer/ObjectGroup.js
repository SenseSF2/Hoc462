import * as THREE from 'three'
import EventBus from '../../EventBus'
import getState from '../../store'
import selectObject from '../../actions/selectObject'
export default (objects, objectIds, scene) => {
  EventBus.addEventListener('object-added-to-group', ({ detail: { id } }) => {
    const object3d = objects.get(id)
    object3d.material = object3d.highlightedMaterial
  })
  const unhighlightObject = (id, object) => {
    const object3d = objects.get(id)
    if (object3d === undefined) return
    const holeOrSolid = (getState().objects.find(
      ({ id: currentId }) => id === currentId
    ) || object).holeOrSolid
    if (holeOrSolid === 'hole') {
      object3d.material = object3d.holeMaterial
    }
    if (holeOrSolid === 'solid') {
      object3d.material = object3d.solidMaterial
    }
  }
  EventBus.addEventListener(
    'object-removed-from-group', ({ detail: { id } }) => {
      unhighlightObject(id)
    }
  )
  EventBus.addEventListener(
    'finished-grouping-objects', ({ detail: { id } }) => {
      getState().objects.forEach(object => {
        unhighlightObject(object.id)
        if (object.type === 'group') {
          object.members.forEach(
            (object) => unhighlightObject(object.id, object)
          )
        }
      })
      const group = new THREE.Group()
      getState().objectGroup.map(id => objects.get(id)).forEach(object => {
        group.add(object)
        objectIds.delete(object)
        scene.remove(object)
      })
      getState().objectGroup.forEach(id => objects.delete(id))
      objects.set(id, group)
      objectIds.set(group, id)
      scene.add(group)
      EventBus.dispatchEvent(selectObject(id))
    }
  )
}
