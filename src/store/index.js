import List from "./List";
import UIState from "./UIState";
class RootStore {
  constructor() {
    this.objects = new List();
    this.slides = new List();
    this.uiState = new UIState(this);
  }
}
const store = new RootStore();
window.store = store;
export default store;
