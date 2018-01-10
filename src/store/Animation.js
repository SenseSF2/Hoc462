import { observable, action } from 'mobx'
import { AFTER_PREVIOUS } from '../constants'
class Animation {
  @observable target
  @observable type
  @observable playWhen = AFTER_PREVIOUS
  @observable duration = 1000
}
export default Animation
