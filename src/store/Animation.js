import { observable, action } from 'mobx'
import uuidv4 from 'uuid/v4'
import { AFTER_PREVIOUS } from '../constants'
class Animation {
  id = uuidv4()
  @observable target
  @observable type
  @observable playWhen = AFTER_PREVIOUS
  @observable duration = 1000
}
export default Animation
