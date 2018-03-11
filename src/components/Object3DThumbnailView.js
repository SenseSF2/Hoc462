import React from "react";
import { observer } from "mobx-react";
import ObjectPreview from "./Renderer/ObjectPreview";
import Clickable from "./Clickable";
import Button from "./Button";
import styles from "./Object3DThumbnailView.css";
const Object3DThumbnailView = observer(
  ({ object, select, remove, selected }) => (
    <Clickable onClick={select}>
      <div
        className={[
          styles.object3DThumbnailView,
          selected ? "highlighted" : ""
        ].join(" ")}
      >
        <ObjectPreview object={object} width={100} height={100} />
        {object.name} <Button onClick={remove}>Delete</Button>
      </div>
    </Clickable>
  )
);
Object3DThumbnailView.displayName = "Object3DThumbnailView";
export default Object3DThumbnailView;
