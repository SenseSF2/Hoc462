import * as THREE from 'three'
import EventBus from '../../EventBus'
import getState from '../../store'
import selectObject from '../../actions/selectObject'
import translateObject from '../../actions/translateObject'
import rotateObject from '../../actions/rotateObject'
import scaleObject from '../../actions/scaleObject'
export default (
  scene, camera, raycastingPlane, objects,
  objectIds, boundingBox, transformControls
) => {
  // For example: string "#ffffff" is converted to number 0xffffff = 16777215
  const hexColorToDecimal = color => parseInt(color.match(/.(.*)/)[1], 16)
  EventBus.addEventListener(
    'object-added', ({ detail: { type, id, color } }) => {
      const decimalColor = hexColorToDecimal(color)
      let object3d
      if (type === 'group') {
        // Just ignore it. The group is already created in
        // finished-creating-object handler (ObjectGroup.js).
        return
      }
      if (type === 'circle') {
        object3d = new THREE.Mesh(
          new THREE.CircleGeometry(1, 32),
          new THREE.MeshBasicMaterial({
            color: decimalColor,
            side: THREE.DoubleSide
          })
        )
      } else {
        object3d = new THREE.Mesh(
          {
            box: new THREE.BoxGeometry(1, 1, 1),
            cylinder: new THREE.CylinderGeometry(1, 1, 3, 32),
            sphere: new THREE.SphereGeometry(1, 32, 32),
            icosahedron: new THREE.IcosahedronGeometry(1, 0),
            torus: new THREE.TorusGeometry(1, 0.5, 16, 100)
          }[type],
          new THREE.MeshPhongMaterial({
            color: decimalColor,
            side: THREE.DoubleSide
          })
        )
      }
      object3d.solidMaterial = object3d.material
      object3d.holeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        opacity: 0.5,
        transparent: true,
        alphaTest: 0.5,
        side: THREE.DoubleSide
      })
      object3d.highlightedMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.5,
        transparent: true,
        alphaTest: 0.5,
        side: THREE.DoubleSide
      })
      objects.set(id, object3d)
      objectIds.set(object3d, id)
      scene.add(object3d)
      EventBus.dispatchEvent(selectObject(id))
      // move the object to the center of renderer by raycasting
      const raycaster = new THREE.Raycaster()
      const centerOfRenderer = new THREE.Vector2(0, 0)
      raycaster.setFromCamera(centerOfRenderer, camera)
      const intersects = raycaster.intersectObjects([raycastingPlane])
      if (intersects.length > 0) {
        EventBus.dispatchEvent(
          translateObject(id, intersects[0].point.toArray())
        )
      }
    }
  )
  EventBus.addEventListener('object-selected', ({ detail: { id } }) => {
    const object3d = objects.get(id)
    boundingBox.setFromObject(object3d)
    scene.add(boundingBox)
    if (getState().selectedDrawerTab === 'world') {
      transformControls.attach(object3d)
    }
  })
  EventBus.addEventListener(
    'object-color-changed', ({ detail: { id, color } }) => {
      const object3d = objects.get(id)
      const newMaterial = new THREE.MeshPhongMaterial({
        color: hexColorToDecimal(color),
        side: THREE.DoubleSide
      })
      const isSolid = getState().objects.find(
        ({ id: currentId }) => currentId === id
      ).holeOrSolid === 'solid'
      if (isSolid) {
        object3d.material = newMaterial
      }
      object3d.solidMaterial = newMaterial
    }
  )
  EventBus.addEventListener(
    'object-texture-changed', ({ detail: { id, url } }) => {
      const object3d = objects.get(id)
      const newMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(url),
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5
      })
      const isSolid = getState().objects.find(
        ({ id: currentId }) => currentId === id
      ).holeOrSolid === 'solid'
      if (isSolid) {
        object3d.material = newMaterial
      }
      object3d.solidMaterial = newMaterial
    }
  )
  transformControls.addEventListener('change', () => {
    if (getState().selectedDrawerTab !== 'world') return
    const { object } = transformControls
    const id = objectIds.get(object)
    EventBus.dispatchEvent(translateObject(id, object.position.toArray()))
    EventBus.dispatchEvent(rotateObject(id, object.rotation.toArray()))
    EventBus.dispatchEvent(scaleObject(id, object.scale.toArray()))
  })
  EventBus.addEventListener(
    'object-translated', ({ detail: { id, position } }) => {
      const object3d = objects.get(id)
      object3d.position.set(...position)
    }
  )
  EventBus.addEventListener(
    'object-rotated', ({ detail: { id, rotation } }) => {
      const object3d = objects.get(id)
      object3d.rotation.set(...rotation)
    }
  )
  EventBus.addEventListener(
    'object-scaled', ({ detail: { id, scale } }) => {
      const object3d = objects.get(id)
      object3d.scale.set(...scale)
    }
  )
  EventBus.addEventListener(
    'object-cloned', ({ detail: { id, clonedFromId } }) => {
      const object3d = objects.get(clonedFromId)
      const clonedObject = object3d.clone()
      scene.add(clonedObject)
      objects.set(id, clonedObject)
      objectIds.set(clonedObject, id)
      EventBus.dispatchEvent(selectObject(id))
    }
  )
  EventBus.addEventListener('object-removed', ({ detail: { id } }) => {
    const object3d = objects.get(id)
    objects.delete(id)
    objectIds.delete(object3d)
    scene.remove(object3d)
    if (getState().selectedObject === id) {
      scene.remove(boundingBox)
      transformControls.detach()
    }
  })
  EventBus.addEventListener(
    'object-turned-into-solid', ({ detail: { id } }) => {
      const object3d = objects.get(id)
      object3d.material = object3d.solidMaterial
    }
  )
  EventBus.addEventListener('object-turned-into-hole', ({ detail: { id } }) => {
    const object3d = objects.get(id)
    object3d.material = object3d.holeMaterial
  })
}
