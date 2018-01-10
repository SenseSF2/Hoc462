import { observable, action } from 'mobx'
import { BOX } from '../constants'
import Texture from './Texture'
class Object3d {
  @observable name = 'Untitled'
  @observable type = BOX
  texture = new Texture()
  @observable position = [0, 0, 0]
  @observable rotation = [0, 0, 0]
  @observable scale = [1, 1, 1]
  @action rename (name) {
    this.name = name
  }
  @action setPosition (position) {
    Object.assign(this.position, position)
  }
  @action setRotation (rotation) {
    Object.assign(this.rotation, rotation)
  }
  @action setScale (rotation) {
    Object.assign(this.scale, scale)
  }
}
export default Object3d
