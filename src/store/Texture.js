import { observable, action } from 'mobx'
import uuidv4 from 'uuid/v4'
import { COLOR, IMAGE } from '../constants'
class Texture {
  id = uuidv4()
  @observable type = COLOR
  @observable value = '#ff00ff'
  @action setColor (color) {
    this.type = COLOR
    this.value = color
  }
  @action setImage (imageUrl) {
    this.type = IMAGE
    this.value = imageUrl
  }
}
export default Texture
