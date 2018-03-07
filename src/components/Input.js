import React from "react";
import { DisabledConsumer } from "./Disabled";
const Input = ({ disabled, innerRef, ...props }) => (
  <DisabledConsumer>
    {disabledInContext => (
      <input
        {...props}
        ref={innerRef}
        disabled={disabled || disabledInContext}
      />
    )}
  </DisabledConsumer>
);
export default Input;
