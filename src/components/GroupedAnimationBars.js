import React from "react";
import AnimationBar from "./AnimationBar";
import styles from "./GroupedAnimationBars.css";
export default ({ animations, selected, select }) => (
  <div className={styles.groupedAnimationBars}>
    {animations.map(animation => (
      <AnimationBar
        animation={animation}
        highlighted={selected === animation}
        key={animation.id}
        select={() => select(animation)}
      />
    ))}
  </div>
);
