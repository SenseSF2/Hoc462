import { observable, action, computed } from 'mobx'
import Animation from './Animation'
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
} from '../constants'
class UIState {
  constructor (rootStore) {
    this.rootStore = rootStore
  }
  @observable selectedDrawerTab = ROOM
  @observable transformControlsMode = TRANSLATE
  @observable isSettingView = false
  @observable isSettingAnimation = false
  @observable viewPosition = [0, 0, 1]
  @observable viewRotation = [0, 0, 0]
  @observable addAnimationStep = CHOOSE_ANIMATION_TARGET
  @observable animationType = TRANSLATE
  @observable clonedAnimationTarget
  @computed get orbitControlsEnabled () {
    const { selectedDrawerTab, isSettingView, isEditingAnimation } = this
    return selectedDrawerTab === ROOM
    || (selectedDrawerTab === SLIDE && isSettingView)
    || (selectedDrawerTab === ADD_ANIMATION && isEditingAnimation)
  }
  @computed get transformControlsEnabled () {
    const { selectedDrawerTab, isSettingView, addAnimationStep } = this
    return (
      selectedDrawerTab === ROOM
      || (
        selectedDrawerTab === ADD_ANIMATION
        && addAnimationStep === CHOOSE_ANIMATION_DESTINATION
      )
    )
    && this.rootStore.objects.selected !== undefined
  }
  @computed get objectSelectionEnabled () {
    const { addAnimationStep, selectedDrawerTab } = this
    return !(
      selectedDrawerTab === ADD_ANIMATION &&
      addAnimationStep > CHOOSE_ANIMATION_TARGET
    )
  }
  @computed get drawerTabLocked () {
    return this.isSettingView || this.isSettingAnimation
  }
  @computed get animationDestination () {
    if (this.clonedAnimationTarget !== undefined) {
      return this.clonedAnimationTarget[({
        [TRANSLATE]: 'position', [ROTATE]: 'rotation', [SCALE]: 'scale'
      })[this.animationType]]
    }
  }
  @action selectDrawerTab (tab) {
    if ([SLIDE, ROOM, ADD_ANIMATION, CAPTION].includes(tab)) {
      this.selectedDrawerTab = tab
    }
  }
  @action setTransformControlsMode (mode) {
    if ([TRANSLATE, ROTATE, SCALE].includes(mode)) {
      this.transformControlsMode = mode
    }
  }
  @action startSettingView () { this.isSettingView = true }
  @action finishSettingView () { this.isSettingView = false }
  @action startEditingAnimation () {
    this.selectDrawerTab(ADD_ANIMATION)
    this.isSettingAnimation = true
  }
  @action finishEditingAnimation () {
    const animation = new Animation()
    animation.setTarget(this.rootStore.objects.selected)
    animation.setType(this.animationType)
    animation.setDestination(this.animationDestination.slice())
    this.rootStore.slides.selected.animations.add(animation)
    this.isSettingAnimation = false
    this.addAnimationStep = CHOOSE_ANIMATION_TARGET
    this.animationType = TRANSLATE
    this.clonedAnimationTarget = undefined
    this.selectDrawerTab(SLIDE)
  }
  @action setView (position, rotation) {
    Object.assign(this.viewPosition, position)
    Object.assign(this.viewRotation, rotation)
  }
  @action incrementAddAnimationStep () {
    if (this.addAnimationStep === CHOOSE_ANIMATION_TARGET) {
      this.clonedAnimationTarget = this.rootStore.objects.selected.clone()
    }
    if (this.addAnimationStep === SELECT_TYPE) {
      this.setTransformControlsMode(this.animationType)
    }
    if (this.addAnimationStep === CHOOSE_ANIMATION_DESTINATION) {
      this.finishEditingAnimation()
    } else {
      this.addAnimationStep++
    }
  }
  @action setAnimationType (type) {
    this.animationType = type
  }
}
export default UIState
