import { observable, action } from 'mobx'
import uuidv4 from 'uuid/v4'
import { COLOR, IMAGE } from '../constants'
class Texture {
  id = uuidv4()
  @observable type = COLOR
  @observable color = '#ff00ff'
  @observable imageUrl = ''
  @action setColor (color) {
    this.type = COLOR
    this.color = color
  }
  @action setImage (imageUrl) {
    this.type = IMAGE
    this.imageUrl = imageUrl
  }
}
export default Texture
