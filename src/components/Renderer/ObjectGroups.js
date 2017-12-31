import * as THREE from 'three'
import ThreeBSP from '../../vendor/ThreeCSG'
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
      const group = getState().objects
        .find(({ id: currentId }) => currentId === id)
      const group3d = new THREE.Group()
      const solids = []
      const holes = []
      group.members.forEach(({ id, holeOrSolid }) => {
        const object3d = objects.get(id)
        objects.delete(id)
        if (holeOrSolid === 'solid') {
          solids.push(object3d)
        } else {
          holes.push(object3d)
        }
        objectIds.delete(object3d)
        scene.remove(object3d)
      })
      const convertToBSP = object3d => {
        const geometry = object3d.geometry.clone()
        object3d.updateMatrix()
        geometry.applyMatrix(object3d.matrix)
        return new ThreeBSP(geometry)
      }
      const holeBSPs = holes.map(convertToBSP)
      for (let i = 0; i < solids.length; i++) {
        // I am mutating this array.
        let solidBSP = convertToBSP(solids[i])
        holeBSPs.forEach(holeBSP => { solidBSP = solidBSP.subtract(holeBSP) })
        solids[i] = solidBSP.toMesh(solids[i].material)
        group3d.add(solids[i])
      }
      scene.add(group3d)
      objects.set(id, group3d)
      objectIds.set(group3d, id)
      EventBus.dispatchEvent(selectObject(id))
    }
  )
}
