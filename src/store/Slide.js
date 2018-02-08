import { observable, action } from 'mobx'
import uuidv4 from 'uuid/v4'
import List from './List'
class Slide {
  id = uuidv4()
  @observable name = 'Untitled'
  @observable viewPosition = [0, 0, 1]
  @observable viewRotation = [0, 0, 0]
  animations = new List()
  @observable caption = ''
  @action rename (name) {
    this.name = name
  }
  @action setView (position, rotation) {
    Object.assign(this.viewPosition, position)
    Object.assign(this.viewRotation, rotation)
  }
  @action setCaption (caption) {
    this.caption = caption
  }
}
export default Slide
