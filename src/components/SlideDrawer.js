import React from "react";
import GroupedAnimationBars from "./GroupedAnimationBars";
import DetailedAnimationView from "./DetailedAnimationView";
import AnimationPlaybackControls from "./AnimationPlaybackControls";
import { observer } from "mobx-react";
import Button from "./Button";
const SlideDrawer = observer(({ slide, uiState }) => {
  if (slide === undefined) return <div>No slides selected</div>;
  return (
    <div>
      <h2>
        View:
        {uiState.isSettingView ? (
          <Button onClick={() => uiState.finishSettingView()}>I am done</Button>
        ) : (
          <Button onClick={() => uiState.startSettingView()}>Set view</Button>
        )}
      </h2>
      <AnimationPlaybackControls uiState={uiState} />
      <h2>Animations:</h2>
      <div>
        <Button onClick={() => uiState.startEditingAnimation()}>
          Add animation
        </Button>
        <Button
          onClick={() => slide.animations.remove(slide.animations.selected)}
        >
          Remove animation
        </Button>
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
