import { observable, computed, action } from 'mobx'
import { TO_PREVIOUS_INDEX, TO_NEXT_INDEX } from '../constants'
class List {
  @observable items = []
  @observable _selected
  @computed get selected () {
    if (this.items.includes(this._selected)) {
      return this._selected
    }
  }
  @action add (item) {
    const index = this.items.indexOf(this.selected)
    if (index === -1) {
      this.items.push(item)
    } else {
      const left = this.items.slice(0, index + 1)
      const right = this.items.slice(index + 1, this.items.length)
      Object.assign(this.items, [...left, item, ...right])
    }
    this.select(item)
  }
  @action addMultiple (items) {
    items.forEach(item => this.items.push(item))
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
  @action move (item, direction, times = 1) {
    for (let i = 0; i < times; i++) {
      const thisIndex = this.items.indexOf(item)
      let thatIndex
      if (direction === TO_PREVIOUS_INDEX) {
        thatIndex = thisIndex - 1
      } else if (direction === TO_NEXT_INDEX) {
        thatIndex = thisIndex + 1
      }
      const thisItem = this.items[thisIndex]
      const thatItem = this.items[thatIndex]
      if (thisItem !== undefined && thatItem !== undefined) {
        this.items[thisIndex] = thatItem
        this.items[thatIndex] = thisItem
      }
    }
  }
}
export default List
