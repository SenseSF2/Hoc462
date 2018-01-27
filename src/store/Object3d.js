import { observable, action } from 'mobx'
import uuidv4 from 'uuid/v4'
import { BOX } from '../constants'
import Texture from './Texture'
class Object3D {
  id = uuidv4()
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
  @action setScale (scale) {
    Object.assign(this.scale, scale)
  }
  constructor (type) {
    this.type = type
  }
}
export default Object3D
