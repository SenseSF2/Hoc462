import { observable, action } from 'mobx'
import uuidv4 from 'uuid/v4'
import { AFTER_PREVIOUS, LINEAR } from '../constants'
class Animation {
  id = uuidv4()
  @observable target
  @observable type
  @observable destination = []
  @observable startTime = AFTER_PREVIOUS
  @observable duration = 1000
  @observable delay = 0
  @observable easingFunction = LINEAR
  @action setTarget (target) { this.target = target }
  @action setType (type) { this.type = type }
  @action setDestination (destination) {
    Object.assign(this.destination, destination)
  }
  @action setDuration (duration) { this.duration = duration }
  @action setEasingFunction (easingFunction) {
    this.easingFunction = easingFunction
  }
  @action setStartTime (startTime) { this.startTime = startTime }
  @action setDelay (delay) { this.delay = delay }
}
export default Animation
