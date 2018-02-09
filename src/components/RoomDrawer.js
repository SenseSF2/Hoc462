import React from 'react'
import { observer } from 'mobx-react'
import { button } from './Button.css'
import Object3D from './Object3D'
import {
  BOX, CIRCLE, CYLINDER, SPHERE, ICOSAHEDRON, TORUS, TRANSLATE, ROTATE, SCALE
} from '../constants'
const RoomDrawer = observer(({
  objects, add, changeTransformControlsMode
}) =>
  <div>
    <div>
      <select className={button} value='__default__' onChange={event => {
        const objectType = ({
          box: BOX, circle: CIRCLE, cylinder: CYLINDER, sphere: SPHERE,
          icosahedron: ICOSAHEDRON, torus: TORUS
        })[event.target.value]
        add(objectType)
      }}>
        <option disabled value='__default__'>Add object</option>
        <option value='box'>Box</option>
        <option value='circle'>Circle</option>
        <option value='cylinder'>Cylinder</option>
        <option value='sphere'>Sphere</option>
        <option value='icosahedron'>Icosahedron</option>
        <option value='torus'>Torus</option>
      </select>
      <button
        className={button}
        onClick={() => changeTransformControlsMode(TRANSLATE)}
      >
        Translate
      </button>
      <button
        className={button}
        onClick={() => changeTransformControlsMode(ROTATE)}
      >
        Rotate
      </button>
      <button
        className={button}
        onClick={() => changeTransformControlsMode(SCALE)}
      >
        Scale
      </button>
    </div>
    <button className={button} onClick={() => objects.selected.turnIntoHole()}>
      Turn object into a hole
    </button>
    <button className={button} onClick={() => objects.selected.turnIntoSolid()}>
      Turn object into a solid
    </button>
    <button className={button}>Group objects</button>
    <button className={button}>
      Done grouping objects
    </button>
    <div>
      {objects.items.map(item =>
        <Object3D
          object={item} remove={() => objects.remove(item)} key={item.id}
          select={() => objects.select(item)}
          selected={objects.selected === item}
          clone={() => objects.add(item.clone())}
        />
      )}
    </div>
  </div>
)
RoomDrawer.displayName = 'RoomDrawer'
export default RoomDrawer
