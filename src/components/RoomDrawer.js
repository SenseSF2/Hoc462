import EventBus from '../EventBus'
import * as THREE from 'three'
export default () => {
  const root = document.createElement('div')
  root.innerHTML = `
    <select class="add-object">
      <option disabled selected>Add object</option>
      <option value="plane">Plane</option>
      <option value="box">Box</option>
      <option value="circle">Circle</option>
      <option value="cylinder">Cylinder</option>
      <option value="sphere">Sphere</option>
      <option value="icosahedron">Icosahedron</option>
      <option value="torus">Torus</option>
      <option value="torusknot">TorusKnot</option>
      <option value="lathe">Lathe</option>
      <option value="sprite">Sprite</option>
    </select>
  `
  const addObjectElement = root.querySelector('.add-object')
  addObjectElement.addEventListener('change', ({ target }) => {
    const geometries = {
      plane: THREE.PlaneGeometry,
      box: THREE.BoxGeometry,
      circle: THREE.CircleGeometry,
      cylinder: THREE.CylinderGeometry,
      sphere: THREE.SphereGeometry,
      icosahedron: THREE.IcosahedronGeometry,
      torus: THREE.TorusGeometry,
      torusknot: THREE.TorusKnotGeometry,
      lathe: THREE.LatheGeometry,
      sprite: new Error("No, this object doesn't")
    }
    console.log(geometries[target.value])
    target.selectedIndex = 0
  })
  return root
}
