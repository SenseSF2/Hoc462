import List from "./List";
import UIState from "./UIState";
import { SLIDE } from "../constants";
class RootStore {
  constructor() {
    this.objects = new List();
    this.slides = new List({
      add: original => () => {
        original();
        this.uiState.selectDrawerTab(SLIDE);
      },
      select: original => () => {
        original();
        this.uiState.selectDrawerTab(SLIDE);
      }
    });
    this.uiState = new UIState(this);
  }
}
const store = new RootStore();
window.store = store;
export default store;
