import React from "react";
import { observer } from "mobx-react";
import styles from "./Slides.css";
import Button from "./Button";
import Slide from "./Slide";
import Disabled from "./Disabled";
import { TO_PREVIOUS_INDEX, TO_NEXT_INDEX } from "../constants";
const Slides = observer(({ slides, create, uiState }) => (
  <Disabled value={uiState.drawerTabLocked}>
    <div className={styles.slides}>
      <span>Slides</span>
      <Button onClick={create}>Create new</Button>
      <ul>
        {slides.items.map(item => (
          <Slide
            key={item.id}
            slide={item}
            selected={slides.selected === item}
            select={() => slides.select(item)}
            remove={() => slides.remove(item)}
            moveUp={() => slides.move(item, TO_PREVIOUS_INDEX)}
            moveDown={() => slides.move(item, TO_NEXT_INDEX)}
          />
        ))}
      </ul>
    </div>
  </Disabled>
));
Slides.displayName = "Slides";
export default Slides;
