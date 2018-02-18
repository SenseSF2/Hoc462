import { observable, action } from 'mobx'
import uuidv4 from 'uuid/v4'
import { AFTER_PREVIOUS, LINEAR } from '../constants'
class Animation {
  id = uuidv4()
  @observable target
  @observable attribute
  @observable destination = []
  @observable playWhen = AFTER_PREVIOUS
  @observable duration = 1000
  @observable easingFunction = LINEAR
  @action setTarget (target) { this.target = target }
  @action setAttribute (attribute) { this.attribute = attribute }
  @action setDestination (destination) {
    Object.assign(this.destination, destination)
  }
  @action setDuration (duration) { this.duration = duration }
  @action setEasingFunction (easingFunction) {
    this.easingFunction = easingFunction
  }
}
export default Animation
