import React from "react";
import { observer } from "mobx-react";
import Renamable from "./Renamable";
import Button from "./Button";
import Clickable from "./Clickable";
import Input from "./Input";
import styles from "./Object3D.css";
import { COLOR } from "../constants";
@observer
export default class Object3D extends React.Component {
  state = {
    isRenaming: false
  };
  startRenaming() {
    this.setState({ isRenaming: true });
  }
  handleRename(name) {
    const { object } = this.props;
    object.rename(name);
    this.setState({ isRenaming: false });
  }
  handleColorChange(event) {
    const { object } = this.props;
    object.texture.setColor(event.target.value);
  }
  handleTextureUpload(event) {
    const reader = new window.FileReader();
    reader.readAsDataURL(this.textureUploadInput.files[0]);
    reader.addEventListener("loadend", () => {
      this.props.object.texture.setImage(reader.result);
    });
  }
  render() {
    const { isRenaming } = this.state;
    const { object, remove, selected, select, clone } = this.props;
    return (
      <Clickable onClick={select}>
        <div
          className={[styles.object, selected ? "highlighted" : undefined].join(
            " "
          )}
        >
          <div className="name">
            <Renamable
              value={object.name}
              onSubmit={name => this.handleRename(name)}
              isRenaming={isRenaming}
            />
          </div>
          <div>
            <Button onClick={remove}>Delete</Button>
            <Button onClick={clone}>Clone</Button>
            <Button onClick={() => this.startRenaming()}>Rename</Button>
            <Button onClick={() => this.textureUploadInput.click()}>
              Set texture
            </Button>
            <Input
              type="file"
              className="texture-upload-input"
              ref={element => {
                this.textureUploadInput = element;
              }}
              onChange={event => this.handleTextureUpload(event)}
            />
            <Input
              type="color"
              value={object.texture.type === COLOR ? object.texture.value : ""}
              onChange={event => this.handleColorChange(event)}
            />
          </div>
          <div className="properties">
            {["Position", "Rotation", "Scale"].map(property => (
              <div key={property}>
                <label>{property}: </label>
                {object[property.toLowerCase()].map((value, index) => (
                  <Input
                    key={index}
                    type="number"
                    step="0.01"
                    value={value}
                    onChange={event => {
                      const newArray = [...object[property.toLowerCase()]];
                      newArray[index] = +event.target.value;
                      object["set" + property](newArray);
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Clickable>
    );
  }
}
