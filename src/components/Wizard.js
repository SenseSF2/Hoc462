import React from 'react'
import styles from './Wizard.css'
import { button } from './Button.css'
const Wizard = ({ children: steps, step, handleNext, nextDisabled }) =>
  <div className={styles.wizard}>
    <div className="content">
      {React.createElement(steps[step - 1].component)}
    </div>
    <button
      className={button} onClick={handleNext}
      disabled={nextDisabled || steps[step - 1].nextDisabled}
    >
      Next
    </button>
  </div>
export default Wizard
