import { observable, action, computed, autorun } from "mobx";
import Animation from "./Animation";
import {
  SLIDE,
  ROOM,
  ADD_ANIMATION,
  CAPTION,
  TRANSLATE,
  ROTATE,
  SCALE,
  CHOOSE_ANIMATION_TARGET,
  SELECT_TYPE,
  CHOOSE_ANIMATION_DESTINATION
} from "../constants";
class UIState {
  constructor(rootStore) {
    this.rootStore = rootStore;
    autorun(() => {
      const selectedSlide = this.rootStore.slides.selected;
      if (selectedSlide !== undefined && !this.isPlaying) {
        this.setElapsedTime(
          selectedSlide.getFinishTimeOfAnimation(
            selectedSlide.animations.selected
          )
        );
      }
    });
    autorun(() => {
      const selectedSlide = this.rootStore.slides.selected;
      if (selectedSlide !== undefined) {
        const animation = (
          [
            ...selectedSlide.getAnimationsToBeAppliedAtTime(this.elapsedTime)
          ].pop() || {}
        ).animation;
        selectedSlide.animations.select(animation);
      }
    });
  }
  @observable selectedDrawerTab = ROOM;
  @observable transformControlsMode = TRANSLATE;
  @observable isSettingView = false;
  @observable isSettingAnimation = false;
  @observable viewPosition = [0, 0, 1];
  @observable viewRotation = [0, 0, 0];
  @observable addAnimationStep = CHOOSE_ANIMATION_TARGET;
  @observable animationType = TRANSLATE;
  @observable clonedAnimationTarget;
  @observable elapsedTime = 0;
  @observable isPlaying = false;
  @computed
  get orbitControlsEnabled() {
    const { selectedDrawerTab, isSettingView, isEditingAnimation } = this;
    return (
      selectedDrawerTab === ROOM ||
      (selectedDrawerTab === SLIDE && isSettingView) ||
      (selectedDrawerTab === ADD_ANIMATION && isEditingAnimation)
    );
  }
  @computed
  get transformControlsEnabled() {
    const { selectedDrawerTab, addAnimationStep } = this;
    return (
      (selectedDrawerTab === ROOM ||
        (selectedDrawerTab === ADD_ANIMATION &&
          addAnimationStep === CHOOSE_ANIMATION_DESTINATION)) &&
      this.rootStore.objects.selected !== undefined
    );
  }
  @computed
  get objectSelectionEnabled() {
    const { addAnimationStep, selectedDrawerTab } = this;
    return !(
      selectedDrawerTab === ADD_ANIMATION &&
      addAnimationStep > CHOOSE_ANIMATION_TARGET
    );
  }
  @computed
  get drawerTabLocked() {
    return this.isSettingView || this.isSettingAnimation;
  }
  @computed
  get animationDestination() {
    if (this.clonedAnimationTarget !== undefined) {
      const property = {
        [TRANSLATE]: "position",
        [ROTATE]: "rotation",
        [SCALE]: "scale"
      }[this.animationType];
      return this.clonedAnimationTarget[property];
    }
  }
  @computed
  get currentObjectStates() {
    const clones = this.rootStore.objects.items.map(object => ({
      originalId: object.id,
      clone: object.clone()
    }));
    const selectedSlide = this.rootStore.slides.selected;
    const slides = this.rootStore.slides.items;
    if (
      selectedSlide !== undefined &&
      [SLIDE, ADD_ANIMATION].includes(this.selectedDrawerTab)
    ) {
      const slidesBeforeSelectedSlide = slides.slice(
        0,
        slides.indexOf(selectedSlide)
      );
      []
        .concat(
          ...slidesBeforeSelectedSlide.map(slide =>
            slide.animations.items.slice()
          )
        )
        .forEach(animation => {
          const cloneObject = clones.find(
            clone => clone.originalId === animation.target.id
          );
          if (cloneObject !== undefined) {
            cloneObject.clone.applyAnimation(animation);
          }
        });
      if (this.selectedDrawerTab === SLIDE) {
        selectedSlide
          .getAnimationsToBeAppliedAtTime(this.elapsedTime)
          .forEach(({ animation, elapsedTime }) => {
            const cloneObject = clones.find(
              clone => clone.originalId === animation.target.id
            );
            if (cloneObject !== undefined) {
              cloneObject.clone.applyAnimation(animation, elapsedTime);
            }
          });
      } else if (this.selectedDrawerTab === ADD_ANIMATION) {
        const selectedAnimation = selectedSlide.animations.selected;
        const animations = selectedSlide.animations.items;
        animations
          .slice(0, animations.indexOf(selectedAnimation) + 1)
          .forEach(animation => {
            const cloneObject = clones.find(
              clone => clone.originalId === animation.target.id
            );
            if (cloneObject !== undefined) {
              cloneObject.clone.applyAnimation(animation);
            }
          });
      }
    }
    return clones;
  }
  @computed
  get selectedSlideDuration() {
    return this.rootStore.slides.selected.slideDuration;
  }
  @action
  selectDrawerTab(tab) {
    if ([SLIDE, ROOM, ADD_ANIMATION, CAPTION].includes(tab)) {
      this.selectedDrawerTab = tab;
    }
  }
  @action
  setTransformControlsMode(mode) {
    if ([TRANSLATE, ROTATE, SCALE].includes(mode)) {
      this.transformControlsMode = mode;
    }
  }
  @action
  startSettingView() {
    this.isSettingView = true;
  }
  @action
  finishSettingView() {
    this.isSettingView = false;
  }
  @action
  startEditingAnimation() {
    this.selectDrawerTab(ADD_ANIMATION);
    this.isSettingAnimation = true;
  }
  @action
  finishEditingAnimation() {
    const animation = new Animation();
    animation.setTarget(this.rootStore.objects.selected);
    animation.setType(this.animationType);
    animation.setDestination(this.animationDestination.slice());
    this.rootStore.slides.selected.animations.add(animation);
    this.isSettingAnimation = false;
    this.addAnimationStep = CHOOSE_ANIMATION_TARGET;
    this.animationType = TRANSLATE;
    this.clonedAnimationTarget = undefined;
    this.selectDrawerTab(SLIDE);
  }
  @action
  setView(position, rotation) {
    Object.assign(this.viewPosition, position);
    Object.assign(this.viewRotation, rotation);
  }
  @action
  incrementAddAnimationStep() {
    if (this.addAnimationStep === CHOOSE_ANIMATION_TARGET) {
      this.clonedAnimationTarget = this.currentObjectStates
        .find(
          ({ originalId }) => this.rootStore.objects.selected.id === originalId
        )
        .clone.clone();
    }
    if (this.addAnimationStep === SELECT_TYPE) {
      this.setTransformControlsMode(this.animationType);
    }
    if (this.addAnimationStep === CHOOSE_ANIMATION_DESTINATION) {
      this.finishEditingAnimation();
    } else {
      this.addAnimationStep++;
    }
  }
  @action
  setAnimationType(type) {
    this.animationType = type;
  }
  @action
  resetElapsedTime() {
    this.elapsedTime = 0;
  }
  @action
  setElapsedTime(time) {
    this.elapsedTime = time;
    if (this.elapsedTime > this.selectedSlideDuration) {
      this.pause();
    }
  }
  @action
  increaseElapsedTime(time) {
    this.elapsedTime += time;
    if (this.elapsedTime > this.selectedSlideDuration) {
      this.stop();
    }
  }
  @action
  play() {
    this.isPlaying = true;
  }
  @action
  pause() {
    this.isPlaying = false;
  }
  @action
  stop() {
    this.pause();
    this.resetElapsedTime();
  }
}
export default UIState;
