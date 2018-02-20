import React from "react";
import { LINEAR, QUAD } from "../../constants";
export default class Animation extends React.Component {
  state = { value: 0 };
  itsTimeToStop = false;
  componentDidMount() {
    const t0 = window.performance.now();
    const easingFunctions = {
      [LINEAR]: x => x,
      [QUAD]: x => x ** 2
    };
    const animate = () => {
      if (this.itsTimeToStop) return;
      const {
        timeElapsed = window.performance.now() - t0,
        duration,
        easingFunction
      } = this.props;
      const value = easingFunctions[easingFunction](timeElapsed / duration);
      if (timeElapsed > duration) {
        this.setState({ value: 1 });
        return;
      }
      this.setState({ value });
      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
  }
  componentWillUnmount() {
    this.itsTimeToStop = true;
  }
  render() {
    const getCurrentValue = (start, end) =>
      start + (end - start) * this.state.value;
    return this.props.children(getCurrentValue);
  }
}
