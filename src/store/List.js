import { observable, computed, action } from 'mobx'
class List {
  @observable items = []
  @observable _selected
  @computed get selected () {
    if (this.items.includes(this._selected)) {
      return this._selected
    }
  }
  @action add (item) {
    this.items.push(item)
  }
  @action remove (item) {
    const itemIndex = this.items.indexOf(item)
    if (itemIndex !== -1) {
      this.items.splice(itemIndex, 1)
    }
  }
  @action select (item) {
    if (this.items.includes(item)) {
      this._selected = item
    }
  }
}
export default List
