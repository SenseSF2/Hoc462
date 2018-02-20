import { observable, action, computed } from "mobx";
import uuidv4 from "uuid/v4";
import List from "./List";
import { AFTER_PREVIOUS } from "../constants";
class Slide {
  id = uuidv4();
  @observable name = "Untitled";
  @observable viewPosition = [0, 0, 1];
  @observable viewRotation = [0, 0, 0];
  animations = new List();
  @computed
  get animationGroups() {
    const result = [];
    let resultIndex = -1;
    for (let i = 0; i < this.animations.items.length; i++) {
      const animation = this.animations.items[i];
      if (animation.startTime === AFTER_PREVIOUS) resultIndex++;
      if (resultIndex < 0) resultIndex = 0;
      if (result[resultIndex] === undefined) result[resultIndex] = [];
      result[resultIndex].push(animation);
    }
    return result;
  }
  @observable caption = "";
  @action
  rename(name) {
    this.name = name;
  }
  @action
  setView(position, rotation) {
    Object.assign(this.viewPosition, position);
    Object.assign(this.viewRotation, rotation);
  }
  @action
  setCaption(caption) {
    this.caption = caption;
  }
}
export default Slide;
