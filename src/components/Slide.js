import React from "react";
import { observer } from "mobx-react";
import Renamable from "./Renamable";
import Button from "./Button";
import Clickable from "./Clickable";
@observer
export default class Slide extends React.Component {
  state = {
    isRenaming: false
  };
  startRenaming() {
    this.setState({ isRenaming: true });
  }
  handleRename(name) {
    const { slide } = this.props;
    slide.rename(name);
    this.setState({ isRenaming: false });
  }
  render() {
    const { slide, remove, select, selected, moveUp, moveDown } = this.props;
    const { isRenaming } = this.state;
    return (
      <Clickable onClick={select}>
        <li className={selected ? "selected" : ""}>
          <Renamable
            value={slide.name}
            onSubmit={name => this.handleRename(name)}
            isRenaming={isRenaming}
          />
          <span className="actions">
            <Button onClick={remove}>Delete</Button>
            <Button onClick={() => this.startRenaming()}>Rename</Button>
            {selected ? (
              <span>
                Move:
                <Button onClick={moveUp}>Up</Button>
                <Button onClick={moveDown}>Down</Button>
              </span>
            ) : (
              undefined
            )}
          </span>
        </li>
      </Clickable>
    );
  }
}
