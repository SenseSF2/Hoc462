import React from "react";
import { observer } from "mobx-react";
import Button from "./Button";
import { button } from "./Button.css";
import Object3D from "./Object3D";
import Object3DThumbnailView from "./Object3DThumbnailView";
import styles from "./RoomDrawer.css";
import {
  BOX,
  CIRCLE,
  CYLINDER,
  SPHERE,
  ICOSAHEDRON,
  TORUS,
  TRANSLATE,
  ROTATE,
  SCALE
} from "../constants";
const RoomDrawer = observer(({ objects, add, changeTransformControlsMode }) => (
  <div className={styles.roomDrawer}>
    <div>
      <select
        className={button}
        value="__default__"
        onChange={event => {
          const objectType = {
            box: BOX,
            circle: CIRCLE,
            cylinder: CYLINDER,
            sphere: SPHERE,
            icosahedron: ICOSAHEDRON,
            torus: TORUS
          }[event.target.value];
          add(objectType);
        }}
      >
        <option disabled value="__default__">
          Add object
        </option>
        <option value="box">Box</option>
        <option value="circle">Circle</option>
        <option value="cylinder">Cylinder</option>
        <option value="sphere">Sphere</option>
        <option value="icosahedron">Icosahedron</option>
        <option value="torus">Torus</option>
      </select>
      <Button onClick={() => changeTransformControlsMode(TRANSLATE)}>
        Translate
      </Button>
      <Button onClick={() => changeTransformControlsMode(ROTATE)}>
        Rotate
      </Button>
      <Button onClick={() => changeTransformControlsMode(SCALE)}>Scale</Button>
    </div>
    <Button onClick={() => objects.selected.turnIntoHole()}>
      Turn object into a hole
    </Button>
    <Button onClick={() => objects.selected.turnIntoSolid()}>
      Turn object into a solid
    </Button>
    <Button>Group objects</Button>
    <Button>Done grouping objects</Button>
    <div className="objects">
      {objects.items.map(item => (
        <Object3DThumbnailView
          object={item}
          remove={() => objects.remove(item)}
          key={item.id}
          select={() => objects.select(item)}
          selected={objects.selected === item}
        />
      ))}
    </div>
    {objects.selected !== undefined && (
      <div>
        <Object3D
          object={objects.selected}
          remove={() => objects.remove(objects.selected)}
          clone={() => objects.add(objects.selected.clone())}
        />
      </div>
    )}
  </div>
));
RoomDrawer.displayName = "RoomDrawer";
export default RoomDrawer;
