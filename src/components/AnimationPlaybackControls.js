import React from "react";
import { observer } from "mobx-react";
import { button } from "./Button.css";
@observer
export default class AnimationPlaybackControls extends React.Component {
  itsTimeToStop = false;
  constructor(props) {
    super(props);
    const { uiState } = props;
    let t0 = window.performance.now();
    const animate = () => {
      if (this.itsTimeToStop) return;
      const t1 = window.performance.now();
      if (uiState.isPlaying) {
        uiState.increaseElapsedTime(t1 - t0);
      }
      t0 = t1;
      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
  }
  componentWillUnmount() {
    this.itsTimeToStop = true;
  }
  render() {
    const { uiState } = this.props;
    return (
      <div>
        <input
          type="range"
          value={uiState.elapsedTime}
          min={0}
          max={uiState.selectedSlideDuration}
          disabled={uiState.selectedSlideDuration === 0}
          onChange={event => uiState.setElapsedTime(+event.target.value)}
        />{" "}
        <button
          className={button}
          disabled={uiState.isPlaying}
          onClick={() => uiState.play()}
        >
          Play
        </button>{" "}
        <button className={button} onClick={() => uiState.pause()}>
          Pause
        </button>{" "}
        <button className={button} onClick={() => uiState.stop()}>
          Stop
        </button>
      </div>
    );
  }
}
