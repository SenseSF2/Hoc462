import List from './List'
import { SLIDE, ROOM, CAPTION, TRANSLATE, ROTATE, SCALE } from '../constants'
class RootStore {
  constructor () {
    this.objects = new List()
    this.slides = new List()
    this.drawerTabs = new List()
    this.drawerTabs.addMultiple([SLIDE, ROOM, CAPTION])
    this.drawerTabs.select(ROOM)
    this.transformControlsModes = new List()
    this.transformControlsModes.addMultiple([TRANSLATE, ROTATE, SCALE])
    this.transformControlsModes.select(TRANSLATE)
  }
}
const store = new RootStore()
window.store = store
export default store
