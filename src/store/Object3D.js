import { observable, action } from "mobx";
import uuidv4 from "uuid/v4";
import {
  BOX,
  COLOR,
  IMAGE,
  TRANSLATE,
  ROTATE,
  SCALE,
  LINEAR,
  QUAD
} from "../constants";
import Texture from "./Texture";
class Object3D {
  id = uuidv4();
  @observable name = "Untitled";
  @observable type = BOX;
  texture = new Texture();
  @observable position = [0, 0, 0];
  @observable rotation = [0, 0, 0];
  @observable scale = [1, 1, 1];
  @action
  rename(name) {
    this.name = name;
  }
  @action
  setPosition(position) {
    Object.assign(this.position, position);
  }
  @action
  setRotation(rotation) {
    Object.assign(this.rotation, rotation);
  }
  @action
  setScale(scale) {
    Object.assign(this.scale, scale);
  }
  @action
  applyAnimation(animation, timeElapsed = animation.duration) {
    let property;
    if (animation.type === TRANSLATE) {
      property = "position";
    } else if (animation.type === ROTATE) {
      property = "rotation";
    } else if (animation.type === SCALE) {
      property = "scale";
    }
    const from = this[property];
    const to = animation.destination;
    const easingFunction = {
      [LINEAR]: x => x,
      [QUAD]: x => x ** 2
    }[animation.easingFunction];
    const next = from.map(
      (x, i) =>
        x + (to[i] - x) * easingFunction(timeElapsed / animation.duration)
    );
    Object.assign(this[property], next);
  }
  constructor(type) {
    this.type = type;
  }
  clone() {
    const clone = new Object3D(this.type);
    clone.rename(this.name);
    if (this.texture.type === COLOR) {
      clone.texture.setColor(this.texture.value);
    } else if (this.texture.type === IMAGE) {
      clone.texture.setImage(this.texture.value);
    }
    clone.setPosition(this.position.slice());
    clone.setRotation(this.rotation.slice());
    clone.setScale(this.scale.slice());
    return clone;
  }
}
export default Object3D;
