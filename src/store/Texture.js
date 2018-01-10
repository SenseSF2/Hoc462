import { observable, action } from 'mobx'
import { COLOR, IMAGE } from '../constants'
class Texture {
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
