import React from "react";
import { observer } from "mobx-react";
import styles from "./AnimationBar.css";
import { LINEAR, QUAD } from "../constants";
const AnimationBar = observer(({ animation, highlighted, select }) => (
  <div
    className={[
      styles.animationBar,
      {
        [LINEAR]: "linear",
        [QUAD]: "quad"
      }[animation.easingFunction],
      highlighted ? "highlighted" : ""
    ].join(" ")}
    style={{
      width: animation.duration / 50 + "px",
      marginLeft: animation.delay / 50 + "px"
    }}
    onClick={select}
  >
    {((animation.duration / 1000 * 100) | 0) / 100}
  </div>
));
AnimationBar.displayName = "AnimationBar";
export default AnimationBar;
