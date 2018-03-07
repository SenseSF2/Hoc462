import React from "react";
import { button } from "./Button.css";
import { DisabledConsumer } from "./Disabled";
const Button = ({ disabled, children, onClick }) => (
  <DisabledConsumer>
    {disabledInContext => (
      <button
        className={button}
        disabled={disabled || disabledInContext}
        onClick={onClick}
      >
        {children}
      </button>
    )}
  </DisabledConsumer>
);
export default Button;
