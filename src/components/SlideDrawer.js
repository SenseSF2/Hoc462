import React from "react";
import GroupedAnimationBars from "./GroupedAnimationBars";
import DetailedAnimationView from "./DetailedAnimationView";
import AnimationPlaybackControls from "./AnimationPlaybackControls";
import { observer } from "mobx-react";
import { button } from "./Button.css";
const SlideDrawer = observer(({ slide, uiState }) => {
  if (slide === undefined) return <div>No slides selected</div>;
  return (
    <div>
      <h2>
        View:
        {uiState.isSettingView ? (
          <button
            className={button}
            onClick={() => uiState.finishSettingView()}
          >
            I am done
          </button>
        ) : (
          <button className={button} onClick={() => uiState.startSettingView()}>
            Set view
          </button>
        )}
      </h2>
      <AnimationPlaybackControls uiState={uiState} />
      <h2>Animations:</h2>
      <div>
        <button
          className={button}
          onClick={() => uiState.startEditingAnimation()}
        >
          Add animation
        </button>
        <button
          className={button}
          onClick={() => slide.animations.remove(slide.animations.selected)}
        >
          Remove animation
        </button>
      </div>
      <div>
        {slide.animationGroups.map(group => (
          <GroupedAnimationBars
            animations={group}
            selected={slide.animations.selected}
            select={animation => slide.animations.select(animation)}
            key={group[0].id}
          />
        ))}
      </div>
      {slide.animations.selected !== undefined && (
        <DetailedAnimationView animation={slide.animations.selected} />
      )}
    </div>
  );
});
SlideDrawer.displayName = "SlideDrawer";
export default SlideDrawer;
