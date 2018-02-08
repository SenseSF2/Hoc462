import { observable, action, computed } from 'mobx'
import { SLIDE, ROOM, CAPTION, TRANSLATE, ROTATE, SCALE } from '../constants'
class UIState {
  @observable selectedDrawerTab = ROOM
  @observable transformControlsMode = TRANSLATE
  @observable isSettingView = false
  @observable isSettingAnimation = false
  @observable viewPosition = [0, 0, 1]
  @observable viewRotation = [0, 0, 0]
  @computed get orbitControlsEnabled () {
    const { selectedDrawerTab, isSettingView, isSettingAnimation } = this
    return selectedDrawerTab === ROOM || (
      selectedDrawerTab === SLIDE && (isSettingView || isSettingAnimation)
    )
  }
  @computed get drawerTabLocked () {
    return this.isSettingView || this.isEditingAnimation
  }
  @action selectDrawerTab (tab) {
    if ([SLIDE, ROOM, CAPTION].includes(tab)) {
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
  @action startEditingAnimation () { this.isEditingAnimation = true }
  @action finishEditingAnimation () { this.isEditingAnimation = false }
  @action setView (position, rotation) {
    Object.assign(this.viewPosition, position)
    Object.assign(this.viewRotation, rotation)
  }
}
export default UIState
