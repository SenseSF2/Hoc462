import React from "react";
import styles from "./Wizard.css";
import Button from "./Button";
const Wizard = ({ children: steps, step, handleNext, nextDisabled }) => (
  <div className={styles.wizard}>
    <div className="content">
      {React.createElement(steps[step - 1].component)}
    </div>
    <Button
      onClick={handleNext}
      disabled={nextDisabled || steps[step - 1].nextDisabled}
    >
      Next
    </Button>
  </div>
);
export default Wizard;
