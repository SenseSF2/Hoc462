import React from "react";
import { observer } from "mobx-react";
import Wizard from "./Wizard";
import { button } from "./Button.css";
import { TRANSLATE, ROTATE, SCALE } from "../constants";
const AddAnimationDrawer = observer(({ uiState, selectedObject }) => (
  <Wizard
    handleNext={() => uiState.incrementAddAnimationStep()}
    step={uiState.addAnimationStep}
  >
    {[
      {
        component: observer(() => (
          <React.Fragment>
            <h1>Step 1: Choose animation target</h1>
            Current animation target:{" "}
            {selectedObject !== undefined && selectedObject.name}
          </React.Fragment>
        )),
        nextDisabled: selectedObject === undefined
      },
      {
        component: observer(() => (
          <React.Fragment>
            <h1>Step 2: Animation type</h1>
            <select
              onChange={event =>
                uiState.setAnimationType(
                  {
                    translate: TRANSLATE,
                    rotate: ROTATE,
                    scale: SCALE
                  }[event.target.value]
                )
              }
              value={
                {
                  [TRANSLATE]: "translate",
                  [ROTATE]: "rotate",
                  [SCALE]: "scale"
                }[uiState.animationType]
              }
              className={button}
            >
              <option value="translate">Translate</option>
              <option value="rotate">Rotate</option>
              <option value="scale">Scale</option>
            </select>
          </React.Fragment>
        ))
      },
      {
        component: observer(() => (
          <React.Fragment>
            <h1>Step 3: Choose animation destination</h1>
            Current animation destination:{" "}
            {uiState.animationDestination !== undefined &&
              JSON.stringify(uiState.animationDestination.slice())}
          </React.Fragment>
        )),
        nextDisabled: uiState.animationDestination === undefined
      }
    ]}
  </Wizard>
));
AddAnimationDrawer.displayName = AddAnimationDrawer;
export default AddAnimationDrawer;
