import { observable, computed, action } from "mobx";
import { TO_PREVIOUS_INDEX, TO_NEXT_INDEX } from "../constants";
class List {
  constructor(enhancerFunctions) {
    const defaultEnhancerFunction = original => (...args) => original(...args);
    this.enhancerFunctions = {
      add: defaultEnhancerFunction,
      addMultiple: defaultEnhancerFunction,
      remove: defaultEnhancerFunction,
      select: defaultEnhancerFunction,
      move: defaultEnhancerFunction
    };
    Object.assign(this.enhancerFunctions, enhancerFunctions);
  }
  @observable items = [];
  @observable _selected;
  @computed
  get selected() {
    if (this.items.includes(this._selected)) {
      return this._selected;
    }
  }
  @action
  add(item) {
    this.enhancerFunctions.add(() => {
      const index = this.items.indexOf(this.selected);
      if (index === -1) {
        this.items.push(item);
      } else {
        const left = this.items.slice(0, index + 1);
        const right = this.items.slice(index + 1, this.items.length);
        // One element is added, now increment the length by 1 to let
        // MobX know of the change.
        this.items.length++;
        Object.assign(this.items, [...left, item, ...right]);
      }
      this.select(item);
    })(item);
  }
  @action
  addMultiple(items) {
    this.enhancerFunctions.addMultiple(() => {
      items.forEach(item => this.items.push(item));
    })(items);
  }
  @action
  remove(item) {
    this.enhancerFunctions.remove(() => {
      const itemIndex = this.items.indexOf(item);
      if (itemIndex !== -1) {
        this.items.splice(itemIndex, 1);
      }
    })(item);
  }
  @action
  select(item) {
    this.enhancerFunctions.select(() => {
      if (this.items.includes(item)) {
        this._selected = item;
      }
    })(item);
  }
  @action
  move(item, direction, times = 1) {
    this.enhancerFunctions.move(() => {
      for (let i = 0; i < times; i++) {
        const thisIndex = this.items.indexOf(item);
        let thatIndex;
        if (direction === TO_PREVIOUS_INDEX) {
          thatIndex = thisIndex - 1;
        } else if (direction === TO_NEXT_INDEX) {
          thatIndex = thisIndex + 1;
        }
        const thisItem = this.items[thisIndex];
        const thatItem = this.items[thatIndex];
        if (thisItem !== undefined && thatItem !== undefined) {
          this.items[thisIndex] = thatItem;
          this.items[thatIndex] = thisItem;
        }
      }
    })(item, direction, times);
  }
  @action
  empty() {
    this.items.length = 0;
  }
}
export default List;
