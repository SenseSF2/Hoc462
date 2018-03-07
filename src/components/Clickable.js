import React from "react";
import { DisabledConsumer } from "./Disabled";
const Clickable = ({ disabled, children, onClick, ...props }) => (
  <DisabledConsumer>
    {disabledInContext =>
      React.cloneElement(React.Children.only(children), {
        onClick: () => disabled || disabledInContext || onClick(),
        disabled: disabled || disabledInContext,
        ...props
      })
    }
  </DisabledConsumer>
);
export default Clickable;
