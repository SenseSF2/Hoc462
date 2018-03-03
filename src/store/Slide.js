import { observable, action, computed } from "mobx";
import uuidv4 from "uuid/v4";
import List from "./List";
import { AFTER_PREVIOUS } from "../constants";
class Slide {
  id = uuidv4();
  @observable name = "Untitled";
  @observable viewPosition = [0, 0, 1];
  @observable viewRotation = [0, 0, 0];
  @observable elapsedTime = 0;
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
  getAnimationsToBeAppliedAtTime(time) {
    let finishTime = 0;
    const calculatedFinishTimes = this.animationGroups.map(group => {
      finishTime += Math.max(
        ...group.map(animation => animation.duration + animation.delay)
      );
      return { finishTime, group };
    });
    let leftFinishTime = 0;
    let activeGroup, activeGroupStartTime;
    const groups = [];
    for (let i = 0; i < calculatedFinishTimes.length; i++) {
      const rightFinishTime = calculatedFinishTimes[i].finishTime;
      const group = calculatedFinishTimes[i].group;
      if (leftFinishTime <= time && time <= rightFinishTime) {
        activeGroup = group;
        activeGroupStartTime = leftFinishTime;
        break;
      }
      groups.push(
        group.map(animation => ({
          animation,
          elapsedTime: Math.min(
            time - leftFinishTime - animation.delay,
            animation.duration
          )
        }))
      );
      leftFinishTime = rightFinishTime;
    }
    const elapsedTimeRelativeToActiveGroup = time - activeGroupStartTime;
    if (activeGroup !== undefined) {
      groups.push(
        activeGroup
          .filter(
            animation =>
              elapsedTimeRelativeToActiveGroup <= animation.duration &&
              elapsedTimeRelativeToActiveGroup >= animation.delay
          )
          .map(animation => ({
            animation,
            elapsedTime: elapsedTimeRelativeToActiveGroup - animation.delay
          }))
      );
    }
    return [].concat(...groups);
  }
  @computed
  get slideDuration() {
    let duration = 0;
    for (let i = 0; i < this.animationGroups.length; i++) {
      const group = this.animationGroups[i];
      duration += Math.max(
        ...group.map(animation => animation.duration + animation.delay)
      );
    }
    return duration;
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
