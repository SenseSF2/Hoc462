import React from "react";
import { DisabledConsumer } from "./Disabled";
const Input = ({ disabled, innerRef, type, ...props }) => (
  <DisabledConsumer>
    {disabledInContext => {
      if (type === "select") {
        return (
          <select
            {...props}
            ref={innerRef}
            disabled={disabled || disabledInContext}
          />
        );
      }
      return (
        <input
          type={type}
          {...props}
          ref={innerRef}
          disabled={disabled || disabledInContext}
        />
      );
    }}
  </DisabledConsumer>
);
export default Input;
