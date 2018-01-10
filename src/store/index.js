import List from './List'
class RootStore {
  constructor () {
    this.objects = new List()
    this.slides = new List()
  }
}
export default new RootStore()
