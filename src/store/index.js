import List from './List'
import { SLIDE, ROOM, CAPTION } from '../constants'
class RootStore {
  constructor () {
    this.objects = new List()
    this.slides = new List()
    this.drawerTabs = new List()
    this.drawerTabs.addMultiple([SLIDE, ROOM, CAPTION])
    this.drawerTabs.select(ROOM)
  }
}
const store = new RootStore()
window.store = store
export default store
